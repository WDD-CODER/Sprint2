'use strict';


function onInit() {

}

function onChooseImg(el) {
    // document.querySelector('.main-gallery').classList.add('hidden');
    // document.querySelector('.meme-editor').classList.remove('hidden');
    document.querySelectorAll('.container').forEach(el => {
        if (el.classList.contains('hidden')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })
}