let page = '';

async function handleLogin() {
    const loginModule = await import('./login.js');
    console.log(loginModule.verifyLogin());
}

handleLogin();