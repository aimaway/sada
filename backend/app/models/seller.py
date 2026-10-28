"""
Modèles Seller Portal - Products, Orders, Inventory
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


# Enums
class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"


class ProductCondition(str, enum.Enum):
    NEW = "new"
    USED = "used"
    REFURBISHED = "refurbished"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


# Models
class ProductCategory(Base):
    """Catégories de produits"""
    __tablename__ = "product_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("product_categories.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    parent = relationship("ProductCategory", remote_side=[id])
    products = relationship("Product", back_populates="category")


class Product(Base):
    """Produits vendeur"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("product_categories.id"), nullable=False)
    
    # Basic info
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    
    # Pricing
    price = Column(Integer, nullable=False)  # en centimes
    cost_price = Column(Integer, nullable=True)  # prix coûtant
    discount_percent = Column(Integer, default=0)
    currency = Column(String(3), default="MAD")
    
    # Inventory
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)
    stock_location = Column(String(100), nullable=True)
    track_inventory = Column(Boolean, default=True)
    
    # Status
    status = Column(SQLEnum(ProductStatus), default=ProductStatus.DRAFT)
    condition = Column(SQLEnum(ProductCondition), default=ProductCondition.NEW)
    is_featured = Column(Boolean, default=False)
    
    # Compatibility
    compatible_makes = Column(JSON, default=[])  # ["Toyota", "Dacia", etc.]
    compatible_models = Column(JSON, default=[])
    compatible_years = Column(JSON, default=[])  # [2018, 2019, 2020]
    compatible_engines = Column(JSON, default=[])
    
    # Shipping
    weight = Column(Float, nullable=True)  # en kg
    length = Column(Float, nullable=True)  # en cm
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    shipping_options = Column(JSON, default=[])
    
    # Media
    main_image = Column(String(500), nullable=True)
    additional_images = Column(JSON, default=[])
    
    # Stats
    views_count = Column(Integer, default=0)
    sales_count = Column(Integer, default=0)
    rating_avg = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    seller = relationship("ProviderProfile")
    category = relationship("ProductCategory", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("ProductReview", back_populates="product")


class ProductImage(Base):
    """Images de produits"""
    __tablename__ = "product_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_main = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="images")


class Order(Base):
    """Commandes client"""
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Parties
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Status
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    
    # Financial
    subtotal = Column(Integer, nullable=False)  # en centimes
    shipping_fee = Column(Integer, default=0)
    tax_amount = Column(Integer, default=0)
    discount_amount = Column(Integer, default=0)
    total = Column(Integer, nullable=False)
    
    # Shipping
    shipping_address = Column(JSON, nullable=False)
    shipping_method = Column(String(100), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    
    # Payment
    payment_method = Column(String(50), nullable=True)
    payment_reference = Column(String(100), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Notes
    customer_notes = Column(Text, nullable=True)
    seller_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    customer = relationship("User")
    seller = relationship("ProviderProfile")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order")
    refunds = relationship("Refund", back_populates="order")


class OrderItem(Base):
    """Articles dans une commande"""
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Details
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Integer, nullable=False)  # en centimes
    total_price = Column(Integer, nullable=False)
    
    # Product snapshot (au moment de la commande)
    product_name = Column(String(255), nullable=False)
    product_sku = Column(String(100), nullable=False)
    product_image = Column(String(500), nullable=True)
    
    # Status
    status = Column(String(50), default="pending")  # pending, shipped, delivered
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class InventoryMovement(Base):
    """Mouvements de stock"""
    __tablename__ = "inventory_movements"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Movement details
    type = Column(String(50), nullable=False)  # sale, purchase, adjustment, return
    quantity = Column(Integer, nullable=False)  # positif ou négatif
    previous_stock = Column(Integer, nullable=False)
    new_stock = Column(Integer, nullable=False)
    
    # Reference
    reference_type = Column(String(50), nullable=True)  # order, purchase_order, manual
    reference_id = Column(Integer, nullable=True)
    
    # Notes
    reason = Column(Text, nullable=True)
    performed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product")
    user = relationship("User")


class ProductReview(Base):
    """Avis sur les produits"""
    __tablename__ = "product_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    
    # Review details
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String(255), nullable=True)
    comment = Column(Text, nullable=True)
    images = Column(JSON, default=[])
    
    # Seller response
    seller_response = Column(Text, nullable=True)
    responded_at = Column(DateTime(timezone=True), nullable=True)
    
    # Status
    is_verified = Column(Boolean, default=False)  # achat vérifié
    is_approved = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="reviews")
    customer = relationship("User")
    order = relationship("Order")


class Payment(Base):
    """Paiements"""
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    
    # Payment details
    amount = Column(Integer, nullable=False)  # en centimes
    currency = Column(String(3), default="MAD")
    method = Column(String(50), nullable=False)  # cmi, orange_money, inwi_money, wallet
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    
    # External reference
    transaction_id = Column(String(100), nullable=True)
    provider_reference = Column(String(100), nullable=True)
    
    # Metadata ("metadata" est réservé par l'API Declarative de SQLAlchemy ;
    # la colonne SQL conserve son nom via metafor)
    metadata_json = Column("metadata", JSON, default={})
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    order = relationship("Order", back_populates="payments")


class Refund(Base):
    """Remboursements"""
    __tablename__ = "refunds"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=True)
    
    # Refund details
    amount = Column(Integer, nullable=False)  # en centimes
    reason = Column(Text, nullable=True)
    status = Column(String(50), default="pending")  # pending, approved, completed, rejected
    
    # Processing
    processed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # External reference
    refund_reference = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="refunds")
    payment = relationship("Payment")
    processor = relationship("User")
