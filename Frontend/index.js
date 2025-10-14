const baseURL = 'http://localhost:3000/'

function verifyLogin() {
    const loginDiv = document.getElementById('login');

    return 'test';
}

async function HandleAccountCreation() {
    const loginDiv = document.getElementById('login');
    loginDiv.remove();

    const loginImport = await import('./login.js');
    loginImport.createAccountRegPage();

    page = 'CreateAccount';
}

async function HandleLogin() {

    const loginImport = await import('./login.js');
    let verify = await loginImport.loginWorkflow();

    if (verify === true) {

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
            Password: Password,
            login: false
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

        localStorage.setItem('userID', result);
        localStorage.setItem('lastLogin', Date.now());

        // Create Homepage
        await HandleHomepage();
    }
    else {
        alert('Incorrect Username or Password');
    }
}

async function HandleHomepage() {
    console.log('This is the homepage');

    const homepageImport = await import ('./homepage.js');
    homepageImport.homepageHandler();

    localStorage.setItem('page', 'Homepage');
}

const CARButton = document.getElementById("CreateAccountLink");
CARButton.addEventListener('click', HandleAccountCreation);

const loginButton = document.getElementById("SignIn");
loginButton.addEventListener('click', HandleLogin);
