const baseURL = 'http://localhost:3000/'

export async function homepageHandler() {
    let homePageHandler = new homepage;
    await homePageHandler.createHomePage();
}

class homepage {

    async createHomePage() {

        let elmC = new elmCreator;

        let usernameStored = localStorage.getItem('username');

        // Retrieve and clear body tag
        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';

        // import sidebar file for later appending
        let widgets = await import('./usefulWidgets.js');
        let sidebar = new widgets.setSidebar(body);
        
        // create the main div where all the collection cards will be stored
        let mainDiv = elmC.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');

        // create homepage title
        let homepageTitle = elmC.createElem(mainDiv, 'hpTitle', 'empty', 'h2');
        homepageTitle.textContent = usernameStored + `'s Homepage`;

        // Generate create collection button
        let createCB = elmC.createElem(mainDiv, 'createCB', 'empty', 'button');
        createCB.textContent = '+ Create collection';

        // Generate create collection textbox and event handler for appending collection to database
        let createCTBX = elmC.createElem(mainDiv, 'collectionBox', 'text', 'input');
        createCB.addEventListener('click', this.createCollection)

        let retrieveCollections = this.retrieveCollection();
    }

    // Gets array of collections based off the user's ID
    retrieveCollection = async () => {

        const userID = localStorage.getItem('userID');

        const response = await fetch(baseURL + 'getCollections?userID=' + userID, {
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

            let elmC = new elmCreator;

            const homepageDiv = document.getElementById('homepageDiv');

            let data = await response.json();

            for (const collection of data) {
                let colCard = elmC.createCard(homepageDiv, collection.collectionTitle);
            }
            
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
}

class itemPage {
    createItempage(event) {

        let elmC = new elmCreator;

        let body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';

        // create the main div where all the collection cards will be stored
        let mainDiv = elmC.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');

        let pageTitle = elmC.createElem(mainDiv, 'itemsTitle', 'empty', 'h2');
        pageTitle.textContent = 'Collection Items';
        mainDiv.appendChild(pageTitle);

        elmC.createItemCard(mainDiv, 'Test Item'); 

    }
    retrieveCollectionItem(){
        // todo 
    }
}

class elmCreator {
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

        let itemPageCreator = new itemPage;

        card.addEventListener('click', (event) => {
            itemPageCreator.createItempage(event);
        });
    }

    createItemCard(mainElm, itemTitle) {
        let doubleCard = document.createElement('div');
        doubleCard.setAttribute('class', 'doubleCard');
        mainElm.appendChild(doubleCard);

        let firstCard = document.createElement('div');
        firstCard.textContent = 'Test Item 1';

        let secondCard = document.createElement('div');
        secondCard.textContent = 'Test Item 2';

        doubleCard.appendChild(firstCard);
        doubleCard.appendChild(secondCard);
    }
}