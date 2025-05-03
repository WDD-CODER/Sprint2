'use strict';



function onInitSavedMemeGallery() {

}
renderSavedMemeGallery()
function renderSavedMemeGallery() {
    document.querySelector('.meme.gallery-pics').innerHTML = ''
    getGSavedMems().forEach(meme => {
        document.querySelector('.meme.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onEditMeme(this)" id="${meme.selectedImgId}" src="${meme.imgUrl}" alt="img">
                         </figure>
        `;
    })
}

function onEditMeme(el) {
    setGMeme(getMemeById(el.id))
    console.log('gMeme', gMeme);
    showContainer('meme')
    onIniMemeEdit()
    renderGMeme()
}


