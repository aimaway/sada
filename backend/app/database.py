"""
Configuration de la base de données PostgreSQL
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

def _sync_pool_kwargs(url: str) -> dict:
    """Pool args only make sense for server-backed dialects (PostgreSQL/MySQL).
    SQLite (dev mode) uses NullPool/StaticPool and rejects pool_size/max_overflow."""
    if url.startswith("postgresql") or url.startswith("mysql"):
        return {
            "pool_size": settings.DATABASE_POOL_SIZE,
            "max_overflow": settings.DATABASE_MAX_OVERFLOW,
            "pool_pre_ping": True,
        }
    # SQLite dev fallback
    kwargs = {"connect_args": {"check_same_thread": False}}
    if ":memory:" in url:
        from sqlalchemy.pool import StaticPool
        kwargs["poolclass"] = StaticPool
    return kwargs


# Synchronous engine (for Alembic migrations + sync API deps)
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    **_sync_pool_kwargs(settings.DATABASE_URL),
)

# Async engine (for FastAPI) — sqlite needs aiosqlite driver instead of asyncpg
_async_url = settings.DATABASE_URL
if _async_url.startswith("postgresql://"):
    _async_url = _async_url.replace("postgresql://", "postgresql+asyncpg://")
elif _async_url.startswith("sqlite:///"):
    _async_url = _async_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

if settings.DATABASE_URL.startswith(("postgresql", "mysql")):
    async_engine = create_async_engine(
        _async_url,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,
        echo=settings.DEBUG,
    )
else:
    from sqlalchemy.pool import StaticPool as _StaticPool
    _a_kwargs = {"echo": settings.DEBUG, "poolclass": _StaticPool} if ":memory:" in _async_url else {"echo": settings.DEBUG}
    async_engine = create_async_engine(_async_url, **_a_kwargs)

# Session factories
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession
)

# Base for models
Base = declarative_base()


def get_db():
    """Dependency pour obtenir une session de base de données synchrone"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Dependency pour obtenir une session de base de données asynchrone"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
