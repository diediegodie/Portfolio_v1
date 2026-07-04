import os
import re
import sys
from pathlib import Path
from dotenv import load_dotenv
from flask import (
    Flask,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

ROOT_DIR = Path(__file__).resolve().parent.parent
if ROOT_DIR.as_posix() not in sys.path:
    sys.path.insert(0, ROOT_DIR.as_posix())

load_dotenv(ROOT_DIR / ".env")

from backend.app.utils import i18n

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)
secret_key = os.environ.get("SECRET_KEY")
if not secret_key:
    raise RuntimeError("SECRET_KEY environment variable is required")
app.secret_key = secret_key

# Simple validation pattern (not exhaustive) for client-provided emails
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _normalize_contact_payload():
    data = request.get_json(silent=True)
    if data is None:
        data = request.form
    if data is None:
        data = {}

    def _clean(value):
        if isinstance(value, (list, tuple)):
            value = value[0] if value else ""
        if value is None:
            return ""
        return str(value).strip()

    return {
        "name": _clean(data.get("name")),
        "email": _clean(data.get("email")),
        "subject": _clean(data.get("subject")),
        "message": _clean(data.get("message")),
        "consent_marketing": bool(_clean(data.get("consent_marketing"))),
        "hp": _clean(data.get("hp")),
    }


def _json_error_response(message=None):
    payload = {
        "status": "error",
        "message": message or i18n._("contact.form.error"),
    }
    if request.is_json:
        return jsonify(payload), 400
    return redirect(request.referrer or url_for("home"))


def _json_success_response():
    payload = {"status": "ok", "message": i18n._("contact.form.success")}
    if not request.is_json:
        return redirect(request.referrer or url_for("home"))
    return jsonify(payload)


# Load translations at startup
i18n.load_translations()


# Register context processor that returns a dict with the current TRANSLATIONS state
@app.context_processor
def inject_translations():
    # In debug mode, reload translations on each request so changes to
    # translation JSON files are reflected without restarting the server.
    if app.debug:
        i18n.load_translations()
    return {"_": i18n._, "TRANSLATIONS": i18n.TRANSLATIONS}


@app.route("/set_language/<lang>", methods=["POST"])
def set_language(lang):
    if lang not in i18n.SUPPORTED_LANGUAGES:
        lang = i18n.DEFAULT_LANGUAGE
    session["lang"] = lang
    resp = make_response(redirect(request.referrer or url_for("home")))
    resp.set_cookie("lang", lang, max_age=60 * 60 * 24 * 365)
    return resp


@app.route("/")
def home():
    from backend.app.services import projects_service

    projects = projects_service.list_projects()
    return render_template("home.html", projects=projects)


@app.route("/contact", methods=["POST"])
def contact():
    payload = _normalize_contact_payload()
    app.logger.info("contact submission received: %s", payload)

    name = payload.get("name")
    email = payload.get("email")
    message = payload.get("message")
    hp = payload.get("hp")

    if hp:
        return _json_error_response()

    if not name or not email or not message or not EMAIL_PATTERN.match(email):
        return _json_error_response()

    return _json_success_response()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=True)
