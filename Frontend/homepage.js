const baseURL = 'http://localhost:3000/'

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

        let createCB = this.createElem(mainDiv, 'createCB', 'empty', 'button');
        createCB.textContent = '+ Create collection';

        createCB.addEventListner('click', this.createCollection)

        // let card1 = this.createCard(mainDiv);
        // let card2 = this.createCard(mainDiv);
        // let card3 = this.createCard(mainDiv);
    }

    createCollection = async () => {
        // Fetch the CollectionCreation API
        const response = await fetch(baseURL + 'createCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postdata)
        });
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

    createCard(mainElm) {
        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.textContent = 'Test Card';
        mainElm.appendChild(card);
    }
}