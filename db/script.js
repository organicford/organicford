const params = new URLSearchParams(window.location.search);

const apiKey = params.get("apiKey");
const databaseURL = params.get("databaseURL");
const email = params.get("email");
const password = params.get("password");

const form = document.getElementById('form');

const inputs = {
    section: document.querySelector('#section input'),
    row: document.querySelector('#row input'),
    run: document.querySelector('#run input'),
    standby: document.querySelector('#standby input'),
    off: document.querySelector('#off input')
};

const shownTexts = {
    section: document.querySelector('#section span'),
    row: document.querySelector('#row span'),
    run: document.querySelector('#run span'),
    standby: document.querySelector('#standby span'),
    off: document.querySelector('#off span')
};

function setTicket(database) {
    database.ref("seats").limitToLast(1).get().then(snapshot => {
        if (snapshot.exists()) {
            Object.values(snapshot.val()).reverse().forEach(item => {
                inputs.section.value = item.section;
                inputs.row.value = item.row;
                if (inputs[item.mode]) {
                    inputs[item.mode].checked = true;
                }

                shownTexts.section.innerText = `${item.section}`
                shownTexts.row.innerText = `${item.row}`;
                shownTexts.run.style.color = item.mode === 'RUN' ? 'green' : 'inherit';
                shownTexts.standby.style.color = item.mode === 'STANDBY' ? 'green' : 'inherit';
                shownTexts.off.style.color = item.mode === 'OFF' ? 'green' : 'inherit';
            });
        }
    }).catch(error => {
        console.log(error);
    });
}

if (apiKey && databaseURL && email && password) {
    const app = firebase.initializeApp({ apiKey, databaseURL });
    const auth = app.auth();
    auth.signInWithEmailAndPassword(email, password).then(() => {
        const database = app.database();

        setTicket(database);
        form.onsubmit = e => {
            e.preventDefault();

            const formData = new FormData(form);
            const sectionValue = formData.get('section');
            const rowValue = formData.get('row');
            const modeValue = formData.get('mode');

            if (!sectionValue || !rowValue) {
                alert('Please fill out all fields!');
                return;
            }

            const confirmed = confirm(`Confirm Sec ${sectionValue}, Row ${rowValue}, Mode ${modeValue}?`);
            
            if (confirmed) {
                database.ref('seats').remove();
                database.ref('seats').push().set({
                    section: sectionValue,
                    row: rowValue,
                    mode: modeValue
                });
                setTicket(database);
            }
        };
    });
}
