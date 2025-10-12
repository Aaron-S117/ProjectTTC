
export function createAccountRegPage() {

    const mainElement = document.createElement('div')
    mainElement.setAttribute('id', 'CARMain');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(mainElement);


    let accountCreation = new createAccount;
    accountCreation.carFormCreation(mainElement);

}

class createAccount{

    createElem(mainElm, id, type, element) {

        const elem = document.createElement(element);
        elem.setAttribute('id', id);
        if (type === 'empty'){
            console.log('not setting type attribute')
        }
        else {
            elem.setAttribute('type', type);
        }
   
        mainElm.appendChild(elem);
    
    }
    
    carFormCreation(mainElm) {

        // Calls to create textboxes and buttons
        let usernameTBox = this.createElem(mainElm, 'username', 'text', 'input')
        let paswordTBox = this.createElem(mainElm, 'password', 'text', 'input')
        let createButton = this.createElem(mainElm, 'createButton', 'empty', 'button')

    }
    
}



