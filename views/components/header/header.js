if(document.documentElement.classList && document.querySelectorAll){
    const header = document.querySelector(".header--container")
    const nav = document.querySelector(".navigation")
    const button = document.querySelector(".header--container button")
    const body = document.querySelector("body")
    const gradient = document.querySelector(".gradient")

    nav.classList.add('nav--hide')
    
    nav.classList.add('nav--progressive')
    button.addEventListener('click',function(){
        gradient.classList.toggle('gradient--show')
        nav.classList.toggle('nav--hide')
        body.classList.toggle('overflow--hidden')

        if (button.innerHTML == "☰") {
          button.innerHTML = "╳";
      } else {
          button.innerHTML = "☰";
      }
    })

    gradient.addEventListener('click', function(){
        nav.classList.toggle('nav--hide')
        body.classList.toggle('overflow--hidden')
        gradient.classList.toggle('gradient--show')

        if (button.innerHTML == "☰") {
          button.innerHTML = "╳";
      } else {
          button.innerHTML = "☰";
      }
    })
}