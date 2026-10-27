"""
API Endpoints pour Seller Portal
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
import secrets
import string

from app.database import get_db
from app.models import User, ProviderProfile, Product, ProductImage, ProductCategory, Order, OrderItem, InventoryMovement, ProductReview
from app.schemas.seller import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    OrderCreate, OrderResponse, OrderListResponse,
    InventoryMovementCreate, InventoryMovementResponse,
    CategoryCreate, CategoryResponse,
    SalesAnalytics, DashboardStats,
    ProductReviewCreate, ProductReviewResponse,
    SellerSettings, SellerSettingsUpdate
)
from app.core.rbac import require_role

router = APIRouter()


# ============ Dashboard Endpoints ============

@router.get("/seller/dashboard/stats", response_model=DashboardStats)
async def get_seller_dashboard_stats(
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Statistiques du dashboard vendeur"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    # Products stats
    total_products = db.query(Product).filter(Product.seller_id == seller_profile.id).count()
    active_products = db.query(Product).filter(
        Product.seller_id == seller_profile.id,
        Product.status == "active"
    ).count()
    low_stock_products = db.query(Product).filter(
        Product.seller_id == seller_profile.id,
        Product.stock_quantity <= Product.low_stock_threshold,
        Product.stock_quantity > 0
    ).count()
    out_of_stock_products = db.query(Product).filter(
        Product.seller_id == seller_profile.id,
        Product.stock_quantity == 0
    ).count()
    
    # Orders stats
    total_orders = db.query(Order).filter(Order.seller_id == seller_profile.id).count()
    pending_orders = db.query(Order).filter(
        Order.seller_id == seller_profile.id,
        Order.status == "pending"
    ).count()
    processing_orders = db.query(Order).filter(
        Order.seller_id == seller_profile.id,
        Order.status.in_(["confirmed", "processing"])
    ).count()
    completed_orders = db.query(Order).filter(
        Order.seller_id == seller_profile.id,
        Order.status == "delivered"
    ).count()
    
    # Revenue stats
    total_revenue = db.query(func.sum(Order.total)).filter(
        Order.seller_id == seller_profile.id,
        Order.status == "delivered"
    ).scalar() or 0
    
    pending_revenue = db.query(func.sum(Order.total)).filter(
        Order.seller_id == seller_profile.id,
        Order.status.in_(["pending", "confirmed", "processing", "shipped"])
    ).scalar() or 0
    
    available_balance = seller_profile.wallet_balance
    
    # Reviews stats
    total_reviews = db.query(ProductReview).join(Product).filter(
        Product.seller_id == seller_profile.id
    ).count()
    
    average_rating = db.query(func.avg(ProductReview.rating)).join(Product).filter(
        Product.seller_id == seller_profile.id
    ).scalar() or 0.0
    
    return DashboardStats(
        total_products=total_products,
        active_products=active_products,
        low_stock_products=low_stock_products,
        out_of_stock_products=out_of_stock_products,
        total_orders=total_orders,
        pending_orders=pending_orders,
        processing_orders=processing_orders,
        completed_orders=completed_orders,
        total_revenue=total_revenue,
        pending_revenue=pending_revenue,
        available_balance=available_balance,
        total_reviews=total_reviews,
        average_rating=float(average_rating)
    )


# ============ Product Endpoints ============

@router.get("/seller/products", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Liste des produits du vendeur"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    query = db.query(Product).filter(Product.seller_id == seller_profile.id)
    
    if status:
        query = query.filter(Product.status == status)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    total = query.count()
    products = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.post("/seller/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Créer un nouveau produit"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    # Vérifier que le SKU est unique
    existing_sku = db.query(Product).filter(Product.sku == product.sku).first()
    if existing_sku:
        raise HTTPException(status_code=400, detail="SKU déjà utilisé")
    
    # Générer un slug unique
    slug = product.name.lower().replace(" ", "-")
    slug = ''.join(c for c in slug if c.isalnum() or c == '-')
    base_slug = slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    db_product = Product(
        seller_id=seller_profile.id,
        slug=slug,
        **product.dict()
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.get("/seller/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Détails d'un produit"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == seller_profile.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    return product


@router.put("/seller/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Mettre à jour un produit"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == seller_profile.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    for key, value in product_update.dict(exclude_unset=True).items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/seller/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Supprimer un produit"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == seller_profile.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    db.delete(product)
    db.commit()
    
    return {"message": "Produit supprimé avec succès"}


@router.post("/seller/products/{product_id}/images")
async def upload_product_images(
    product_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Uploader des images pour un produit"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == seller_profile.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    uploaded_images = []
    
    for file in files:
        # Générer un nom de fichier unique
        file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"product_{product_id}_{secrets.token_hex(8)}.{file_extension}"
        
        # TODO: Implémenter l'upload vers S3/MinIO
        # Pour l'instant, on stocke juste le nom
        image_url = f"/uploads/products/{unique_filename}"
        
        # Sauvegarder en base
        db_image = ProductImage(
            product_id=product.id,
            image_url=image_url,
            alt_text=file.filename,
            is_main=(len(uploaded_images) == 0)  # Première image = principale
        )
        db.add(db_image)
        uploaded_images.append(image_url)
    
    db.commit()
    
    # Mettre à jour le produit avec les images
    if not product.main_image and uploaded_images:
        product.main_image = uploaded_images[0]
    if uploaded_images[1:]:
        product.additional_images = product.additional_images + uploaded_images[1:]
    
    db.commit()
    
    return {"message": f"{len(uploaded_images)} image(s) uploadée(s)", "images": uploaded_images}


# ============ Order Endpoints ============

@router.get("/seller/orders", response_model=OrderListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Liste des commandes du vendeur"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    query = db.query(Order).filter(Order.seller_id == seller_profile.id)
    
    if status:
        query = query.filter(Order.status == status)
    
    total = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return OrderListResponse(
        orders=orders,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.get("/seller/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Détails d'une commande"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.seller_id == seller_profile.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    return order


@router.put("/seller/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    new_status: str,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Mettre à jour le statut d'une commande"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.seller_id == seller_profile.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    # Valider la transition de statut
    valid_transitions = {
        "pending": ["confirmed", "cancelled"],
        "confirmed": ["processing", "cancelled"],
        "processing": ["shipped", "cancelled"],
        "shipped": ["delivered"],
        "delivered": [],
        "cancelled": [],
    }
    
    if new_status not in valid_transitions.get(order.status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de statut invalide: {order.status} -> {new_status}"
        )
    
    order.status = new_status
    
    # Mettre à jour les timestamps
    if new_status == "confirmed":
        order.confirmed_at = datetime.utcnow()
    elif new_status == "shipped":
        order.shipped_at = datetime.utcnow()
    elif new_status == "delivered":
        order.delivered_at = datetime.utcnow()
    elif new_status == "cancelled":
        order.cancelled_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Statut de commande mis à jour: {new_status}"}


# ============ Inventory Endpoints ============

@router.get("/seller/inventory")
async def get_inventory(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    low_stock_only: bool = False,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Liste de l'inventaire"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    query = db.query(Product).filter(Product.seller_id == seller_profile.id)
    
    if low_stock_only:
        query = query.filter(Product.stock_quantity <= Product.low_stock_threshold)
    
    total = query.count()
    products = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "sku": p.sku,
                "stock_quantity": p.stock_quantity,
                "low_stock_threshold": p.low_stock_threshold,
                "status": "low_stock" if p.stock_quantity <= p.low_stock_threshold else "ok"
            }
            for p in products
        ],
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.post("/seller/inventory/adjust")
async def adjust_inventory(
    movement: InventoryMovementCreate,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Ajuster l'inventaire"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    product = db.query(Product).filter(
        Product.id == movement.product_id,
        Product.seller_id == seller_profile.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    previous_stock = product.stock_quantity
    new_stock = previous_stock + movement.quantity
    
    if new_stock < 0:
        raise HTTPException(status_code=400, detail="Stock ne peut pas être négatif")
    
    # Créer le mouvement
    db_movement = InventoryMovement(
        product_id=product.id,
        type=movement.type,
        quantity=movement.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=movement.reason,
        performed_by=current_user.id
    )
    
    # Mettre à jour le stock
    product.stock_quantity = new_stock
    
    db.add(db_movement)
    db.commit()
    
    return {"message": "Inventaire ajusté", "new_stock": new_stock}


# ============ Category Endpoints ============

@router.get("/seller/categories", response_model=List[CategoryResponse])
async def list_categories(
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Liste des catégories de produits"""
    categories = db.query(ProductCategory).filter(ProductCategory.is_active == True).all()
    return categories


