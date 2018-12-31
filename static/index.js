document.addEventListener('DOMContentLoaded', main);

function main() {
    // Check localStorage for User
    if (localStorage.getItem('user')) {
        const visible = document.querySelector('div[name="withUser"]');
        const invisible = document.querySelector('div[name="getUser"]');
        visible.querySelector("#name").innerHTML = "Welcome " + localStorage.getItem('user') + "!";
        visible.classList.remove('disappear');
        invisible.classList.add('disappear');
    }

    // Restore channel
    if (localStorage.getItem('channel')) {
        const check = document.querySelector('a[href="/channel/' + localStorage.getItem('channel') + ']');
        if (check) {
            location.replace('channel/' + localStorage.getItem('channel'));
        }
    }

    // Submit User Form
    const userButton = document.querySelector('#user');
    userButton.addEventListener('click', function () {
        const user = document.querySelector("input[name='user']").value;
        localStorage.setItem('user', user);
        main();
    });

    // Create Channel Form
    document.querySelector("#channel-form").onsubmit = () => {
        // Initialize request
        const request = new XMLHttpRequest();
        const channel = document.querySelector("input[name='channel']").value;
        request.open('POST', '/add');

        // Add chat channels
        request.onload = () => {
            const data = JSON.parse(request.responseText);
            if (data.success) {
                // Create elements
                const addElement = document.createElement('li');
                const addLink = document.createElement('a');
                const addText = document.createTextNode(data.channel);
                // Append elements
                addLink.setAttribute('href', '/channel/' + data.channel);
                addLink.appendChild(addText);
                addElement.appendChild(addLink);
                document.querySelector("#channel-list").appendChild(addElement);
            } else {
                // Unsuccesful channel
                alert("The request was unsuccesful, please try adding another channel (minimum 4 letters long). If a channel already exists with the same name it will deny your request");
            }
        };
        // Attach data to request
        const data = new FormData();
        data.append('channel', channel);
        // Send request
        request.send(data);
        return false;
    };
}
