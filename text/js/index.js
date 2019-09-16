function byId(id) {
    return typeof(id)==="string"?document.getElementById(id):id;
}
var timer = null,
    index=0,
    div1 = byId('div1'),
    oDiv = div1.getElementsByTagName('div'),
len = oDiv.length;
function slideImg() {
    timer = setInterval(function () {
        index++;
        if(index===len){index = 0}
        changeimage();
    },2000);
}

function changeimage() {
    for(var i = 0;i<len;i++){
        oDiv[i].style.display = 'none';
    }
    oDiv[index].style.display = 'block';
}

slideImg();