export function setSidebar(mainElm) {

    let create = new sidebarBuilder();

    let sidebar = create.createSidebar();

    mainElm.appendChild(sidebar);

    let sidebarButton = document.getElementById("sidebarButton");

    sidebarButton.addEventListener('click', () => {
        console.log('toggling sidebar');
    
        let sidebarContent = document.getElementById("sidebarContent");
    
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
        
    });
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
            boxShadow: '0px 3px lightgrey',
        });

        // Main sidebar button
        const sidebarButton = document.createElement('button');
        sidebarButton.id = 'sidebarButton';
        sidebarButton.draggable = true;

        const buttonImage = document.createElement('img');
        buttonImage.src = '../resources/hamburger';
        buttonImage.style.maxWidth = '15px';
        sidebarButton.appendChild(buttonImage);

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

export class PopupModal {
    createPopup() {
        let body = document.getElementsByTagName('body')[0];

        let popupDiv = document.createElement('div');
        popupDiv.setAttribute('class', 'popupDiv');
        
        let headerDiv = document.createElement('div');
        headerDiv.setAttribute('ID', 'pHeaderDiv');

        let exitButton = document.createElement('button');
        exitButton.setAttribute('ID', 'pExitButton');
        exitButton.textContent = 'X';

        body.appendChild(popupDiv);
        popupDiv.appendChild(headerDiv);
        headerDiv.appendChild(exitButton);

        this.includeCSSFile();
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
}