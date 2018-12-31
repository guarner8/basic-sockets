document.addEventListener('DOMContentLoaded', main);

function main() {
    const channel = document.querySelector('#channel').innerHTML;
    // Redirect if no chosen user
    if (!localStorage.getItem('user')) {
        location.replace("index.html");
    }

    // Connect to websocket
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
        // Each button should emit a "submit vote" event
        document.querySelectorAll('button').forEach(button => {
            button.onclick = () => {
                // Parse message
                const message = document.querySelector("input[name='message']").value;
                const date = new Date();
                const jsonMsg = {
                    "message": message,
                    "timestamp": date.toUTCString(),
                    "user": localStorage.getItem('user'),
                    "channel": channel
                };

                // Send message to server
                socket.emit('submit message', jsonMsg);
            };
        });
    });

    // Display sent message from any user in channel
    socket.on('new message', data => {
        const message =  data.message;
        const timestamp = data.timestamp;
        const user = data.user;

        const toAdd = document.createElement('p');
        const text = document.createTextNode(user +": " + message);
        const dateSpan = document.createElement('span');
        const dateText = document.createTextNode(timestamp);

        dateSpan.classList.add('msgSpan');
        toAdd.appendChild(text);
        dateSpan.appendChild(dateText);
        toAdd.appendChild(dateSpan);

        // Add message to Dom
        document.querySelector('.message-container').appendChild(toAdd);
    });


    // Remember the closed window
    window.addEventListener('unload', function () {
        window.localStorage.setItem('channel', channel)
    });
}
