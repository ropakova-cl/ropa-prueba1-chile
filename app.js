(function () {
  "use strict";
  var K = window.KOVA, PRODUCTS = window.PRODUCTS, REVIEWS = window.REVIEWS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var CART_KEY = "kova_cart_v1";

  var fmt = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  function money(n) { return fmt.format(n); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- enlaces y datos fijos ---------- */
  function waLink(text) {
    return "https://wa.me/" + K.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  $("#year").textContent = new Date().getFullYear();
  ["#igLink", "#igFoot"].forEach(function (s) { $(s).href = K.instagram; });
  ["#fbLink", "#fbFoot"].forEach(function (s) { $(s).href = K.facebook; });
  ["#heroWa", "#waBig", "#waFloat"].forEach(function (s) {
    $(s).href = waLink("Hola, me gustaría comprar en " + K.nombre + ".");
    $(s).target = "_blank"; $(s).rel = "noopener";
  });

  /* ---------- menú móvil ---------- */
  var burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", o);
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") nav.classList.remove("open"); });

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- placeholder de imagen ---------- */
  var PH = [
    { bg: "#1f3fd9", fg: "#ffffff" }, { bg: "#ffd23f", fg: "#0b0f2e" },
    { bg: "#e63329", fg: "#ffffff" }, { bg: "#9db4ff", fg: "#0b0f2e" },
    { bg: "#0b0f2e", fg: "#ffffff" }, { bg: "#ffffff", fg: "#1f3fd9" }
  ];
  var SIL = {
    polera: '<path d="M30 12 10 26l9 16 11-6v50h40V36l11 6 9-16-20-14c-3 8-10 12-20 12s-17-4-20-12z"/>',
    pantalon: '<path d="M28 8h44l6 86H54L50 40 46 94H22z"/>',
    vestido: '<path d="M38 6h24l-3 30 22 58H19l22-58z"/>',
    chaqueta: '<path d="M34 10 50 18 66 10 90 24 86 82 74 82 72 44V92H28V44L26 82 14 82 10 24z"/><path d="M50 18V92" fill="none"/>'
  };
  function tipo(p) {
    if (p.tipo && SIL[p.tipo]) return p.tipo;
    var t = (p.categoria + " " + p.nombre).toLowerCase();
    if (/pantal|jean|jogger|buzo/.test(t)) return "pantalon";
    if (/vestid|falda/.test(t)) return "vestido";
    if (/chaqueta|cortaviento|abrigo|bomber|parka/.test(t)) return "chaqueta";
    return "polera";
  }
  function imgHTML(p, idx) {
    if (p.img) return '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy">';
    var c = PH[idx % PH.length];
    return '<div class="ph" style="background:' + c.bg + ";color:" + c.fg + '" aria-hidden="true">' +
      '<svg viewBox="0 0 100 100" fill="currentColor" stroke="' + c.bg + '" stroke-width="2.5" stroke-linejoin="round">' +
      SIL[tipo(p)] + "</svg></div>";
  }
  function findProd(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }

  /* ---------- catálogo ---------- */
  var currentCat = "Todos";
  function renderFilters() {
    var cats = ["Todos"];
    PRODUCTS.forEach(function (p) { if (cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    $("#filters").innerHTML = cats.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === currentCat) + '">' + esc(c) + "</button>";
    }).join("");
  }
  $("#filters").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    currentCat = b.dataset.cat; renderFilters(); renderGrid();
  });

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) { return currentCat === "Todos" || p.categoria === currentCat; });
    $("#grid").innerHTML = list.map(function (p) {
      var idx = PRODUCTS.indexOf(p);
      return '<article class="prod" data-id="' + p.id + '">' +
        '<div class="prod__img">' + imgHTML(p, idx) + '<span class="tag">' + money(p.precio) + "</span></div>" +
        '<div class="prod__body">' +
        '<span class="prod__cat">' + esc(p.categoria) + "</span>" +
        "<h3>" + esc(p.nombre) + "</h3>" +
        '<p class="prod__desc">' + esc(p.desc || "") + "</p>" +
        '<div class="opts">' +
        "<div><label>Talla</label><select data-k=\"talla\" aria-label=\"Talla de " + esc(p.nombre) + "\">" +
        p.tallas.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("") + "</select></div>" +
        "<div><label>Color</label><select data-k=\"color\" aria-label=\"Color de " + esc(p.nombre) + "\">" +
        p.colores.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + "</select></div>" +
        "</div>" +
        '<button class="btn btn--dark" type="button" data-add="' + p.id + '">Agregar al carrito</button>' +
        "</div></article>";
    }).join("");
  }
  $("#grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    var card = b.closest(".prod");
    addToCart(b.dataset.add, $('[data-k="talla"]', card).value, $('[data-k="color"]', card).value);
  });

  /* ---------- carrito ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
  cart = cart.filter(function (i) { return findProd(i.id); });
  function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }

  function addToCart(id, talla, color) {
    var it = cart.filter(function (i) { return i.id === id && i.talla === talla && i.color === color; })[0];
    if (it) it.qty++; else cart.push({ id: id, talla: talla, color: color, qty: 1 });
    saveCart(); renderCart(); toast("Agregado al carrito");
  }
  function subtotal() {
    return cart.reduce(function (s, i) { return s + findProd(i.id).precio * i.qty; }, 0);
  }
  function renderCart() {
    var count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    $("#cartCount").textContent = count;
    var box = $("#cartItems");
    if (!cart.length) {
      box.innerHTML = '<div class="empty">Tu carrito está vacío.<br>Agrega productos desde el catálogo.</div>';
      $("#cartFoot").hidden = true; return;
    }
    $("#cartFoot").hidden = false;
    box.innerHTML = cart.map(function (i, n) {
      var p = findProd(i.id), idx = PRODUCTS.indexOf(p);
      var th = '<div class="thumb">' + imgHTML(p, idx) + "</div>";
      return '<div class="item">' + th + "<div><h4>" + esc(p.nombre) + "</h4><small>Talla " + esc(i.talla) +
        " · " + esc(i.color) + "</small>" +
        '<div class="qty"><button type="button" data-q="-1" data-n="' + n + '" aria-label="Quitar uno">−</button><span>' + i.qty +
        '</span><button type="button" data-q="1" data-n="' + n + '" aria-label="Agregar uno">+</button></div></div>' +
        "<div><b>" + money(p.precio * i.qty) + '</b><br><button class="rm" type="button" data-rm="' + n + '">Quitar</button></div></div>';
    }).join("");
    $("#cartSub").textContent = money(subtotal());
  }
  $("#cartItems").addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) {
      var it = cart[+q.dataset.n]; it.qty += +q.dataset.q;
      if (it.qty <= 0) cart.splice(+q.dataset.n, 1);
    } else if (r) { cart.splice(+r.dataset.rm, 1); } else return;
    saveCart(); renderCart();
  });

  function openCart() {
    $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
  }
  function closeCart() {
    $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
  }
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);

  function cartText() {
    return cart.map(function (i) {
      var p = findProd(i.id);
      return "• " + i.qty + " x " + p.nombre + " (Talla " + i.talla + ", " + i.color + ") = " + money(p.precio * i.qty);
    }).join("\n");
  }
  $("#cartWa").addEventListener("click", function () {
    var msg = "Hola, quiero comprar en " + K.nombre + ":\n" + cartText() +
      "\nSubtotal: " + money(subtotal()) + "\n\n¿Me confirman stock, envío y total?";
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- envío de formularios al correo (FormSubmit) ---------- */
  function sendToMail(payload) {
    payload._template = "table";
    payload._captcha = "false";
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(K.emailDestino), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok || d.success === "false" || d.success === false) throw new Error(d.message || "error");
        return d;
      });
    });
  }
  function validate(form) {
    var ok = true;
    Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (el) {
      var bad = el.type === "radio"
        ? !form.querySelector('input[name="' + el.name + '"]:checked')
        : !el.value.trim() || (el.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
      if (el.type !== "radio") el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    return ok;
  }
  function setMsg(form, txt, cls) { var m = $(".msg", form); m.textContent = txt; m.className = "msg " + (cls || ""); }
  function formData(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { o[k] = v; });
    return o;
  }
  function wireForm(form, build, onOk) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($('[name="_honey"]', form).value) return;
      if (!validate(form)) { setMsg(form, "Revisa los campos marcados.", "err"); return; }
      var btn = $('button[type="submit"]', form); btn.disabled = true; setMsg(form, "Enviando…", "");
      sendToMail(build(formData(form))).then(function () {
        onOk(form);
      }).catch(function () {
        setMsg(form, "No pudimos enviar el formulario. Inténtalo de nuevo o escríbenos por WhatsApp.", "err");
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- formulario 1: talla / color ---------- */
  $("#reqProducto").innerHTML = '<option value="">Selecciona un producto…</option>' +
    PRODUCTS.map(function (p) { return "<option>" + esc(p.nombre) + "</option>"; }).join("") +
    "<option>Otro producto (lo detallo en el comentario)</option>";
  wireForm($("#formTalla"), function (d) {
    return {
      _subject: "[Kova] Solicitud de talla/color: " + d.producto,
      _autoresponse: "Hola " + d.nombre + ", recibimos tu solicitud de talla/color para \"" + d.producto +
        "\" (talla: " + (d.talla || "-") + ", color: " + (d.color || "-") + "). Te responderemos pronto. — " + K.nombre,
      Formulario: "Solicitud de talla / color",
      Nombre: d.nombre, email: d.email, WhatsApp: d.whatsapp || "-",
      Producto: d.producto, "Talla solicitada": d.talla || "-", "Color solicitado": d.color || "-",
      Comentario: d.mensaje || "-", _honey: ""
    };
  }, function (form) {
    form.reset(); setMsg(form, "¡Listo! Recibimos tu solicitud y te responderemos pronto.", "ok");
  });
  $("#reqProducto").required = true;

  /* ---------- formulario 2: feedback / reseñas ---------- */
  function stars(n) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
  function renderReviews() {
    var box = $("#reviewList"), sum = $("#ratingSum");
    if (!REVIEWS.length) {
      sum.hidden = true;
      box.innerHTML = '<div class="empty">Aún no hay reseñas publicadas.<br>¡Sé el primero en dejar tu opinión!</div>';
      return;
    }
    var avg = REVIEWS.reduce(function (s, r) { return s + r.estrellas; }, 0) / REVIEWS.length;
    sum.hidden = false;
    sum.innerHTML = "<strong>" + avg.toFixed(1).replace(".", ",") + '</strong> <span class="s">' + stars(Math.round(avg)) +
      "</span><br><small>" + REVIEWS.length + (REVIEWS.length === 1 ? " reseña" : " reseñas") + "</small>";
    box.innerHTML = REVIEWS.map(function (r) {
      return '<article class="rev"><div class="rev__top"><b>' + esc(r.nombre) + '</b><span class="s">' + stars(r.estrellas) +
        "</span></div>" + (r.producto ? "<small>" + esc(r.producto) + "</small>" : "") +
        "<p>" + esc(r.comentario) + "</p>" + (r.fecha ? "<small>" + esc(r.fecha) + "</small>" : "") + "</article>";
    }).join("");
  }
  wireForm($("#formResena"), function (d) {
    return {
      _subject: "[Kova] Nueva reseña (" + d.estrellas + " estrellas) de " + d.nombre,
      _autoresponse: "Hola " + d.nombre + ", ¡gracias por tu opinión sobre " + K.nombre + "! La leímos con mucha atención.",
      Formulario: "Feedback y reseña",
      Nombre: d.nombre, email: d.email, Producto: d.producto || "-",
      Estrellas: d.estrellas + " / 5", Comentario: d.comentario,
      "Autoriza publicar": d.publicar ? "Sí" : "No", _honey: ""
    };
  }, function (form) {
    form.reset(); setMsg(form, "¡Gracias por tu opinión! Nos llegó correctamente.", "ok");
  });

  /* ---------- checkout ---------- */
  var co = $("#checkout"), coForm = $("#formPedido");
  $("#coEnvio").innerHTML = K.envios.map(function (s) {
    return '<option value="' + s.id + '">' + esc(s.label) + " — " + (s.precio ? money(s.precio) : "Gratis") + "</option>";
  }).join("");
  function envioSel() { return K.envios.filter(function (s) { return s.id === $("#coEnvio").value; })[0]; }
  function envioCosto() {
    var s = envioSel(), sub = subtotal();
    if (K.envioGratisDesde && sub >= K.envioGratisDesde) return 0;
    return s ? s.precio : 0;
  }
  function renderSum() {
    var sub = subtotal(), env = envioCosto(), s = envioSel();
    $("#coSum").innerHTML = cart.map(function (i) {
      var p = findProd(i.id);
      return '<div class="line"><span>' + i.qty + " × " + esc(p.nombre) + " <small>(" + esc(i.talla) + ", " + esc(i.color) +
        ")</small></span><span>" + money(p.precio * i.qty) + "</span></div>";
    }).join("") +
      '<div class="line"><span>Subtotal</span><span>' + money(sub) + "</span></div>" +
      '<div class="line"><span>Envío (cargo extra)</span><span>' + (env ? money(env) : "Gratis") + "</span></div>" +
      '<div class="line total"><span>Total</span><span>' + money(sub + env) + "</span></div>";
    $("#coDireccion").hidden = !!(s && s.id === "retiro");
  }
  function openCheckout() {
    if (!cart.length) { toast("Tu carrito está vacío"); return; }
    closeCart();
    $("#coFormWrap").hidden = false; $("#coDone").hidden = true; setMsg(coForm, "", "");
    renderSum(); co.hidden = false; co.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCheckout() {
    co.hidden = true; co.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  }
  $("#goCheckout").addEventListener("click", openCheckout);
  $("#closeCheckout").addEventListener("click", closeCheckout);
  co.addEventListener("click", function (e) { if (e.target === co) closeCheckout(); });
  $("#coEnvio").addEventListener("change", renderSum);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeCheckout(); closeCart(); }
  });

  coForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if ($('[name="_honey"]', coForm).value) return;
    var d = formData(coForm), s = envioSel();
    var needsAddr = s.id !== "retiro";
    var ok = validate(coForm);
    if (needsAddr) {
      ["region", "comuna", "direccion"].forEach(function (n) {
        var el = coForm.elements[n]; var bad = !el.value.trim(); el.classList.toggle("invalid", bad); if (bad) ok = false;
      });
    }
    if (!ok) { setMsg(coForm, "Revisa los campos marcados.", "err"); return; }

    var sub = subtotal(), env = envioCosto(), total = sub + env;
    var num = "KOVA-" + Date.now().toString(36).toUpperCase();
    var btn = $('button[type="submit"]', coForm); btn.disabled = true; setMsg(coForm, "Registrando tu pedido…", "");
    var resumen = cartText();

    sendToMail({
      _subject: "[Kova] Nuevo pedido " + num + " — " + money(total),
      _autoresponse: "Hola " + d.nombre + ", recibimos tu pedido " + num + ".\n\n" + resumen +
        "\nEnvío: " + money(env) + "\nTOTAL: " + money(total) +
        "\n\nPara confirmarlo, transfiere a:\n" + K.transferencia.banco + " · " + K.transferencia.tipoCuenta +
        " N° " + K.transferencia.numero + "\n" + K.transferencia.titular + " · RUT " + K.transferencia.rut +
        "\nEnvía el comprobante a " + K.transferencia.email + " o por WhatsApp. — " + K.nombre,
      Formulario: "Pedido de compra", "N° de pedido": num,
      Nombre: d.nombre, email: d.email, RUT: d.rut || "-", Teléfono: d.telefono,
      Productos: resumen, Subtotal: money(sub), "Método de envío": s.label, "Costo de envío": money(env),
      TOTAL: money(total),
      Dirección: needsAddr ? d.direccion + ", " + d.comuna + ", " + d.region : "Retiro / a coordinar",
      Notas: d.notas || "-", _honey: ""
    }).then(function () {
      var t = K.transferencia;
      var waMsg = "Hola, hice el pedido " + num + " por " + money(total) + ". Te envío el comprobante de pago. Soy " + d.nombre + ".";
      $("#coFormWrap").hidden = true;
      var done = $("#coDone"); done.hidden = false; done.className = "done";
      done.innerHTML = "<h3>¡Pedido recibido! 🎉</h3>" +
        "<p>Tu número de pedido es <b>" + esc(num) + "</b>. Total a pagar: <b>" + money(total) + "</b>.</p>" +
        '<div class="bank"><b>Datos para transferencia</b>' +
        "<span>Banco: " + esc(t.banco) + " · " + esc(t.tipoCuenta) + "</span>" +
        "<span>N° de cuenta: " + esc(t.numero) + "</span>" +
        "<span>Titular: " + esc(t.titular) + " · RUT " + esc(t.rut) + "</span>" +
        "<span>Correo: " + esc(t.email) + "</span></div>" +
        '<p class="note">Una vez que transfieras, envíanos el comprobante por WhatsApp o correo y despachamos tu pedido.</p>' +
        '<a class="btn btn--wa btn--full" target="_blank" rel="noopener" href="' + waLink(waMsg) + '">Enviar comprobante por WhatsApp</a>' +
        '<button class="btn btn--line btn--full" type="button" id="coClose">Seguir comprando</button>';
      $("#coClose").addEventListener("click", closeCheckout);
      cart = []; saveCart(); renderCart(); coForm.reset();
    }).catch(function () {
      setMsg(coForm, "No pudimos registrar el pedido. Inténtalo otra vez o pídelo por WhatsApp.", "err");
    }).then(function () { btn.disabled = false; });
  });

  /* ---------- inicio ---------- */
  renderFilters(); renderGrid(); renderCart(); renderReviews();
})();
