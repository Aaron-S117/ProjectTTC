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
}

const CARButton = document.getElementById("CreateAccountLink");
CARButton.addEventListener('click', HandleAccountCreation);
