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
                let colCard = elmC.createCard(homepageDiv, collection.collectionTitle, collection.ID);
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

            let elmc = new elmCreator;

            let resJson = await response.json()
            
            elmc.createCard(homepageDiv, title.value, resJson.ID);
        }
        else {
            // todo 
        }
    }
}

class itemPage {
    async createItempage(mainElm) {

        let elmC = new elmCreator;
        let collectionID = mainElm.id;

        let body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';
        
        // create the main div where all the collection cards will be stored
        let mainDiv = elmC.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');

        let HeaderDiv = elmC.createElem(mainDiv, 'headerDiv', 'empty', 'div');

        let pageTitle = elmC.createElem(HeaderDiv, 'itemsTitle', 'empty', 'h2');
        pageTitle.textContent = 'Collection Items';

        let createItemButton = elmC.createElem(HeaderDiv, 'createItemButton', 'empty', 'button');
        createItemButton.textContent = '+ Create Item';

        createItemButton.addEventListener('click', this.createItemForm);

        let CI = await this.retrieveCollectionItems(collectionID);
        let CIJson = await CI.json()

        let cardNumber = 1;

        for (const item of CIJson) {

            var currentMainDiv; 

            if (cardNumber === 1){
                let doubleCard = document.createElement('div');
                doubleCard.setAttribute('class', 'doubleCard');

                await elmC.createItemCard(doubleCard, item.ItemName, 1, item.ID); 
                cardNumber = 2;

                mainDiv.appendChild(doubleCard);
                currentMainDiv = doubleCard;
            }
            else if (cardNumber === 2) {
                await elmC.createItemCard(currentMainDiv, item.ItemName, 2, item.ID); 
                cardNumber = 1;
            }
            else {
                console.log('issue with creating card');
            }
            
        }
    }
    async retrieveCollectionItems(collectionID){
        const response = await fetch(baseURL + `getCollectionItems?collectionID=${collectionID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (!response.ok) {
            console.log('Unable to retrieve Collection Items');
        }
        else {
            return response;
        }
    }
    async createItemForm() {
        let elmC = new elmCreator;

        let UW = await import('./usefulWidgets.js');
        let UWP = new UW.PopupModal;

        let popDiv = UWP.createPopup();
        let contentDiv = document.getElementById('pContentDiv');

        let popupTitle = document.getElementById('pTitle');
        popupTitle.textContent = 'Creating Item...';

        // Item Name Section
        let itemNameDiv = elmC.createElem(contentDiv, 'newItemNameDiv', 'empty', 'div');
        let itemNameText = elmC.createElem(itemNameDiv, 'newItemText', 'empty', 'p');
        itemNameText.textContent = 'Item Name';
        itemNameText.setAttribute('class', 'formText1');
        let itemNameBox = elmC.createElem(itemNameDiv, 'newItemNameBox', 'text', 'input');

        // Item Description Section
        let itemDescDiv = elmC.createElem(contentDiv, 'newItemDescDiv', 'empty', 'div');
        let itemDescText = elmC.createElem(itemDescDiv, 'newItemDescText', 'empty', 'p');
        itemDescText.textContent = 'Item Description';
        itemDescText.setAttribute('class', 'formText1');
        let itemDescBox = elmC.createElem(itemDescDiv, 'newItemDescBox', '', 'textarea');

        let footerDiv = elmC.createElem(popDiv, 'newItemfooterDiv', 'empty', 'div');
        let footerSaveBut = elmC.createElem(footerDiv, 'pSaveButton', 'empty', 'button');
        footerSaveBut.textContent = 'Save';

        // for creating item in database and creating a new card on the UI
        footerSaveBut.addEventListener('click', async () => {

            let itemTitleBox = document.getElementById('newItemNameBox');
            let itemTitle = itemTitleBox.value;

            let itemDescBox = document.getElementById('newItemDescBox');
            let itemDesc = itemDescBox.value;

            let collectionID = localStorage.getItem("currentCollectionID");

            let itemPM = new itemPage;

            let creatingItem = await itemPM.createItem(itemTitle, itemDesc, collectionID);

            let doubleCardDivs = document.getElementsByClassName('doubleCard');
            let lastDiv = doubleCardDivs[doubleCardDivs.length - 1];

            if (!lastDiv) {
                console.log('No Div to speak of');

                let doubleCard = document.createElement('div');
                doubleCard.setAttribute('class', 'doubleCard');

                let newCard = await elmC.createItemCard(doubleCard, itemTitle, 1, creatingItem[0].ID); 

                let mainDiv = document.getElementById('homepageDiv');
                mainDiv.appendChild(doubleCard);
            }
            else if (lastDiv.children.length === 2) {

                let doubleCard = document.createElement('div');
                doubleCard.setAttribute('class', 'doubleCard');

                let newCard = await elmC.createItemCard(doubleCard, itemTitle, 1, creatingItem[0].ID); 

                let mainDiv = document.getElementById('homepageDiv');
                mainDiv.appendChild(doubleCard);
            }
            else if (lastDiv.children.length === 1) {
                let newCard = await elmC.createItemCard(lastDiv, itemTitle, 2, creatingItem[0].ID); 
            }
            else {
                console.log('No Div to speak of');
            }

            popDiv.remove();
            UWP.markClosePopup();
        })
    }

    // API call for creating item in database
    async createItem(itemTitle, itemValue, collectionID) {

        let postData = {
            itemName: itemTitle,
            itemValue: itemValue,
            collectionID: collectionID
        }

        const response = await fetch(baseURL + 'createItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })

        if(!response.ok) {
            console.error('Issue with creating item: ' + response);
        }
        else {
            let resJSON = response.json();
            return resJSON; 
        }
    }

    async showItemDetails(itemTitle, DD, ID) {

        let elmc = new elmCreator;
        let UW = await import('./usefulWidgets.js');
        let itemPopup = new UW.PopupModal;

        let popup = await itemPopup.createPopup(itemTitle);

        let popupHeader = document.getElementById('pHeaderDiv');
        let pTitle = document.getElementById('pTitle');

        let contentDiv = document.getElementById('pContentDiv');
        let itemDescDiv = elmc.createElem(contentDiv, 'itemDescDiv', 'empty', 'div');

        let getItem = await this.getItemDetails(ID);
        let itemDesc = elmc.createElem(itemDescDiv, 'itemDesc', 'empty', 'h4');

        if (getItem === undefined) {
            itemDesc.textContent = 'Content Not Found';
        }
        else {
            itemDesc.textContent = getItem.ItemValue;
            pTitle.textContent = itemTitle || undefined;
        }

        let textAreaDiv = elmc.createElem(contentDiv, 'textAreaDiv', 'empty', 'div');
        textAreaDiv.classList.add('hide');

        let exitTextArea = elmc.createElem(textAreaDiv, 'exitTA', 'empty', 'button');
        exitTextArea.classList.add('hide');
        exitTextArea.textContent = '-';
        
        let itemTextArea = elmc.createElem(textAreaDiv, 'itemTextArea', 'empty', 'textarea');
        itemTextArea.classList.add('itemTextArea');
        itemTextArea.textContent = getItem.ItemValue || undefined
    
        let footerDiv = elmc.createElem(popup, 'newItemfooterDiv', 'empty', 'div');
        let footerSaveBut = elmc.createElem(footerDiv, 'pSaveButton', 'empty', 'button');
        footerSaveBut.classList.add('hide');
        footerSaveBut.textContent = 'Save';

        // Allow popup to be dragged around
        DD.DragwithFullElm(popup, popupHeader);

        let hoverTimeout;

        itemDescDiv.addEventListener('mouseenter', () => {

            clearTimeout(hoverTimeout); 

                hoverTimeout = setTimeout(() => {
                    itemDescDiv.classList.add('entered');
                }, 1000);
        })

        itemDescDiv.addEventListener('mouseleave', () => {
            // Clear the timeout when the mouse leaves to prevent the class from being added
            clearTimeout(hoverTimeout);
            
            // Immediately remove the class
            itemDescDiv.classList.remove('entered');
        });

        itemDescDiv.addEventListener('click', () => {
            itemDescDiv.classList.add('hide');
            textAreaDiv.classList.remove('hide');
            exitTextArea.classList.remove('hide');
            itemTextArea.classList.remove('hide');
            footerSaveBut.classList.remove('hide');
        })

        exitTextArea.addEventListener('click', () => {
            itemDescDiv.classList.remove('hide');
            textAreaDiv.classList.add('hide');
            exitTextArea.classList.add('hide');
            itemTextArea.classList.add('hide');
            footerSaveBut.classList.add('hide');
        })
    }

    async getItemDetails(ID) {
        let response = await fetch(baseURL + 'getItem?itemID=' + ID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(response);

        if (!response.ok) {
            console.error('Issue getting item data');
        }
        else {
            // return array for the first value
            let responseArray = await response.json()
            return responseArray[0];
        }
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

    async createCard(mainElm, cardTitle, collectionID) {
        let UWImp = await import('./usefulWidgets.js');
        let DI = new UWImp.hoverInfo;

        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('draggable', 'true');
        card.textContent = cardTitle;
        card.setAttribute('id', collectionID);
        mainElm.appendChild(card);

        let itemPageCreator = new itemPage;
        let entered = false;
        
        card.addEventListener('click', () => {
            localStorage.setItem('currentCollectionID', collectionID);
            itemPageCreator.createItempage(card);
        });

        card.addEventListener('mouseover', (event) => {
            if (entered === false) {
                entered = true;
                setTimeout(() => {
                    DI.createHover(event, 'Collection Card. Click to see collection items, Drag left to edit, and drag right to delete.');
                }, 2000);
            }
            else if (entered === true) {
                // already entered, don't do anything, until leave
            }
        })

        card.addEventListener('mouseleave', (event) => {
            entered = false;
            let infodiv = document.getElementById('infoDiv');
            infodiv.remove(); 
        })
    }

    async createItemCard(mainElm, itemTitle, cardNumber, ID) {

        let DDImp = await import('./DragnDrop.js');

        let DD = new DDImp.Draggin;
        let IP = new itemPage;

        if (cardNumber === 1) {

            let firstCard = document.createElement('div');
            firstCard.textContent = itemTitle;
            firstCard.setAttribute('class', 'card1');
            firstCard.setAttribute('ID', ID);

            mainElm.appendChild(firstCard); 

            firstCard.addEventListener('click', () => {
                IP.showItemDetails(itemTitle, DD, ID);
            });
        }
        else if (cardNumber === 2) {
            let secondCard = document.createElement('div');
            secondCard.textContent = itemTitle;
            secondCard.setAttribute('class', 'card2');
            secondCard.setAttribute('ID', ID);

            mainElm.appendChild(secondCard);

            secondCard.addEventListener('click', () => {
                IP.showItemDetails(itemTitle, DD, ID);
            });
        }
        else {
            // todo
        }
    }
}