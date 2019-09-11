var applicationModule = require("application");
var uiFrame = require('ui/frame');

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

// Detect screen rotation, and set the "landscapeMode" boolean value in the current page's binding context
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

            if( uiFrame.topmost() != null ) {
                if( uiFrame.topmost().currentPage ) {
                    if( uiFrame.topmost().currentPage.bindingContext != null ) {
                        uiFrame.topmost().currentPage.bindingContext.set("landscapeMode" , args.newValue == "landscape");
                    }
                }
            }
        }
    });
} else {
    applicationModule.on(applicationModule.orientationChangedEvent, function(args) {
        applicationModule.screenOrientation   = args.newValue;
        console.log(applicationModule.screenOrientation);
        
        if( uiFrame.topmost() != null ) {
            if( uiFrame.topmost().currentPage  != null ) {
                if( uiFrame.topmost().currentPage.bindingContext != null ) {
                    uiFrame.topmost().currentPage.bindingContext.set("landscapeMode" , args.newValue == "landscape");
                }
            }
        }
    });
}

applicationModule.start({ moduleName: "main-page" });
