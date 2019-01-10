function pageLoad(page){
    var view = document.querySelector("ivory-view.visible section");
    view.addEventListener('scroll', () => {
        if (view.scrollTop > 0){
            view.classList.add("scroll");
        } else {
            view.classList.remove("scroll");
        }
    });
    eval(page);
}

var homeLoaded = false;

function homeLoad(){
    document.title = "BLACKPINK";
    if (!homeLoaded){
        sliderControl();
        homeLoaded = true;
    }
}

function videosLoad(){
    document.title = "Videos - BLACKPINK";
    buildVLive((data) => {
        
    });
}

function lisaLoad(){
    document.title = "Lisa - BLACKPINK";
    instagramFeed("lisa", (feed) => {
        document.getElementById("lisaIG").innerHTML = '';
        document.getElementById("lisaIG").appendChild(feed);
    });
}

function jennieLoad(){
    document.title = "Jennie - BLACKPINK";
    instagramFeed("jennie", (feed) => {
        document.getElementById("jennieIG").innerHTML = '';
        document.getElementById("jennieIG").appendChild(feed);
    });
}

function jisooLoad(){
    document.title = "Jisoo - BLACKPINK";
    instagramFeed("jisoo", (feed) => {
        document.getElementById("jisooIG").innerHTML = '';
        document.getElementById("jisooIG").appendChild(feed);
    });
}

function roseLoad(){
    document.title = "Rosé - BLACKPINK";
    instagramFeed("rose", (feed) => {
        document.getElementById("roseIG").innerHTML = '';
        document.getElementById("roseIG").appendChild(feed);
    });
}

function musicLoad(){
    document.title = "Music - BLACKPINK";
    buildAlbums();
}

function storeLoad(){
    document.title = "Store - BLACKPINK";
    buildStore();
}

function buildStore(){
    var url = "https://api.ipdata.co?api-key=";
    // var apiKey = "c0e573178e93ec0fb2d75febfe46cdc32670a8410a95267af1d5235c";
    var apiKey = "test";
    var productsElem = document.getElementById("products");
    productsElem.innerHTML = '';
    fetch(url+apiKey)
    .then(res => {
        res.json().then(data => {
            var currency = data.currency.code;
            var symbol = data.currency.symbol;
            fetch("../../data/products.json")
            .then(res => {
                res.json().then(data => {
                    console.log(data);
                    buildProducts(data, currency, symbol, function(products){
                        productsElem.appendChild(products);
                    });
                });
            });
        });
    });
}

function buildProducts(data, currency, symbol, callback){
    var products = document.createElement("div");
    products.classList.add("productsWrapper");
    Object.keys(data).forEach((item) => {
        buildProduct(data[item], currency, symbol, function(product, preorder){
            if (preorder){
                products.prepend(product);
            } else {
                products.appendChild(product);
            }
        });
    });
    callback(products);
}

function buildProduct(data, currency, symbol, callback){
    var product = document.createElement("div");
    product.classList.add("product");

    var productInfo = document.createElement("div");
    productInfo.classList.add("info");
    var productName = document.createElement("p");
    var productPrice = document.createElement("p");
    productPrice.classList.add("price");

    if (data.price[currency] === undefined){
        productPrice.innerText = "$"+data.price.usd;
    } else {
        productPrice.innerText = symbol+data.price[currency];
    }

    productName.innerText = data.displayName;
    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);

    var productImage = document.createElement("img");
    productImage.setAttribute("src", data.image);

    product.appendChild(productImage);
    product.appendChild(productInfo);

    productLink = document.createElement("a");
    productLink.setAttribute("href", "https://en.ygselect.com/Product/Detail/view/pid/"+data.id+"/cid/831");
    productLink.setAttribute("target", "_blank");
    productLink.setAttribute("external", true);

    if (data.preorder){
        product.classList.add("preorder");
    }

    if (data.new){
        product.classList.add("new");
    }

    productLink.appendChild(product);

    callback(productLink, data.preorder);
}

