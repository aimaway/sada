"""Notifications in-app persistées (distinctes des envois SMS/e-mail externes)."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.sql import func

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    type = Column(String(50), nullable=False)   # partnership_invite, security_change, order_update...
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=True)
    link = Column(String(255), nullable=True)   # route interne vers le détail
    data = Column(JSON, default={})
    read = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
