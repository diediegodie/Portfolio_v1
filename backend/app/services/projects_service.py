from typing import List, Dict
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
        localized.append(item)
    return localized
