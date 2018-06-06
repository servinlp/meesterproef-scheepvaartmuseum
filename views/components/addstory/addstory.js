function toggleToolButton() {
    const addStoryButtons = document.querySelectorAll('.button--regular--hidden')
    const plusButton = document.querySelector('.button--show')
    if (!addStoryButtons) return

    // function toggleButtons(){
    //     addStoryButtons.classList.toggle('button--regular--hidden')
    // }
    // function buttonEventlistener() {
    //     addStoryButtons.addEventListener('click', toggleButtons)
    // }
    //
    // addStoryButtons.forEach(buttonEventlistener)

    function toggleButtons(event){

        console.log(event);
    }

    function buttonEventlistener(event) {
        addStoryButtons.forEach(function(addStoryButtons) {
            addStoryButtons.classList.toggle('button--regular--hidden')
        })
    }

    plusButton.addEventListener('click', buttonEventlistener)
}

export default toggleToolButton
