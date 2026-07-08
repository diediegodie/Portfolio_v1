from sqlalchemy import Column, DateTime, Integer, JSON, String, func

from ..db import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    title_key = Column(String(255), nullable=False)
    description_key = Column(String(255), nullable=False)
    stack = Column(JSON, nullable=True)
    github_url = Column(String(1024), nullable=True)
    website_url = Column(String(1024), nullable=True)
    image_urls = Column(JSON, nullable=True)
    readme_path = Column(String(1024), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
