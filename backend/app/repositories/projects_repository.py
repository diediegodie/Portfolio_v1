from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models.project import Project


def get_all_projects(db: Session) -> Sequence[Project]:
    """Return all projects stored in the database as ORM instances.

    Use SQLAlchemy 1.4+ style select() and scalars() so callers always get
    mapped Project objects (not Column/InstrumentedAttribute values).
    """
    stmt = select(Project).order_by(Project.id)
    return db.execute(stmt).scalars().all()
