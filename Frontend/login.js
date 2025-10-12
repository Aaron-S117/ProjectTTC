
export function createAccountRegPage() {
    console.log("Test Import");

    const mainElement = document.createElement('div')
    mainElement.setAttribute('id', 'CARMain');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(mainElement);


    carFormCreation(mainElement);

}

function carFormCreation(mainElm) {

    const username = document.createElement('input');
    username.setAttribute('id', 'username');
    username.setAttribute('type', 'text');
    mainElm.appendChild(username);

    const password = document.createElement('input');
    password.setAttribute('id', 'password');
    password.setAttribute('type', 'text');
    mainElm.appendChild(password);

    const createButton = document.createElement('button');
    createButton.setAttribute('id', 'createButton');
    mainElm.appendChild(createButton);
}