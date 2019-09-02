var firebase = require("nativescript-plugin-firebase/app");

function pushToFirebase(collectionName, dataArray) {
    
    var collection  = firebase.firestore().collection(collectionName);

    dataArray.forEach(record => {
        collection.doc(record.Ref + "").set(record);
    });

    var stampCollection = firebase.firestore().collection("TableUpdates");
    stampCollection.doc(collectionName).set({
        TableName: collectionName,
        Updated: firebase.firestore().FieldValue().serverTimestamp()
    });
}

exports.pushToFirebase = pushToFirebase;
