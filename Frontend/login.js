baseURL = 'http://localhost:3000/'

// Handles account creation page
export function createAccountRegPage() {

    const mainElement = document.createElement('div');
    mainElement.setAttribute('id', 'CARMain');
    mainElement.classList.add('mainDiv');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(mainElement);


    let accountCreation = new createAccount;
    accountCreation.carFormCreation(mainElement);

}

// Handle login workflow including validation, and singing users in
export function loginWorkflow() {

    const usernameBox = document.getElementById("Username");
    const passwordBox = document.getElementById("Password");

    if (!Username.value || !Password.value) {
        console.log('Insufficient Information');

    }
    let Username = usernameBox.value;
    let Password = passwordBox.value;

    postdata = {
        Username: Username,
        Password: Password
    }

    const loginData = fetch(baseURL + 'UserLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.blob();
    })

    console.log('Username: ' + Username + '. Password: ' + Password); 
}

class loginHelper {
    loginValidation() {
        // todo
        console.log('stuff');
    }


}


// Class for setting up the account creation page
class createAccount {

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



