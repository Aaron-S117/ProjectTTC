var popupOpen = false;

export function setSidebar(mainElm) {

    let create = new sidebarBuilder();

    let sidebar = create.createSidebar();

    mainElm.appendChild(sidebar);

    let sidebarButton = document.getElementById("sidebarButton");

    sidebarButton.addEventListener('click', () => {
        console.log('toggling sidebar');
    
        this.toggleSidebar();
    });
}

// used to toggle sidebar open and closed states
export function toggleSidebar() {
    let sidebarContent = document.getElementById("sidebarContent");
    let sidebar = document.getElementById("sidebar");
    let sidebarButton = document.getElementById("sidebarButton");

    if (sidebarOpen === false) {
        sidebarContent.setAttribute("class", "sidebarContentsOpened");
        sidebar.classList.toggle('active');
        sidebarButton.classList.toggle('active')
        sidebarOpen = true;
    }
    else if (sidebarOpen === true) {
        sidebarContent.setAttribute("class", "sidebarContentsClosed");
        sidebar.classList.toggle('active');
        sidebarButton.classList.toggle('active')
        sidebarOpen = false;
    }
}

class sidebarBuilder {

    createSidebar() {

          // Main sidebar container
        const sidebar = document.createElement('div');
        sidebar.id = 'sidebar';
        sidebar.className = 'sidebar';

        // Sidebar button div
        const sidebarButtonDiv = document.createElement('div');
        sidebarButtonDiv.className = 'sidebarButtonDiv';

        // Button wrapper with border, margin, etc.
        const buttonWrapper = document.createElement('div');
        Object.assign(buttonWrapper.style, {
            border: '2px solid grey',
            margin: '6px',
            borderRadius: '20px',
            //boxShadow: '0px 3px lightgrey',
        });

        // Main sidebar button
        const sidebarButton = document.createElement('button');
        sidebarButton.id = 'sidebarButton';
        sidebarButton.textContent = '='
        sidebarButton.draggable = true;

        buttonWrapper.appendChild(sidebarButton);
        sidebarButtonDiv.appendChild(buttonWrapper);

        // Sidebar content container
        const sidebarContent = document.createElement('div');
        sidebarContent.id = 'sidebarContent';
        sidebarContent.className = 'sidebarContentsClosed';

        // Combine all
        sidebar.appendChild(sidebarButtonDiv);
        sidebar.appendChild(sidebarContent);

        return sidebar;
    }
}

export class DataGrid {

}

export class DataView {

}

// Allows you to create an element that hovers over your cursor 
export class hoverInfo {

    // // Example using this 
    // card.addEventListener('mouseover', (event) => {
    //     if (entered === false) {
    //         entered = true;
    //         hoverTimeout = setTimeout(() => {
    //             DI.createHover(event, 'Collection Card. Click to see collection items, Drag left to edit, and drag right to delete.');
    //         }, 2000);
    //     }
    // })

    // card.addEventListener('mouseleave', (event) => {
    //     entered = false;

    //     clearTimeout(hoverTimeout);

    //     let infodiv = document.getElementById('infoDiv');
    //     if (infodiv) {
    //         infodiv.remove(); 
    //     }
    // })

    createHover(event, infoText) {
        let infoDiv = document.createElement('div');
        infoDiv.id = 'infoDiv';
        
        let infoTextElm = document.createElement('p');
        infoTextElm.textContent = infoText;
        infoTextElm.id = 'infoText';

        infoDiv.appendChild(infoTextElm);

        let body = document.getElementsByTagName('body')[0];

        body.appendChild(infoDiv);
        
        this.setPosition(infoDiv, event);

        return 'Info Created'
    }   
    setPosition(hoverelm, event) {
        let leftPos = event.clientX;
        let topPos = event.clientY;

        console.log(leftPos, topPos);

        hoverelm.style = `top: ${topPos}; left: ${leftPos}`;
    }

}

export class PopupModal {
    createPopup() {
    
        if(popupOpen === true) {
            console.log('Popup already open!');

            let popupDiv = document.getElementById('popupDiv');
            console.log(popupDiv);

            return popupDiv;
        }
        else {

            let body = document.getElementsByTagName('body')[0];

            let popupDiv = document.createElement('div');
            popupDiv.setAttribute('class', 'popupDiv');
            popupDiv.setAttribute('ID', 'popupDiv');
            
            let headerDiv = document.createElement('div');
            headerDiv.setAttribute('ID', 'pHeaderDiv');
    
            let title = document.createElement('h5');
            title.setAttribute('ID', 'pTitle');
    
            let exitButton = document.createElement('button');
            exitButton.setAttribute('ID', 'pExitButton');
            exitButton.textContent = 'X';

            let contentDiv = document.createElement('div');
            contentDiv.setAttribute('ID', 'pContentDiv');
    
            body.appendChild(popupDiv);
            popupDiv.appendChild(headerDiv);
            headerDiv.appendChild(title);
            headerDiv.appendChild(exitButton);
            popupDiv.appendChild(contentDiv);
    
            popupOpen = true;
    
            exitButton.addEventListener('click', () => {
                this.exitPopup(popupDiv);
                popupOpen = false;
            })

            this.includeCSSFile();

            return popupDiv;
        }
    }
    includeCSSFile() {
        let widgetFile = document.getElementById('widgetID');
        if (!widgetFile) {
            let head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = './widgets.css';
            link.id = 'widgetID';

            head.appendChild(link);
        }
        else {
            console.log('widget file already loaded');
        }
    }
    exitPopup(mainElm) {
        mainElm.outerHTML = '';
    }
    markClosePopup() {
        popupOpen = false;
    }
}