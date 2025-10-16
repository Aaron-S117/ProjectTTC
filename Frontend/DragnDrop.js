class Draggin {
    
    startDrageEvent(ele) {
        ele.addEventListener('dragstart', (event) => {
            // todo
        })

        ele.addEventListener('dragover', (event) => {
            // todo
        })
    }

    setPosition(elm, clientX, clientY, attempt) {
        elm.style.position = 'absolute';
        elm.style.top = clientY - 300;
        elm.style.left = clientX - 1000;
    }

}