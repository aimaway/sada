"""
Système RBAC - Role-Based Access Control
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Callable
from functools import wraps
import jwt

from app.database import get_db
from app.models import User
from app.config import settings

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Obtenir l'utilisateur actuel depuis le token JWT"""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            user_id = None
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    if (user.status or "active") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte désactivé"
        )

    # Snapshot des attributs : les sessions d'injection de dependances sont
    # closes en fin de requete et certains handlers appellent db.commit()
    # (expire_on_commit=True) ; un objet attache accede plus tard (ex.
    # user.id dans marketplace.accept_offer apres commit) leverait un
    # DetachedInstanceError. On renvoie donc une instance User detachee dont
    # tous les attributs colonnes sont pré-charges dans __dict__ — le handler
    # peut lire n'importe quel champ sans session ni refresh. Pour les
    # endpoints qui MUTENT current_user, utiliser rebind_user() (app.main).
    state = {c.key: getattr(user, c.key) for c in User.__mapper__.column_attrs}
    detached = User.__new__(User)
    detached.__dict__.update(state)
    return detached


def require_role(*roles: str) -> Callable:
    """
    Décorateur pour vérifier le rôle de l'utilisateur
    
    Usage:
        @router.get("/seller/dashboard")
        async def seller_dashboard(current_user: User = Depends(require_role("seller"))):
            ...
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Accès réservé aux rôles: {', '.join(roles)}"
            )
        return current_user
    
    return role_checker


def require_any_role(*roles: str) -> Callable:
    """
    Décorateur pour vérifier que l'utilisateur a au moins un des rôles spécifiés
    
    Usage:
        @router.get("/provider/dashboard")
        async def provider_dashboard(current_user: User = Depends(require_any_role("seller", "tuner", "mechanic"))):
            ...
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Accès réservé aux rôles: {', '.join(roles)}"
            )
        return current_user
    
    return role_checker


def require_permission(permission: str) -> Callable:
    """
    Décorateur pour vérifier une permission spécifique
    
    Usage:
        @router.post("/products")
        async def create_product(current_user: User = Depends(require_permission("products.create"))):
            ...
    """
    def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        # TODO: Implémenter un système de permissions granulaires
        # Pour l'instant, on vérifie juste le rôle
        role_permissions = {
            "customer": ["orders.create", "orders.read", "reviews.create"],
            "seller": ["products.*", "orders.*", "inventory.*", "analytics.read"],
            "tuner": ["projects.*", "requests.*", "appointments.*", "portfolio.*", "analytics.read"],
            "mechanic": ["jobs.*", "requests.read"],
            "admin": ["*"],
        }
        
        user_permissions = role_permissions.get(current_user.role, [])
        
        # Vérifier si la permission est accordée
        if "*" not in user_permissions and permission not in user_permissions:
            # Vérifier les permissions wildcards
            permission_parts = permission.split(".")
            has_permission = False
            
            for user_perm in user_permissions:
                if user_perm.endswith(".*"):
                    perm_prefix = user_perm[:-2]
                    if permission.startswith(perm_prefix):
                        has_permission = True
                        break
            
            if not has_permission:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission refusée: {permission}"
                )
        
        return current_user
    
    return permission_checker


def check_resource_ownership(resource_owner_id: int, current_user: User) -> bool:
    """
    Vérifier que l'utilisateur est le propriétaire de la ressource
    
    Usage:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not check_resource_ownership(product.seller_id, current_user):
            raise HTTPException(status_code=403, detail="Accès refusé")
    """
    # Admin peut tout voir
    if current_user.role == "admin":
        return True
    
    # Vérifier que l'utilisateur est le propriétaire
    return resource_owner_id == current_user.id


def check_provider_ownership(provider_id: int, current_user: User, db: Session) -> bool:
    """
    Vérifier que l'utilisateur est le propriétaire du profil provider
    
    Usage:
        if not check_provider_ownership(provider_id, current_user, db):
            raise HTTPException(status_code=403, detail="Accès refusé")
    """
    from app.models import ProviderProfile
    
    # Admin peut tout voir
    if current_user.role == "admin":
        return True
    
    # Vérifier que le profil provider appartient à l'utilisateur
    provider = db.query(ProviderProfile).filter(
        ProviderProfile.id == provider_id,
        ProviderProfile.user_id == current_user.id
    ).first()
    
    return provider is not None
