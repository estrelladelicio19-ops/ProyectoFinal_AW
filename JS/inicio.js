const boton = document.querySelector(".hamburguesa");

const menu = document.querySelector(".menus");


boton.addEventListener("click",()=>{

    menu.classList.toggle("activo");


    if(menu.classList.contains("activo")){

        boton.innerHTML="✖";

    }else{

        boton.innerHTML="☰";

    }

});
// cerrar menú al tocar un enlace

document.querySelectorAll(".menus a").forEach(link=>{


    link.addEventListener("click",()=>{

        menu.classList.remove("activo");

        boton.innerHTML="☰";

    });

});

const scriptNavegacion = document.currentScript;
if (scriptNavegacion && !document.querySelector("[data-language-app]")) {
    const scriptIdioma = document.createElement("script");
    scriptIdioma.src = new URL("app.js", scriptNavegacion.src).href;
    scriptIdioma.dataset.languageApp = "";
    document.body.appendChild(scriptIdioma);
}