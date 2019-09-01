var applicationModule = require("application");

const firebase = require("nativescript-plugin-firebase/app");

firebase.database.enableLogging(false);
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

applicationModule.screenOrientation = "portrait";

if( applicationModule.android ) {
    applicationModule.on(applicationModule.orientationChangedEvent, function(args) {
        applicationModule.screenOrientation   = args.newValue;
        if( applicationModule.android.startActivity ) {
            const win = applicationModule.android.startActivity.getWindow();
            if( args.newValue == "landscape" ) {
                win.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
            } else {
                win.clearFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
            }
        }
    });
} else {
    applicationModule.on(applicationModule.orientationChangedEvent, function(args) {
        applicationModule.screenOrientation   = args.newValue;
        console.log(applicationModule.screenOrientation);
    });
}

applicationModule.start({ moduleName: "main-page" });
