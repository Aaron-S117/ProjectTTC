export function homepageHandler() {
    let homePageHandler = new homepage;
    homePageHandler.createHomePage();
}

class homepage {

    createHomePage() {
        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';
        
        let mainDiv = this.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');
        let homepageTitle = this.createElem(mainDiv, 'hpTitle', 'empty', 'h2');
        homepageTitle.textContent = 'Homepage';
    }

    createElem(mainElm, id, type, element) {

        const elem = document.createElement(element);
        if (type === 'empty'){
            // console.log('not setting type attribute')
        }
        else {
            elem.setAttribute('type', type);
        }
        elem.setAttribute('id', id);
   
        mainElm.appendChild(elem);
    
        return elem;
    }
}