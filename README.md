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

> **Repositorio Oficial:** `https://github.com/luisfermrd/cric-comuneros-django.git`

### ⚙️ Variables de Entorno (Opcional en Local)

El proyecto viene configurado con valores por defecto para funcionar inmediatamente en tu máquina. **No necesitas crear un archivo `.env` para desarrollo local**, a menos que tus credenciales de PostgreSQL sean diferentes a las de por defecto (`Usuario: postgres`, `Contraseña: postgres`).

Si necesitas cambiarlas, puedes crear un archivo `.env` en la carpeta `backend/` con el siguiente formato (puedes guiarte del archivo `.env.production.example` que está en la raíz del proyecto):

```env
DB_NAME=cric_comuneros
DB_USER=mi_usuario
DB_PASSWORD=mi_password
DB_HOST=localhost
DB_PORT=5432
```

---

### Opción 1: Todo con Docker Compose (Recomendado)

```bash
git clone https://github.com/luisfermrd/cric-comuneros-django.git
cd cric-comuneros-django
docker-compose up --build
```

Servicios levantados:
- Frontend: http://localhost:8080
- API Backend: http://localhost:8000/api
- Documentación Swagger: http://localhost:8000/api/docs
- Admin de Django: http://localhost:8000/admin

---

### Opción 2: Desarrollo Local (Consola)

⚠️ **Prerrequisito Backend:** Debes tener PostgreSQL instalado localmente o levantar el contenedor de base de datos (`docker-compose up -d db`).

```bash
git clone https://github.com/luisfermrd/cric-comuneros-django.git
cd cric-comuneros-django
```

#### 1. Backend (Django)
```bash
cd backend

# 1. Crear y activar entorno virtual (Recomendado)
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Migraciones y Base de Datos
python manage.py migrate

# 4. Poblar datos por defecto (usuarios, territorios, etc.)
python manage.py seed

# 5. Levantar el servidor
python manage.py runserver
```
El backend quedará escuchando en `http://localhost:8000`

#### 2. Frontend (React/Vite)
Abre **otra** pestaña en tu terminal:
```bash
cd frontend

# 1. Instalar dependencias de Node
npm install

# 2. Levantar servidor de desarrollo
npm run dev
```
El frontend abrirá usualmente en `http://localhost:5173` (Vite).

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

## Despliegue a Producción (VPS por IP Directa)

Este proyecto está configurado para desplegarse fácilmente en un servidor usando IP. Dado que muchos servidores tienen el puerto 80 ocupado por defecto, el sistema usará los siguientes puertos:
- **`8080`** (Frontend) -> Aquí entrarás a tu app: `http://TU_IP:8080`
- **`8000`** (Backend API/Admin)

### 1. Configurar el servidor

```bash
# Opcional (el despliegue automático de GitHub Actions hace esto por ti)
# Pero si quieres levantar a mano:
git clone https://github.com/luisfermrd/cric-comuneros-django.git ~/cric-comuneros
cd ~/cric-comuneros

# Crear .env de produccion
cp .env.production.example .env
nano .env  # Editar con tus valores reales

# Levantar
docker compose -f docker-compose.prod.yml up -d
```

### 2. Configurar la URL o IP en el `.env` (o Github Secrets)

Para que Django permita las peticiones, debes asignarle tu IP pública a la variable `DOMAIN`.
- **En tu `.env` de producción:** Pon `DOMAIN=tu.ip.publica`
- **En GitHub Secrets (Opcional):** Puedes declarar el Repository Secret `DOMAIN=tu.ip.publica`.


### 3. Configurar GitHub Secrets para deploy automático

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP o dominio del servidor |
| `VPS_USER` | Usuario SSH (ej: `deploy` o `root`) |
| `VPS_SSH_KEY` | Llave privada SSH **(Opción 1)** |
| `VPS_PASSWORD` | Contraseña del usuario SSH **(Opción 2, usar si no tienes llave)** |

| Variable | Valor |
|----------|-------|
| `DEPLOY_PATH` | `~/cric-comuneros` |

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
