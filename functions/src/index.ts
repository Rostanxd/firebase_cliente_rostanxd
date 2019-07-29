import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const updateCategories = functions.https.onRequest((request, response) => {
    console.log('Updating categories');

    const queryRef = admin.firestore().collection('categories')
        .where("enterpriseId", "==", "08da15xigruqP56uJF9N");

    queryRef.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.update({"enterprise": {"id": "08da15xigruqP56uJF9N", "name": "ñami ñami"}})
                    .then(function () {
                        console.log('Category Updated: ' + doc.data()['name']);
                    }).catch(error => {
                    console.log('Error updating category: ' + doc.data()['name'] + error)
                });
            });
            response.send('ok!');
        }).catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
});

export const udpateEnterpriseUser = functions.https.onRequest((request, response) => {
    const queryRef = admin.firestore().collection('enterprises_users')
        .where("enterpriseId", "==", "08da15xigruqP56uJF9N");

    queryRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (document) {
            let roleData: DocumentSnapshot;
            let userData: DocumentSnapshot;

            //  Getting the role data
            await admin.firestore().collection('roles').doc(document.data()['roleId']).get()
                .then(function (roleDoc) {
                    roleData = roleDoc;
                }).catch(rolesError => {
                    console.log(rolesError);
                    response.status(500).send(rolesError);
                });

            //  Getting the user data
            await admin.firestore().collection('users').doc(document.data()['userId']).get()
                .then(function (userDoc) {
                    userData = userDoc;
                }).catch(userError => {
                    console.log(userError);
                    response.status(500).send(userError);
                });

            await document.ref.update({
                "enterprise": {
                    "id": "08da15xigruqP56uJF9N",
                    "name": "ñami ñami"
                },
                "role": {
                    "id": document.data()['roleId'],
                    "name": roleData.data()['name'],
                },
                "user": {
                    "id": document.data()['userId'],
                    "firstName": userData.data()['firstName'],
                    "lastName": userData.data()['lastName'],
                },
            }).then(function () {
                console.log('Enterprise-user updated: ' + document.ref.id);
                response.send('ok!');
            }).catch(error => {
                console.log(error);
                response.status(500).send(error);
            });
        })
    }).catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
});

export const updateItems = functions.https.onRequest((request, response) => {
    let categoryData: DocumentSnapshot;
    const queryRef = admin.firestore().collection('items')
        .where("enterpriseId", "==", "08da15xigruqP56uJF9N");

    queryRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (document) {
            console.log('Updating item: ' + document.data()['name']);

            // Getting Category
            await admin.firestore().collection('categories').doc(document.data()['categoryId']).get()
                .then(function (categoryDoc) {
                    categoryData = categoryDoc;
                }).catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });

            await document.ref.update({
                "enterprise": {
                    "id": "08da15xigruqP56uJF9N",
                    "name": "ñami ñami"
                },
                "measure": {
                    "id": "ywYKZXuIb03dWcUwQ4Cm",
                    "name": "Unidad",
                },
                "category": {
                    "id": document.data()['categoryId'],
                    "name": categoryData.data()['name'],
                },
            }).then(function () {
                console.log('Item updated: ' + document.data()['name']);
            }).catch(error => {
                console.log(error);
                response.status(500).send(error);
            });
        })
    }).catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
    response.send('ok!');
});

export const updateDocument = functions.https.onRequest((request, response) => {
    let customerData: DocumentSnapshot;
    let queryRefDetail;

    const queryRef = admin.firestore().collection('documents')
        .where("branchId", "==", "CTsXjc21QbJuvqbeyTyd");

    queryRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (document) {
            const detailPromises: Array<Promise<Object>> = new Array<Promise<Object>>();
            let detailData: Array<Object> = new Array<Object>();

            // Getting customer data
            await admin.firestore().collection('customers').doc(document.data()['customerId']).get()
                .then(function (customerDoc) {
                    customerData = customerDoc;
                }).catch(error => {
                    console.log(error);
                    response.status(500).send(error);
                });

            //  Getting the invoice detail
            queryRefDetail = admin.firestore().collection('documents_details')
                .where("documentId", "==", document.ref.id);

            await queryRefDetail.get().then(function (qsDetail) {
                qsDetail.forEach( function (document_detail) {
                    detailPromises.push(invoiceDetailToObject(document_detail));
                })
            }).catch(error => {
                console.log(error);
                response.status(500).send(error);
            });

            //  Loading detail by promise all
            await Promise.all(detailPromises).then(function (data) {
                detailData = data;
            }).catch(error => {
                console.log(error);
                response.status(500).send(error);
            });

            console.log(detailData.length);

            //  Updating data
            await document.ref.update({
                "enterprise": {
                    "id": "08da15xigruqP56uJF9N",
                    "name": "ñami ñami"
                },
                "branch": {
                    "id": "CTsXjc21QbJuvqbeyTyd",
                    "name": "Matriz",
                },
                "cashDrawer": {
                    "id": "5lGFbNzoOIOPJKBlCU2S",
                    "name": "Principal"
                },
                "customer": {
                    "customerId": document.data()['customerId'],
                    "id": customerData.data()['id'],
                    "firstName": customerData.data()['firstName'],
                    "lastName": customerData.data()['lastName'],
                },
                "detail": detailData
            }).then(function () {
                console.log('Invoice updated: ' + document.ref.id);
            }).catch(error => {
                console.log(error);
                response.status(500).send(error);
            });
        });

        console.log('finished!');
        //  Finally respond
        response.send('ok!');
    }).catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
});

// @ts-ignore
async function invoiceDetailToObject(document_detail): Promise<Object> {
    let lineData: Object = {};

    //  Getting the data of the item
    await admin.firestore().collection('items').doc(document_detail.data()['itemId']).get()
        .then(function (itemDoc) {
            //  Creating the detail
            lineData = {
                "discountRate": document_detail.data()['discountRate'],
                "discountValue": document_detail.data()['discountValue'],
                "price": document_detail.data()['price'],
                "quantity": document_detail.data()['quantity'],
                "subtotal": document_detail.data()['subtotal'],
                "taxes": document_detail.data()['taxes'],
                "total": document_detail.data()['total'],
                "dispatchMeasure": {
                    "id": "ywYKZXuIb03dWcUwQ4Cm",
                    "name": "Unidad"
                },
                "item": {
                    "id": document_detail.data()['itemId'],
                    "name": itemDoc.data()['name'],
                }
            };
        }).catch(error => {
            console.log(error);
        });
    return lineData;
}

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
        querySnapshot.forEach(function (doc) {
            console.log(doc.id, ' => ', doc.data());
        });
    }).catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
});

export const getItemById = functions.https.onRequest((request, respond) => {
    const uid = request.body.id;
    const doc = admin.firestore().doc(`items/${uid}`);

    doc.get().then(snapshot => {
        respond.send(snapshot.data());
    }).catch(error => {
        respond.status(500).send(error);
    });
});