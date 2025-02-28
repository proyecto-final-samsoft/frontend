const menu_icon = document.getElementById("menu-icon");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");
const menu = document.querySelector(".menu");
const contenedorContenido = document.querySelector(".contenedor_contenido");
const barraUsuario = document.querySelector(".barra_usuario");


const fotoUsuario = document.querySelector(".foto_usuario");
const eleccionUsuario2 = document.querySelector(".eleccion_usuario2");

// DEL RESPONSIVE
const eleccionUsuario = document.querySelector(".eleccion_usuario");
const fotoUsuario2 = document.querySelector(".foto_usuario2");


const btn_change = document.querySelector(".btn-change");


// RESPONSIVE ELECCION DE CERRA SESION Y EDITA PERFIL
fotoUsuario2.addEventListener("click", () => {
    eleccionUsuario.classList.toggle("aparece");

})

// Ocultar el menú si se hace clic fuera de él RESPONSIVE
document.addEventListener("click", (event) => {
    const isClickInside = eleccionUsuario.contains(event.target) || fotoUsuario2.contains(event.target);
    // Comprueba si el elemento en el que se hizo clic (event.target) está contenido dentro del div (eleccion_usuario2 o fotoUsuario)
    // ||, si el clic ocurrió dentro de cualquiera de estos elementos, isClickInside será TRUE.
    //  contains, se usa para determinar si el elemento en el que se hizo clic (event.target) es un descendiente del div con la clase.

    if (!isClickInside) { // si es diferente a TRUE, significa que el clic no ocurrio dentro del div
        eleccionUsuario.classList.remove("aparece");
    }
});


// NORMAL ELECCION DE CERRA SESION Y EDITA PERFIL
fotoUsuario.addEventListener("click", () => {
    eleccionUsuario2.classList.toggle("apareceInicial");

})

// Ocultar el menú si se hace clic fuera de él NORMAL
document.addEventListener("click", (event) => {
    const isClickInside = eleccionUsuario2.contains(event.target) || fotoUsuario.contains(event.target);

    if (!isClickInside) {
        eleccionUsuario2.classList.remove("apareceInicial");
    }
});



// MENU RESPONSIVE
menu.addEventListener("click", () => {
    // Esta el el RESPOSIVE, vuelva a la posicion
    barraLateral.classList.toggle("max-barra-lateral");

    // classList.contains() es una función de JavaScript que se 
    // utiliza para verificar si un elemento HTML tiene una clase específica
    if (barraLateral.classList.contains("max-barra-lateral")) {
        menu.children[0].style.display = "none"; // icon menu
        menu.children[1].style.display = "block"; //icon circulo
    }
    else {
        menu.children[0].style.display = "block"; // icon menu
        menu.children[1].style.display = "none"; // icon circulo
    }

});

// MENU DESPEGABLE NORMAL VISTA
menu_icon.addEventListener("click", () => {
    // Barra de Arriba
    barraUsuario.classList.toggle("min-barra");

    // Barra Lateral
    barraLateral.classList.toggle("mini-barra-lateral");

    // organizar el margin-left del CONTENIDO. 
    contenedorContenido.classList.toggle("min-contenido");



    // Para todos los span encontrados le agregamos la CALSE .oculto
    spans.forEach((span) => {
        span.classList.toggle("oculto");
    });
});



// PASAR DE HOJA A HOJA con informacion
const pasar = (event) => {
  const fila = event.target.parentElement.parentElement;
  const idFicha = fila.cells[0].innerText;
  const number_ficha = fila.cells[1].innerText;
  const account_aprendices = fila.cells[2].innerText;
  const level_formacion = fila.cells[3].innerText;
  const program_formacion = fila.cells[4].innerText;
  const ambiente = fila.cells[5].innerText;

  localStorage.setItem("EditIdFicha", idFicha);
  localStorage.setItem("editNumeroFicha", number_ficha);
  localStorage.setItem("editCantidad", account_aprendices);
  localStorage.setItem("editNivel", level_formacion);
  localStorage.setItem("editPrograma", program_formacion);
  localStorage.setItem("editAmbiente", ambiente);

  window.location.href = "/dash/editarFicha";
};


