'use strict';

var gElCanvas
var gCtx
//  Lists 

function onInit() {
        gElCanvas = document.querySelector('canvas');
        gCtx = gElCanvas.getContext('2d')
        
        renderCanvas()    
}

function renderCanvas() {
    reSizeCanvas()
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function reSizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    console.log("🚀 ~ reSizeCanvas ~ elContainer:", elContainer)
    gElCanvas.width = elContainer.offsetWidth - 10;
    gElCanvas.height = elContainer.offsetHeight - 10;
}

function onChooseImg(el) {
    document.querySelectorAll('.container').forEach(el => {
        if (el.classList.contains('hidden')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })
}

// Create



// Read



// Update



// Delete
