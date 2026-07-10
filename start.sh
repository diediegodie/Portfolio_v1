# aplica migrations
alembic upgrade head

# inicia o servidor
gunicorn main:app --bind 0.0.0.0:$PORT