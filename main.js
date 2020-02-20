// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAoQxn-9BoUEtsmmldl4LP3_2mGNGMt6R0",
    authDomain: "upfim-test.firebaseapp.com",
    databaseURL: "https://upfim-test.firebaseio.com",
    projectId: "upfim-test",
    storageBucket: "upfim-test.appspot.com",
    messagingSenderId: "552941794469",
    appId: "1:552941794469:web:5611458d93a7fb7c0e894c"
};
firebase.initializeApp(firebaseConfig); // Initialize Firebase

const db = firebase.firestore(); //Creating instance of Firebase Firestore Database
const saveButton = document.querySelector('#submit'); // Reference of the button
const messageInput = document.querySelector('#message'); // Reference of the input
const messagesContainer = document.querySelector('#messages');


// This function allow save a message into the database, with the datetime of submit.
function saveMessage(message) {
    db
    .collection('messages') //In which collection the message will be saved
    .add({ //Method add() create a new document into the collection
        message,
        timestamp: firebase.firestore.Timestamp.now()
    })
    .then(function() { // .then() is when the promise is resolved
        console.log("Mensaje agregado a la DB")
        messageInput.value = '' // Clear input after the message is saved in the DB
    })
    .catch(function(error) { // If the promise fails (rejected)
        console.log("Algo falló al guardar mensaje")
        console.log("Error", error)
    });
}

function showMessages(messages) { // This function format the messages in HTML and show its in the DOM.
    let innerHTML = ''; // Empty string
    messages.forEach(function(message) {  // Iterate the messages
        innerHTML += `
            <div class="message-container">
                <p>${message.message}</p>
                <span>${message.timestamp.toDate().toLocaleString()}</span>
                <br>
            </div>
        `; //For each message we build a div with a <p> and a <span>.
    })
    messagesContainer.innerHTML = innerHTML; //Adding the formatted messages in the div
}

function getMessages() { //This function get all the messages into the collection
    db
    .collection('messages')
    .onSnapshot(function(querySnapshot) { // With onSnapshot method, we get the messages, and also, each time that the DB is updated (i.e. a new message is added), this function detect this (realtime ;))
        let messages = []; // Create a dynamic empty array to store messages
        querySnapshot.forEach(function(message) { //Loop the messages
            messages.push(message.data()) //With .data() we transform the Firebase data to a JS data
        })
        showMessages(messages); //Call showMessages function passing the messages as parameter
    })
}

document.addEventListener('DOMContentLoaded', getMessages());

// Adding click listener to the button
saveButton.addEventListener('click', function() {
    saveMessage(messageInput.value)
}) // Call saveMessage function, passing the message (value on the input) as parameter to save it

