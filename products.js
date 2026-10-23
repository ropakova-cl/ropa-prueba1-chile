/* ============================================================
   CATÁLOGO DE PRODUCTOS (ejemplos para reemplazar por los tuyos)
   - precio: en pesos chilenos, número sin puntos
   - img: ruta de la foto, ej "images/poleron-negro.jpg" (opcional;
          si lo dejas vacío se muestra un diseño de reemplazo)
   - tallas / colores: listas de opciones disponibles
   - categoria: se usa para los filtros
   - tipo (opcional): "polera", "pantalon", "vestido" o "chaqueta". Define la
          silueta que se muestra mientras no tengas foto; si lo omites se
          deduce de la categoría y el nombre.
   ============================================================ */
window.PRODUCTS = [
  { id: "p01", nombre: "Polerón oversize con capucha", categoria: "Poleras y polerones", precio: 24990,
    tallas: ["S", "M", "L", "XL"], colores: ["Negro", "Gris", "Beige"], img: "",
    desc: "Algodón grueso, corte holgado." },
  { id: "p02", nombre: "Jeans wide leg tiro alto", categoria: "Pantalones", precio: 29990,
    tallas: ["34", "36", "38", "40", "42"], colores: ["Azul claro", "Azul oscuro", "Negro"], img: "",
    desc: "Corte recto amplio, tela denim rígida." },
  { id: "p03", nombre: "Vestido midi floral", categoria: "Vestidos y faldas", precio: 22990,
    tallas: ["S", "M", "L"], colores: ["Rosado", "Verde", "Azul"], img: "",
    desc: "Liviano, ideal para primavera y verano." },
  { id: "p04", nombre: "Chaqueta bomber", categoria: "Chaquetas", precio: 34990,
    tallas: ["S", "M", "L", "XL"], colores: ["Negro", "Verde militar"], img: "",
    desc: "Forro interior, cierre metálico." },
  { id: "p05", nombre: "Polera básica algodón", categoria: "Poleras y polerones", precio: 9990,
    tallas: ["S", "M", "L", "XL"], colores: ["Blanco", "Negro", "Gris", "Café"], img: "",
    desc: "Básico de uso diario, suave al tacto." },
  { id: "p06", nombre: "Buzo jogger cargo", categoria: "Pantalones", precio: 19990,
    tallas: ["S", "M", "L", "XL"], colores: ["Negro", "Gris", "Verde militar"], img: "",
    desc: "Bolsillos laterales y puño ajustable." },
  { id: "p07", nombre: "Falda plisada", categoria: "Vestidos y faldas", precio: 15990,
    tallas: ["S", "M", "L"], colores: ["Negro", "Beige", "Burdeos"], img: "",
    desc: "Cintura elástica, caída suelta." },
  { id: "p08", nombre: "Cortaviento impermeable", categoria: "Chaquetas", precio: 27990,
    tallas: ["S", "M", "L", "XL"], colores: ["Negro", "Azul", "Naranja"], img: "",
    desc: "Liviano y resistente al viento y la llovizna." }
];
