'use strict';
var gRandomTexts = [
    "You know I love you!",
    "Hey there... you!",
    "How's it hanging over there?",
    "That doesn't look good.",
    "Ah, shit... Here we go again.",
    "When you open the fridge and forget why.",
    "Me? Normal? Never heard of it.",
    "404: Motivation not found.",
    "Just one more episode… at 3am.",
    "I came. I saw. I made it awkward."
];
var gImgs = []
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

// Lists
function GetLastLine() {
    return gMeme.lines[gMeme.lines.length - 1]
}


function getAccurateBorderLinePosition(line) {
    
    const curLine = line || gMeme.lines[gMeme.selectedLineIdx]
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    // starts with left
    const widthFallback = elCanvasContainerWidth - 70;
    
    const lineWidth = curLine.textWidth + 15 || widthFallback
    const lineHeight = curLine.size + 4
    const textAlign = curLine.textAlign || ''
    const textSize = curLine.size

    let linePositionX = curLine.textPositionX - 5
    let linePositionY = curLine.textPositionY - 2.5

    if (textAlign === 'center') {
        linePositionX = centerOfCanvas - lineWidth / 2
        linePositionY = curLine.textPositionY - 2.5
    }

    else if (textAlign === "right") {
        linePositionX = curLine.textPositionX + 5 - lineWidth
        linePositionY = curLine.textPositionY - 2.5
    }

    const accurateLinePositions = { linePositionX, linePositionY, lineWidth, lineHeight, textSize }
    return accurateLinePositions

}
function getAccurateUnderLinePosition(line) {
    
    const { linePositionX, linePositionY, lineWidth, lineHeight, textSize } = getAccurateBorderLinePosition(line)
    var UnderLinePosition = {}
    let strokeStartPointX = linePositionX
    let strokeStartPointY = linePositionY + textSize
    let strokeEndPointX = lineWidth
    return UnderLinePosition = { strokeStartPointX, strokeStartPointY, strokeEndPointX }
}

function getSelectedLineIdx() {
    return gMeme.selectedLineIdx
}

function getLineIdxByPosition(ev) {
    if (!gMeme) return
    const pos = getEvPos(ev)
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    const curLineIdx = gMeme.lines.findIndex(line => {
        let { textPositionX, textPositionY, lineHeight, textWidth } = line
        // In case the line was added without any text, Gives the line One time use width so it could be chosen.
        if (!textWidth) textWidth = getCanvasContainerWidth()
        var isClicked
        if (line.textAlign) {
            if (line.textAlign === "center") {
                isClicked =
                    pos.x >= centerOfCanvas - 10 - textWidth / 2 &&
                    pos.x <= centerOfCanvas + 10 + textWidth / 2
                    &&
                    pos.y >= textPositionY - 3 &&
                    pos.y <= textPositionY + lineHeight + 3
            }
            else if (line.textAlign === "right") {
                isClicked =
                    pos.x >= textPositionX - textWidth - 10 &&
                    pos.x <= textPositionX + 10
                    &&
                    pos.y >= textPositionY - 3 &&
                    pos.y <= textPositionY + lineHeight + 3
            }
            else {
                //text align to the left
                isClicked =
                    pos.x >= textPositionX - 10 &&
                    pos.x <= textPositionX + textWidth + 20
                    &&
                    pos.y >= textPositionY - 3 &&
                    pos.y <= textPositionY + lineHeight + 3
            }
            return isClicked
        }

        else {
            //text align to the left
            isClicked =
                pos.x >= textPositionX - 10 &&
                pos.x <= textPositionX + textWidth + 20
                &&
                pos.y >= textPositionY - 3 &&
                pos.y <= textPositionY + lineHeight + 3
            return isClicked
        }

    })
    return curLineIdx !== -1 ? curLineIdx : null
}


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
function getLineByIdX(lineIdx) {
    return gMeme.lines[lineIdx]
}

function getRandomImg() {
    const elGImgs = document.querySelectorAll('.gallery-pics img');
    return elGImgs[getRandomInt(0, elGImgs.length - 1)]

}

// Create

function getRandomText() {
    return gRandomTexts[getRandomInt(0, gRandomTexts.length - 1)]
}

function _createMemeImg(el, onReady) {    //First load the main image and then create the object
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
        _createNewGMeme(MemeImg.id)
        renderImgOnCanvas(img)
        if (onReady) onReady()
    }
    img.src = el.src
}

function _createNewGMeme(ImgId) {
    gMeme = {
        selectedImgId: ImgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: '',
                size: 16,
                color: '#f5f5f5',
                textPositionX: 35,
                textPositionY: 30,
                lineHeight: 30,
            }
        ]
    }
}


// Update

function setGMemeUnderline() {
    gMeme.lines[gMeme.selectedLineIdx].underLine = !gMeme.lines[gMeme.selectedLineIdx].underLine;
    return gMeme.lines[gMeme.selectedLineIdx].underLine;
}


function setFontFamily(value) {
    return gMeme.lines[gMeme.selectedLineIdx].fontFamily = value
}


function SetTextAlignment(el) {
    const CurLine = gMeme.lines[gMeme.selectedLineIdx]
    CurLine.textAlign = el.value
    CurLine.textPositionX = getUpdatedTextPositionX(el.value)
}

function setGMemeSelectedLine(el) {
    let change = IncreaseOrDecreaseByFactor(1, el)
    if (change < 0 && gMeme.selectedLineIdx <= 0) return
    if (change > 0 && gMeme.selectedLineIdx >= gMeme.lines.length - 1) return
    gMeme.selectedLineIdx += change
}
function setGMemeSelectedLineIdxTo(lineIdx) {
    return gMeme.selectedLineIdx = lineIdx
}

function setImg(el, onReady) {
    _createMemeImg(el, onReady)
}

function setFontSize(change) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += change
    gCtx.font = `${line.size}px Arial`
    return
}

function setRandomTextLines(numOfLines) {
     gMeme.lines = []
    for (let i = 0; i < numOfLines; i++) {
        createNewLine()
    }
    gMeme.lines.forEach(line =>  line.txt = getRandomText())
}

function setLineTxt(txt) {
    return gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function createNewLine() {
    let lastLine = GetLastLine();
    const baseY = lastLine ? lastLine.textPositionY + lastLine.lineHeight : G_START_POSITION_Y;

    const newLine = {
        txt: '',
        size: 16,
        color: '#f5f5f5',
        textPositionX: G_START_POSITION_X,
        textPositionY: baseY,
        lineHeight: 30
    };

    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function setTextWidth(width) {
    return gMeme.lines[gMeme.selectedLineIdx].textWidth = width
}


function saveTextColor(color) {
    return gMeme.lines[gMeme.selectedLineIdx].color = color
}

// Delete

function DeleteLineFromGMeme() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx--
}


// Helpers

function _calculateTextPositionOnLine(lineIdx) {
    const textPosition = {}
    textPosition.x = gLines[lineIdx].lineStartPointX + 10
    textPosition.y = gLines[lineIdx].lineStartPointy + 10
    return textPosition
}

function IncreaseOrDecreaseByFactor(factor, el) {
    if (el.classList.contains('decrease')) return -factor
    else return factor
}

function CheckGMemeLinesNumb() {
    if (gMeme.lines.length <= 0) return null
    else return gMeme.lines.length
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

