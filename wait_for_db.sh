until python -c "import psycopg2; psycopg2.connect(dbname='$DB_NAME', user='$DB_USER', password='$DB_PASSWORD', host='$DB_HOST')"
do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

python crypto_backend/manage.py migrate
gunicorn crypto_backend.wsgi