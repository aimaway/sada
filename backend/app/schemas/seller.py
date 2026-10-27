"""
Schémas Pydantic pour Seller Portal
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class ProductStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"


class ProductCondition(str, Enum):
    NEW = "new"
    USED = "used"
    REFURBISHED = "refurbished"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


# Product Schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    category_id: int
    price: int = Field(..., gt=0)  # en centimes
    cost_price: Optional[int] = Field(None, ge=0)
    discount_percent: int = Field(default=0, ge=0, le=100)
    stock_quantity: int = Field(default=0, ge=0)
    low_stock_threshold: int = Field(default=5, ge=0)
    status: ProductStatus = ProductStatus.DRAFT
    condition: ProductCondition = ProductCondition.NEW
    is_featured: bool = False
    compatible_makes: List[str] = []
    compatible_models: List[str] = []
    compatible_years: List[int] = []
    weight: Optional[float] = Field(None, gt=0)
    length: Optional[float] = Field(None, gt=0)
    width: Optional[float] = Field(None, gt=0)
    height: Optional[float] = Field(None, gt=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    category_id: Optional[int] = None
    price: Optional[int] = Field(None, gt=0)
    cost_price: Optional[int] = Field(None, ge=0)
    discount_percent: Optional[int] = Field(None, ge=0, le=100)
    stock_quantity: Optional[int] = Field(None, ge=0)
    low_stock_threshold: Optional[int] = Field(None, ge=0)
    status: Optional[ProductStatus] = None
    condition: Optional[ProductCondition] = None
    is_featured: Optional[bool] = None
    compatible_makes: Optional[List[str]] = None
    compatible_models: Optional[List[str]] = None
    compatible_years: Optional[List[int]] = None
    weight: Optional[float] = Field(None, gt=0)
    length: Optional[float] = Field(None, gt=0)
    width: Optional[float] = Field(None, gt=0)
    height: Optional[float] = Field(None, gt=0)


class ProductResponse(ProductBase):
    id: int
    seller_id: int
    slug: str
    main_image: Optional[str] = None
    additional_images: List[str] = []
    views_count: int
    sales_count: int
    rating_avg: float
    review_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(..., min_length=1)
    shipping_address: dict
    shipping_method: Optional[str] = None
    customer_notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    product_image: Optional[str] = None
    quantity: int
    unit_price: int
    total_price: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: int
    seller_id: int
    status: OrderStatus
    payment_status: str
    subtotal: int
    shipping_fee: int
    tax_amount: int
    discount_amount: int
    total: int
    shipping_address: dict
    shipping_method: Optional[str] = None
    tracking_number: Optional[str] = None
    payment_method: Optional[str] = None
    customer_notes: Optional[str] = None
    seller_notes: Optional[str] = None
    items: List[OrderItemResponse] = []
    created_at: datetime
    updated_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Inventory Schemas
class InventoryMovementCreate(BaseModel):
    product_id: int
    type: str  # sale, purchase, adjustment, return
    quantity: int  # positif ou négatif
    reason: Optional[str] = None


class InventoryMovementResponse(BaseModel):
    id: int
    product_id: int
    type: str
    quantity: int
    previous_stock: int
    new_stock: int
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None
    reason: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Category Schemas
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True
    display_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Analytics Schemas
class SalesAnalytics(BaseModel):
    period: str  # daily, weekly, monthly, yearly
    start_date: datetime
    end_date: datetime
    total_revenue: int
    total_orders: int
    total_products_sold: int
    average_order_value: float
    revenue_by_category: dict
    revenue_by_product: dict
    top_products: List[dict]


class DashboardStats(BaseModel):
    total_products: int
    active_products: int
    low_stock_products: int
    out_of_stock_products: int
    total_orders: int
    pending_orders: int
    processing_orders: int
    completed_orders: int
    total_revenue: int
    pending_revenue: int
    available_balance: int
    total_reviews: int
    average_rating: float


# Review Schemas
class ProductReviewCreate(BaseModel):
    product_id: int
    order_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    comment: Optional[str] = None
    images: List[str] = []


class ProductReviewResponse(BaseModel):
    id: int
    product_id: int
    customer_id: int
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    images: List[str] = []
    seller_response: Optional[str] = None
    responded_at: Optional[datetime] = None
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Seller Settings Schemas
class SellerSettings(BaseModel):
    store_name: Optional[str] = None
    store_description: Optional[str] = None
    store_logo: Optional[str] = None
    store_banner: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    shipping_preferences: Optional[dict] = None
    return_policy: Optional[str] = None
    notification_preferences: Optional[dict] = None


class SellerSettingsUpdate(BaseModel):
    store_name: Optional[str] = Field(None, max_length=255)
    store_description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    shipping_preferences: Optional[dict] = None
    return_policy: Optional[str] = None
    notification_preferences: Optional[dict] = None
