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


// PASAR DE UNA HOJA A OTRA

const editarPerfil = () => {
    window.location.href = "/dash/editarPerfilUser";
};

const devolver = () => {
    window.location.href = "/dash/formulariosUser";
  }

// CONSUMO

const token = sessionStorage.getItem("token");
const url = sessionStorage.getItem("urlApi");
const idUser = sessionStorage.getItem("idUser");
const endpoint = "/api/tool";
const recurso = url + endpoint;

// CERRAS SESION
const cerrarSesion = () => {
  sessionStorage.setItem("token", "");
  sessionStorage.setItem("idUser", "");
  sessionStorage.setItem("urlApi", "");
  window.location.href = '/login';
}


// VERIFICAR INGRESO
const urlComprobar = url + "/api/oauth";

if (token === "" || token === null) {
  window.location.href = "/login"
};
if (url === "" || url === null) {
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


// Mostrar herramientas
  fetch(recurso)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error("error al mostrar datos", data);
      } else {
        mostrar(data.body);
      }
    })
    .catch((error) => console.log(error));
  
  const mostrar = (data) => {
    let body = "";
  
    for (let i = 0; i < data.length; i++) {
      body += `
        <option value="${data[i].id}" id="opcion_id">${data[i].nombre_herramienta}</option>   
      `;
    }
    document.getElementById("herramienta").innerHTML = body;
  
  };


// CREAR un formualrio
const crearFormulario = () => {
   const recursos = url + "/api/formDemageUser";

    const asunto = document.getElementById("asunto").value;
    const account_tool = document.getElementById("account_tool").value;
    const imagen = "";
    const opcion_id = document.getElementById("opcion_id").value;
    const description = document.getElementById("description").value;
  
  
    // Verificar que lo campos no esten vacios
    if (!asunto || !account_tool || !description || !herramienta) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacios!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        asunto: asunto,
        cantidad: account_tool,
        imagen: imagen,
        descripcion: description,
        id_user: idUser,
        id_herramienta: opcion_id,
  
      })
    };
    fetch(recursos, options)
      .then(res => res.json())
      .then(data => {
        if (data.error == false) {
          Swal.fire({
            icon: "success",
            title: "Ha sido Enviado",
            showConfirmButton: false,
            timer: 1500
          });
  
          setTimeout(function () {
            window.location.href = "/dash/formulariosUser";
          }, 2000);
  
        } else {
  
          Swal.fire({
            icon: "error",
            title: "No se pudo Enviar el formulario",
            showConfirmButton: false,
            timer: 1500
          });
  
        }
  
      })
      .catch(err => {
        console.log("Tenemos un problema", err);
      });
  
  }



