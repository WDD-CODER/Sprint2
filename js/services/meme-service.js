'use strict';
var gImgs = []
// { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

// var gImgs =[]

var gLines = []


// Lists

function getImgById(id) {
    const curImgIdx = gImgs.findIndex(img => img.id === id)
    return gImgs[curImgIdx];
}

function getGImgs() {
    return gImgs;
}

function getGMeme() {
    return gMeme
}

// Create

function _createMemeImg(el) {
    //First load the main image and then create the object
    var MemeImg = {}
    const img = new Image()
    img.onload = () => {
        MemeImg = {
            id: +el.id,
            url: el.src,
            keywords: [],
            img: img
        }
        gImgs.push(MemeImg)
        // Create GMeme object
        _createNewGMeme()
        renderImgOnCanvas(img)
    }
    img.src = el.src
}

function _createNewGMeme() {
    gMeme = {
        selectedImgId: +gImgs[gImgs.length - 1].id,
        selectedLineIdx: 0,
        lines: [
            {
                txt: '', size: 20, color: 'black', textPositionX: 35, textPositionY: 30, lineHeight: 30,

            }
        ]
    }
}


// Update

function setImg(el) {
    _createMemeImg(el)
}

function setLineHeight(setSize) {
    return gMeme.lines[gMeme.lines.length - 1].lineHeight += +setSize
}

function setFontSize(setSize) {
    return gMeme.lines[gMeme.lines.length - 1].size += +setSize
}

function setLineTxt(txt) {
    return gMeme.lines[gMeme.lines.length - 1].txt = txt
}


function createNewLine() {
    let lastLine = gMeme.lines[gMeme.lines.length - 1]
    // const  {txt , size , color , textPositionX , textPositionY, lineHeight} = curLine    
    const newLine = {...lastLine}
    if (gMeme.lines.length > 0) newLine.textPositionY += gMeme.lines.length + 50
    gMeme.lines.push(newLine)
    console.log("🚀 ~ createNewLine ~  gMeme.lines:",  gMeme.lines)
}

function saveLineText(lineIdx, value) {
    return gLines[lineIdx].text = value
}


function saveLineTextWidth(lineIdx, value) {
    return gLines[lineIdx].textWidth = value
}


function saveTextPosition(lineIdx) {
    const textPosition = _calculateTextPositionOnLine(lineIdx)
    gLines[lineIdx].textPositionX = textPosition.x
    gLines[lineIdx].textPositionY = textPosition.y
    return
}


function saveTextColor(color) {
    return gMeme.lines[gMeme.lines.length - 1].color = color
}

// Helpers

function _calculateTextPositionOnLine(lineIdx) {
    const textPosition = {}
    textPosition.x = gLines[lineIdx].lineStartPointX + 10
    textPosition.y = gLines[lineIdx].lineStartPointy + 10
    return textPosition
}

