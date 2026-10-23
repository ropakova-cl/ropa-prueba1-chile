# ropa kova chile

Sitio web estático (HTML + CSS + JavaScript, sin instalar nada) para la tienda de ropa importada.

## Qué incluye
- Catálogo con precio, talla y color, y botón **Agregar al carrito**
- Carrito con cantidades, y dos formas de comprar:
  - **Comprar ahora**: checkout con método de envío y **cargo extra de envío** calculado, datos para transferencia
  - **Pedir por WhatsApp**: mensaje armado con tu carrito
- Sección con enlaces a **Instagram** y **Facebook** (catálogo completo)
- **Formulario 1**: solicitud de talla / color de un producto del catálogo
- **Formulario 2**: feedback y reseñas
- Lista de reseñas publicadas con promedio de estrellas
- Cada formulario y cada pedido te envía una copia a tu correo

## Qué debes editar (todo está en `js/`)
| Archivo | Para qué |
|---|---|
| `js/config.js` | WhatsApp, Instagram, Facebook, correo, costos de envío, datos de transferencia |
| `js/products.js` | Tus productos, precios, tallas, colores y fotos |
| `js/reviews.js` | Reseñas que quieras publicar |

Fotos: copia tus imágenes en la carpeta `images/` (créala) y pon la ruta en `img`, por ejemplo `"images/poleron.jpg"`. Mientras esté vacío se muestra un recuadro de color con la silueta de la prenda. Usa fotos verticales (proporción 4:5) para que calcen bien en las tarjetas.

## Diseño
Los colores y tipografías están al inicio de `css/styles.css` (bloque `:root`): azul `--blue`, rojo `--red` y amarillo `--yellow`. El estilo se inspira en las bolsas rayadas de los importados, las etiquetas de paquete y los stickers de precio. Las tipografías (Archivo y Schibsted Grotesk) se cargan desde Google Fonts, por lo que necesitan internet.

## Importante: activar el envío de correos
Los formularios usan el servicio gratuito [FormSubmit](https://formsubmit.co). La **primera vez** que se envíe un formulario desde tu sitio ya publicado, FormSubmit te manda un correo de activación a `kova.chile.cl@gmail.com`: ábrelo y confirma. Revisa también spam. Después de eso, recibirás todo en tu bandeja.

Nota: no funciona abriendo `index.html` desde el computador (`file://`); debe estar publicado en un hosting.

## Publicar el sitio (gratis)
Sube la carpeta completa a cualquiera de estos: Netlify (arrastrar y soltar), Cloudflare Pages, GitHub Pages o Vercel. Luego puedes conectar tu dominio.

## Pagos
Esta versión **no cobra con tarjeta**: el cliente recibe tus datos de transferencia y te envía el comprobante. Para cobrar con tarjeta dentro de la página hay que integrar una pasarela (Webpay Plus, Mercado Pago, Flow, etc.), que requiere cuenta aprobada y un servidor.

## Reseñas
Los comentarios llegan a tu correo. Si el cliente marcó "Autorizo publicar", puedes copiarlo a `js/reviews.js` para que aparezca en el sitio.