function sliderControl(){
    var slider = document.getElementById("slider");
    var listener = new Hammer(slider);
    listener.on('swipeleft swiperight', function(ev) {
        var currentSlide = parseInt(slider.getAttribute("data-current"));
        if (ev.type === "swipeleft"){
            if (currentSlide === 4){
                slider.setAttribute("data-current", 1);
            } 
            else 
            {
                slider.setAttribute("data-current", currentSlide + 1);
            }
        } else if (ev.type === "swiperight"){
            if (currentSlide === 1){
                slider.setAttribute("data-current", 4);
            } else {
                slider.setAttribute("data-current", currentSlide - 1);
            }
        }
    });
}

function aboutLoad(){
    document.title = "About - BLACKPINK";
}

function buildAlbums(){
    fetch('../../data/albums.json')
    .then(res => {
        res.json().then(data => {
            var parent = document.getElementById("albums");
            parent.innerHTML = "";
            Object.keys(data).forEach(album => {
                buildAlbum(data[album], (albumElem) => {
                    parent.appendChild(albumElem);
                });
            });
        });
    });
}

function buildAlbum(data, callback){
    var album = document.createElement("div");
    album.classList.add("album");

    var title = document.createElement("h1");
    title.innerText = data.title;

    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    album.appendChild(title);
    album.appendChild(checkbox);

    data.songs.forEach(song => {
        buildSong(song, (songElem) => {
            album.appendChild(songElem);
        });
    });

    var links = document.createElement("div");
    links.classList.add("links");

    if (data.links.apple !== undefined && data.links.apple !== ""){
        var apple = document.createElement("div");

        var apple_link = document.createElement("a");
        apple_link.setAttribute("href", data.links.apple);
        apple_link.setAttribute("target", "_blank");
        apple_link.setAttribute("external", true);

        var apple_icon = document.createElement("i");
        apple_icon.classList.add("fab");
        apple_icon.classList.add("fa-apple");

        apple.appendChild(apple_icon);
        apple_link.appendChild(apple);

        links.appendChild(apple_link);
    }

    if (data.links.spotify !== undefined && data.links.spotify !== ""){
        var spotify = document.createElement("div");

        var spotify_link = document.createElement("a");
        spotify_link.setAttribute("href", data.links.spotify);
        spotify_link.setAttribute("target", "_blank");
        spotify_link.setAttribute("external", true);

        var spotify_icon = document.createElement("i");
        spotify_icon.classList.add("fab");
        spotify_icon.classList.add("fa-spotify");

        spotify.appendChild(spotify_icon);
        spotify_link.appendChild(spotify);

        links.appendChild(spotify_link);
    }

    if (data.links.soundcloud !== undefined && data.links.soundcloud !== ""){
        var soundcloud = document.createElement("div");

        var soundcloud_link = document.createElement("a");
        soundcloud_link.setAttribute("href", data.links.soundcloud);
        soundcloud_link.setAttribute("target", "_blank");
        soundcloud_link.setAttribute("external", true);

        var soundcloud_icon = document.createElement("i");
        soundcloud_icon.classList.add("fab");
        soundcloud_icon.classList.add("fa-soundcloud");

        soundcloud.appendChild(soundcloud_icon);
        soundcloud_link.appendChild(soundcloud);

        links.appendChild(soundcloud_link);
    }

    if (data.links.google !== undefined && data.links.google !== ""){
        var google = document.createElement("div");

        var google_link = document.createElement("a");
        google_link.setAttribute("href", data.links.google);
        google_link.setAttribute("target", "_blank");
        google_link.setAttribute("external", true);
        
        var google_icon = document.createElement("i");
        google_icon.classList.add("fab");
        google_icon.classList.add("fa-google-play");

        google.appendChild(google_icon);
        google_link.appendChild(google);

        links.appendChild(google_link);
    }

    album.appendChild(links);

    callback(album);
}

function buildSong(data, callback){
    var song = document.createElement("div");
    song.classList.add("song");

    if (data.mvid !== undefined && data.mvid !== ""){
        var mv = document.createElement("iframe");
        mv.classList.add("mv");
        mv.setAttribute("src", "https://www.youtube.com/embed/"+data.mvid);
        mv.setAttribute("frameborder", 0);
        mv.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
        mv.setAttribute("allowfullscreen", true);

        song.appendChild(mv);
    }

    var title = document.createElement("h3");
    title.innerText = data.title;

    song.appendChild(title);

    callback(song);
}