'use strict';

// function getRandomImgFromGallery() {
//     const elGImgs = document.querySelectorAll('.gallery-pics img');
//     elGImgs[getRandomInt(0, elGImgs.length - 1)]
//     console.log("🚀 ~ getRandomImgFromGallery ~ elGImgs:", elGImgs)
//     var MemeImg = {}
//     const img = new Image()
//     img.onload = () => {
//         MemeImg = {
//             id: +elGImgs.id,
//             url: elGImgs.src,
//             keywords: [],
//             img: img
//         } 
//     }
//     return MemeImg
// }  


function getRandomImgFromGallery() {
    const elGImgs = document.querySelectorAll('.gallery-pics img');
    return elGImgs[getRandomInt(0, elGImgs.length - 1)]
}

// function getRandomImgFromGallery() {
//     const elGImgs = document.querySelectorAll('.gallery-pics img');
//     const el = elGImgs[getRandomInt(0, elGImgs.length - 1)]
//     console.log('🎲 Random image DOM element picked:', el)
//     return el
// }


function getRandomText() {
    return gRandomTexts[getRandomInt(0, gRandomTexts.length - 1)]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
