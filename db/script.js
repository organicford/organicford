const params = new URLSearchParams(window.location.search);

const apiKey = params.get("apiKey");
const databaseURL = params.get("databaseURL");
const email = params.get("email");
const password = params.get("password");

function setTicket(database) {
    const section = document.querySelector('#section span');
    const row = document.querySelector('#row span');
    database.ref("seats").limitToLast(1).get().then(snapshot => {
        if (snapshot.exists()) {
            Object.values(snapshot.val()).reverse().forEach(item => {
                section.innerText = `${item.section}`
                row.innerText = `${item.row}`;
            });
        } else {
            section.innerText = `${item.section}`
            row.innerText = `${item.row}`
        }
    }).catch(error => {
        console.log(error);
    });
}

if (apiKey && databaseURL && email && password) {
    const section = document.querySelector('#section input');
    const row = document.querySelector('#row input');

    const app = firebase.initializeApp({ apiKey, databaseURL });
    const auth = app.auth();
    auth.signInWithEmailAndPassword(email, password).then(() => {
        const database = app.database();

        setTicket(database);
        document.getElementById('form').onsubmit = e => {
            e.preventDefault();

            if (!section.value || !row.value) {
                alert('Please fill out all fields!');
                return;
            }

            database.ref('seats').remove();
            database.ref('seats').push().set({
                section: section.value,
                row: row.value
            });
            setTicket(database);
        };
    });
}