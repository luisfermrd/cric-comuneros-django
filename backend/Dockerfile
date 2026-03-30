FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput 2>/dev/null || true

EXPOSE 8000

CMD ["sh", "-c", "python manage.py makemigrations users territories comuneros && python manage.py migrate && python manage.py seed && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]
