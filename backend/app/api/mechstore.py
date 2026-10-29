"""Boutique mecanicien : catalogue acheteur, panier via creation de commande serveur.

Reutilise le catalogue Product / Order / OrderItem / Commission existant — pas de
second marketplace. Le vendeur reste la source de verite du prix et du stock.

Regles :
- Prix calcules COTE SERVEUR (jamais confiance au frontend), en centimes uniquement.
- Snapshots de prix/name/sku sur chaque ligne (historique fidele si le prix change).
- Stock diminue dans une transaction avec verrouillage de ligne (SELECT ... FOR UPDATE
  sur PostgreSQL ; SQLite dev = serialise par la transaction).
- Quantites > stock refusees ; produits non actifs refuses ; vendeur inactif refuse.
- La commission TomoBily (payee par le VENDEUR) n'est JAMAIS ajoutee au total acheteur ;
  elle est ecrite idempotemment quand un paiement est marque paye, uniquement si
  COMMISSION_RATE_PERCENT est configuree (aucun taux invente).
"""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.core.rbac import get_current_user
from app.database import get_db
from app.models import (
    User, ProviderProfile, Notification, ProductCategory,
    Commission, InventoryMovement, Order, OrderItem, Product, Transaction,
)
from app.models.seller import OrderStatus, PaymentStatus, ProductStatus
from app.models.financial import TransactionStatus, TransactionType

router = APIRouter(prefix="/store", tags=["Mechanic Store"])


def _effective_unit_price(p: Product) -> int:
    """Prix de vente reel (centimes), identique pour clients et mecaniciens.

    Remise eventuelle du vendeur appliquee de facon deterministe (arrondi centime).
    Aucun tarif professionnel ni majoration : le meme prix s'applique partout.
    """
    price = int(p.price)
    disc = int(p.discount_percent or 0)
    if disc > 0:
        price = price - (price * disc) // 100
    return max(price, 0)


def _seller_public(p: Product, db: Session) -> dict:
    sp = db.query(ProviderProfile).filter(ProviderProfile.id == p.seller_id).first()
    return {
        "seller_id": p.seller_id,
        "business_name": sp.name if sp else None,
        "city": sp.city if sp else None,
        "verified": bool(sp.verified) if sp else False,
        "rating": round(float(sp.rating or 0), 2) if sp else 0,
    }


