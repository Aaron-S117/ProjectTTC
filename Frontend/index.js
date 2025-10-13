let page = '';

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
        HandleHomepage();
    }
    else {
    }
}

async function HandleHomepage() {
    console.log('This is the homepage');

    const homepageImport = await import ('./homepage.js');
    homepageImport.homepageHandler();

    page = 'HomePage';
}

const CARButton = document.getElementById("CreateAccountLink");
CARButton.addEventListener('click', HandleAccountCreation);

const loginButton = document.getElementById("SignIn");
loginButton.addEventListener('click', HandleLogin);
