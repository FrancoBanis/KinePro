# KinePro 🏥

> Trabajo práctico — Ingeniería de Software 2  
> Facultad de Informática, UNLP

Sistema web de gestión de turnos y rutinas para centros kinesiológicos.
Permite a pacientes reservar turnos, inscribirse en rutinas grupales,
gestionar pagos y administrar listas de espera, todo desde una interfaz
moderna y sin necesidad de contraseña.

---

## Demo

> 📹 [Ver video de demostración](https://www.youtube.com/watch?v=sIcg1mS_TJc)  
---

## Tecnologías

### Backend
- Java 17 + Spring Boot
- Spring Security + JWT (autenticación sin contraseña)
- SQLite + JPA / Hibernate
- JavaMailSender (tokens de acceso por mail)
- MercadoPago SDK

### Frontend
- React 19 + TypeScript
- Vite
- Axios (con interceptores JWT)
- Sonner (notificaciones toast)
- Bootstrap 5

---

## Funcionalidades

- 🔐 **Autenticación sin contraseña** — el usuario ingresa su email y recibe un token de 6 dígitos por mail (Magic Link). Al verificarlo recibe un JWT que autentica todas sus requests.
- 📅 **Gestión de turnos** — reserva, cancelación y reprogramación de turnos individuales con cálculo de reembolso según anticipación.
- 🏃 **Gestión de rutinas** — inscripción a rutinas grupales con múltiples turnos, cancelación con reembolso proporcional y reprogramación a rutinas similares.
- ⏳ **Cola de espera** — cuando un turno o rutina está lleno, el usuario puede anotarse. Al liberarse un lugar recibe un mail para aceptar o rechazar.
- 💳 **Pagos con MercadoPago** — integración con el checkout de MercadoPago para confirmar inscripciones.
- 👥 **Roles de usuario** — Admin, Secretaria, Profesional y Paciente, cada uno con permisos diferenciados.
- 🛠️ **Panel de administración** — gestión de usuarios, rutinas, tipos de rutina y visualización de pagos.
- 📧 **Sistema de avisos** — los administradores pueden enviar notificaciones por mail a todos los pacientes inscriptos en una rutina.

---

## Limitaciones conocidas

- Los turnos no tienen vencimiento automático — un turno pasado sigue apareciendo como activo hasta que se desactive manualmente.

---

## Requisitos previos

- Java 17+
- Node.js 20+
- Maven
- Visual Studio Code (para Dev Tunnels, necesario con MercadoPago)
- Cuenta Gmail con App Password habilitada
- Cuenta MercadoPago en modo sandbox

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/kinepro.git
cd kinepro
```

### 2. Configurar el backend

#### Crear el archivo de configuración local

```bash
cd backend
cp src/main/resources/application-local.properties.example \
   src/main/resources/application-local.properties
```

Editá `application-local.properties` y completá los valores:

```properties
spring.mail.username=tu-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx

jwt.secret=una-clave-de-al-menos-32-caracteres

app.frontend-url=http://localhost:5173
app.backend-url=http://localhost:8080

mercadopago.access-token=APP_USR-...
mercado.public.key=APP_USR-...
```

#### Levantar el backend

```bash
./mvnw spring-boot:run
```

El servidor levanta en `http://localhost:8080`

### 3. Configurar el frontend

#### Instalar dependencias

```bash
cd frontend
npm install
```

#### Crear el archivo de entorno

```bash
cp .env.example .env
```

El contenido por default ya apunta a `localhost:8080`. Si usás tunnels, 
actualizá la URL.

#### Levantar el frontend

```bash
npm run dev
```

La app corre en `http://localhost:5173`

---

## Dev Tunnels (necesario para MercadoPago)

MercadoPago necesita URLs públicas para redirigir al usuario después del pago.
Con `localhost` no funciona porque MP no puede acceder a tu máquina local.

### Pasos

1. Abrí VS Code
2. En el panel inferior, abrí la pestaña **Ports**
3. Hacé click en **Forward a Port** y agregá los puertos `5173` y `8080`
4. VS Code genera URLs públicas del estilo:

https://xxxxxxxx-5173.brs.devtunnels.ms/
https://xxxxxxxx-8080.brs.devtunnels.ms/

5. Actualizalas en `application-local.properties`:
```properties
   app.frontend-url=https://xxxxxxxx-5173.brs.devtunnels.ms/
   app.backend-url=https://xxxxxxxx-8080.brs.devtunnels.ms/
```
6. Y en el `.env` del frontend:

VITE_BACKEND_URL=https://xxxxxxxx-8080.brs.devtunnels.ms


> ⚠️ Las URLs cambian cada vez que abrís los tunnels.
> Recordá actualizarlas en ambos archivos cada sesión.

---

## Cómo obtener el App Password de Gmail

1. Ir a tu cuenta Google → **Seguridad**
2. Activar **verificación en dos pasos**
3. Buscar **"Contraseñas de aplicación"**
4. Crear una nueva para "Correo" → copiar la clave generada (16 caracteres)
5. Usarla como `spring.mail.password`

---

## Estructura del proyecto
```
kinepro/
├── backend/
│ └── src/main/
│ ├── java/com/AMDevs/inge2/
│ │ ├── config/ # SecurityConfig, JwtFilter
│ │ ├── controller/ # AuthController, TurnoController, RutinaController...
│ │ ├── dto/ # UsuarioDTO
│ │ ├── entity/ # Usuario, Turno, Rutina, TipoRutina...
│ │ ├── repository/ # Repositorios JPA
│ │ └── service/ # JwtService, UsuarioService, TurnoService...
│ └── resources/
│ ├── application.properties ← config genérica
│ ├── application-local.properties ← secretos locales (no en repo)
│ └── application-local.properties.example ← plantilla
└── frontend/
└── src/
├── components/ # Rutina, Turno, BotonesUsuario...
├── constants/ # config, tipos
├── context/ # AuthContext
├── pages/ # LoginPage, RutinasPage, MisTurnosPage...
└── services/ # axiosInstance, rutinaService, turnoService...
```
---

## Variables de configuración

| Variable | Descripción |
|---|---|
| `spring.mail.username` | Gmail para envío de tokens de acceso |
| `spring.mail.password` | App Password de Gmail |
| `jwt.secret` | Clave secreta para firmar JWT (mín. 32 caracteres) |
| `app.frontend-url` | URL del frontend (para CORS) |
| `app.backend-url` | URL del backend |
| `mercadopago.access-token` | Access token de MercadoPago |
| `mercado.public.key` | Public key de MercadoPago |

---

## Autores

| Nombre | GitHub |
|---|---|
| Franco Banis | [@FrancoBanis](https://github.com/tu-usuario) |
| Agustín Platun | [@AgustinPlatun](https://github.com/AgustinPlatun) |
| Santiago Almada | [@almadasantiago](https://github.com/almadasantiago) |

---

> Facultad de Informática — UNLP  
> Ingeniería de Software 2 — 2026
