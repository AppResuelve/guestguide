# Poner la guía de huésped en un subdirectorio del dominio del cliente

Ej: que `cliente.com.ar/guia-de-huesped` muestre la guía, aunque esté
deployada en otro proyecto de Vercel.

En todos los casos la lógica es la misma: un **reverse proxy** — el
dominio del cliente recibe la visita, pero por atrás le pide el contenido
a tu deploy de Vercel (`https://tu-proyecto.vercel.app`) y se lo devuelve
al visitante como si fuera propio. La URL del navegador nunca cambia.

Antes de elegir el método, preguntale al cliente (o a quien le maneje la
web): **¿dónde está hosteado el sitio, y quién administra el DNS?** Esa
respuesta define cuál de los casos de abajo aplica.

---

## Caso A — El sitio principal también está en Vercel

El más simple de todos. En el proyecto del sitio principal (no en el de
la guía), agregás o editás el archivo `vercel.json` en la raíz:

```json
{
  "rewrites": [
    { "source": "/guia-de-huesped", "destination": "https://tu-proyecto.vercel.app/guia-de-huesped" },
    { "source": "/guia-de-huesped/:path*", "destination": "https://tu-proyecto.vercel.app/guia-de-huesped/:path*" }
  ]
}
```

Redeployás el sitio principal y listo. Sin DNS nuevo, sin certificados,
sin nada extra.

**Ojo:** si el proyecto de la guía usa rutas relativas para sus propios
assets (CSS, JS, imágenes), verificá que sigan cargando bien detrás del
proxy — con Next.js normalmente no da problema, pero conviene probarlo.

---

## Caso B — El DNS del sitio pasa por Cloudflare (sea cual sea el hosting de atrás)

Es la opción más prolija cuando no controlás el hosting del sitio
principal — funciona igual si atrás hay WordPress, un hosting compartido
viejo, o cualquier otra cosa, porque el proxy corre a nivel de Cloudflare,
no en el servidor del cliente.

**Requisito:** el dominio tiene que estar en Cloudflare (nameservers
apuntando ahí). Muchos hostings en Argentina ya lo usan, o se puede migrar
el DNS sin mover el hosting en sí.

Pasos:
1. En el dashboard de Cloudflare del cliente → **Workers & Pages** → **Create Worker**.
2. Pegás este código:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/guia-de-huesped')) {
      const targetUrl = 'https://tu-proyecto.vercel.app' + url.pathname + url.search;
      return fetch(targetUrl, request);
    }

    // Cualquier otra ruta sigue al sitio original sin tocarla
    return fetch(request);
  },
};
```

3. Guardás y deployás el Worker.
4. En **Workers Routes**, agregás una ruta: `cliente.com.ar/guia-de-huesped*` → apuntando a este Worker.

No hace falta tocar el hosting original para nada — el resto del sitio
sigue funcionando exactamente igual.

---

## Caso C — VPS propio con Nginx

Si el cliente (o vos) administra un servidor propio con Nginx delante del
sitio, es un bloque de configuración estándar:

```nginx
location /guia-de-huesped/ {
    proxy_pass https://tu-proyecto.vercel.app/guia-de-huesped/;
    proxy_set_header Host tu-proyecto.vercel.app;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_ssl_server_name on;
}
```

Se agrega dentro del `server {}` del sitio principal, se recarga Nginx
(`nginx -s reload`) y listo.

---

## Caso D — Hosting compartido tipo cPanel (WordPress, etc.)

Es el más incierto de los cuatro. Técnicamente se puede con `mod_proxy`
de Apache vía `.htaccess`:

```apache
RewriteEngine On
RewriteRule ^guia-de-huesped/?(.*)$ https://tu-proyecto.vercel.app/guia-de-huesped/$1 [P,L]
```

**El problema:** la mayoría de los hostings compartidos económicos (los
típicos de cPanel en Argentina) traen `mod_proxy` **deshabilitado** por
seguridad, y no se puede activar sin acceso al servidor completo (algo
que en hosting compartido no tenés). Si lo probás y tira error 500 o
directamente no anda, es casi seguro por esto.

**Si no anda:** no pierdas tiempo peleando con el hosting — pasá al Caso
B (si se puede mover el DNS a Cloudflare, que es gratis y no mueve el
sitio de lugar) o directamente ofrecé el subdominio (`guia.cliente.com.ar`),
que no depende de nada de esto.

---

## Caso E — Sitios "cerrados" (WordPress.com, Wix, Shopify, Tiendanube, etc.)

Estas plataformas no dejan configurar reverse proxy ni tocar el servidor
— el subdirectorio bajo el dominio principal **no es viable**. Directamente
andá al subdominio (`guia.cliente.com.ar`), que en Vercel es un CNAME y
no depende de qué plataforma use el sitio principal.

---

## Resumen rápido

| Dónde está el sitio | Método | Dificultad |
|---|---|---|
| Vercel | `vercel.json` rewrites | Muy fácil |
| DNS en Cloudflare | Cloudflare Worker | Fácil |
| VPS con Nginx | `proxy_pass` | Media (necesita acceso al server) |
| cPanel / hosting compartido | `.htaccess` + `mod_proxy` | Incierta, a veces bloqueada |
| WordPress.com / Wix / Shopify / Tiendanube | No es posible | — usar subdominio en su lugar |
