'use strict';

var gElCanvas
var gCtx
// var gImg
var gPos = {}


//  Lists 

function onInit() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d')
}

function renderCanvas() {
    reSizeCanvas() // Resize first; this clears canvas internally
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderImg()
    renderLines()
    renderText()
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
    saveImgObject(el)
    switchBetweenMainContainers()
    renderCanvas()
}

function renderImg() {
    const img = getGImg()
    if (!img) return
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width - 2, gElCanvas.height - 2)
    reSizeCanvasContainer(gElCanvas.width, gElCanvas.height)

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
        drawText(line.text, line.textPositionX, line.textPositionY, 25, 'Arial', line.color)
    })
}

// Create
function onAddText(el) {
    if (!getGLines().length) {
        alert('First must add a line')
        return
    }
    const curLineIdx = 0
    const textWidth = measureTextWidthBypX(el.value)
    saveLineText(curLineIdx, el.value)
    saveLineTextWidth(curLineIdx, textWidth)
    saveTextPosition(curLineIdx)
    renderCanvas()
}

function onAddLine(ev) {
    // For now by hand 
    const lineStartPointX = 30
    const lineStartPointy = 20
    const lineHeight = 40

    saveNewLine(lineStartPointX, lineStartPointy, lineHeight, ev)
    renderLines(lineStartPointX, lineStartPointy, lineHeight)
}

function drawText(str, textPositionX, textPositionY, textSize = 25, fontFamily = 'Arial', color = '#000000') {
    gCtx.font = `${textSize}px ${fontFamily}`
    gCtx.fillStyle = color
    gCtx.textBaseline = 'top'
    gCtx.fillText(str, textPositionX, textPositionY)
}

function drawRoundRect(startPointX, startPointY, lineHeight, color = '#000000') {
    const width = document.querySelector('.canvas-container').offsetWidth - (startPointX * 2);
    gCtx.beginPath()
    gCtx.roundRect(startPointX, startPointY, width, lineHeight, lineHeight / 2)
    gCtx.strokeStyle = color
    gCtx.stroke()
}

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

function onChangeTextColor(el){
    saveTextColor(el.value)
    renderCanvas()
// const color = el.value

}


// Delete
