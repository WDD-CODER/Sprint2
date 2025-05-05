'use strict';


function onInitSavedMemeGallery() {
    renderSavedMemeGallery()
}

function renderSavedMemeGallery() {
    document.querySelector('.meme.gallery-pics').innerHTML = ''
    getGSavedMems().forEach(meme => {
        document.querySelector('.meme.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onEditMeme(this)" id="${meme.id}" src="${meme.imgUrl}" alt="img">
                         </figure>
        `;
    })
}

function onEditMeme(el) {
    var res = getMemeById(el.id)
    setGMeme(res)
    showContainer('meme')
    onIniMemeEdit()
    renderGMeme()
}


