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
        # Safely extract values from ORM instance to avoid static type checkers
        # confusing class-level Column[...] descriptors with instance values.
        title_key = getattr(p, "title_key", None)
        title_key = title_key if isinstance(title_key, str) else ""

        description_key = getattr(p, "description_key", None)
        description_key = description_key if isinstance(description_key, str) else ""

        stack_val = getattr(p, "stack", None)
        stack = stack_val if isinstance(stack_val, list) else []

        github_url = getattr(p, "github_url", None)
        github_url = github_url if isinstance(github_url, str) else ""

        website_url = getattr(p, "website_url", None)
        website_url = website_url if isinstance(website_url, str) else ""

        image_urls_val = getattr(p, "image_urls", None)
        image_urls = image_urls_val if isinstance(image_urls_val, list) else []

        readme_ref = getattr(p, "readme_path", None)
        readme_ref = readme_ref if isinstance(readme_ref, str) else ""

        item = {
            "id": getattr(p, "id", None),
            "slug": getattr(p, "slug", ""),
            "title_key": title_key,
            "description_key": description_key,
            "title": i18n._(title_key) if title_key else "",
            "description": i18n._(description_key) if description_key else "",
            "stack": stack,
            "github_url": github_url,
            "website_url": website_url,
            "demo_url": website_url,
            "image_urls": image_urls,
            "images": image_urls,
            "readme_path": readme_ref,
        }

        readme_html = ""
        try:
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
