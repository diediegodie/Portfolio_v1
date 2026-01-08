from typing import List, Dict
from pathlib import Path
import markdown

from ..repositories import projects_repository
from app.utils import i18n


def list_projects() -> List[Dict]:
    """Return projects for controllers to render, with localized title/description."""
    projects = projects_repository.get_all_projects()
    localized = []
    for p in projects:
        item = p.copy()
        # Localize title/description using translation keys via i18n._
        try:
            item["title"] = i18n._(p["title"]) if p.get("title") else ""
            item["description"] = (
                i18n._(p["description"]) if p.get("description") else ""
            )
        except Exception:
            # Fallback to raw values if localization fails
            item["title"] = p.get("title", "")
            item["description"] = p.get("description", "")
        # Ensure stack is an array for templates
        if "stack" in item and not isinstance(item["stack"], list):
            item["stack"] = [item["stack"]]

        # Optionally include README content rendered from Markdown.
        # Projects can include a `readme` field with a path relative to the
        # `backend/app/repositories` directory (for example: "readmes/foo.md").
        readme_html = ""
        try:
            readme_ref = p.get("readme")
            if readme_ref:
                repo_dir = Path(__file__).parent.parent.joinpath("repositories")
                readme_path = repo_dir.joinpath(readme_ref)
                if readme_path.exists():
                    raw = readme_path.read_text(encoding="utf-8")
                    # Convert Markdown to HTML; safe HTML will be rendered in templates
                    readme_html = markdown.markdown(raw, output_format="html")
        except Exception:
            readme_html = ""
        item["readme_html"] = readme_html
        localized.append(item)
    return localized
