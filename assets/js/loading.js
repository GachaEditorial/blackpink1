window.addEventListener("load", hideLoading);

function hideLoading(){
    this.setTimeout(_ => {
        this.document.querySelector('body').classList.remove("loading");
    }, 2000);
}