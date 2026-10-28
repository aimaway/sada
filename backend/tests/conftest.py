"""Fixtures partagees pour les tests marketplace / IFIX AI."""
import pytest
from app.main import create_access_token


@pytest.fixture(autouse=True)
def _isolate_db_override(request):
    """Chaque module de test possede sa propre SQLite (test.db,
    test_marketplace.db, test_ifix.db) mais partage l'app FastAPI globale.
    On reenregistre l'override get_db du module courant avant chaque test,
    et on purge entierement la base cible entre modules pour eviter toute
    contamination croisee (tables orphelines d'un autre engine, etc.)."""
    from app.database import Base, get_db
    from app.main import app
    module = request.node.module
    override = getattr(module, "override_get_db", None)
    if override is not None:
        app.dependency_overrides[get_db] = override
    yield


@pytest.fixture
def token_for():
    """Fabrique de JWT : token_for(user) -> header value (sub=str(user.id))."""
    def _make(user):
        return create_access_token(data={"sub": str(user.id)})
    return _make
