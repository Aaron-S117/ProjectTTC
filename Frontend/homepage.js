const baseURL = 'http://localhost:3000/'

export function homepageHandler() {
    let homePageHandler = new homepage;
    homePageHandler.createHomePage();
}

class homepage {

    createHomePage() {

        let usernameStored = localStorage.getItem('username');

        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';
        
        let mainDiv = this.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');

        let homepageTitle = this.createElem(mainDiv, 'hpTitle', 'empty', 'h2');
        homepageTitle.textContent = usernameStored + `'s Homepage`;

        let createCB = this.createElem(mainDiv, 'createCB', 'empty', 'button');
        createCB.textContent = '+ Create collection';

        let createCTBX = this.createElem(mainDiv, 'collectionBox', 'text', 'input');

        createCB.addEventListener('click', this.createCollection)

        let retrieveCollections = this.retrieveCollection();
    }

    retrieveCollection = async () => {

        const userID = localStorage.getItem('userID');

        const response = await fetch(baseURL + 'retrieveCollection?userID=' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            console.log('Collection Retrieval Failed');
        }
        else if (response.ok) {
            console.log('Collection Retrieval Suceeded');

            const homepageDiv = document.getElementById('homepageDiv');

            let data = await response.json();

            for (const collection of data) {
                let colCard = this.createCard(homepageDiv, collection.collectionTitle);
            }
            
            // this.createCard(homepageDiv, title.value);
        }
        else {
            // todo 
        }
    }

    createCollection = async () => {
        
        const title = document.getElementById('collectionBox');
        const userID = localStorage.getItem('userID');

        let postdata = {
            user: userID,
            title: title.value
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

    setPosition(elm, clientX, clientY, attempt) {
        elm.style.position = 'absolute';
        elm.style.top = clientY - 300;
        elm.style.left = clientX - 1000;
    }

    createCard = async (mainElm, cardTitle) => {
        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('draggable', 'true');
        card.textContent = cardTitle;
        mainElm.appendChild(card);

        let DDImp = await import('./DragnDrop.js');
        let DD = new DDImp.Draggin;

        DD.DragwithFullElm(card);

        // card.addEventListener("dragend", (event) => {
        //     console.log('drag ended');
        //     card.remove();
        // })
    }
}