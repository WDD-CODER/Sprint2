'use strict';


// Lists
function onInitGallery() {
    gElCanvas = document.querySelector('.Search-canvas');
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
}

function renderGallery() {
    const imgs = getGImgs();
    for (let i = 0; i < 4; i++) {
        document.querySelector('.gallery-pics').innerHTML += `
                         <figure>
                         <figcaption class="img-name"></figcaption>
                         <img onclick="onImgSelect(this)" id="${i + 1}" src="style/assets/img/meme-imgs-(square)/${i + 1}.jpg" alt="img">
                         </figure>
        `;
    }

}

function SwitchBetweenMainContainers() {
    document.querySelectorAll('.container').forEach(el => {
        if (el.classList.contains('hidden')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })
}


// Create

function onImgSelect(el) {
    SwitchBetweenMainContainers()
    onIniMemeEdit()
    setImg(el)
}

// Update

