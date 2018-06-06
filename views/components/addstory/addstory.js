function toggleToolButton() {
    const addStoryButtons = document.querySelectorAll('.button--regular--hidden')
    const plusButton = document.querySelector('.button--show')
    if (!addStoryButtons) return

    function toggleButtons(addStoryButtons){
        addStoryButtons.classList.toggle('button--regular--hidden')
    }

    function buttonEventlistener(event) {
        addStoryButtons.forEach(toggleButtons)
        if (plusButton.classList.contains('button--show--rotate')) {
            plusButton.classList.remove('button--show--rotate')
            plusButton.classList.add('button--show')
        } else {
            plusButton.classList.remove('button--show')
            plusButton.classList.add('button--show--rotate')
        }
    }

    plusButton.addEventListener('click', buttonEventlistener)
}

export default toggleToolButton