// PASAR DE HOJA A HOJA
btn_change.addEventListener("click", () =>{
    window.location.href = '/dash/addFichas';
});

const editarPerfil = () => {
    window.location.href = "/dash/editarPerfil";
};

const token = sessionStorage.getItem("token");
const url = sessionStorage.getItem("urlApi");
const endpoint = "/api/ficha";
const recurso = url + endpoint;

// CERRAS SESION
const cerrarSesion = () => {
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("urlApi", "");
    sessionStorage.setItem("idUser", "");
    window.location.href = '/login';
};

// VERIFICAR INGRESO
const urlComprobar = url + "/api/oauth";

if (token == "" || token == null) {
  window.location.href = "/login"
};
if (url == "" || url == null) {
  window.location.href = "/login"
};

const options = {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
     'Authorization' : `Bearer ${token}`
  }
}
fetch(urlComprobar, options)
  .then(res => res.json())
  .then(data => {
    if (data.error == true) {
      window.location.href = "/login"
    }
  });


// MOSTRAR las fichas
fetch(recurso)
  .then((res) => res.json())
  .then((data) => {
    if (data.error) {
      console.error("error al mostrar datos", data);
    } else {
      mostrar(data.body);
    }
  })
  .catch((err) => console.log(err));

const mostrar = (data) => {
  let body = "";

  for (let i = 0; i < data.length; i++) {
    body += `

     <tr>
            <th scope="row">${data[i].id}</th>
            <td class="numberF">${data[i].numero_ficha}</td>
            <td>${data[i].cantidad_aprendices}</td>
            <td class="levelF">${data[i].nivel_formacion}</td>
            <td class="programF">${data[i].programa_formacion}</td>
            <td class="ambi">${data[i].ambiente}</td>
            <td scope="btn">
                <button class="act-icon green btn-edit" onclick="pasar(event);"> Editar </button>
                <button class="act-icon red btn-trash-open" onclick="eliminar(event);"> Eliminar </button>
            </td>
    </tr> 
                      
    `;
  }
  document.getElementById("data").innerHTML = body;
};


// CONSEGUIR el id de la ficha, y mostrar el mensaje de aceptar o no
const eliminar = (event) => {
  const eliminar_ficha =event.target.parentElement.parentElement.children[1].innerText;

  Swal.fire({
    title: "Estas seguro?",
    text: "¡No podrás revertirlo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
  }).then((result) => {
    if (result.isConfirmed) {

      eliminarApi(eliminar_ficha);
      
      Swal.fire({
        title: "¡Borrado!",
        text: "La ficha ha sido eliminada.",
        icon: "success",
      });
    }
  });
};

// ELIMINAR la ficha
const eliminarApi = (number_ficha) => {

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      numero_ficha: number_ficha,
    }),
  };

  fetch(recurso, options)
    .then((res) => res.json())
    .then((data) => {
      if (data.error == false) {
        Swal.fire(data.body);
        window.location.href = "/dash/fichasAdmin";
      }
    })
    .catch((err) => {
      console.log("Tenemos un problema", err);
    });
};


// BARRA DE BUSQUEDA
const search = document.getElementById("search_invenatry");

search.addEventListener("keyup", e => {
    const query = e.target.value.toLowerCase();
    
    document.querySelectorAll('#data tr').forEach(row =>{
        const numeroFicha = row.querySelector('.numberF').textContent.toLowerCase();
        const nivelFormacion = row.querySelector('.levelF').textContent.toLowerCase();
        const programaFormacion = row.querySelector('.programF').textContent.toLowerCase();
        const ambiente = row.querySelector('.ambi').textContent.toLowerCase();
        if(numeroFicha.includes(query) || nivelFormacion.includes(query) || programaFormacion.includes(query) || ambiente.includes(query)){
            row.classList.remove('filtro');
        } else {
            row.classList.add('filtro');
        }
    });
});

const style = document.createElement('style')
style.innerHTML = `
.filtro {
    display: none;
    }
`;

document.head.appendChild(style);
