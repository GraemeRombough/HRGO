var frameModule     = require("ui/frame");
var observable = require("data/observable");
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");
var app = require("application");
var pageData = new observable.Observable();
var page;
var pageObject;
var pagePrefix  = "";

exports.pageLoaded = function(args) {
    page = args.object;
    args.object.bindingContext = pageData;
    pageObject = page;

    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        pageData.set("HeaderTitle", "Videos");
        pagePrefix = "FR_";
    } else {
        pageData.set("HeaderTitle", "Videos");
        pagePrefix = "";
    }
    pageData.set( "searchBarVisibility", "collapsed" );
    pageData.set("SearchCriteria", "" );

    pageData.set( "HeaderTitle" , page.navigationContext.Title );

    console.log( "app orientation = " + app.screenOrientation );
    pageData.set( "landscapeMode" , app.screenOrientation == "landscape" );
    pageData.set( "showNav", false );

    pageData.set( "videoHTML" , `<iframe 
    width="100%" height="100%"
    allowFullScreen
    src="https://www.youtube.com/embed/${page.navigationContext.VideoID}"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" />` );

    console.log( "watch the video " + page.navigationContext.VideoID );
};

exports.portrait = function() {
    console.log( "switched to portrait" );
};

exports.landscape = function() {
    console.log( "switched to landscape" );
};

exports.orientation = function(args) {
    console.log("Orientation was changed, is Landscape?", args.landscape);
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};

exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
};

exports.toggleNavBar = function() {
    pageData.set( "showNav", !pageData.get( "showNav" ));
}

exports.onWebViewLoaded = function(webargs) {
    console.log( "onWebViewLoaded ************************************************************" );

    const webview = webargs.object;

    if ( platformModule.isAndroid ) {

        webview.android.getSettings().setDisplayZoomControls(false);
            webview.android.getSettings().setBuiltInZoomControls(false);
            webview.android.getSettings().setSupportZoom(false);
    } else {
        // TODO: figure out how to perform the overrides on iOS
        //webview.ios.
    }
};
