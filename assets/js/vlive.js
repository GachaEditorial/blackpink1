var vlive = 'https://api-vfan.vlive.tv/vproxy/channelplus/getChannelVideoList?app_id=8c6cc7b45d2568fb668be6e05b6e5a3b&gcc=GB&channelSeq=243&maxNumOfRows=30&pageNo=1&_=1541685911695';
var local = '../../data/vlive.json';

fetch(local)
.then(res => {
    res.json().then(data => {
        console.log(data);
    })
});