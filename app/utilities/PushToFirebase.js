var firebase = require("nativescript-plugin-firebase/app");

function pushToFirebase(collectionName, dataArray) {
    
    var collection  = firebase.firestore().collection(collectionName);

    dataArray.forEach(record => {
        collection.doc(record.Ref + "").set(record);
    });
}

exports.pushToFirebase = pushToFirebase;
