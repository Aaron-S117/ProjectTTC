const loginImport = await import('./login.js');
const homepageImport = await import ('./homepage.js');

const baseURL = 'http://localhost:3000/'

let storedUser = localStorage.getItem('userID');
let storedPage = localStorage.getItem('page');
let sidebarOpen = false;

if (storedUser != ''){
    switch(storedPage) {
        case '':
            console.log('No page, going to login');
            break;
        case 'Homepage':
            console.log('Going to homepage');
            handleHomepage();
            break;
        case 'Collection':
            console.log('Going to Collection');
            let collectionID = localStorage.getItem('currentCollectionID');
            if (collectionID === null || collectionID === ''){
                console.log('Collection not found, going to homepage');
                break;
            }
            else {
                handleCollectionPage();
                break;
            }
        default:
            console.log('Nothing of importance happened');
    }
}   
else {
    console.log('continue with life');
}

function verifyLogin() {
    const loginDiv = document.getElementById('login');

    return 'test';
}

function HandleAccountCreation() {
    const loginDiv = document.getElementById('login');
    loginDiv.remove();

    loginImport.createAccountRegPage();

    page = 'CreateAccount';
}

async function HandleLogin() {

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

        localStorage.setItem('username', Username);
        localStorage.setItem('userID', result);
        localStorage.setItem('lastLogin', Date.now());

        // Create Homepage
        await handleHomepage();
    }
    else {
        alert('Incorrect Username or Password');
    }
}

async function handleHomepage() {
    console.log('This is the homepage');

    await homepageImport.homepageHandler();

    localStorage.setItem('page', 'Homepage');
}

async function handleCollectionPage() {
    await homepageImport.collectionpageHandler();

    localStorage.setItem('page', 'Collection');
}

const CARButton = document.getElementById("CreateAccountLink");
CARButton.addEventListener('click', HandleAccountCreation);

const loginButton = document.getElementById("SignIn");
loginButton.addEventListener('click', HandleLogin);
