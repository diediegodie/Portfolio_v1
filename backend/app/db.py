from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_ENGINE_OPTIONS

engine = create_engine(
    SQLALCHEMY_DATABASE_URI,
    future=True,
    **SQLALCHEMY_ENGINE_OPTIONS,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    future=True,
)

Base = declarative_base()
