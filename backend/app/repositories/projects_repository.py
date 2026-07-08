from typing import List

from sqlalchemy.orm import Session

from ..models.project import Project


def get_all_projects(db: Session) -> List[Project]:
    """Return all projects stored in the database."""
    return db.query(Project).order_by(Project.id).all()
