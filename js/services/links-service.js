'use strict';
// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
// function onImgInput(ev) {
//     loadImage(ev, renderImg)
// }

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}
