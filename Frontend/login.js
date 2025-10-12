
export function createAccountRegPage() {

    const mainElement = document.createElement('div')
    mainElement.setAttribute('id', 'CARMain');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(mainElement);


    let accountCreation = new createAccount;
    accountCreation.carFormCreation(mainElement);

}


// Class for setting up the account creation page
class createAccount{

    createElem(mainElm, id, type, element) {

        const elem = document.createElement(element);
        if (type === 'empty'){
            console.log('not setting type attribute')
        }
        else {
            elem.setAttribute('type', type);
        }
        elem.setAttribute('id', id);
   
        mainElm.appendChild(elem);
    
        return elem;
    }
    
    carFormCreation(mainElm) {


        let title = this.createElem(mainElm, 'titleText', 'empty', 'h2');
        title.textContent = 'Creating Account...';
        let usernameTxt = this.createElem(mainElm, 'usernameText', 'empty', 'p');
        usernameTxt.textContent = 'Username: ';
        let passwordTxt = this.createElem(mainElm, 'passwordText', 'empty', 'p');
        passwordTxt.textContent = 'Password: ';


        // Calls to create textboxes and buttons
        let usernameTBox = this.createElem(usernameTxt, 'usernameBox', 'text', 'input')
        let paswordTBox = this.createElem(passwordTxt, 'passwordBox', 'text', 'input')
        let createButton = this.createElem(mainElm, 'createButton', 'empty', 'button')
        createButton.textContent = 'Submit Account';

    }
    
}



