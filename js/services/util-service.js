'use strict';

function getRandomImgFromGallery() {
    const elGImgs = document.querySelectorAll('.gallery-pics img');
    return elGImgs[getRandomInt(0, elGImgs.length - 1)]
}

function getRandomText() {
    return gRandomTexts[getRandomInt(0, gRandomTexts.length - 1)]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
