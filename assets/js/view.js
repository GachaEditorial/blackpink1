'use strict';

class ivoryView extends HTMLElement {
    constructor(){
        super();
        this._view = null;
        this._isRemote = (this.getAttribute('remote') !== null);
    }

    get route(){
        return this.getAttribute('route') || null;
    }

    _hideSpinner(){
        var body = document.querySelector("body");
        body.classList.remove("loading");
    }

    _showSpinner(){
        var body = document.querySelector("body");
        body.classList.add("loading");
    }

    _loadView(data){
        this._view = new DocumentFragment();
        const xhr = new XMLHttpRequest();

        xhr.onload = evt => {
            const newDoc = evt.target.response;
            const newView = newDoc.querySelector('ivory-view.visible');

            while (newView.firstChild){
                this._view.appendChild(newView.firstChild);
            }

            this.appendChild(this._view);
        };
        xhr.responseType = 'document';
        xhr.open('GET', `${data[0]}`);
        xhr.send();
        return this;
    }

    in(data){
        var checkboxes = document.getElementsByClassName("navCheckbox");

        for (var i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].checked){
                checkboxes[i].click();
            }
        }

        if (this._isRemote && !this.view && this.childNodes.length < 2){
            this._loadView(data);
        }

        return new Promise((resolve, reject) => {
            const onTransitionEnd = () => {
                this.removeEventListener('transitionend', onTransitionEnd);

                var routename = window.location.pathname;
                routename = routename.replace(new RegExp("/", 'g'), "");

                if (routename === ""){
                    routename = "home";
                }

                setTimeout(_ => {
                    routename += "Load()"; // moved here as elements weren't being
                    pageLoad(routename); // created quick enough for load functions

                    var elem = document.querySelector(".visible section");
                    elem.scrollTo(0,0);

                    this._hideSpinner();
                    
                    resolve();
                }, 2000);
            };

            this.classList.add('visible');
            this.addEventListener('transitionend', onTransitionEnd);
        });
    }

    out(){
        this._showSpinner();
        return new Promise((resolve, reject) => {
            const onTransitionEnd = () => {
                this.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };

            setTimeout(_ => {
                this.classList.remove('visible');
            }, 500);
            this.addEventListener('transitionend', onTransitionEnd);
        });
    }

    update(){
        var checkbox = document.getElementById('navCheckbox');
        if (checkbox.checked){
            checkbox.click();
        }
        return Promise.resolve();
    }
}

customElements.define('ivory-view', ivoryView);