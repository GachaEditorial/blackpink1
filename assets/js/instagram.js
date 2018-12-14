var lisa = '../../data/ig_lisa.json';
var jennie = '../../data/ig_jennie.json';
var jisoo = '../../data/ig_jisoo.json';
var rose = '../../data/ig_rose.json';
var feed_url;

function instagramFeed(member, callback){
    if (member === 'lisa'){
        feed_url = lisa;
    } else if (member === 'jennie'){
        feed_url = jennie;
    } else if (member === 'jisoo'){
        feed_url = jisoo;
    } else if (member === 'rose'){
        feed_url = rose;
    }

    fetch(feed_url)
    .then(res => {
        res.json().then(data => {
            var feed = buildFeed(data.graphql.user.edge_owner_to_timeline_media.edges);
            callback(feed);
        });
    });
}

function buildFeed(data){
    var feed = document.createElement("div");
    feed.classList.add("feed");

    for (var i = 0; i < 9; i++){
        var post = buildPost(data[i].node);

        feed.appendChild(post);
    }

    return feed;
}

function buildPost(data){
    var post = document.createElement("div");
    post.classList.add("post");

    var link = document.createElement("a");
    link.setAttribute("href", "https://instagram.com/p/"+data.shortcode);
    link.setAttribute("target", "_blank");
    link.setAttribute("external", true);

    var img = document.createElement("img");
    img.setAttribute("src", data.thumbnail_src);

    link.appendChild(img);
    post.appendChild(link);

    return post;
}