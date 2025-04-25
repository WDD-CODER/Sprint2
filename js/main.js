'use strict';

var gElCanvas
var gCtx
var gImg
var gLine = []
var gPos = {}


//  Lists 

function onInit() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d')
}

function renderCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderImgToCanvas()
    reSizeCanvas()
}
function renderImgToCanvas() {
    if (gImg) loadImageToCanvas(gImg, renderImg)
}

function reSizeCanvasContainer(width, height) {
    const elContainer = document.querySelector('.canvas-container');
    elContainer.style.width = width + "px";
    elContainer.style.height = height + "px";
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
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width - 2, gElCanvas.height - 2)
    reSizeCanvasContainer(gElCanvas.width, gElCanvas.height)
    drawExistingLine()
}

function loadImageToCanvas(imgSrc, onImageReady) {
    const img = new Image()
    img.onload = () => {
        onImageReady(img)
    }
    img.src = imgSrc
}

function renderLines() {
    const gLines = getGLines()
    if (!gLines.length) return
    gLines.forEach(line => {
        drawRoundRect(line.lineStartPointX, line.lineStartPointy, line.lineHeight)
    })
}

function renderText() {
    const gLines = getGLines()
    if (!gLines.length) return
    gLines.forEach(line => {
        drawText(line.text, line.textPositionX, line.textPositionY, 25, 'Arial')
    })
}



// Create

function addLineToMeme(ev) {
    //for now manual
    const startPointX = 30
    const startPointY = 20
    const lineHeight = 40
    drawRoundRect(startPointX, startPointY, lineHeight, ev)
    const line = { startPointX, startPointY, lineHeight }
    gLine.push(line)
}

function drawText(str, textPositionX, textPositionY, textSize = 25, fontFamily = 'Arial', color = 'black') {
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY, lineHeight, ev) {
    // const pos = getEvPos(ev)
    const width = document.querySelector('.canvas-container').offsetWidth - (startPointX * 2);
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, width, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = '#000000'
    gCtx.stroke()
}


// function getTextPosition(lineNum = 0) {
//     const posX = gLine[lineNum].startPointX + 10
//     const posY = gLine[lineNum].startPointY + 10
//     // const lineHeight = gLine[lineNum].lineHeight

//     drawText(posX, posY, 25,'Arial','#000000', gLine[lineNum].text)
//     // gCtx.font = '25px Arial'
//     // gCtx.fillStyle = 'black'
//     // gCtx.textBaseline = 'top'
//     // gCtx.fillText(, posX, posY)

// }




// Read

function measureTextWidthBypX(str) {
    const textWidth = gCtx.measureText(str).width
    return textWidth
}


// Update
function switchBetweenMainContainers() {
    document.querySelectorAll('.container').forEach(el => {
        if (el.classList.contains('hidden')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })

}


// Delete
