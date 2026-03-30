# CRIC Comuneros - Django + React

Sistema de gestion de comuneros del Consejo Regional Indigena del Cauca (CRIC), con enfoque territorial y control de acceso.

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Backend | Django 5, Django REST Framework, SimpleJWT, drf-spectacular |
| Frontend | React 18, TypeScript, Vite, Mantine UI, TanStack Query |
| BD | PostgreSQL 16 |
| Tests | pytest (backend), Vitest (frontend) |
| DevOps | Docker Compose, GitHub Actions |

## Levantar el Proyecto

### Docker Compose

```bash
git clone <repo-url>
cd cric-comuneros-django
docker-compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:8000/api
- Swagger: http://localhost:8000/api/docs
- Admin Django: http://localhost:8000/admin

### Desarrollo Local

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

## Credenciales

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@cric-colombia.org | CricAdmin2026 |
| Operador | operador@cric-colombia.org | CricOper2026 |

## Permisos

| Accion | Admin | Operador |
|--------|-------|----------|
| Leer | Si | Si |
| Crear | Si | Si |
| Editar | Si | No |
| Eliminar | Si | No |

## API Endpoints

- `POST /api/auth/login/` - Login (JWT)
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/me/` - Usuario actual
- `GET /api/territories/` - Listar territorios
- `POST /api/territories/` - Crear territorio
- `PUT /api/territories/{id}/` - Actualizar (admin)
- `DELETE /api/territories/{id}/` - Eliminar (admin)
- `GET /api/comuneros/` - Listar comuneros (filtros: search, territory, is_active, sex)
- `GET /api/comuneros/stats/` - Estadisticas
- `POST /api/comuneros/` - Crear comunero
- `PUT /api/comuneros/{id}/` - Actualizar (admin)
- `DELETE /api/comuneros/{id}/` - Eliminar (admin)
- `GET /api/docs/` - Swagger UI

## Tests

```bash
# Backend (local)
cd backend
pip install -r requirements.txt
pytest -v

# Backend (Docker)
docker-compose exec backend pytest -v

# Frontend
cd frontend
npm install
npm test
```

## Despliegue a Produccion (VPS con nginx existente)

Compatible con servidores que ya tienen nginx corriendo (ServerAvatar, RunCloud, etc). Los contenedores escuchan en `127.0.0.1` y el nginx del VPS hace reverse proxy.

### 1. Configurar el servidor

```bash
# Clonar el repo
git clone <repo-url> /opt/cric-comuneros
cd /opt/cric-comuneros

# Crear .env de produccion
cp .env.production.example .env
nano .env  # Editar con tus valores reales

# Levantar
docker compose -f docker-compose.prod.yml up -d
```

### 2. Configurar nginx del VPS

Crear un vhost en el nginx existente (ver `nginx/vhost-example.conf`):

- `/*` → `http://127.0.0.1:8080` (frontend)
- `/api/*` → `http://127.0.0.1:8000` (backend)
- `/admin/*` → `http://127.0.0.1:8000` (Django admin)


### 3. Configurar GitHub Secrets para deploy automatico

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP o dominio del servidor |
| `VPS_USER` | Usuario SSH (ej: `deploy`) |
| `VPS_SSH_KEY` | Llave privada SSH |

| Variable | Valor |
|----------|-------|
| `DEPLOY_PATH` | `/opt/cric-comuneros` |

### 4. Flujo de deploy

Push a `main` → GitHub Actions ejecuta tests → SSH al VPS → `git pull` → rebuild containers → migrate → seed

## Estructura

```
cric-comuneros-django/
├── docker-compose.yml
├── .github/workflows/ci.yml
├── backend/
│   ├── config/           # Django settings, urls, wsgi
│   ├── apps/
│   │   ├── users/        # Auth, roles, permissions
│   │   ├── territories/  # CRUD territorios
│   │   └── comuneros/    # CRUD comuneros + stats
│   └── fixtures/
├── frontend/
│   └── src/
│       ├── components/   # AppShell (sidebar), StatsCards
│       ├── pages/        # Login, Dashboard, CRUD pages
│       ├── hooks/        # TanStack Query
│       ├── services/     # API client (axios)
│       └── providers/    # AuthContext
└── README.md
```
