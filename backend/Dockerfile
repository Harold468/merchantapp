FROM python:3.13.2-slim-bookworm

# Install system dependencies for Pillow and general build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    libpq-dev \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libopenjp2-7-dev \
    libtiff5-dev \
    tk-dev \
    python3-dev \
    libyaml-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
# Remove pywin32 from requirements as it's Windows-only
RUN sed -i '/pywin32/d' requirements.txt
# Install build dependencies and PyYAML
RUN pip install --no-cache-dir --upgrade pip setuptools wheel cython
RUN pip install --no-cache-dir PyYAML==6.0.2
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# COPY entrypoint.sh /app/entrypoint.sh
# RUN chmod +x /app/entrypoint.sh

EXPOSE 8000


CMD ["gunicorn", "merchantproject.wsgi.application", "--bind", "0.0.0.0:8000"]