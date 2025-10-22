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
    async createItempage(event) {

        let elmC = new elmCreator;

        let body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';

        // create the main div where all the collection cards will be stored
        let mainDiv = elmC.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');

        let pageTitle = elmC.createElem(mainDiv, 'itemsTitle', 'empty', 'h2');
        pageTitle.textContent = 'Collection Items';

        let createItemButton = elmC.createElem(mainDiv, 'createItemButton', 'empty', 'button');
        createItemButton.textContent = 'Create Item';

        createItemButton.addEventListener('click', this.createItemForm);

        await elmC.createItemCard(mainDiv, 'Test Item'); 

    }
    retrieveCollectionItem(){
        // todo 
    }
    async createItemForm() {
        let elmC = new elmCreator;

        let UW = await import('./usefulWidgets.js');
        let UWP = new UW.PopupModal;

        let popDiv = UWP.createPopup();

        let popupTitle = document.getElementById('pTitle');
        popupTitle.textContent = 'Creating Item...';

        // Item Name Section
        let itemNameDiv = elmC.createElem(popDiv, 'newItemNameDiv', 'empty', 'div');
        let itemNameText = elmC.createElem(itemNameDiv, 'newItemText', 'empty', 'p');
        itemNameText.textContent = 'Item Name';
        itemNameText.setAttribute('class', 'formText1');
        let itemNameBox = elmC.createElem(itemNameDiv, 'newItemNameBox', 'text', 'input');

        // Item Description Section
        let itemDescDiv = elmC.createElem(popDiv, 'newItemDescDiv', 'empty', 'div');
        let itemDescText = elmC.createElem(itemDescDiv, 'newItemDescText', 'empty', 'p');
        itemDescText.textContent = 'Item Description';
        itemDescText.setAttribute('class', 'formText1');
        let itemDescBox = elmC.createElem(itemDescDiv, 'newItemDescBox', '', 'textarea');

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

        let itemPageCreator = new itemPage;

        card.addEventListener('click', (event) => {
            itemPageCreator.createItempage(event);
        });
    }

    async createItemCard(mainElm, itemTitle) {
        let counter = 0;

        while (counter < 50) {
            let doubleCard = document.createElement('div');
            doubleCard.setAttribute('class', 'doubleCard');
            mainElm.appendChild(doubleCard);
            
            let firstCard = document.createElement('div');
            firstCard.textContent = 'Test Item 1: ' + counter;
            firstCard.setAttribute('class', 'card1');
    
            let secondCard = document.createElement('div');
            secondCard.textContent = 'Test Item 2: ' + counter;
            secondCard.setAttribute('class', 'card2');

            doubleCard.appendChild(firstCard);
            doubleCard.appendChild(secondCard);

            let UW = await import('./usefulWidgets.js');

            let itemPopup = new UW.PopupModal;

            firstCard.addEventListener('click', (event) => {
                itemPopup.createPopup();
            });

            counter++;
        }

        // let firstCard = document.createElement('div');
        // firstCard.textContent = 'Test Item 1';
        // firstCard.setAttribute('class', 'card1');

        // let secondCard = document.createElement('div');
        // secondCard.textContent = 'Test Item 2';
        // secondCard.setAttribute('class', 'card2');

        // doubleCard.appendChild(firstCard);
        // doubleCard.appendChild(secondCard);
    }
}