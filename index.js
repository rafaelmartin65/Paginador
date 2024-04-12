const
  screen = {
    2: 0,
    6: 500,
    10: 900
};
let datos;
let datosFamilia;
let totalPaginas;
let idiomaActual;
let elementosPorPagina = 10;
fetch("familias.json")
.then((response) => response.json())
.then((familias) => {
  idiomaActual = "español";
  datosFamilia = familias;
  cargaFiltroFamilias(familias[idiomaActual]);
  fetch("KFC.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("listado").innerHTML = "";
    datos = data;
    elementosPorPagina = calculoElementosPorPagina();
    for (let i=0;i< elementosPorPagina;i++){
      cargaproductos(data.productos[i], data,idiomaActual);
    }
    paginador(datos, 1);
  });
})

/* document.getElementById("familias").addEventListener("change", (event) => {
  document.getElementById("productos").innerHTML = "";
  if (event.target.value == 0) {
    muestraProductos(datos.productos);
  } else {
    let datosFiltrados = datos.productos.filter(function (P) {
      return console.log(P.familia == event.target.value);
    });
    
    console.log(datosFiltrados);
    muestraProductos(datosFiltrados);
  }
});

function cargaFiltroFamilias(familias) {
  document.getElementById("familias").innerHTML = "";
  for (elemento in familias) {
    let nomFamilia = document.createElement("option");
    nomFamilia.value = elemento;
    nomFamilia.innerHTML = familias[elemento];
    document.getElementById("familias").appendChild(nomFamilia);
  }
}

function muestraProductos(listaProductos) {
  listaProductos.forEach((elemento) => {
    let descripcion = document.createElement("p");
    descripcion.innerHTML = elemento.descripcion;
    document.getElementById("productos").appendChild(descripcion);
  });
} */

window.addEventListener('resize', () => {
  calculoElementosPorPagina();
});  

function calculoElementosPorPagina(){
 // Obtenemos tamaño de pantalla
 const iw = window.innerWidth;
 
 // Determinamos el tipo de pantalla
 let size = null;
 for (let s in screen) {
   if (iw >= screen[s]) size = s;
 }
 paginador(datos,actual());
 cargaPaginas(datos,actual());
 return parseInt(size);
}

function paginador(data, actual) {
  let paginas = data.productos.length / elementosPorPagina;
  if ((paginas % elementosPorPagina) > 0) totalPaginas = Math.trunc(paginas)+1
  else
    totalPaginas = paginas;
   
  // Controlamos la activacion de anterior y siguiente
  if (actual == 1) {
    document.getElementById("liAnterior").classList.add("disabled")
  } else {
    document.getElementById("liAnterior").classList.remove("disabled")
  }
  if (actual == totalPaginas) {
    document.getElementById("liSiguiente").classList.add("disabled")
  } else {
    document.getElementById("liSiguiente").classList.remove("disabled")
  }
  let fragmento = new DocumentFragment();
  for (let i = 1; i <= totalPaginas; i++) {
    let linea = document.createElement("li");
    let vinculo = document.createElement("a");
    vinculo.href = "";
    let span = document.createElement("span");
    span.classList.add("page-link");
    linea.classList.add("page-item", "mx-3");
    if (i == actual) {
      linea.classList.add("active");
      linea.setAttribute("aria-current", "page");
      span.innerText = i;
      linea.appendChild(span);
    } else {
      vinculo.classList.add("page_link","naranja");
      vinculo.innerText = i;
      vinculo.onclick = cambiaPagina;
      linea.appendChild(vinculo);
    }
    fragmento.appendChild(linea);
  }
  document.getElementById("paginas").innerHTML = "";
  document.getElementById("paginas").appendChild(fragmento);
}

function cargaproductos(producto, datos,idioma) {
  let tarjeta = document.createElement("div");
  tarjeta.classList.add("card","mx-1");
  tarjeta.style = "width: 15rem;";
  let foto = document.createElement("img");
  foto.src = `./imagenes/${producto.codigo}.jpg`;
  foto.classList.add("card-img-top","img-fluid");
  tarjeta.appendChild(foto);
  let cuerpo = document.createElement("div");
  cuerpo.classList.add("card-body","py-0");
  let entries = Object.entries(producto);
  let fragmento = new DocumentFragment();
  entries.forEach(([key, value]) => {
    if (key != "codigo") {
      if (key == "descripcion") {
        let titulo = document.createElement("h5");
        titulo.classList.add("my-0");
        titulo.innerHTML = `${datos[idioma][key]}: ${value}`;
        cuerpo.appendChild(titulo);
      } else {
        let etiqueta = document.createElement("p");
        etiqueta.classList.add("my-0");
        if (key == "familia"){
          etiqueta.innerHTML = `<b>${datos[idioma][key]}</b>: ${datosFamilia[idioma][value]}`;
        } else {
          etiqueta.innerHTML = `<b>${datos[idioma][key]}</b>: ${value}`;
        }
        
        fragmento.appendChild(etiqueta);
      }
    }
  });
  // -----------------------------------------------
  cuerpo.appendChild(fragmento);
  tarjeta.appendChild(cuerpo);
  document.getElementById("listado").appendChild(tarjeta);
}

// Cambiamos el idioma seleccionando la bandera
let formulario = document.getElementById("formulario");
formulario.addEventListener("click", function (event) {
  event.preventDefault();
  // Recorremos la lista de productos con los carteles de sus datos en el idioma elegido
  document.getElementById("listado").innerHTML = "";
  idiomaActual = event.target.alt;
  for (let i=0;i< elementosPorPagina;i++){
    cargaproductos(datos.productos[i], datos,idiomaActual);
  };
  cargaFiltroFamilias(datosFamilia[idiomaActual])
  paginador(datos,1);
});


function actual() {
  const paginas = document.getElementById("paginas");
  //
  for (const child of paginas.childNodes) {
    if (Array.from(child.classList).includes("active")) {
      return parseInt(child.firstChild.innerText);
    }
  }
}

document.getElementById("anterior").addEventListener("click", () => {
  if (actual() > 1) {
    let paginaActual = actual() - 1;
    // Vamos a llamar a la funcion de actualizar la pagina actual
    paginador(datos,paginaActual);
    cargaPaginas(datos,paginaActual);
  }
});

document.getElementById("siguiente").addEventListener("click", () => {
  if (actual()< totalPaginas) {
    let paginaActual = actual() + 1;
    // Vamos a llamar a la funcion de actualizar la pagina actual
    paginador(datos,paginaActual);
    cargaPaginas(datos,paginaActual);
  }
});

function cargaPaginas(datos,paginaActual){
  let inicio = (paginaActual-1) * elementosPorPagina;
  document.getElementById("listado").innerHTML = "";
  for (let i=inicio;i < (inicio + elementosPorPagina);i++){
    cargaproductos(datos.productos[i], datos,idiomaActual);
  }
}

function cambiaPagina(event){
  event.preventDefault();
  paginador(datos,event.target.text);
  cargaPaginas(datos,event.target.text);
}

function cargaFiltroFamilias(familias){
  document.getElementById("familias").innerHTML = "";
  for (elemento in familias) {
    let nomFamilia = document.createElement("option");
    nomFamilia.value = elemento;
    nomFamilia.innerHTML = familias[elemento];
    document.getElementById("familias").appendChild(nomFamilia);
  };
}