@router.get("/products")
def list_products(
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    make: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Catalogue public actif — le mecanicien voit le MEME catalogue que les clients."""
    query = db.query(Product).filter(Product.status == ProductStatus.ACTIVE)
    if q:
        like = f"%{q}%"
        query = query.filter((Product.name.like(like)) | (Product.description.like(like)) | (Product.sku.like(like)))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    total = query.count()
    rows = query.order_by(Product.is_featured.desc(), Product.published_at.desc()).offset(offset).limit(min(limit, 100)).all()
    items = []
    for p in rows:
        items.append({
            "id": p.id, "name": p.name, "slug": p.slug, "sku": p.sku,
            "short_description": p.short_description,
            "price": _effective_unit_price(p), "list_price": int(p.price),
            "discount_percent": int(p.discount_percent or 0),
            "currency": p.currency,
            "in_stock": (p.stock_quantity or 0) > 0,
            "stock_quantity": int(p.stock_quantity or 0),
            "condition": p.condition.value if hasattr(p.condition, "value") else str(p.condition),
            "main_image": p.main_image,
            "compatible_makes": p.compatible_makes or [],
            "compatible_models": p.compatible_models or [],
            "compatible_years": p.compatible_years or [],
            "shipping_options": p.shipping_options or [],
            "seller": _seller_public(p, db),
        })
    return {"items": items, "total": total, "offset": offset, "limit": limit}


@router.get("/products/{product_id}")
def product_detail(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id, Product.status == ProductStatus.ACTIVE).first()
    if not p:
        raise HTTPException(status_code=404, detail="Produit introuvable.")
    cat = db.query(ProductCategory).filter(ProductCategory.id == p.category_id).first()
    return {
        "id": p.id, "name": p.name, "slug": p.slug, "sku": p.sku,
        "description": p.description, "short_description": p.short_description,
        "price": _effective_unit_price(p), "list_price": int(p.price),
        "discount_percent": int(p.discount_percent or 0), "currency": p.currency,
        "stock_quantity": int(p.stock_quantity or 0), "in_stock": (p.stock_quantity or 0) > 0,
        "category": {"id": cat.id, "name": cat.name} if cat else None,
        "compatible_makes": p.compatible_makes or [],
        "compatible_models": p.compatible_models or [],
        "compatible_years": p.compatible_years or [],
        "compatible_engines": p.compatible_engines or [],
        "weight": p.weight, "shipping_options": p.shipping_options or [],
        "main_image": p.main_image, "additional_images": p.additional_images or [],
        "rating_avg": float(p.rating_avg or 0), "review_count": int(p.review_count or 0),
        "seller": _seller_public(p, db),
    }


class AddressBody(BaseModel):
    full_name: str = Field(min_length=2, max_length=200)
    phone: str = Field(min_length=6, max_length=32)
    address_line: str = Field(min_length=3, max_length=500)
    city: str = Field(min_length=1, max_length=100)
    postal_code: Optional[str] = Field(default=None, max_length=20)
    notes: Optional[str] = Field(default=None, max_length=500)


class OrderLine(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=999)
    vehicle_ref: Optional[str] = Field(default=None, max_length=120)  # ex: "Toyota Corolla 2019"


class CreateOrderBody(BaseModel):
    items: List[OrderLine] = Field(min_length=1, max_length=50)
    delivery_mode: str  # business_address | custom_address | customer_address | pickup
    shipping_address: Optional[AddressBody] = None
    recipient_notes: Optional[str] = Field(default=None, max_length=1000)
    idempotency_key: Optional[str] = Field(default=None, max_length=80)
    confirm: bool = False  # confirmation explicite exigee avant soumission


def _me_provider(db: Session, user: User) -> Optional[ProviderProfile]:
    return db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()


def _validate_delivery(user: User, body: CreateOrderBody, db: Session):
    """Construit l'adresse de livraison autorisee selon le mode choisi."""
    mode = body.delivery_mode
    if mode == "pickup":
        # retrait chez le vendeur : destination resolue plus tard a partir de la
        # ville publique du vendeur (donnees professionnelles publiques uniquement).
        return {"mode": "pickup", "address": None}
    if mode == "business_address":
        me = _me_provider(db, user)
        if not me or not me.address:
            raise HTTPException(status_code=400, detail="Adresse professionnelle manquante : complétez votre profil ou choisissez une autre adresse.")
        return {"mode": mode, "address": {
            "full_name": me.name, "phone": None, "address_line": me.address,
            "city": me.city, "postal_code": None, "notes": body.recipient_notes,
        }}
    if mode in ("custom_address", "customer_address"):
        if not body.shipping_address:
            raise HTTPException(status_code=400, detail="Adresse de livraison requise.")
        a = body.shipping_address
        # Base legitime : pour customer_address, le mecanicien doit avoir une relation
        # d'affaires avec le client (partenariat accepte OU commande/job lie) — on exige
        # au minimum un numero de telephone valide du destinataire ; l'adresse n'est PAS
        # ecrite dans un carnet d'adresses client (aucune modification non autorisee).
        return {"mode": mode, "address": a.model_dump()}
    raise HTTPException(status_code=400, detail="Mode de livraison non supporté.")


@router.post("/orders/quote")
def quote(body: CreateOrderBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Devis serveur : decompose les montants REELS payes par l'acheteur AVANT confirmation.

    La commission vendeur n'apparait pas ici (elle est retenue sur la part vendeur,
    jamais ajoutee au total acheteur) — transparence totale des frais acheteur.
    """
    lines, subtotal, errors = _price_lines(body, db)
    if errors:
        raise HTTPException(status_code=409, detail={"message": "Certains articles ne sont plus disponibles.", "errors": errors})
    ship = _shipping_fee(lines)
    tax = 0  # pas de regle fiscale configuree dans ce depot — rien n'invente
    total = subtotal + tax + ship
    return {
        "lines": lines,
        "subtotal": subtotal, "shipping_fee": ship, "tax_amount": tax,
        "total": total, "currency": "MAD",
        "note_commission": "La commission plateforme est prélevée sur les revenus du vendeur ; elle n'est pas ajoutée à votre total.",
    }


def _price_lines(body: CreateOrderBody, db: Session):
    lines = []
    subtotal = 0
    errors = []
    seen = set()
    for ln in body.items:
        if ln.product_id in seen:
            raise HTTPException(status_code=400, detail="Produits dupliqués dans la commande : fusionnez les quantités.")
        seen.add(ln.product_id)
        p = db.query(Product).filter(Product.id == ln.product_id).first()
        if not p or p.status != ProductStatus.ACTIVE:
            errors.append({"product_id": ln.product_id, "reason": "unavailable"}); continue
        seller = db.query(ProviderProfile).filter(ProviderProfile.id == p.seller_id).first()
        su = db.query(User).filter(User.id == seller.user_id).first() if seller else None
        if not seller or (su and (su.status or "active") != "active"):
            errors.append({"product_id": ln.product_id, "reason": "seller_inactive"}); continue
        unit = _effective_unit_price(p)
        avail = int(p.stock_quantity or 0)
        if ln.quantity > avail:
            errors.append({"product_id": ln.product_id, "reason": "insufficient_stock", "available": avail}); continue
        line_total = unit * ln.quantity
        subtotal += line_total
        lines.append({
            "product_id": p.id, "name": p.name, "sku": p.sku,
            "unit_price": unit, "quantity": ln.quantity, "line_total": line_total,
            "seller_id": p.seller_id, "seller_name": seller.name,
            "vehicle_ref": ln.vehicle_ref,
        })
    if not lines:
        errors.append({"product_id": None, "reason": "empty_cart"})
    return lines, subtotal, errors


def _shipping_fee(lines) -> int:
    """Frais de livraison : aucun bareme de transport n'existe dans ce depot.

    On n'invente pas de montant : 0 tant que le vendeur/configurateur de frais
    n'est pas branche (documente). Le champ existe pour la cohérence du schema.
    """
    return 0


@router.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(body: CreateOrderBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Cree une commande avec prix serveur, snapshots, stock transactionnel.

    - confirm=true exige (confirmation explicite avant soumission).
    - idempotency_key optionnel : retry sur la meme cle renvoie la meme commande
      (evite les doubles soumissions).
    - Un order = un vendeur (panier multi-vendeurs refuse explicitement, pas silencieusement).
    """
    if not body.confirm:
        raise HTTPException(status_code=400, detail="La confirmation explicite de la commande est requise (confirm=true).")

    # Idempotence : retry sur la meme cle -> meme commande
    if body.idempotency_key:
        from sqlalchemy import text as _t
        existing = db.execute(_t(
            "SELECT id FROM orders WHERE extra_idempotency_key = :k AND customer_id = :u",
            {"k": body.idempotency_key, "u": user.id})).fetchone() if _has_idem_col(db) else None
        if existing:
            return {"ok": True, "order_id": existing[0], "replayed": True}

    lines, subtotal, errors = _price_lines(body, db)
    if errors:
        raise HTTPException(status_code=409, detail={"message": "Certains articles ne sont plus disponibles.", "errors": errors})

    seller_ids = {l["seller_id"] for l in lines}
    if len(seller_ids) > 1:
        raise HTTPException(status_code=400, detail="Commande multi-vendeurs non supportée : passez une commande par vendeur.")
    seller_id = next(iter(seller_ids))

    delivery = _validate_delivery(user, body, db)
    if delivery["mode"] == "pickup":
        seller = db.query(ProviderProfile).filter(ProviderProfile.id == seller_id).first()
        addr = {"full_name": seller.name, "address_line": f"Retrait — {seller.city}", "city": seller.city,
                "phone": None, "postal_code": None, "notes": body.recipient_notes, "mode": "pickup"}
    else:
        addr = dict(delivery["address"]); addr["mode"] = delivery["mode"]
        if addr.get("notes") is None:
            addr["notes"] = body.recipient_notes

    ship = _shipping_fee(lines)
    tax = 0
    total = subtotal + ship + tax

    try:
        # Verrou de ligne sur chaque produit (anti course sur le stock).
        for l in lines:
            locked = db.execute(
                select(Product).where(Product.id == l["product_id"]).with_for_update()
            ).scalar_one()
            if int(locked.stock_quantity or 0) < l["quantity"]:
                db.rollback()
                raise HTTPException(status_code=409, detail=f"Stock insuffisant pour « {locked.name} » (dispo : {locked.stock_quantity}).")

        now = datetime.utcnow()
        order_number = f"TB-{now.strftime('%Y%m%d%H%M%S')}-{user.id}-{abs(hash(body.idempotency_key or now.isoformat())) % 10000:04d}"
        order = Order(
            order_number=order_number,
            customer_id=user.id,          # le mecanicien EST l'acheteur identifiable
            seller_id=seller_id,
            status=OrderStatus.PENDING,
            payment_status=PaymentStatus.PENDING,
            subtotal=subtotal, shipping_fee=ship, tax_amount=tax, total=total,
            shipping_address=addr,
            shipping_method=delivery["mode"],
            payment_method="simulated_checkout",  # dev/demo : paiement SIMULE, jamais reel
            customer_notes=body.recipient_notes,
        )
        if body.idempotency_key:
            ensure_store_columns(db)
            setattr(order, "extra_idempotency_key", body.idempotency_key)
        db.add(order)
        db.flush()

        for l in lines:
            p = db.query(Product).filter(Product.id == l["product_id"]).with_for_update().scalar()
            prev = int(p.stock_quantity or 0)
            item = OrderItem(
                order_id=order.id, product_id=p.id,
                quantity=l["quantity"], unit_price=l["unit_price"], total_price=l["line_total"],
                product_name=p.name, product_sku=p.sku, product_image=p.main_image,
            )
            db.add(item)
            p.stock_quantity = prev - l["quantity"]
            db.add(InventoryMovement(
                product_id=p.id, type="sale", quantity=-l["quantity"],
                previous_stock=prev, new_stock=p.stock_quantity,
                reference_type="order", reference_id=order.id,
                reason="Achat mécanicien (marketplace)", performed_by=user.id,
            ))
        db.commit()
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Création de commande échouée (transaction annulée).")

    seller_user = db.query(User).filter(User.id == db.query(ProviderProfile).filter(ProviderProfile.id == seller_id).first().user_id).first()
    if seller_user:
        db.add(Notification(user_id=seller_user.id, type="order_new",
                            title="Nouvelle commande",
                            body=f"Commande {order.order_number} reçue ({total/100:.2f} MAD).",
                            link="/seller/orders", data={"order_id": order.id}))
        db.commit()

    return {
        "ok": True, "order_id": order.id, "order_number": order.order_number,
        "totals": {"subtotal": subtotal, "shipping_fee": ship, "tax_amount": tax, "total": total, "currency": "MAD"},
        "payment_status": "pending",
        "payment_simulated": True,
        "note": "Commande créée. Paiement NON effectué : la finalisation dépend du moyen de paiement (simulé en démo).",
    }


def _has_idem_col(db: Session) -> bool:
    from sqlalchemy import text as _t
    try:
        cols = {r[1] for r in db.execute(_t("PRAGMA table_info(orders)"))}
        return "extra_idempotency_key" in cols
    except Exception:
        return False


def ensure_store_columns(db: Session):
    """Colonne d'idempotence + indexes (SQLite dev, idempotent)."""
    from sqlalchemy import text as _t
    if db.bind.dialect.name != "sqlite":
        return
    cols = {r[1] for r in db.execute(_t("PRAGMA table_info(orders)"))}
    if "extra_idempotency_key" not in cols:
        db.execute(_t("ALTER TABLE orders ADD COLUMN extra_idempotency_key VARCHAR(80) UNIQUE"))
        db.commit()


@router.get("/orders")
def my_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Historique d'achats du mecanicien (client_id = compte authentifie)."""
    ensure_store_columns(db)
    rows = (db.query(Order).filter(Order.customer_id == user.id)
            .order_by(Order.created_at.desc()).limit(100).all())
    out = []
    for o in rows:
        items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
        out.append({
            "id": o.id, "order_number": o.order_number,
            "status": o.status.value if hasattr(o.status, "value") else str(o.status),
            "payment_status": o.payment_status.value if hasattr(o.payment_status, "value") else str(o.payment_status),
            "subtotal": o.subtotal, "shipping_fee": o.shipping_fee, "tax_amount": o.tax_amount,
            "total": o.total, "currency": "MAD",
            "delivery_mode": o.shipping_method, "shipping_address": o.shipping_address,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "items": [{"name": i.product_name, "qty": i.quantity, "unit_price": i.unit_price,
                       "line_total": i.total_price} for i in items],
        })
    return {"items": out}


class PayBody(BaseModel):
    method: str = "simulated"  # seul 'simulated' est disponible en demo


@router.post("/orders/{order_id}/pay")
def pay_order(order_id: int, body: PayBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Paiement SIMULE en dev/demo (jamais de carte reelle). Ecrit la transaction,
    la facture comme payee, et la commission Vendeur (idempotent) si configuree."""
    if not settings.DEMO_MODE or settings.ENVIRONMENT == "production":
        raise HTTPException(status_code=403, detail="Checkout simulé réservé à la démo ; production exige le prestataire de paiement.")
    if body.method != "simulated":
        raise HTTPException(status_code=400, detail="Moyen de paiement non disponible.")
    o = db.query(Order).filter(Order.id == order_id, Order.customer_id == user.id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Commande introuvable.")
    cur_pay = o.payment_status.value if hasattr(o.payment_status, "value") else str(o.payment_status)
    if cur_pay in ("completed", "paid"):
        return {"ok": True, "already_paid": True, "payment_status": cur_pay}

    tx_exists = db.query(Transaction).filter(Transaction.reference_type == "order",
                                             Transaction.reference_id == o.id,
                                             Transaction.type == TransactionType.PAYMENT).first()
    now = datetime.utcnow()
    if not tx_exists:
        tx = Transaction(
            transaction_id=f"TX-O-{o.id}",
            type=TransactionType.PAYMENT,
            from_user_id=user.id, to_user_id=None,
            amount=o.total, currency="MAD", fee_amount=0, net_amount=o.total,
            status=TransactionStatus.COMPLETED,
            reference_type="order", reference_id=o.id, reference_number=o.order_number,
        )
        db.add(tx)
        db.flush()
    else:
        tx = tx_exists

    o.payment_status = PaymentStatus.COMPLETED
    o.paid_at = now
    o.status = OrderStatus.CONFIRMED

    # Commission vendeur (N'augmente PAS le total acheteur) — idempotente.
    commission = None
    rate = settings.COMMISSION_RATE_PERCENT
    if rate is not None:
        already = db.query(Commission).filter(Commission.transaction_id == tx.id,
                                              Commission.order_id == o.id).first()
        if not already:
            lines_val = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
            gross = sum(i.total_price for i in lines_val)  # base = sous-total produits (hors livraison/taxes)
            # arrondi au centime le plus proche, entier (pas de float pour les montants finaux)
            amount = (gross * int(round(rate * 100)) + 5000) // 10000
            commission = Commission(
                commission_id=f"CM-O-{o.id}",
                transaction_id=tx.id, order_id=o.id,
                provider_id=o.seller_id, provider_type="seller",
                gross_amount=gross, commission_rate=float(rate),
                commission_amount=amount, status="collected", collected_at=now,
            )
            db.add(commission)
    seller_p = db.query(ProviderProfile).filter(ProviderProfile.id == o.seller_id).first()
    seller_u = db.query(User).filter(User.id == seller_p.user_id).first() if seller_p else None
    if seller_u:
        db.add(Notification(user_id=seller_u.id, type="order_update",
                            title="Commande payée",
                            body=f"Commande {o.order_number} payée (simulation démo).",
                            link="/seller/orders", data={"order_id": o.id}))
    db.commit()
    breakdown = None
    if commission is not None:
        breakdown = {
            "gross_amount": commission.gross_amount,
            "commission_rate": commission.commission_rate,
            "commission_amount": commission.commission_amount,
            "seller_net": commission.gross_amount - commission.commission_amount,
        }
    return {
        "ok": True, "payment_status": "paid", "simulated": True,
        "buyer_total": o.total,
        "commission": breakdown,
        "note": "Paiement SIMULÉ (démo). En production : prestataire CMI/mobile money requis.",
    }


@router.post("/orders/{order_id}/cancel")
def cancel_order(order_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Annulation autorisee seulement aux etats initiaux ; restitue le stock."""
    o = db.query(Order).filter(Order.id == order_id, Order.customer_id == user.id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Commande introuvable.")
    cur = o.status.value if hasattr(o.status, "value") else str(o.status)
    if cur not in ("pending", "confirmed"):
        raise HTTPException(status_code=409, detail=f"Annulation impossible à l'état « {cur} ».")
    try:
        for i in db.query(OrderItem).filter(OrderItem.order_id == o.id).all():
            p = db.query(Product).filter(Product.id == i.product_id).with_for_update().scalar()
            if p and p.track_inventory:
                prev = int(p.stock_quantity or 0)
                p.stock_quantity = prev + i.quantity
                db.add(InventoryMovement(product_id=p.id, type="return", quantity=i.quantity,
                                         previous_stock=prev, new_stock=p.stock_quantity,
                                         reference_type="order", reference_id=o.id,
                                         reason="Annulation commande", performed_by=user.id))
        o.status = OrderStatus.CANCELLED
        o.cancelled_at = datetime.utcnow()
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Annulation échouée (transaction annulée).")
    return {"ok": True, "status": "cancelled"}
