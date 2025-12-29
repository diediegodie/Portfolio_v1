from typing import List, Dict
from ..repositories import projects_repository


def list_projects() -> List[Dict]:
    """Return projects for controllers to render.

    Service layer exists to be extended with caching, filtering, or DB access.
    """
    projects = projects_repository.get_all_projects()
    # Ensure stack is an array for templates
    for p in projects:
        if "stack" in p and not isinstance(p["stack"], list):
            p["stack"] = [p["stack"]]
    return projects
