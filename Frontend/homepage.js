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

        let createCTBX = this.createElem(mainDiv, 'collectionBox', 'text', 'input');

        createCB.addEventListener('click', this.createCollection)

        // let card1 = this.createCard(mainDiv);
        // let card2 = this.createCard(mainDiv);
        // let card3 = this.createCard(mainDiv);
    }

    createCollection = async () => {
        
        const title = document.getElementById('collectionBox');

        let postdata = {
            user: '86',
            title: title
        }

        // Fetch the CollectionCreation API
        const response = await fetch(baseURL + 'createCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postdata)
        });

        if (!response.ok) {
            console.log('Collection Creation Failed');
        }
        else if (response.ok) {
            console.log('Collection Creation Suceeded');

            const homepageDiv = document.getElementById('homepageDiv');
            
            this.createCard(homepageDiv, title.value);
        }
        else {
            // todo 
        }
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

    createCard(mainElm, cardTitle) {
        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.textContent = cardTitle;
        mainElm.appendChild(card);
    }
}