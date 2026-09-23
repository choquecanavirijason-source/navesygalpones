# Despliegue en Hostinger

El sitio corre como **aplicación Node** (no como export estático): el formulario de contacto
necesita un servidor que envíe el correo.

> Los nombres exactos de los menús de hPanel cambian con el tiempo. Lo que importa es el
> concepto: una app Node con su comando de arranque y sus variables de entorno.

## 1. Qué subir

`deploy-hostinger.zip` (en la raíz del proyecto) ya trae todo lo necesario: el sitio **ya
compilado** (`.next/`), el código, `public/` y la configuración. No incluye `node_modules`
—se instala en el servidor— ni `.env`, que se carga desde el panel.

Se regenera con:

```bash
npm run build
```

…y volviendo a comprimir esas carpetas. El build **incrusta `NEXT_PUBLIC_SITE_URL`**, así que
hay que compilarlo con la URL real:

```bash
# PowerShell
$env:NEXT_PUBLIC_SITE_URL = "https://nygestructuras.com"; npm run build
```

**No usar `npm run build:static`.** Ese modo vuelca el sitio a `out/` y, a propósito, deja
fuera las rutas de servidor (los archivos `*.node.ts`): sin ellas `/api/contacto` no existe y
el formulario no tiene a dónde enviar.

## 2. Crear la app Node

En hPanel: **Sitios web → nygestructuras.com → Node.js** (o «Aplicaciones Node.js»).

| Campo | Valor |
|---|---|
| Versión de Node | 22.x o 24.x |
| Carpeta de la aplicación | la raíz donde descomprimas el zip |
| Comando de instalación | `npm ci --omit=dev` |
| Comando de arranque | `npm run start` |

`next start` escucha en el puerto que Hostinger expone en `PORT`: no hay que fijarlo.

`--omit=dev` saltea las dependencias que solo hacen falta para compilar (Tailwind, TypeScript,
tipos). Si al arrancar se queja por alguna de ellas, corré `npm ci` a secas: instala de más,
pero arranca igual.

Pasos, en orden:

1. Subir y descomprimir `deploy-hostinger.zip` en la carpeta de la aplicación (por FTP con los
   datos que muestra el panel, o desde el Administrador de archivos).
2. Cargar las variables de entorno (sección 3) **antes** de arrancar.
3. Ejecutar la instalación de dependencias y arrancar la aplicación.

Si antes subiste el export estático a `public_html`, vaciá esa carpeta: los archivos sueltos
pueden tapar la app.

Si preferís compilar en el servidor en vez de subir el build, subí el mismo zip sin `.next/` y
usá `npm ci && npm run build` como comando de instalación. Es más lento y consume más memoria.

## 3. Variables de entorno

Se cargan en el panel de la app Node, no en un archivo subido por FTP.

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://nygestructuras.com

# Correo del formulario de contacto
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@nygestructuras.com
SMTP_PASSWORD=<contraseña de la casilla>
MAIL_FROM=NyG Estructuras <info@nygestructuras.com>
CONTACT_TO=info@nygestructuras.com
```

Dos detalles que se pagan caro si se pasan por alto:

- **`NEXT_PUBLIC_SITE_URL` se resuelve en el build**, no al arrancar. Si la cargás después,
  hay que volver a hacer el build para que la tomen metadata, sitemap y robots.
- **`SMTP_PASSWORD` es la contraseña del buzón**, no la de la cuenta de Hostinger. Se crea o
  se cambia en **Emails → info@nygestructuras.com**.

Sin `SMTP_HOST`, `SMTP_USER` y `SMTP_PASSWORD`, en producción `/api/contacto` responde 503 y
el visitante ve un error. Es a propósito: es preferible a aceptar la consulta y perderla.

## 4. Comprobar que quedó andando

```bash
curl -i https://nygestructuras.com/es                     # 200
curl -i -X POST https://nygestructuras.com/api/contacto \
  -H "Content-Type: application/json" \
  -d '{"name":"Prueba","phone":"11 4493 6915","message":"Prueba de despliegue"}'
```

Respuestas esperadas:

| Caso | Respuesta |
|---|---|
| Consulta válida | `201` · `{"success":true,"data":{"sent":true}}` y el correo en el buzón |
| Falta el nombre o el teléfono | `422` · `VALIDATION_ERROR` |
| SMTP sin configurar | `503` · `SERVICE_UNAVAILABLE` |

Si da `201` pero el correo no llega, el problema está en las credenciales o en el buzón, no en
la aplicación: revisá **Emails → info@nygestructuras.com** y la carpeta de spam.

## 5. Correo: por qué esta casilla

El remitente es `info@nygestructuras.com`, una casilla del mismo dominio que ya vive en
Hostinger. Eso hace que el SPF y el DKIM del dominio respalden el envío y el mensaje no caiga
en spam. Mandar desde una cuenta de Gmail con el dominio ajeno es lo que suele terminar en
correo no deseado.

Para usar Gmail igualmente: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER` la cuenta
y `SMTP_PASSWORD` una **contraseña de aplicación** (requiere verificación en dos pasos). El
código no cambia.
