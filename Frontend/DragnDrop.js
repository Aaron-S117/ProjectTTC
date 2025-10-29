export class Draggin {
    
    DragwithFullElm(ele, dragEle) {
        dragEle.addEventListener('dragstart', (event) => {
            // event.dataTransfer.setData("text/plain", ele.textcontent);
            // event.dataTransfer.setData("text/html", ele.outerHTML);

            let fakeDrag = document.createElement("span");
            fakeDrag.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');

            event.dataTransfer.setDragImage(fakeDrag, 0, 0);

            let attempt = 0;

            dragEle.addEventListener("drag", (dragEvent) => {

                if (attempt === 5) {
                    const clientX = dragEvent.clientX;
                    const clientY = dragEvent.clientY;

                    this.setPosition(ele, clientX, clientY, attempt);
                    attempt = 0;
                } 
                else {
                    attempt = attempt + 1;
                }
            })     
        })

        ele.addEventListener('dragover', (event) => {
            // todo
        })
    }

    // mainDiv.addEventListener("dragover", (event) => {
    //     event.preventDefault();

    //     if (mainDiv.classList.contains('divDrop') == false) {
    //         mainDiv.classList.toggle('divDrop');
    //     }
    //     else {
    //         //todo
    //     }
    // })  

    // mainDiv.addEventListener("drop", (event) => {
    //     event.preventDefault();

    //     mainDiv.classList.toggle('divDrop');

    //     let dropped = event.dataTransfer.getData("text/html");
        
    //     let droppedParsed = new DOMParser().parseFromString(dropped, 'text/html');
    //     let droppedElement = droppedParsed.firstChild.childNodes[1].firstChild

    //     this.createCard(mainDiv, droppedElement.textContent);
        

    //     console.log('element dropped');
    // })


    setPosition(elm, clientX, clientY, attempt) {
        elm.style.position = 'fixed';
        elm.style.top = clientY - 10;
        elm.style.left = clientX - 100;
    }

}