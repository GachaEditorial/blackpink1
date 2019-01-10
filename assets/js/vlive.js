var vlive = 'https://api-vfan.vlive.tv/vproxy/channelplus/getChannelVideoList?app_id=8c6cc7b45d2568fb668be6e05b6e5a3b&gcc=GB&channelSeq=243&maxNumOfRows=30&pageNo=1&_=1541685911695';
var local = '../../data/vlive.json';

function buildVLive(callback){
    var parent = document.getElementById("vlives");
    parent.innerHTML = "";
    fetch(local).then(res => {
        res.json().then(data => {
            data.result.videoList.forEach((item) => {
                buildVideo(item, (elem) => {
                    parent.appendChild(elem);
                });
            });
        });
    });
}

function buildEmbed(data, callback){
    var video = document.createElement("div");
    var embed = document.createElement("iframe");

    video.classList.add("vlive");

    embed.setAttribute("src", "https://www.vlive.tv/embed/"+data.videoSeq+"?autoPlay=false");
    embed.setAttribute("frameborder", "no");
    embed.setAttribute("scrolling", "no");
    embed.setAttribute("marginwidth", "0");
    embed.setAttribute("marginheight", "0");
    embed.setAttribute("allowfullscreen", true);

    video.appendChild(embed);

    callback(embed);
}

function buildVideo(data, callback){
    var videoID = data.videoSeq;

    var linkWrap = document.createElement("a");
    linkWrap.setAttribute("href", "https://vlive.tv/video/" + videoID);
    linkWrap.setAttribute("external", true);
    linkWrap.setAttribute("target", "_blank");

    var video = document.createElement("div");
    var thumbnail = document.createElement("img");
    var overlay = document.createElement("div");

    video.classList.add("vlive");

    thumbnail.setAttribute("src", data.thumbnail);

    overlay.classList.add("overlay");

    var playIcon = document.createElement("i");
    playIcon.classList.add("fas");
    playIcon.classList.add("fa-play");

    overlay.appendChild(playIcon);

    var videoTitle = document.createElement("h1");
    videoTitle.innerText = data.title;

    var videoInfo = document.createElement("h3");
    var viewCount = data.playCount;

    if (viewCount >= 1000000){ // 1m+
        viewCount = viewCount.toString().slice(0,2);
        viewCount = viewCount[0] + "." + viewCount[1] + "M";
    } else if (viewCount >= 100000){ // 100k - 1m
        viewCount = viewCount.toString().slice(0,3);
        viewCount = viewCount + "K";
    } else if (viewCount >= 10000){ // 10k - 100k
        viewCount = viewCount.toString().slice(0,2);
        viewCount = viewCount + "K";
    } else if (viewCount >= 1000){ // 1k - 10k
        viewCount = viewCount.toString().slice(0,2);
        viewCount = viewCount[0] + "." + viewCount[1] + "K";
    }

    var videoTimestamp = formatTime(new Date(data.willStartAt)) + " ago";

    viewCount = viewCount + " views | " + videoTimestamp;

    videoInfo.innerText = viewCount;

    video.appendChild(thumbnail);
    video.appendChild(overlay);

    video.appendChild(videoTitle);
    video.appendChild(videoInfo);

    linkWrap.appendChild(video);

    callback(linkWrap);
}

function formatTime(d){
    var s = Math.floor((new Date() - d) / 1000);
    var i = Math.floor(s / 31536000);

    if (i == 1){
        return i + " year";
    }
    if (i > 1){
        return i + " years";
    }

    i = Math.floor(s / 2592000);
    if (i == 1){
        return i + " month";
    }
    if (i > 1){
        return i + " months";
    }

    i = Math.floor(s / 86400);
    if (i == 1){
        return i + " day";
    }
    if (i > 1){
        return i + " days";
    }

    i = Math.floor(s / 3600);
    if (i == 1){
        return i + " hour";
    }
    if (i > 1){
        return i + " hours";
    }

    i = Math.floor(s / 60);
    if (i == 1){
        return i + " minute";
    }
    if (i > 1){
        return i + " minutes";
    }

    return Math.floor(s) + " seconds";
}