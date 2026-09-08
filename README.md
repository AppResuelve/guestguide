# Guía del Huésped

Landing con teléfonos útiles agrupados por categoría, editable desde `/admin`
sin base de datos (usa Vercel Edge Config como almacenamiento).

## Deploy

1. Hacé fork o "Deploy" de este repo en tu cuenta de Vercel.
2. En el proyecto ya creado, andá a **Storage → Create → Edge Config**, dale
   un nombre y conectalo a este proyecto.
3. Copiá su **connection string** → variable de entorno `EDGE_CONFIG`.
4. Copiá su **ID** (aparece en la configuración del store) → variable
   `EDGE_CONFIG_ID`.
5. Generá un token en **Account Settings → Tokens** con permiso sobre este
   proyecto → variable `VERCEL_API_TOKEN`.
6. Elegí una contraseña para el panel → variable `ADMIN_PASSWORD`.
7. Redeployá el proyecto para que tome las variables nuevas.
8. Entrá a `tudominio.vercel.app/admin`, ingresá la contraseña, y cargá los
   contactos y la apariencia (colores + imagen de portada).

No hace falta tocar código en ningún paso. Los cambios que se guarden desde
`/admin` se ven reflejados en la landing al instante, sin nuevo deploy.
