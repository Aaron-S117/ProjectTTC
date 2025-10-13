const baseURL = 'http://localhost:3000/'

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
export async function loginWorkflow() {

    const usernameBox = document.getElementById("Username");
    const passwordBox = document.getElementById("Password");

    // Checks if either Username of Password textbox values are empty
    if (!usernameBox.value || !passwordBox.value) {
        console.log('Insufficient Information');
        return false;
    }

    let Username = usernameBox.value;
    let Password = passwordBox.value;

    let postdata = {
        Username: Username,
        Password: Password
    }

    // Fetch the UserLogin API
    const response = await fetch(baseURL + 'UserLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata)
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    let result = await response.json();

    if (result === 'Account Match'){
        return true;
    }
    else {
        return false;
    }
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

    SubmitAccount = async () => {

        const usernameBox = document.getElementById("usernameBox");
        const passwordBox = document.getElementById("passwordBox");

            // Checks if either Username of Password textbox values are empty
        if (!usernameBox.value || !passwordBox.value) {
            console.log('Insufficient Information');
            return false;
        }

        let Username = usernameBox.value;
        let Password = passwordBox.value;

        let postdata = {
            Username: Username,
            Password: Password
        }

            // Fetch the UserLogin API
        const response = await fetch(baseURL + 'UserCreation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postdata)
        });

        if(response.ok === false) {
            console.log('Issue Creating Account');
            alert('Issue Creating Account');

            return false;
        }
        else if (response.ok === true) {
            console.log('Account Created');
            location.reload();

            alert('Account Created, please login!');
            return true;
        }
        else {
            //todo
        }
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

        let submitRes = createButton.addEventListener('click', this.SubmitAccount);

    }

}



