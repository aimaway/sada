"""
Modèles Financiers - Transactions, Commissions, Payouts
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


# Enums
class TransactionType(str, enum.Enum):
    PAYMENT = "payment"
    COMMISSION = "commission"
    PAYOUT = "payout"
    REFUND = "refund"
    ADJUSTMENT = "adjustment"
    FEE = "fee"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentMethod(str, enum.Enum):
    CMI = "cmi"
    ORANGE_MONEY = "orange_money"
    INWI_MONEY = "inwi_money"
    MAROC_TELECOM = "maroc_telecom"
    WAFACASH = "wafacash"
    WALLET = "wallet"
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"


class PayoutStatus(str, enum.Enum):
    REQUESTED = "requested"
    APPROVED = "approved"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


# Models
class Transaction(Base):
    """Transactions financières"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(100), unique=True, index=True, nullable=False)
    
    # Type
    type = Column(SQLEnum(TransactionType), nullable=False)
    
    # Parties
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Financial
    amount = Column(Integer, nullable=False)  # en centimes
    currency = Column(String(3), default="MAD")
    fee_amount = Column(Integer, default=0)
    net_amount = Column(Integer, nullable=False)
    
    # Status
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING)
    
    # Reference
    reference_type = Column(String(50), nullable=True)  # order, project, payout, etc.
    reference_id = Column(Integer, nullable=True)
    reference_number = Column(String(100), nullable=True)
    
    # Payment method
    payment_method = Column(SQLEnum(PaymentMethod), nullable=True)
    external_transaction_id = Column(String(200), nullable=True)
    
    # Metadata
    description = Column(Text, nullable=True)
    # "metadata" est réservé par l'API Declarative de SQLAlchemy ;
    # la colonne SQL conserve son nom via metafor
    metadata_json = Column("metadata", JSON, default={})
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    from_user = relationship("User", foreign_keys=[from_user_id])
    to_user = relationship("User", foreign_keys=[to_user_id])


class Commission(Base):
    """Commissions plateforme"""
    __tablename__ = "commissions"
    
    id = Column(Integer, primary_key=True, index=True)
    commission_id = Column(String(100), unique=True, index=True, nullable=False)
    
    # Source
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("tuning_projects.id"), nullable=True)
    
    # Provider
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    provider_type = Column(String(50), nullable=False)  # seller, tuner, mechanic
    
    # Financial
    gross_amount = Column(Integer, nullable=False)  # montant brut
    commission_rate = Column(Float, nullable=False)  # pourcentage (ex: 10.0 pour 10%)
    commission_amount = Column(Integer, nullable=False)  # montant commission
    
    # Status
    status = Column(String(50), default="pending")  # pending, collected, refunded
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    collected_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    transaction = relationship("Transaction")
    order = relationship("Order")
    project = relationship("TuningProject")
    provider = relationship("ProviderProfile")


class Payout(Base):
    """Versements aux providers"""
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    payout_id = Column(String(100), unique=True, index=True, nullable=False)
    
    # Provider
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Financial
    amount = Column(Integer, nullable=False)  # en centimes
    currency = Column(String(3), default="MAD")
    fee_amount = Column(Integer, default=0)
    net_amount = Column(Integer, nullable=False)
    
    # Method
    payout_method = Column(SQLEnum(PaymentMethod), nullable=False)
    payout_details = Column(JSON, nullable=False)  # {bank_account, phone_number, etc.}
    
    # Status
    status = Column(SQLEnum(PayoutStatus), default=PayoutStatus.REQUESTED)
    
    # Reference
    external_reference = Column(String(200), nullable=True)
    
    # Processing
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Notes
    approval_notes = Column(Text, nullable=True)
    failure_reason = Column(Text, nullable=True)
    
    # Relationships
    provider = relationship("ProviderProfile")


class WalletTransaction(Base):
    """Transactions de portefeuille"""
    __tablename__ = "wallet_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Provider
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Transaction
    type = Column(String(50), nullable=False)  # credit, debit
    amount = Column(Integer, nullable=False)  # en centimes
    balance_before = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    
    # Reference
    reference_type = Column(String(50), nullable=True)  # sale, commission, payout, refund
    reference_id = Column(Integer, nullable=True)
    
    # Description
    description = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    provider = relationship("ProviderProfile")


class FinancialReport(Base):
    """Rapports financiers"""
    __tablename__ = "financial_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Period
    report_type = Column(String(50), nullable=False)  # daily, weekly, monthly, yearly
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Provider (optional - null for platform-wide reports)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=True)
    
    # Financial summary
    total_revenue = Column(Integer, default=0)  # en centimes
    total_commissions = Column(Integer, default=0)
    total_payouts = Column(Integer, default=0)
    total_refunds = Column(Integer, default=0)
    net_revenue = Column(Integer, default=0)
    
    # Breakdown
    revenue_breakdown = Column(JSON, default={})  # {by_product, by_category, etc.}
    commission_breakdown = Column(JSON, default={})
    
    # Statistics
    total_transactions = Column(Integer, default=0)
    total_orders = Column(Integer, default=0)
    total_projects = Column(Integer, default=0)
    
    # Metadata
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    generated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    provider = relationship("ProviderProfile")
    generator = relationship("User")


class PaymentProvider(Base):
    """Configuration des providers de paiement"""
    __tablename__ = "payment_providers"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Provider info
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    method = Column(SQLEnum(PaymentMethod), nullable=False)
    
    # Configuration
    is_active = Column(Boolean, default=True)
    is_test_mode = Column(Boolean, default=False)
    
    # Credentials (encrypted in production)
    api_key = Column(String(500), nullable=True)
    api_secret = Column(String(500), nullable=True)
    merchant_id = Column(String(100), nullable=True)
    
    # Settings
    settings = Column(JSON, default={})
    
    # Fees
    fee_percent = Column(Float, default=0.0)
    fee_fixed = Column(Integer, default=0)  # en centimes
    
    # Limits
    min_amount = Column(Integer, nullable=True)
    max_amount = Column(Integer, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PayoutMethod(Base):
    """Méthodes de versement configurées par provider"""
    __tablename__ = "payout_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Provider
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Method
    payment_method = Column(SQLEnum(PaymentMethod), nullable=False)
    is_default = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # Details (encrypted in production)
    account_details = Column(JSON, nullable=False)  # {bank_name, account_number, etc.}
    
    # Limits
    min_payout = Column(Integer, nullable=True)
    max_payout = Column(Integer, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    verified_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    provider = relationship("ProviderProfile")
