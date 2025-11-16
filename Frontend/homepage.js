let widgets = await import('./usefulWidgets.js');
let DDImp = await import('./DragnDrop.js');

const baseURL = 'http://localhost:3000/'

// Takes use to homepage
export async function homepageHandler() {
    let homePageHandler = new homepage;
    await homePageHandler.createHomePage();
}

// Take user to latest stored collection
export async function collectionpageHandler() {
    let collectionID = localStorage.getItem('currentCollectionID');
    let collectionpageHandler = new itemPage;
    await collectionpageHandler.createItempage(collectionID);
}

class homepage {

    createLogout() {

        let elmc = new elmCreator;

        let body = document.getElementsByTagName('body')[0];

        let logOut = elmc.createElem(body, 'logOut', 'empty', 'button');

        logOut.textContent = 'SIGN OUT';

        logOut.addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
        })

    }

    async createHomePage() {

        let elmC = new elmCreator;

        let usernameStored = localStorage.getItem('username');

        // Retrieve and clear body tag
        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';

        // Creates log out button
        this.createLogout();

        // creating sidebar on homepage
        let sidebar = widgets.setSidebar(body);
        
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

        let optionsButton = elmC.createOptions(mainDiv);

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
    async createItempage(id) {

        let elmC = new elmCreator;
        let collectionID = id;

        let body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';

        let home = new homepage;
        // Creates log out button
        home.createLogout();
        
        // create the main div where all the collection cards will be stored
        let mainDiv = elmC.createElem(body, 'homepageDiv', 'empty', 'div');
        mainDiv.classList.add('mainDiv');

        let HeaderDiv = elmC.createElem(mainDiv, 'headerDiv', 'empty', 'div');

        let backButton = elmC.createElem(HeaderDiv, 'itemBack', 'empty', 'button');
        backButton.textContent = '< Back';

        backButton.addEventListener('click', () => {
            let homepageSetup = new homepage;

            homepageSetup.createHomePage();
            localStorage.setItem('currentCollectionID', '');
            localStorage.setItem('page', 'Homepage');
        })

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
        let UWP = new widgets.PopupModal;

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
        let itemDescBox = elmC.createElem(itemDescDiv, 'newItemDescBox', 'empty', 'textarea');

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
        let itemPopup = new widgets.PopupModal;

        let popup = await itemPopup.createPopup(itemTitle);

        let popupHeader = document.getElementById('pHeaderDiv');
        let pTitle = document.getElementById('pTitle');

        let contentDiv = document.getElementById('pContentDiv');
        let itemDescDiv = elmc.createElem(contentDiv, 'itemDescDiv', 'empty', 'div');

        let getItem = await this.getItemDetails(ID);
        let itemDesc = elmc.createElem(itemDescDiv, 'itemDesc', 'empty', 'h4');

        let itemDescStart = '';

        if (getItem === undefined) {
            itemDesc.textContent = 'Content Not Found';
        }
        else {
            itemDesc.textContent = getItem.ItemValue;
            itemDescStart = getItem.ItemValue
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

        // Change value in DOM when user types in textarea
        itemTextArea.addEventListener('input', (event)=> {
            itemTextArea.textContent = event.target.value
        })

        footerSaveBut.addEventListener('click', () => {
            let checkDesc = document.getElementById('itemTextArea').textContent;

            if (itemDescStart === checkDesc) {
                // Placeholder alert
                alert("Information hasn't changed");
            }
            else {
                // Columns being edited to pass onto the API for saving
                let columns = {
                    "ItemValue": checkDesc
                }

                // API call for editing the items, uses the item ID, and any columns we're passing into it
                let editItem = this.editItemCall(ID, columns)

                popup.remove();
                itemPopup.markClosePopup();
            }
        });

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

        if (!response.ok) {
            console.error('Issue getting item data');
        }
        else {
            // return array for the first value
            let responseArray = await response.json();
            return responseArray[0];
        }
    }

    // Call item edit API to change data in database
    async editItemCall(ID, columns) {
        let payload = {
            "ID": ID,
            "Columns" : columns
        }

        let response = await fetch(baseURL + 'editItem', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if(!response.ok) {
            console.error('Issue editing data');
        }
        else {
            let responseArray = await response.json();
            return responseArray;
        }
    }
}

class elmCreator {
    createElem(mainElm, id, type, element, prepend) {

        const elem = document.createElement(element);
        if (type === 'empty'){
            // console.log('not setting type attribute')
        }
        else {
            elem.setAttribute('type', type);
        }

        elem.setAttribute('id', id);
   
        if (prepend === true) {
            mainElm.prepend(elem);
        }
        else {
            mainElm.appendChild(elem);
        }

        return elem;
    }

    async createCard(mainElm, cardTitle, collectionID) {
        let DI = new widgets.hoverInfo;

        let cardSection = document.createElement('div');
        cardSection.setAttribute('id', 'set' + collectionID);
        cardSection.setAttribute('class', 'cardSection');
        mainElm.appendChild(cardSection);

        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('draggable', 'true');
        card.textContent = cardTitle;
        card.setAttribute('id', collectionID);
        cardSection.appendChild(card);

        let itemPageCreator = new itemPage;
        let entered = false;
        let hoverTimeout;
        
        card.addEventListener('click', () => {

            if (card.classList.contains('editing') === true) {
                // do nothing, but allow user to edit
            }
            else {
                
                localStorage.setItem('currentCollectionID', collectionID);
                localStorage.setItem('page', 'Collection');
                itemPageCreator.createItempage(collectionID);

                clearTimeout(hoverTimeout);
            }
        });

        card.addEventListener('mouseover', (event) => {
            if (entered === false && card.classList.contains('editing') === false) {
                entered = true;
                hoverTimeout = setTimeout(() => {
                    DI.createHover(event, 'Collection Card. Click to see collection items, drag left to edit, and drag right to delete.');
                }, 1000);
            }
        })

        card.addEventListener('mouseleave', () => {
            entered = false;

            // stops mouseover event listener from executing
            clearTimeout(hoverTimeout);

            let infodiv = document.getElementById('infoDiv');
            if (infodiv) {
                infodiv.remove(); 
            }
        })

        // used to prevent creation of multiple selection divs
        let selectionCreated = false;

        card.addEventListener('drag', (event) => {
            // stops mouseover event listener from executing
            clearTimeout(hoverTimeout);
            
            if (selectionCreated === false) {
                selectionCreated = true;
 
                this.createSelectionDrops(cardSection, event.target, cardTitle);
            } 
            else if (selectionCreated === true) {
                // make sure nothing else is created
            }

        }) 

        card.addEventListener('dragend', () => {
            // stops mouseover event listener from executing
            clearTimeout(hoverTimeout);
            this.deleteSelectionDrops();
            selectionCreated = false;
        })
    }

    // Add selection elements to edit or delete card
    createSelectionDrops(mainElm, card, cardTitle) {

        let editDiv = this.createElem(mainElm, 'editDiv', 'empty', 'div', true);
        editDiv.textContent = 'Edit Div';
        editDiv.setAttribute('draggable', 'true');

        let deleteDiv = this.createElem(mainElm, 'deleteDiv', 'empty', 'div');
        deleteDiv.textContent = 'Delete Div';
        deleteDiv.setAttribute('draggable', 'true');

        editDiv.addEventListener('dragover', (event) => {
            // prevent default to allow drop
            event.preventDefault();
        })

        editDiv.addEventListener('drop', (event) => {
            // prevent default to allow drop
            event.preventDefault();
            console.log('editing card');

            let textValue = card.textContent;
            card.textContent = '';

            let buttonDiv = this.createElem(card, 'editButtonDiv', 'empty', 'div');

            let stopEditButton = this.createElem(buttonDiv, 'stopEdit', 'empty', 'button');
            stopEditButton.textContent = '-';

            let submitEditButton = this.createElem(buttonDiv, 'submitEdit', 'empty', 'button');
            submitEditButton.textContent = '+';

            let editTextArea = this.createElem(card, 'editTA', 'empty', 'textarea');
            editTextArea.value = textValue;

            stopEditButton.addEventListener('click', () => {
                buttonDiv.remove();
                editTextArea.remove();

                card.textContent = cardTitle;
            })

            //todo submitEditButton.addEventListner('click', () => {}

            card.classList.add('editing');
            
        })

        editDiv.addEventListener('dragenter', () => {
            editDiv.classList.toggle('selectionHover');
        })

        editDiv.addEventListener('dragleave', () => {
            editDiv.classList.toggle('selectionHover');
        })

        deleteDiv.addEventListener('dragover', (event) => {
            // prevent default to allow drop
            event.preventDefault();
        })

        deleteDiv.addEventListener('dragenter', () => {
            deleteDiv.classList.toggle('selectionHover');
        })

        deleteDiv.addEventListener('dragleave', () => {
            deleteDiv.classList.toggle('selectionHover');
        })

        deleteDiv.addEventListener('drop', async (event) => {
            // prevent default action (open as a link for some elements)
            event.preventDefault();

            console.log(card.id);

            let reqBody = {
                ID: card.id
            }

            console.log(reqBody.ID);

            let response = await fetch(baseURL + 'remove/collection', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            })

            if (!response){
                console.log('Issue Deleting Collection')
            }
            else {
                console.log('deleting collection');
                card.remove();
            }
        })

    }

    // Remove selection elements
    deleteSelectionDrops() {
        let editDiv = document.getElementById('editDiv');
        let deleteDiv = document.getElementById('deleteDiv');

        editDiv.remove();
        deleteDiv.remove();
    }

    async createItemCard(mainElm, itemTitle, cardNumber, ID) {

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

    createOptions(mainElm) {
        let optionBtn = this.createElem(mainElm, 'optionsBtn', 'empty', 'button');
        optionBtn.textContent = 'Options';

        optionBtn.addEventListener('click', ()=> {
            widgets.toggleSidebar();
        })

        return optionBtn;
    }
}