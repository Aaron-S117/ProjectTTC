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


class DataGrid {

}

class DataView {

}