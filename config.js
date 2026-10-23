/* ============================================================
   CONFIGURACIÓN DE "ropa kova chile"
   Edita SOLO este archivo para cambiar datos de la tienda.
   ============================================================ */
window.KOVA = {
  nombre: "ropa kova chile",

  // Correo donde recibirás una copia de cada formulario y de cada pedido
  emailDestino: "kova.chile.cl@gmail.com",

  // WhatsApp en formato internacional, sin + ni espacios (ej: 56912345678)
  whatsapp: "56900000000",

  // Tus redes (reemplaza por los enlaces reales)
  instagram: "https://www.instagram.com/kova.chl?xtok=MXIzbmUxaW1tc3Uydg%3D%3D&utm_source=qr",
  facebook: "https://www.facebook.com/share/19H3fvQg2B/?mibextid=wwXIfr",

  // Métodos de envío y su cargo extra (en pesos chilenos)
  envios: [
    { id: "retiro",   label: "Retiro / entrega a coordinar en Santiago", precio: 0 },
    { id: "rm",       label: "Envío Región Metropolitana",               precio: 3990 },
    { id: "regiones", label: "Envío a regiones (Starken / Chilexpress)", precio: 5990 },
    { id: "extremo",  label: "Zonas extremas (Arica, Aysén, Magallanes, Isla de Pascua)", precio: 9990 }
  ],

  // Envío gratis desde este monto (pon null para desactivar)
  envioGratisDesde: null,

  // Datos para transferencia (se muestran al cliente después de pedir)
  transferencia: {
    banco: "Tu banco",
    tipoCuenta: "Cuenta Vista / Corriente",
    numero: "000000000",
    titular: "Nombre del titular",
    rut: "00.000.000-0",
    email: "kova.chile.cl@gmail.com"
  }
};
