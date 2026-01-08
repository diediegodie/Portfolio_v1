import json
import os
import logging
from flask import request, session, current_app

TRANSLATIONS = {}

SUPPORTED_LANGUAGES = ["en", "pt"]
DEFAULT_LANGUAGE = "en"


def load_translations():
    """Load translation JSON files into the TRANSLATIONS dict.

    This function is defensive: any missing or invalid translation file
    will be logged and will not crash the application. On error the
    language key is set to an empty dict so templates can still render.
    """
    global TRANSLATIONS
    base_path = os.path.join(os.path.dirname(__file__), "../translations")
    for lang in SUPPORTED_LANGUAGES:
        file_path = os.path.join(base_path, f"{lang}.json")
        try:
            with open(file_path, encoding="utf-8") as f:
                TRANSLATIONS[lang] = json.load(f)
        except FileNotFoundError:
            logging.warning("i18n: translation file not found: %s", file_path)
            TRANSLATIONS[lang] = {}
        except json.JSONDecodeError as e:
            logging.warning("i18n: failed to parse JSON %s: %s", file_path, e)
            TRANSLATIONS[lang] = {}
        except Exception as e:
            logging.warning("i18n: unexpected error loading %s: %s", file_path, e)
            TRANSLATIONS[lang] = {}

    return TRANSLATIONS


def get_locale():
    # Priority: session > cookie > Accept-Language > default
    lang = session.get("lang")
    if not lang:
        lang = request.cookies.get("lang")
    if not lang:
        accept = request.headers.get("Accept-Language", "")
        if accept:
            lang = accept.split(",")[0].split("-")[0]
    if lang not in SUPPORTED_LANGUAGES:
        lang = DEFAULT_LANGUAGE
    return lang


def _(key):
    lang = get_locale()

    def resolve(dct, dotted_key):
        if not dotted_key:
            return None
        parts = dotted_key.split('.')
        cur = dct
        for p in parts:
            # dict access
            if isinstance(cur, dict):
                if p in cur:
                    cur = cur[p]
                    continue
                else:
                    return None
            # list/tuple access by numeric index
            if isinstance(cur, (list, tuple)):
                if p.isdigit():
                    idx = int(p)
                    if 0 <= idx < len(cur):
                        cur = cur[idx]
                        continue
                    else:
                        return None
                else:
                    return None
            # unsupported type
            return None
        return cur

    # Try current language then fallback to default language, finally return key
    val = resolve(TRANSLATIONS.get(lang, {}), key)
    if val is None:
        val = resolve(TRANSLATIONS.get(DEFAULT_LANGUAGE, {}), key)
    return val if val is not None else key


def inject_i18n():
    # Expose translations dict to templates so frontend can embed a client-side cache
    return {"_": _, "TRANSLATIONS": TRANSLATIONS}
