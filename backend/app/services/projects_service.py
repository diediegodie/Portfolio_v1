from typing import List, Dict
from pathlib import Path

import markdown
from sqlalchemy.orm import Session

from ..repositories import projects_repository
from ..utils import i18n


def list_projects(db: Session) -> List[Dict]:
    """Return projects for controllers to render, with localized title/description."""
    projects = projects_repository.get_all_projects(db)
    localized = []
    for p in projects:
        item = {
            "id": p.id,
            "slug": p.slug,
            "title_key": p.title_key,
            "description_key": p.description_key,
            "title": i18n._(p.title_key) if p.title_key else "",
            "description": i18n._(p.description_key) if p.description_key else "",
            "stack": p.stack if isinstance(p.stack, list) else (p.stack or []),
            "github_url": p.github_url or "",
            "website_url": p.website_url or "",
            "demo_url": p.website_url or "",
            "image_urls": p.image_urls or [],
            "images": p.image_urls or [],
            "readme_path": p.readme_path or "",
        }

        readme_html = ""
        try:
            readme_ref = p.readme_path
            if readme_ref:
                repo_dir = Path(__file__).parent.parent.joinpath("repositories")
                readme_path = repo_dir.joinpath(readme_ref)
                if readme_path.exists():
                    raw = readme_path.read_text(encoding="utf-8")
                    readme_html = markdown.markdown(raw, output_format="html")
        except Exception:
            readme_html = ""

        item["readme_html"] = readme_html
        localized.append(item)
    return localized
