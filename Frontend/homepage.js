export function homepageHandler() {
    let homePageHandler = new homepage;
    homePageHandler.createHomePage();
}

class homepage {
    createHomePage() {
        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';
    }
}