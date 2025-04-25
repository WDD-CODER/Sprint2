'use strict';
var gImg 
var gLines = []


// Lists

function getGImg(){
    return gImg;
}

function getLineIdxByLineId(lineId) {
    return gLines.findIndex((line) => line.Id === lineId)
}

function getGLines() {
    return gLines
}

// Create

function saveImgObject(el) {
        const img = new Image()
        img.onload = () => {
            gImg = img
            renderImg(img)
        }
        img.src = el.src
}

function saveNewLine(lineStartPointX = 30, lineStartPointy = 20, lineHeight = 40, ev) {
    const line = { lineStartPointX, lineStartPointy, lineHeight }
    gLines.push(line)
}

function saveLineText(lineIdx, value) {
    return gLines[lineIdx].text = value
}


function saveLineTextWidth(lineIdx, value) {
    return gLines[lineIdx].textWidth = value
}


function saveTextPosition(lineIdx){
    const textPosition = _calculateTextPositionOnLine(lineIdx)
    gLines[lineIdx].textPositionX = textPosition.x
    gLines[lineIdx].textPositionY = textPosition.y
   return
}


function saveTextColor(color){
    gLines[0].color = color
}

// Helpers

function _calculateTextPositionOnLine(lineIdx) {
    const textPosition = {}
    textPosition.x = gLines[lineIdx].lineStartPointX + 10
    textPosition.y = gLines[lineIdx].lineStartPointy + 10
    return  textPosition
}

