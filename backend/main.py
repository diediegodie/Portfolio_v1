from flask import Flask, render_template

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)


@app.route("/")
def home():
    from app.services import projects_service

    projects = projects_service.list_projects()
    return render_template("home.html", projects=projects)


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=True)
