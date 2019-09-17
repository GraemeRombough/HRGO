
var fileSystem  = require("tns-core-modules/file-system");
var TextModule  = require("tns-core-modules/text");
var firebase    = require("nativescript-plugin-firebase/app");
var dialogs     = require("ui/dialogs");
var uiFrame     = require('ui/frame');
var applicationSettings = require("application-settings");


const errorTitle      = ["Read Error", "Erreur de lecture"];
const errorMessage    = ["Data file must be downloaded from Firebase", "Le fichier de données doit être téléchargé à partir de Firebase"];


async function refreshTable(tableName) {
    try {
    var login   = await firebase.auth().signInAnonymously();
    console.log(" login success");
    } catch(err) {
        console.log("login error " + err);
    }

    var refreshCollection   = firebase.firestore().collection(tableName);
    try {
        var refreshSnapshot = await refreshCollection.get();
        var array   = [];
        refreshSnapshot.forEach( record => {
            array.push(record.data());
            //console.log( record.data().TitleEN);
        });

        await writeContents( tableName, array);
    } catch(err) {
        console.log(err);
    }

    firebase.auth().signOut();
    
    uiFrame.goBack();
/*
    if( uiFrame.topmost().currentPage != null ) {
        console.log( uiFrame.topmost().currentPage.callLoaded() );
        console.log("current page exists");
    } else {
        console.log("dang");
    }*/
}

function writeContents( tableName , contents ) {
    console.log("asdf");
    var appFolder   = fileSystem.knownFolders.documents().getFolder("firebaseBuffer");
    //if( appFolder.contains(tableName)) {
    //    appFolder.removeSync(tableName);
    //}
    var bufferFile  = appFolder.getFile(tableName);

    var testString  = JSON.stringify(contents);

    bufferFile.writeTextSync(testString, fwerr=>{ 
        throw fwerr;
    }, TextModule.encoding.UTF_8);
}

function readContents( tableName ) {
    var appFolder   = fileSystem.knownFolders.documents().getFolder("firebaseBuffer");
    //refreshTable(tableName);
    //appFolder.removeSync(tableName);
    var bufferFile;
    if( appFolder.contains(tableName)) {
        console.log("file is found: " + tableName);
        bufferFile  = appFolder.getFile(tableName);
        /*
        var fileContents    = bufferFile.readTextSync( frerr2 => {
            dialogs.alert({
                title: "Read Error",
                message: frerr2,
            okButtonText: "OK"});
        }, TextModule.encoding.UTF_8);*/
        var decodedArray    = [];
        try {
        decodedArray    = JSON.parse( bufferFile.readTextSync( frerr2 => {
            dialogs.alert({
                title: "Read Error",
                message: frerr2,
            okButtonText: "OK"});
            }));
        } catch(err) {
            var selectedLanguage = ((applicationSettings.getString("PreferredLanguage") == "French") ? 1 : 0);
            dialogs.confirm({
                title: errorTitle[selectedLanguage],
                message: errorMessage[selectedLanguage],
                okButtonText: "OK",
                cancelButtonText: "Cancel"}).then( (btn) => {
                    if( btn == true ) {
                        refreshTable(tableName);
                    } else {
                        uiFrame.goBack();
                    }
                });
            decodedArray    = [];
        }
        return decodedArray;
    } else {
        console.log("file does not exist " + tableName);
        var selectedLanguage = ((applicationSettings.getString("PreferredLanguage") == "French") ? 1 : 0);
        dialogs.confirm({
            title: errorTitle[selectedLanguage],
            message: errorMessage[selectedLanguage],
            okButtonText: "OK",
            cancelButtonText: "Cancel"}).then( (btn) => {
                if( btn == true ) {
                    refreshTable(tableName);
                } else {
                    uiFrame.goBack();
                }
            });
    }

    return [];
    /*
    try {
    bufferFile  = appFolder.getFile(tableName);
    } catch( frerr ) {
        dialogs.alert({
            title: "Parsing Error",
            message: frerr,
        okButtonText: "OK"});
    }
    console.log("gfds3");
    try {
        var fileContents    = bufferFile.readTextSync( frerr2 => {
            dialogs.alert({
                title: "Read Error",
                message: frerr2,
            okButtonText: "OK"});
        }, TextModule.encoding.UTF_8);
    } catch( frerr ) {
            dialogs.alert({
                title: "Read Error",
                message: frerr,
            okButtonText: "OK"});
        
    }

    var decodedArray    = {};
    try {
    decodedArray    = JSON.parse( fileContents );
    } catch(frerr) {
        dialogs.alert({
            title: "Parsing Error",
            message: frerr,
        okButtonText: "OK"});
    }

    return decodedArray;
    */
}

exports.writeContents = writeContents;
exports.readContents = readContents;
