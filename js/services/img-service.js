var gImg 

function getGImg(){
    return gImg;
}

// function onImgInput(ev) {
//     loadImageFromInput(ev, renderImg)
// }

function saveImgObject(el) {
        const img = new Image()
        img.onload = () => {
            gImg = img
            renderImg(img)
        }
        img.src = el.src
}

// function renderImg(img) {
//     gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
//     gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
//     reSizeCanvasContainer(gElCanvas.width,gElCanvas.height)
//     // reSizeCanvas()
// }

// function loadImageToCanvas(imgSrc, onImageReady) {
//     const img = new Image()
//     img.onload = () => {
//         onImageReady(img)
//     }
//     img.src = imgSrc
//    return gImg.push(img)
// }


// function saveMemeImg(imgSrc) {
//     const memeImg = {
//         src: imgSrc,
//     }
//     gImg.push(memeImg)
//     console.log("🚀 ~ saveMemeImg ~ gImg:", gImg)
// }

// function loadImageToCanvas(imgSrc, onImageReady) {
//     const img = new Image()
//     img.onload = () => {
//         onImageReady(img)
//     }
//     img.src = imgSrc
//     gImg = img 
//     console.log("🚀 ~ loadImageToCanvas ~ gImg:", gImg)
// }

