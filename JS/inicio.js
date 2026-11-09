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