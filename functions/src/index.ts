import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    console.log("Hello!");
    response.send("Hello from FireCast!");
});

export const getNamiEnterprise = functions.https.onRequest((request, response) => {
    admin.firestore().collection('enterprises').doc('08da15xigruqP56uJF9N').get()
        .then(snapshot => {
            const data = snapshot.data();
            response.send(data);
        })
        .catch(error => {
            // Handle the error
            console.log(error);
            response.status(500).send(error);
        });
});

export const getListItems = functions.https.onRequest((request, response) => {
    admin.firestore().collection('items').get().then(function (querySnapshot) {
        querySnapshot.forEach(function(doc){
            console.log(doc.id, ' => ', doc.data());
        });
    }).catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
});