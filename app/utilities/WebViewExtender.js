var email               = require("nativescript-email");
var phone               = require("nativescript-phone");
var clipboard           = require("nativescript-clipboard");
var dialogs             = require("ui/dialogs");
var utils               = require("utils/utils");
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");

var callLink = function(phoneNumber){
    //console.log("call number:" + phoneNumber);
    phone.dial(phoneNumber,true);

};

var textLink = function(phoneNumber){
    //console.log("call number:" + phoneNumber);
    phone.sms(phoneNumber,"");

};

var copyToClipboard = function(clipboardText){
    //console.log("copied to clipboard" + clipboardText);
            clipboard.setText(clipboardText).then(function() {
                //console.log("OK, copied to the clipboard");
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
    if( emailText.includes("%")) {
        console.log("decode uri");
        emailText   = decodeURI(emailText);
    }
    
    var recipients  = "";
    var subject     = "";
    var body        = "";
    if( emailText.includes("::subject::")) {
        var sections    = emailText.split("::subject::");
        if( sections[0].includes("::body::")) {
            subject         = sections[1];

            var sections2   = sections[0].split("::body::");
            recipients      = sections2[0];
            body            = sections2[1];
        } if(sections[1].includes("::body::")) {
            recipients      = sections[0];

            var sections2   = sections[1].split("::body::");
            subject         = sections2[0];
            body            = sections2[1];
        } else {
            recipients      = sections[0];
            subject         = sections[1];
        }
    } else if( emailText.includes("::body::")) {
        var sections    = emailText.split("::body::");
        recipients      = sections[0];
        body            = sections[1];
    } else {
        recipients   = emailText;
    }

    console.log("To: " + recipients);
    console.log("Subject: " + subject);
    console.log("Body: " + body);


    email.available().then((success) => {
        var toAddress   = recipients.split(";");
        if(success) {
            email.compose({
                subject: subject,
                body: body,
                to: toAddress
            });
        } else {
            console.log("try url email");
            if( utils.openUrl("mailto:" + encodeURI(recipients) + "?subject=" + encodeURI(subject) + "&body=" + encodeURI(body))) {
                console.log("email success");
            } else {
                console.log("Email Not Available");
                clipboard.setText(recipients).then(function() {
                    console.log("OK, copied to the clipboard");
                })
                if(applicationSettings.getString("PreferredLanguage") == "French"){
                    dialogs.alert({
                        title: "Courriel n'est pas disponible",
                        message: "GO RH ne peux pas ouvrir votre client de courriel.  Votre message a mis dans le presse papier pour mettre dans votre client de courriel.",
                        okButtonText: "OK"});
                } else {
                    dialogs.alert({
                        title: "Email Not Available",
                        message: "HR GO cannot open your email client.  Your message has been copied to the clipboard to be pasted in your email client of choice.",
                        okButtonText: "Continue"});
                }
            }
        }
    });

    /*
    var toAddress = recipients.split(";");
    if( recipients.includes("@intern.mil.ca")) {
        if( applicationSettings.getBoolean("EnableMilEmails", false) == true ) {
            if (email.available()){
                email.compose({
                    subject: subject,
                    body: body,
                    to: toAddress
                });
            } else {
                console.log("Email Not Available");
            }
        } else {
            if( applicationSettings.getBoolean("EnableMilWarnings", true) == true ) {
                if(applicationSettings.getString("PreferredLanguage") == "French") {
                    dialogs.alert({
                        title: "",
                        message: "Les courriels pour @intern.mil.ca ont été désactivés.\r\nVous pouvez activer les liens ou désactiver cet avertissement à partir du formulaire Paramètres.",
                    okButtonText: "OK"});
                } else {
                    dialogs.alert({
                        title: "",
                        message: "Emails for @intern.mil.ca have been disabled.\r\nYou can enable the links or turn off this warning from the Settings form.",
                        okButtonText: "OK"});
                }
            }
        }
    } else {
        //toAddress.push(recipients);
        if (email.available()){
            email.compose({
                subject: subject,
                body: body,
                to: toAddress
            });
        } else {
            console.log("Email Not Available");
        }
    }
    */
};

exports.onWebViewLoaded = function(webargs) {
    //console.log( "onWebViewLoaded ************************************************************" );

    const webview = webargs.object;

    if ( platformModule.isAndroid ) {
        
        var LinkOverrideWebViewClient = android.webkit.WebViewClient.extend({
            shouldOverrideUrlLoading: function(view, webResourceRequest) {
                if (webResourceRequest != null) {
                    var urlString   = String( webResourceRequest.getUrl());
                    //console.log( urlString );
                    if( urlString.startsWith("http://") || urlString.startsWith("https://") ) {
                        if( urlString.includes(".mil.ca/")) {
                            if( applicationSettings.getBoolean("EnableMilHyperlinks", false) == true ) {
                                utils.openUrl( urlString );
                            } else {
                                if( applicationSettings.getBoolean("EnableMilWarnings", true) == true ) {
                                    if(applicationSettings.getString("PreferredLanguage") == "French") {
                                        dialogs.alert({
                                            title: "",
                                            message: "Les liens pour .mil.ca/ ont été désactivés.",
                                            //message: "Les liens pour .mil.ca/ ont été désactivés.\r\nVous pouvez activer les liens ou désactiver cet avertissement à partir du formulaire Paramètres.",
                                        okButtonText: "OK"});
                                    } else {
                                        dialogs.alert({
                                            title: "",
                                            message: "Links for .mil.ca/ have been disabled.",
                                            //message: "Links for .mil.ca/ have been disabled.\r\nYou can enable the links or turn off this warning from the Settings form.",
                                            okButtonText: "OK"});
                                    }
                                }
                            }
                        } else {
                            utils.openUrl( urlString );
                        }
                        return true;
                    } else if( urlString.startsWith( "mailto:")) {
                        emailLink( urlString.substr( 7));
                        return true;
                    } else if( urlString.startsWith( "tel:")) {
                        callLink( urlString.substr( 4));
                        return true;
                    } else if( urlString.startsWith( "sms:")) {
                        textLink( urlString.substr( 4));
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
    //console.log("onLoadStarted ****************************************************************");
    checkURL = args.url.split(":");
    if(checkURL.length > 1){
        if(checkURL[0] == "mailto") {
            //console.log(checkURL[1]);
            args.object.stopLoading();
            emailLink( args.url.substr( 7) );//checkURL[1]);
        } else if(checkURL[0] == "tel") {
            console.log(checkURL[1]);
            args.object.stopLoading();
            callLink(checkURL[1]);
        } else if(checkURL[0] == "sms") {
            console.log(checkURL[1]);
            args.object.stopLoading();
            textLink(checkURL[1]);  
        } else if(checkURL[0] == "copy") {
            console.log(checkURL[1]);
            args.object.stopLoading();
            args.object.goBack();
            copyToClipboard(args.url.substring(5));
        } else if( checkURL[0].startsWith("http") || checkURL[0] == "https") {
            args.object.stopLoading();
            var urlString   = checkURL[0] + ":" + checkURL[1];
            if( urlString.includes(".mil.ca/")) {
                if( applicationSettings.getBoolean("EnableMilHyperlinks", false) == true ) {
                    utils.openUrl( urlString );
                } else {
                    if( applicationSettings.getBoolean("EnableMilWarnings", true) == true ) {
                        if(applicationSettings.getString("PreferredLanguage") == "French") {
                            dialogs.alert({
                                title: "",
                                message: "Les liens pour .mil.ca/ ont été désactivés.",
                                //message: "Les liens pour .mil.ca/ ont été désactivés.\r\nVous pouvez activer les liens ou désactiver cet avertissement à partir du formulaire Paramètres.",
                                okButtonText: "OK"});
                        } else {
                            dialogs.alert({
                                title: "",
                                message: "Links for .mil.ca/ have been disabled.",
                                //message: "Links for .mil.ca/ have been disabled.\r\nYou can enable the links or turn off this warning from the Settings form.",
                                okButtonText: "OK"});
                        }
                    }
                }
            } else {
                utils.openUrl( urlString );
            }
            args.object.goBack();
        }
        console.log(args.url);
    }
};
