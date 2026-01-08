import os
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    make_response,
)
from app.utils import i18n


app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)
app.secret_key = os.environ.get("SECRET_KEY", "dev-key-change-in-production")

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
    from app.services import projects_service

    projects = projects_service.list_projects()
    return render_template("home.html", projects=projects)


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=True)
