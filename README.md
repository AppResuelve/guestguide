# Guía del Huésped

Landing con teléfonos útiles agrupados por categoría, editable desde `/admin`
sin base de datos (usa Vercel Global Config, antes llamado Edge Config, como
almacenamiento).

## Deploy

1. Hacé fork o "Deploy" de este repo en tu cuenta de Vercel.
2. En el proyecto ya creado, andá a **Storage → Create → Global Config**, dale
   un nombre y conectalo a este proyecto. Vercel crea sola la variable
   `GLOBAL_CONFIG` (la connection string) — no hace falta tocarla.
3. Copiá el **ID** del store (formato `ecfg_...`, se ve en su configuración)
   → variable de entorno `GLOBAL_CONFIG_ID`.
4. Generá un token en **Account Settings → Tokens** con permiso sobre este
   proyecto → variable `GLOBAL_CONFIG_TOKEN` (ojo: no lo llames empezando
   con `VERCEL_`, Vercel reserva ese prefijo y no deja crear variables con
   ese nombre).
5. Elegí una contraseña para el panel → variable `ADMIN_PASSWORD`.
6. Redeployá el proyecto para que tome las variables nuevas.
7. Entrá a `tudominio.vercel.app/admin`, ingresá la contraseña, y cargá los
   contactos y la apariencia (colores + imagen de portada).

No hace falta tocar código en ningún paso. Los cambios que se guarden desde
`/admin` se ven reflejados en la landing al instante, sin nuevo deploy.
