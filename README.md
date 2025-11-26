# API Cementerio – Gestión de Reservas de Parcelas

Backend en Django + Django REST Framework + PostgreSQL para gestionar:
- Usuarios
- Parcelas
- Reservas
- Pagos
- Difuntos

## Requisitos

- Python 3.11+
- PostgreSQL 14+
- pip / virtualenv

## Instalación

```bash
git clone <URL_DEL_REPO>
cd cementerio_api

python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell

pip install -r requirements.txt

# Configurar DB en cementerio_api/settings.py

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
