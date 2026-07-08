import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env", override=False)

SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_size": 3,
    "max_overflow": 0,
    "pool_timeout": 30,
    "pool_pre_ping": True,
}


def get_database_url() -> str:
    url = os.environ.get("DATABASE_URL") or os.environ.get("DATABASE_URI")
    if not url:
        raise RuntimeError(
            "DATABASE_URL environment variable is required for database connectivity"
        )
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    return url


SQLALCHEMY_DATABASE_URI = get_database_url()
