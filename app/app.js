var applicationModule = require("application");
const firebase = require("nativescript-plugin-firebase/app");

firebase.initializeApp({
    persist: true
}).then(
    function(result) {
        console.log("initializeApp success: " + JSON.stringify(result));
    },
    function(error) {
        console.log("initialization error: " + error);
    }
);

applicationModule.start({ moduleName: "main-page" });
