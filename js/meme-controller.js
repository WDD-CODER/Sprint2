'use strict';

var gElCanvas
var gCtx
var gPos = {}


//  Lists 


function renderMeme() {    
    // if (!getGMeme()) return
    const curMeme = getGMeme()
    const curMemeGImg = getImgById(curMeme.selectedImgId)
    reSizeCanvas() // Resize first; this clears canvas internally
    clearCanvas()
    renderImgOnCanvas(curMemeGImg.img)
    renderLines()
    renderText()

}

function clearCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
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


function renderImgOnCanvas(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width - 2, gElCanvas.height - 2)
    //Does another double check and optimize the canvas container after putting the picture
    reSizeCanvasContainer(gElCanvas.width, gElCanvas.height)
}

function renderLines() {
    const gMeme = getGMeme()
    const CurMemeLInes = gMeme.lines
    if (!CurMemeLInes.length) return
    CurMemeLInes.forEach(line => {
        const lineStartPointX = 30
        const lineStartPointy = 20
        const lineHeight = 40
        drawRoundRect(lineStartPointX, lineStartPointy, lineHeight)
        // drawRoundRect(line.lineStartPointX, line.lineStartPointy, line.lineHeight)
    })
}

function renderText() {
    const gMeme = getGMeme()
    const CurMemeText = gMeme.lines
    if (!CurMemeText.length) return
    CurMemeText.forEach(line => {
        // const lineStartPointX = 30
        // const lineStartPointy = 20
        // const lineHeight = 40
        // drawRoundRect(lineStartPointX, lineStartPointy, lineHeight)
        const lineTextPositionX = 35
        const lineTextPositionY = 30

        drawText(line.txt, line.Size, line.color, lineTextPositionX, lineTextPositionY, 'Arial')
    })
}


// Create
function onAddText(el) {
    setLineTxt(el.value)
    renderMeme()
}

function onAddLine(ev) {
    // For now by hand 
    const lineStartPointX = 30
    const lineStartPointy = 20
    const lineHeight = 40

    saveNewLine(lineStartPointX, lineStartPointy, lineHeight, ev)
    renderLines(lineStartPointX, lineStartPointy, lineHeight)
}

function drawText(str, textSize = 25, color = '#000000', textPositionX, textPositionY, fontFamily = 'Arial') {
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

function onChangeTextColor(el) {
    saveTextColor(el.value)
    renderMeme()
}


// Delete
