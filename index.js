const
  screen = {
    2: 0,
    6: 500,
    10: 900
};
let datos;
let productosFiltrados;
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
    datos =  data;
    productosFiltrados = data.productos;
    elementosPorPagina = calculoElementosPorPagina();
    for (let i=0;i< elementosPorPagina;i++){
      cargaproductos(data.productos[i],idiomaActual);
    }
    paginador(productosFiltrados, 1);
  });
})


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
 paginador(productosFiltrados,actual());
 cargaPaginas(datos.productos,actual());
 return parseInt(size);
}

function paginador(productos, actual) {
  let paginas = productos.length / elementosPorPagina;
  if (paginas  > Math.trunc(paginas)) totalPaginas = Math.trunc(paginas)+1
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
// -----------------------------------------------
// Cargamos un producto en pantalla
// -----------------------------------------------
function cargaproductos(producto, idioma) {
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
  cuerpo.appendChild(fragmento);
  tarjeta.appendChild(cuerpo);
  document.getElementById("listado").appendChild(tarjeta);
}
// -----------------------------------------------
// Cambiamos el idioma seleccionando la bandera
// -----------------------------------------------
let formulario = document.getElementById("formulario");
formulario.addEventListener("click", function (event) {
  event.preventDefault();
  // Recorremos la lista de productos con los carteles de sus datos en el idioma elegido
  document.getElementById("listado").innerHTML = "";
  idiomaActual = event.target.alt;
  if (elementosPorPagina > productosFiltrados.length){
    final = productosFiltrados.length;
  }
    else
  {
    final = elementosPorPagina;
  };  
  for (let i=0;i< final;i++){
    cargaproductos(productosFiltrados[i], idiomaActual);
  };
  console.log(datosFamilia[idiomaActual]);
  cargaFiltroFamilias(datosFamilia[idiomaActual])
  paginador(productosFiltrados,1);
});

function actual() {
  const paginas = document.getElementById("paginas");
  for (const child of paginas.childNodes) {
    if (Array.from(child.classList).includes("active")) {
      return parseInt(child.firstChild.innerText);
    }
  }
}
// -----------------------------------------------
// Damos click en anterior
// -----------------------------------------------
document.getElementById("anterior").addEventListener("click", () => {
  if (actual() > 1) {
    let paginaActual = actual() - 1;
    // Vamos a llamar a la funcion de actualizar la pagina actual
    paginador(productosFiltrados,paginaActual);
    cargaPaginas(productosFiltrados,paginaActual);
  }
});

// -----------------------------------------------
// Damos click en siguiente
// -----------------------------------------------
document.getElementById("siguiente").addEventListener("click", () => {
  console.log(actual(),totalPaginas);
  if (actual()< totalPaginas) {
    let paginaActual = actual() + 1;
    // Vamos a llamar a la funcion de actualizar la pagina actual
    paginador(productosFiltrados,paginaActual);
    cargaPaginas(productosFiltrados,paginaActual);
  }
});

function cargaPaginas(productos,paginaActual){
  let inicio = (paginaActual-1) * elementosPorPagina;
  document.getElementById("listado").innerHTML = "";
  if (inicio + elementosPorPagina > productos.length){
    final = productos.length;
  }
    else
  {
    final = inicio + elementosPorPagina;
  };  
  for (let i=inicio;i < final;i++){
    cargaproductos(productos[i], idiomaActual);
  }
}

function cambiaPagina(event){
  event.preventDefault();
  paginador(productosFiltrados,event.target.text);
  cargaPaginas(productosFiltrados,event.target.text);
}
// -----------------------------------------------
// Cambiamos la lista de familias segun idioma
// -----------------------------------------------
function cargaFiltroFamilias(familias){
  let seleccionada = Math.max(document.getElementById("familias").selectedIndex,0);
  document.getElementById("familias").innerHTML = "";
  for (elemento in familias) {
    let nomFamilia = document.createElement("option");
    nomFamilia.value = elemento;
    nomFamilia.innerHTML = familias[elemento];
    document.getElementById("familias").appendChild(nomFamilia);
  };
  document.getElementById("familias").selectedIndex = seleccionada;
}
// -----------------------------------------------
// Se dispara el filtro de familias
// -----------------------------------------------
document.getElementById("familias").addEventListener("change", (event) => {
  document.getElementById("listado").innerHTML = "";
  if (event.target.value == 0) {
    productosFiltrados = datos.productos;
    cargaPaginas(datos.productos,1);
  } else {
    productosFiltrados = datos.productos.filter(function (P) {
      return P.familia == event.target.value;
    });
    cargaPaginas(productosFiltrados,1);
  }
  console.log(productosFiltrados);
  paginador(productosFiltrados, 1);
});