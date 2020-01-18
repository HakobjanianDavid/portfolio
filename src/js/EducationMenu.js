let submenu = document.querySelector('.submenu');

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
};