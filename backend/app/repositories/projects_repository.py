import json
from pathlib import Path
from typing import List, Dict


_DATA_PATH = Path(__file__).parent.joinpath("projects.json")


def get_all_projects() -> List[Dict]:
    """Return a list of project dicts read from projects.json.

    This is a simple JSON-backed repository for now.
    """
    if not _DATA_PATH.exists():
        return []
    try:
        with _DATA_PATH.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
            if isinstance(data, list):
                return data
            return []
    except Exception:
        return []
