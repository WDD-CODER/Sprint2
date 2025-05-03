'use strict';
const MEME_STORAGE_KEY = 'memeDB'
const IMG_STORAGE_KEY = 'imgDB'
const gRandomTexts = [
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

var gImgs = loadGImgsFromStorage(IMG_STORAGE_KEY) || []
var gSavedMems = loadFromStorage(MEME_STORAGE_KEY) || []
var gMeme
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

// Lists

function getGSavedMems() {
    return gSavedMems
}

function GetLastLine() {
    return gMeme.lines[gMeme.lines.length - 1]
}


function getAccurateBorderLinePosition(line) {
    // להוסיף את הטיפול במידה והטקסט הוא באות גדולה!
    const curLine = line || gMeme.lines[gMeme.selectedLineIdx]
    const elCanvasContainerWidth = document.querySelector('.canvas-container.meme').offsetWidth
    const centerOfCanvas = elCanvasContainerWidth / 2
    const marginInline = 35 * 2
    const lineWidthFallback = elCanvasContainerWidth - marginInline;
    
    // starts with left
    const lineWidth = curLine.textWidth + 15 || lineWidthFallback
    const textSize = curLine.size
    const lineHeight = textSize + 4
    const textAlign = curLine.textAlign || ''

    let linePositionX = curLine.textPositionX - 5
    let linePositionY = curLine.textPositionY - 2.5

    if (textAlign === 'center')  linePositionX = centerOfCanvas - lineWidth / 2 
    else if (textAlign === "right") {
        linePositionX = curLine.textPositionX + 5 - lineWidth
    }
    const accurateLinePositions = { linePositionX, linePositionY, lineWidth, lineHeight, textSize }
    return accurateLinePositions
}
function getAccurateUnderLinePosition(line) {
    const { linePositionX, linePositionY, lineWidth, lineHeight, textSize } = getAccurateBorderLinePosition(line)
    let strokeStartPointX = linePositionX
    let strokeStartPointY = linePositionY + textSize + 4
    let strokeEndPointX = lineWidth
    var UnderLinePosition = { strokeStartPointX, strokeStartPointY, strokeEndPointX }
    return UnderLinePosition
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
            if (line.textAlign) {
            var isClicked 
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
// function getLineByIdX(lineIdx) {
//     return gMeme.lines[lineIdx]
// }
function getMemeById(memeId) {
    return gSavedMems.find(meme => meme.selectedImgId === memeId)
}

// Create


function _createMemeImg(el, onReady) {    //First load the main image and then create the object
    var MemeImg = {}
    const img = new Image()
    img.onload = () => {
        MemeImg = {
            id: el.id,
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

// Reade

function loadGImgsFromStorage(key) {
    const savedImgs = loadFromStorage(key)
    if (savedImgs) savedImgs.forEach(gImg => {
        const img = new Image();
        img.src = gImg.url;
        gImg.img = img;
    })
    return savedImgs
}




// Update
function setGMeme(meme) {
    return gMeme = meme
}

function saveMemeToLocalStorage(meme) {
    const curId = meme.selectedImgId
    const alreadyExists = gSavedMems.findIndex(meme => meme.selectedImgId === curId)
    if (alreadyExists === -1) gSavedMems.push(meme)
        saveToStorage(MEME_STORAGE_KEY, gSavedMems)
}

function saveImgToLocalStorage(img) {
    const curId = img.id
    const alreadyExists = gImgs.findIndex(img => img.id === curId)
    if (alreadyExists === -1) gImgs.push(img)
        saveToStorage(IMG_STORAGE_KEY, gImgs)
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

function setImgObject(el, onReady) {
    _createMemeImg(el, onReady)
}

function createNewLine() {
    const lastLine = GetLastLine();
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

function setRandomTextLines(numOfLines) {
    gMeme.lines = []
    for (let i = 0; i < numOfLines; i++) {
        createNewLine()
    }
    gMeme.lines.forEach(line => line.txt = getRandomText())
}

function setLineTxt(txt) {
    return gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setGMemeUnderline() {
    gMeme.lines[gMeme.selectedLineIdx].underLine = !gMeme.lines[gMeme.selectedLineIdx].underLine;
    return gMeme.lines[gMeme.selectedLineIdx].underLine;
}

function setFontFamily(value) {
    return gMeme.lines.forEach(line =>line.fontFamily = value)
}

function setTextWidth(width) {
    return gMeme.lines[gMeme.selectedLineIdx].textWidth = width
}

function setFontSize(change) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += change
    gCtx.font = `${line.size}px Arial`
    return gCtx.font
}

function saveTextColor(color) {
    return gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setLinePosition(change) {
   return gMeme.lines[gMeme.selectedLineIdx].textPositionY += change
}
// Delete

function DeleteLineFromGMeme() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx--
}


// Helpers

function IncreaseOrDecreaseByFactor(factor, el) {
    if (el.classList.contains('decrease')) return -factor
    else return factor
}

function getGMemeLinesNum() {
    if (gMeme.lines.length <= 0) return null
    else return gMeme.lines.length
}


