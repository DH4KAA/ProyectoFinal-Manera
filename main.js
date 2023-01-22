let juegos = []

async function recuperarCatalogo() {
    const Response = await fetch('./juegos.json')
    let respuesta = await Response.json()
    return respuesta
}

let carrito = []



async function renderCatalogo() {
    juegos = await recuperarCatalogo()
    console.log(juegos)
    let juegosContainer = document.getElementById('juegosContainer')
    juegos.map(x => {
        juegosContainer.innerHTML += `
        <div class="card">
        <img class="card-img-top" src="${x.imgUrl}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${x.nombre}</h5>
          <p class="card-text">$${x.price}</p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          <button class="btn btn-outline-success" id=${x.id} type="button" onclick=agregarAlCarrito(this)>Agregar al carrito</button>
        </div>
      </div>
        `
    })
}

function buscar() {
    let buscador = document.getElementById('buscador')
    let juegosFiltrados = juegos.filter(juego => juego.nombre.toLowerCase().includes(buscador.value) || juego.genre.toLowerCase().includes(buscador.value))
    juegosContainer.innerHTML = ""
    juegosFiltrados.map(x => {
        juegosContainer.innerHTML += `
        <div class="card">
        <img class="card-img-top" src="${x.imgUrl}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${x.nombre}</h5>
          <p class="card-text">$${x.price}</p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          <button class="btn btn-outline-success" id=${x.id} type="button" onclick=agregarAlCarrito(this)>Agregar al carrito</button>
        </div>
      </div>
        `
    })
}

function irAlCarrito() {
    window.location.href = "./carrito.html"
}

function renderCarrito() {
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    let carritoContainer = document.getElementById("carritoContainer")
    if (carrito.length == 0) {
        carritoContainer.innerHTML =
            `<h5>Su carrito se encuentra vacio</h5>`
    } else {
        carrito.map(x => {
            carritoContainer.innerHTML += `
        <div class="card">
        <img class="card-img-top" src="${x.imgUrl}" alt="Card image cap"> 
        <div class="card-body">
          <h5 class="card-title">${x.nombre}</h5>
          <p class="card-text">$${x.precioUnitario}</p>
          <p class="card-text">${x.unidades} unidad/es</p>
          <p class="card-text">Subtotal $${x.subtotal}</p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
          <button class="btn btn-outline-danger" id=${x.id} type="button" onclick=quitarDelCarrito(this)>Quitar del carrito</button>
        </div>
      </div>
        `
        })
        let total = carrito.reduce((acc, valorActual) => acc + valorActual.subtotal, 0)
        carritoContainer.innerHTML += `
          <h3>TOTAL $${total}</h3>
          <button type="button" class="btn btn-outline-dark" onclick=comprar(${total})>Comprar</button>
          `
    }
    contadorCarrito()
}

function agregarAlCarrito(e) {
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    let juegoBuscado = juegos.find(juego => juego.id == e.id)
    let posicionJuegoBuscado = carrito.findIndex(juego => juego.id == juegoBuscado.id)
    if (posicionJuegoBuscado != -1) {
        carrito[posicionJuegoBuscado].unidades++
        carrito[posicionJuegoBuscado].subtotal = carrito[posicionJuegoBuscado].unidades * carrito[posicionJuegoBuscado].precioUnitario
    } else {
        carrito.push({ id: juegoBuscado.id, nombre: juegoBuscado.nombre, precioUnitario: juegoBuscado.price, unidades: 1, subtotal: juegoBuscado.price, imgUrl: juegoBuscado.imgUrl })
    }
    Toastify({
        text: "Producto agregado correctamente al carrito.",
        duration: 1500,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
    }).showToast();
    localStorage.setItem("carrito", JSON.stringify(carrito))
    console.log(carrito)
    contadorCarrito()
}

function quitarDelCarrito(e) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
    let posicionJuegoBuscado = carrito.findIndex(juego => juego.id == e.id)
    if (posicionJuegoBuscado != -1) {
        if (carrito[posicionJuegoBuscado].unidades > 1) {

            carrito[posicionJuegoBuscado].unidades--
            carrito[posicionJuegoBuscado].subtotal = carrito[posicionJuegoBuscado].unidades * carrito[posicionJuegoBuscado].precioUnitario

        } else {
            carrito.splice(posicionJuegoBuscado, 1)
        }
    }
    Toastify({
        text: "Producto quitado correctamente del carrito.",
        duration: 1500,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
    }).showToast();
    localStorage.setItem("carrito", JSON.stringify(carrito))
    window.location.reload()
    contadorCarrito()
}

function comprar(total) {
    alert("Usted abonará un total de $" + total)
    limpiarCarrito()
    window.location.reload()
}

function limpiarCarrito() {
    localStorage.setItem("carrito", "")
}

function contadorCarrito() {
    total = carrito.reduce((acc, valorActual) => acc + valorActual.unidades, 0)

    document.getElementById("contadorCarrito").innerHTML =
        ` ${total}`
}