
var email               = require("nativescript-email");
var phone               = require("nativescript-phone");
var clipboard           = require("nativescript-clipboard");
var dialogs             = require("ui/dialogs");
var utils               = require("utils/utils");
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");

var callLink = function(phoneNumber){
    console.log("call number:" + phoneNumber);
    phone.dial(phoneNumber,true);

};

var copyToClipboard = function(clipboardText){
    console.log("copied to clipboard" + clipboardText);
            clipboard.setText(clipboardText).then(function() {
                console.log("OK, copied to the clipboard");
            });
            if(applicationSettings.getString("PreferredLanguage") == "French"){
                dialogs.alert({
                    title: "Lien a été copié",
                    message: "Le lien a été copié.",
                okButtonText: "OK"});
            } else {
                dialogs.alert({
                    title: "Link Copied",
                    message: "The link has been copied to your clipboard.",
                    okButtonText: "OK"});
            }
};

var emailLink = function(emailText){
    console.log("send email to:" + emailText);
    var toAddress = [];
    toAddress.push(emailText);
    if (email.available()){
        email.compose({
            subject: "",
            body: "",
            to: toAddress
        });
    } else {
        console.log("Email Not Available");
    }
};

exports.onWebViewLoaded = function(webargs) {
    console.log( "onWebViewLoaded ************************************************************" );

    const webview = webargs.object;

    if ( platformModule.isAndroid ) {
        
        var LinkOverrideWebViewClient = android.webkit.WebViewClient.extend({
            shouldOverrideUrlLoading: function(view, webResourceRequest) {
                if (webResourceRequest != null) {
                    var urlString   = String( webResourceRequest.getUrl());
                    console.log( urlString );
                    if( urlString.startsWith("http://") || urlString.startsWith("https://") ) {
                        utils.openUrl( urlString );
                        return true;
                    } else if( urlString.startsWith( "mailto:")) {
                        emailLink( urlString.substr( 7));
                        return true;
                    } else if( urlString.startsWith( "tel:")) {
                        callLink( urlString.substr( 4));
                        return true;
                    } else if( urlString.startsWith( "copy:")) {
                        copyToClipboard( urlString.substr( 5));
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });

        // override long press gesture to copy links to the clipboard
        let myListener = new android.view.View.OnCreateContextMenuListener({
            onCreateContextMenu: function (menu, view) {
                if( view.getHitTestResult().getType() != 0 ) {
                    copyToClipboard( view.getHitTestResult().getExtra());
                }
                return false;
            }
        });

        webview.android.setOnCreateContextMenuListener(myListener);

        webview.android.setWebViewClient(new LinkOverrideWebViewClient());
        webview.android.getSettings().setDisplayZoomControls(false);
        if( webargs.enableZoom != null ) {
            webview.android.getSettings().setBuiltInZoomControls(webargs.enableZoom);
            webview.android.getSettings().setSupportZoom(webargs.enableZoom);
        } else {
            webview.android.getSettings().setBuiltInZoomControls(false);
            webview.android.getSettings().setSupportZoom(false);
        }
    } else {
        // TODO: figure out how to perform the overrides on iOS
        //webview.ios.
    }
};

exports.onLoadStarted = function(args){
    console.log("onLoadStarted ****************************************************************");
    checkURL = args.url.split(":");
    if(checkURL.length > 1){
        if(checkURL[0] == "mailto"){
            console.log(checkURL[1]);
            args.object.stopLoading();
            emailLink(checkURL[1]);
            
        }else if(checkURL[0] == "tel"){
            console.log(checkURL[1]);
            args.object.stopLoading();
            callLink(checkURL[1]);  
        }else if(checkURL[0] == "copy"){
            console.log(checkURL[1]);
            args.object.stopLoading();
            args.object.goBack();
            copyToClipboard(args.url.substring(5));
        } else if( checkURL[0].startsWith("http") || checkURL[0] == "https") {
            args.object.stopLoading();
            utils.openUrl(checkURL[0] + ":" + checkURL[1]);
            args.object.goBack();
        }
        console.log(args.url);
    }
};
