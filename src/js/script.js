let submenu = document.querySelector('.submenu');

// document.querySelector('.title').addEventListener('click', () => {
	
// });
 



document.getElementById('nav').onclick = function(event) {
  let target = event.target;

  if(target.className == 'title_heading') {
    if(submenu.style.display == '') {
    open();
    } else if (submenu.style.display = 'flex'){
      close();
    }
  }
  function open() {
    submenu.style.display = 'flex';
  }

  function close() {
    submenu.style.display = '';
  }
}


let sliderIndex = 1;
showSlide(sliderIndex);

function plusSlides(n) {

    showSlide(sliderIndex +=n);
}


function showSlide(n){
    let slides = document.getElementsByClassName('mySlides');

    for(let i=0; i<slides.length; i++) {
        slides[i].style.display = 'none';
    }

    if(sliderIndex > slides.length) {
        sliderIndex = 1;
    }

    if(sliderIndex < 1) {
        sliderIndex = slides.length;
    }

    slides[sliderIndex-1].style.display = 'grid'; 
}


