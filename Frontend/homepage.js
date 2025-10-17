const baseURL = 'http://localhost:3000/'

export async function homepageHandler() {
    let homePageHandler = new homepage;
    await homePageHandler.createHomePage();
}

class homepage {

    async createHomePage() {

        let usernameStored = localStorage.getItem('username');

        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';

        let widgets = await import('./usefulWidgets.js');

        let sidebar = new widgets.setSidebar(body);
        
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

    createCard(mainElm, cardTitle) {
        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.textContent = cardTitle;
        mainElm.appendChild(card);
    }
}