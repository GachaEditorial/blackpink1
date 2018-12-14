'use strict';

class ivoryRouter extends HTMLElement {
    constructor(){
        super();
        this._onChange = this._onChange.bind(this);
        this._routes = new Map();
    }

    _onChange(){
        const path = window.location.pathname;
        const routes = Array.from(this._routes.keys());
        const route = routes.find(r => r.test(path));
        const data = route.exec(path);

        if (!route) return;

        this._newView = this._routes.get(route);

        if (this._isTransitioning){
            return Promise.resolve();
        }

        this._isTransitioning = true;

        let outViewPromise = Promise.resolve();

        if (this._currentView){
            if (this._currentView === this._newView){
                this._isTransitioning = false;
                return this._currentView.update(data);
            }
            outViewPromise = this._currentView.out(data);
        }

        return outViewPromise
        .then(_ => {
            this._currentView = this._newView;
            this._isTransitioning = false;
            return this._newView.in(data);
        });
    }

    go(url){
        window.history.pushState(null, null, url);
        return this._onChange();
    }

    addRoute(route, view){
        if (this._routes.has(route)){
            return console.warn(`This route already exists: ${route}`);
        }

        this._routes.set(route, view);
    }

    _addRoutes(){
        let views = Array.from(document.querySelectorAll('ivory-view'));
        views.forEach(view => {
            if (!view.route) return;
            // var loadingparent = document.createElement('div');
            // loadingparent.classList.add('loadingnew');

            // var i = 0;
            // while (i < 8){
            //     var loadingchild = document.createElement('span');
            //     loadingparent.append(loadingchild);
            //     i++;
            // }

            // view.prepend(loadingparent);
            
            this.addRoute(new RegExp(view.route, 'i'), view);
        }, this);
    }

    _removeRoute(route){
        this._routes.delete(route);
    }

    _clearRoutes(){
        this._routes.clear();
    }


    connectedCallback(){
        window.addEventListener('popstate', this._onChange);
        this._clearRoutes();
        this._addRoutes();
        this._onChange();
    }
    
    disconnectedCallback(){
        window.removeEventListener('popstate', this._onChange);
    }
}

customElements.define('ivory-router', ivoryRouter);