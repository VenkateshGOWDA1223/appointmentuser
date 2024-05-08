import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBdqxEkfCXyTxr2NqwjnHCOafkutV4zI2A",
  authDomain: "doctorappointment-d7cd8.firebaseapp.com",
  databaseURL: "https://doctorappointment-d7cd8-default-rtdb.firebaseio.com",
  projectId: "doctorappointment-d7cd8",
  storageBucket: "doctorappointment-d7cd8.appspot.com",
  messagingSenderId: "980504198472",
  appId: "1:980504198472:web:e8cde298133274b7cf477d"
}; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('appointmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const datetime = document.getElementById('datetime').value;

    const q = query(collection(db, "appointments"), where("datetime", "==", datetime));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        addDoc(collection(db, "appointments"), {
            name: name,
            email: email,
            datetime: datetime,
            status: 'pending'
        }).then(() => {
            alert('Appointment booked!');
            document.getElementById('appointmentForm').reset();
        }).catch(error => {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment');
        });
    } else {
        alert('This slot is already booked. Please choose another time.');
    }
});

window.checkStatus = async function() {
    const email = document.getElementById('statusEmail').value;
    const statusResult = document.getElementById('statusResult');
    const q = query(collection(db, "appointments"), where("email", "==", email));
    try {
        const querySnapshot = await getDocs(q);
        statusResult.innerHTML = '';
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric' };
                const formattedTime = new Date(data.datetime).toLocaleString('en-IN', options);
                statusResult.innerHTML += `<p class="${data.status}"><strong>Date and Time:</strong> ${formattedTime}, <strong>Status:</strong> ${data.status}</p>`;
            });
        } else {
            statusResult.innerHTML = '<p>No appointments found for this email.</p>';
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
        statusResult.innerHTML = '<p>Error fetching status. Please try again.</p>';
    }
};
