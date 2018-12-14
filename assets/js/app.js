'use strict';

class App {
    constructor(){

        document.addEventListener('click', function(e){
            const router = document.querySelector("ivory-router");

            if (e.target.tagName.toLowerCase() === "a" && !e.target.hasAttribute("external")){
                e.preventDefault();
                router.go(e.target.href);
            } else if (e.target.parentNode.tagName.toLowerCase() === "a" && !e.target.parentNode.hasAttribute("external")){
                e.preventDefault();
                router.go(e.target.parentNode.href);
            }

        });
    }
}

(_ => new App())();