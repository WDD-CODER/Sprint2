'use strict';

var gElCanvas
var gCtx
var gImg
//  Lists 

function onInit() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d')
}

function renderCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    if (gImg) loadImageToCanvas(gImg, renderImg)
        reSizeCanvas()
}

function reSizeCanvasContainer(width, height) {
    const elContainer = document.querySelector('.canvas-container');
    elContainer.style.width = width  + 2 + "px";
    elContainer.style.height = height + 2 + "px";
}

function reSizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function onChooseImg(el) {
    gImg = el.src
    loadImageToCanvas(gImg, renderImg)
    switchBetweenMainContainers()
    renderCanvas()
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    reSizeCanvasContainer(gElCanvas.width, gElCanvas.height)
}

function loadImageToCanvas(imgSrc, onImageReady) {
    const img = new Image()
    img.onload = () => {
        onImageReady(img)
    }
    img.src = imgSrc
}

// Create




// Read



// Update
function switchBetweenMainContainers() {
    document.querySelectorAll('.container').forEach(el => {
        if (el.classList.contains('hidden')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })

}


// Delete