@router.post("/seller/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Créer une nouvelle catégorie"""
    db_category = ProductCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


# ============ Analytics Endpoints ============

@router.get("/seller/analytics/sales", response_model=SalesAnalytics)
async def get_sales_analytics(
    period: str = Query("monthly", pattern="^(daily|weekly|monthly|yearly)$"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Analytics des ventes"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    # Définir la période par défaut
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        if period == "daily":
            start_date = end_date - timedelta(days=1)
        elif period == "weekly":
            start_date = end_date - timedelta(weeks=1)
        elif period == "monthly":
            start_date = end_date - timedelta(days=30)
        else:  # yearly
            start_date = end_date - timedelta(days=365)
    
    # Calculer les statistiques
    orders = db.query(Order).filter(
        Order.seller_id == seller_profile.id,
        Order.status == "delivered",
        Order.delivered_at >= start_date,
        Order.delivered_at <= end_date
    ).all()
    
    total_revenue = sum(order.total for order in orders)
    total_orders = len(orders)
    total_products_sold = sum(sum(item.quantity for item in order.items) for order in orders)
    average_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    # Revenue par catégorie
    revenue_by_category = {}
    for order in orders:
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                category = db.query(ProductCategory).filter(ProductCategory.id == product.category_id).first()
                if category:
                    cat_name = category.name
                    revenue_by_category[cat_name] = revenue_by_category.get(cat_name, 0) + item.total_price
    
    # Top produits
    product_sales = {}
    for order in orders:
        for item in order.items:
            product_sales[item.product_id] = product_sales.get(item.product_id, 0) + item.quantity
    
    top_products = []
    for product_id, quantity in sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:10]:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            top_products.append({
                "id": product.id,
                "name": product.name,
                "quantity_sold": quantity,
                "revenue": quantity * product.price
            })
    
    return SalesAnalytics(
        period=period,
        start_date=start_date,
        end_date=end_date,
        total_revenue=total_revenue,
        total_orders=total_orders,
        total_products_sold=total_products_sold,
        average_order_value=average_order_value,
        revenue_by_category=revenue_by_category,
        revenue_by_product={},  # TODO: Implement
        top_products=top_products
    )


# ============ Settings Endpoints ============

@router.get("/seller/settings", response_model=SellerSettings)
async def get_seller_settings(
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Paramètres du vendeur"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    return SellerSettings(
        store_name=seller_profile.name,
        store_description=seller_profile.bio,
        store_logo=seller_profile.avatar,
        store_banner=seller_profile.cover,
        contact_email=current_user.email,
        contact_phone=current_user.phone,
        # TODO: Implémenter shipping_preferences, return_policy, notification_preferences
    )


@router.put("/seller/settings")
async def update_seller_settings(
    settings: SellerSettingsUpdate,
    current_user: User = Depends(require_role("seller")),
    db: Session = Depends(get_db)
):
    """Mettre à jour les paramètres du vendeur"""
    seller_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=404, detail="Profil vendeur non trouvé")
    
    if settings.store_name:
        seller_profile.name = settings.store_name
    if settings.store_description:
        seller_profile.bio = settings.store_description
    
    # TODO: Implémenter les autres paramètres
    
    db.commit()
    
    return {"message": "Paramètres mis à jour"}
