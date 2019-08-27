var frameModule     = require("ui/frame");
var Image           = require("tns-core-modules/ui/image").Image;
const Label = require("tns-core-modules/ui/label/").Label;
const GridLayout    = require("tns-core-modules/ui/layouts/grid-layout").GridLayout;
const StackLayout    = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const FormattedString = require("tns-core-modules/text/formatted-string").FormattedString;
const Span = require("tns-core-modules/text/span").Span;
var observable = require("data/observable");
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");
var Visibility = require("tns-core-modules/ui/enums").Visibility;
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

    var showCategory    = "";
    if( page.navigationContext != null && page.navigationContext.Category != null ) {
        showCategory    = page.navigationContext.Category;
    }
    buildVideoList(showCategory);
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
};
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate(pagePrefix + "profile-page");
    
};
exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:pagePrefix + 'feedback-page',
        context:{Language: "ENG",
                PageName: pageDetails[1].split("/")[1].split(".")[0],
                DateTime: TODAY
                }
            }
    topmost.navigate(navigationOptions); 
};
exports.footer5 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("POC-page");
};

// Toggle the search bar visibility
exports.openSearch = function() {
    if( pageData.get("searchBarVisibility") == "visible") {
        pageData.set( "searchBarVisibility", "collapsed" );
        
        page.getViewById("SearchBox").off("textChange");
    } else {
        pageData.set( "searchBarVisibility", "visible" );

        page.getViewById("SearchBox").on("textChange" , (lpargs) => {
            var categoryList    = pageObject.getViewById("videoStack");
            var categoryCount   = categoryList.getChildrenCount() / 2;
            var lowercaseSearch = lpargs.value.toLowerCase();
            
            if( lowercaseSearch != "") {
                for( categoryIndex = 0 ; categoryIndex < categoryCount ; categoryIndex++ ) {
                    var videoList   = categoryList.getChildAt( (categoryIndex * 2) + 1 );
                    var videoCount  = videoList.getChildrenCount();
                    var videoIndex  = 0;
                    
                    for( videoIndex = 0 ; videoIndex < videoCount ; videoIndex++ ) {
                        checkText   = videoList.getChildAt( videoIndex ).searchText;
                        if( checkText.toLowerCase().includes( lowercaseSearch ) == true ) {
                            videoList.getChildAt( videoIndex ).visibility   = Visibility.visible;
                        } else {
                            videoList.getChildAt( videoIndex ).visibility   = Visibility.collapse;
                        }
                    }
                }
            } else {
                for( categoryIndex = 0 ; categoryIndex < categoryCount ; categoryIndex++ ) {
                    var videoList   = categoryList.getChildAt( (categoryIndex * 2) + 1 );
                    var videoCount  = videoList.getChildrenCount();
                    var videoIndex  = 0;
                    
                    for( videoIndex = 0 ; videoIndex < videoCount ; videoIndex++ ) {
                        videoList.getChildAt( videoIndex ).visibility   = Visibility.visible;
                    }
                }
            }
        } );

    }
};

exports.searchVideos = function() {
    var categoryList    = pageObject.getViewById("videoStack");
    var categoryCount   = categoryList.getChildrenCount() / 2;
    var categoryIndex   = 0;
    var checkText       = "";

    if( pageData.get("SearchCriteria") != null ) {
        var searchCriteria  = pageData.get("SearchCriteria").toLowerCase();
        if( searchCriteria != "") {
            for( categoryIndex = 0 ; categoryIndex < categoryCount ; categoryIndex++ ) {
                var videoList   = categoryList.getChildAt( (categoryIndex * 2) + 1 );
                var videoCount  = videoList.getChildrenCount();
                var videoIndex  = 0;
                
                for( videoIndex = 0 ; videoIndex < videoCount ; videoIndex++ ) {
                    checkText   = videoList.getChildAt( videoIndex ).searchText;
                    if( checkText.toLowerCase().includes( searchCriteria ) == true ) {
                        videoList.getChildAt( videoIndex ).visibility   = Visibility.visible;
                    } else {
                        videoList.getChildAt( videoIndex ).visibility   = Visibility.collapse;
                    }
                }
            }
        } else {
            for( categoryIndex = 0 ; categoryIndex < categoryCount ; categoryIndex++ ) {
                var videoList   = categoryList.getChildAt( (categoryIndex * 2) + 1 );
                var videoCount  = videoList.getChildrenCount();
                var videoIndex  = 0;
                
                for( videoIndex = 0 ; videoIndex < videoCount ; videoIndex++ ) {
                    videoList.getChildAt( videoIndex ).visibility   = Visibility.visible;
                }
            }
        }
    }

    pageData.set( "searchBarVisibility", "collapsed" );
}

exports.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('existing-iframe-example', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
    });
};

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

function watchVideo(event) {
    console.log(this);

    var navigationOptions={
        moduleName:'pages/video-watch-page',
        context:{Language: "ENG",
                VideoID: this.videoID,
                Title: this.videoDescription,
                Provider: this.videoProvider
                }
            };
    var topmost = frameModule.topmost();
    topmost.navigate(navigationOptions);
};

function createListEntry(name, videoCode, tags, provider) {
    var gridLayout = new GridLayout();

    gridLayout.columns="10,80,10,*,10";
    
    var thumbnail = new Image();
    thumbnail.stretch   = "aspectFill";
    thumbnail.src       = `https://img.youtube.com/vi/${videoCode}/0.jpg`;
    gridLayout.addChildAtCell(thumbnail,0,1);
    
    var videoLabel = new Label();
    videoLabel.text   = name;
    videoLabel.className = "Main_Nav_SubLine";
    gridLayout.addChildAtCell(videoLabel,0,3);

    gridLayout.searchText   = name + " " + tags;

    gridLayout.addEventListener( "tap" , watchVideo , { videoID: videoCode , videoDescription: name , videoProvider: provider});
    gridLayout.className = "Video_Grid";

    return gridLayout;
}

var buildVideoList  = function( category = "" ) {
    var videoStack  = pageObject.getViewById("videoStack");
    var videoList   = getFromDatabase( category );

    videoStack.removeChildren();
    videoList.sort(videoCompare);

    var lastCategory    = "-1";

    var categoryStack;

    videoList.forEach( function(video) {
        // Create a new category button and subsequent child stack
        if( video.Category != lastCategory ) {
            var categoryText    = new FormattedString();
            var iconSpan        = new Span();

            //categoryText.className    = "Video_Category";
            iconSpan.text       = String.fromCharCode(0xEA43) + "  ";
            iconSpan.fontFamily = "icomoon";
            iconSpan.width = "60px";
            categoryText.spans.push(iconSpan);
            
            var labelSpan            = new Span();
            labelSpan.text       = getCategoryLabel(video.Category);
            categoryText.spans.push(labelSpan);

            categoryText.width = "100%";

            
            var videoLabel = new Label();
            videoLabel.width    = "100%";
            videoLabel.className    = "Video_Category";
            videoLabel.formattedText    = categoryText;

            categoryStack   = new StackLayout();
            categoryStack.className    = "Video_Category_Stack";
            videoLabel.addEventListener( "tap" , function(event) {
                if( this.categoryStack.visibility == Visibility.visible ) {
                    this.categoryStack.visibility = Visibility.collapse;
                    this.iconSpan.text            = String.fromCharCode(0xEA42) + "  ";
                } else {
                    this.categoryStack.visibility = Visibility.visible;
                    this.iconSpan.text            = String.fromCharCode(0xEA43) + "  ";
                }
            } , { categoryStack: categoryStack, iconSpan: iconSpan });

            videoStack.addChild( videoLabel );
            videoStack.addChild( categoryStack );

            lastCategory    = video.Category;
        }
        if( applicationSettings.getString("PreferredLanguage") == "French" ) {
            categoryStack.addChild( createListEntry( video.NameFR , video.VideoCodeFR , video.DescriptionFR , video.Provider ));
        } else {
            categoryStack.addChild( createListEntry( video.NameEN , video.VideoCodeEN , video.DescriptionEN , video.Provider ));
        }
    });
    
    videoStack.visibility   = Visibility.visible;
};

function videoCompare( a , b ) {
    var compareResult = 0;
    if( a.Category < b.Category ) {
        compareResult = -1;
    } else {
        if( a.Category > b.Category ) {
            compareResult = 1;
        } else {
            if( a.DateAdded < b.DateAdded ) {
                compareResult = -1;
            } else {
                if( a.DateAdded > b.DateAdded ) {
                    compareResult = 1;
                } else {
                    if( a.Ref < b.Ref ) {
                        compareResult = -1;
                    } else {
                        if( a.Ref > b.Ref ) {
                            compareResult = 1;
                        }
                    }
                }
            }
        }
    }
    return compareResult;
};

var getCategoryLabel = function(category) {
    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        switch( category ) {
            case "Health":
                return "Santé et bien-être";
                break;
            case "Pay":
                return "Paie";
                break;
        }
    } else {
        switch( category ) {
            case "Health":
                return "Health and wellness";
                break;
            case "Pay":
                return "Pay";
                break;
        }
    }
};

var getFromDatabase = function( category = "" ) {
    var returnedItem;
    var contentData = [];
    var TODAY       = new Date();
    
    returnedItem = {Ref:"1", Category:"Health", DateAdded:TODAY+1, DescriptionEN:"Organizational culture", DescriptionFR:"Culture organisationnelle", NameEN:"Organizational culture", NameFR:"Culture organisationnelle", Provider:"YouTube", VideoCodeEN:"kxG2aoZAHuY", VideoCodeFR:"Q_qQ5a1QvOw" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"2", Category:"Health", DateAdded:TODAY+2, DescriptionEN:"Psychological and social support", DescriptionFR:"Soutien psychologique et social", NameEN:"Psychological and social support", NameFR:"Soutien psychologique et social", Provider:"YouTube", VideoCodeEN:"4BTPJv4oW2Y", VideoCodeFR:"wXjWejNGYyg" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", Category:"Health", DateAdded:TODAY+3, DescriptionEN:"Clear leadership and expectations", DescriptionFR:"Leadership et attentes clairs", NameEN:"Clear leadership and expectations", NameFR:"Leadership et attentes clairs", Provider:"YouTube", VideoCodeEN:"aaoncPmkO-Y", VideoCodeFR:"t0HEzmWLrIo" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"4", Category:"Health", DateAdded:TODAY+4, DescriptionEN:"Civility and respect", DescriptionFR:"Politesse et respect", NameEN:"Civility and respect", NameFR:"Politesse et respect", Provider:"YouTube", VideoCodeEN:"Jr8oy2w3Rss", VideoCodeFR:"lmCDQSbbi4g" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"5", Category:"Health", DateAdded:TODAY+5, DescriptionEN:"Psychological demands", DescriptionFR:"Exigences psychologiques", NameEN:"Psychological demands", NameFR:"Exigences psychologiques", Provider:"YouTube", VideoCodeEN:"tHFDgzIoEhY", VideoCodeFR:"vC1MUt__c-A" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"6", Category:"Health", DateAdded:TODAY+6, DescriptionEN:"Growth and development", DescriptionFR:"", NameEN:"Growth and development", NameFR:"", Provider:"YouTube", VideoCodeEN:"Wt_OxnqMRws", VideoCodeFR:"" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"7", Category:"Health", DateAdded:TODAY+7, DescriptionEN:"Recognition and reward", DescriptionFR:"Reconnaissance et récompenses", NameEN:"Recognition and reward", NameFR:"Reconnaissance et récompenses", Provider:"YouTube", VideoCodeEN:"xkZ7EOgS7no", VideoCodeFR:"CofmjKc2I58" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"8", Category:"Health", DateAdded:TODAY+8, DescriptionEN:"Involvement and influence", DescriptionFR:"Participation et influence", NameEN:"Involvement and influence", NameFR:"Participation et influence", Provider:"YouTube", VideoCodeEN:"pUsKrYdsLPM", VideoCodeFR:"Z5MOraprfA8" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"9", Category:"Health", DateAdded:TODAY+9, DescriptionEN:"Workload management", DescriptionFR:"Gestion de la charge de travail", NameEN:"Workload management", NameFR:"Gestion de la charge de travail", Provider:"YouTube", VideoCodeEN:"NGL6JoZrmWA", VideoCodeFR:"18NjtMrGuII" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"10", Category:"Health", DateAdded:TODAY+10, DescriptionEN:"Engagement", DescriptionFR:"Engagement", NameEN:"Engagement", NameFR:"Engagement", Provider:"YouTube", VideoCodeEN:"Nur5iErSmi0", VideoCodeFR:"KgUS6USTiXw" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"11", Category:"Health", DateAdded:TODAY+11, DescriptionEN:"Balance", DescriptionFR:"Équilibre", NameEN:"Balance", NameFR:"Équilibre", Provider:"YouTube", VideoCodeEN:"h48ElbN7Nfs", VideoCodeFR:"1O78FUwOyKw" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"12", Category:"Health", DateAdded:TODAY+12, DescriptionEN:"Psychological protection", DescriptionFR:"Protection de la sécurité psychologique", NameEN:"Psychological protection", NameFR:"Protection de la sécurité psychologique", Provider:"YouTube", VideoCodeEN:"mk0dHEGBo0M", VideoCodeFR:"lYK2haexwdE" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"13", Category:"Health", DateAdded:TODAY+13, DescriptionEN:"Protection of physical safety", DescriptionFR:"Protection de l’intégrité physique", NameEN:"Protection of physical safety", NameFR:"Protection de l’intégrité physique", Provider:"YouTube", VideoCodeEN:"2M0LvGcSBes", VideoCodeFR:"6-ueoNe4NGI" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"14", Category:"Pay", DateAdded:TODAY+14, DescriptionEN:"Sign in and registration process", DescriptionFR:"Processus d'ouverture de session d'inscription", NameEN:"Sign in and registration process", NameFR:"Processus d'ouverture de session d'inscription", Provider:"YouTube", VideoCodeEN:"plKSDSF7IAY", VideoCodeFR:"5HwXXdMDWbw" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"15", Category:"Pay", DateAdded:TODAY+15, DescriptionEN:"Submitting a par via hrss", DescriptionFR:"Soumettre une demande d'intervention de payé ssrh", NameEN:"Submitting a par via hrss", NameFR:"Soumettre une demande d'intervention de payé ssrh", Provider:"YouTube", VideoCodeEN:"sVzAyz52tKY", VideoCodeFR:"I-vajhmxhOo" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"16", Category:"Pay", DateAdded:TODAY+16, DescriptionEN:"Submitting a bulk par via hrss", DescriptionFR:"Effectuer une soumission en bloc de demandes d'intervention de paye", NameEN:"Submitting a bulk par via hrss", NameFR:"Effectuer une soumission en bloc de demandes d'intervention de paye", Provider:"YouTube", VideoCodeEN:"xXN0yyYrwNk", VideoCodeFR:"ETnAaIqsq8E" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"17", Category:"Pay", DateAdded:TODAY+17, DescriptionEN:"Submitting a phoneix feedback form via hrss", DescriptionFR:"Envoyer un formulaire de rétroaction phénix", NameEN:"Submitting a phoneix feedback form via hrss", NameFR:"Envoyer un formulaire de rétroaction phénix", Provider:"YouTube", VideoCodeEN:"4MZF4MFH52s", VideoCodeFR:"qAwl_yebOtU" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"18", Category:"Pay", DateAdded:TODAY+18, DescriptionEN:"Escalating a pay issue via the hrss", DescriptionFR:"Acheminer une demande relative à la paye", NameEN:"Escalating a pay issue via the hrss", NameFR:"Acheminer une demande relative à la paye", Provider:"YouTube", VideoCodeEN:"aiZSVrLXDnc", VideoCodeFR:"ZmwCh0ss_LM" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"19", Category:"Pay", DateAdded:TODAY+19, DescriptionEN:"Submitting an access timekeeper via the hrss", DescriptionFR:"Soumettre une demande aux responsables de la comptabilisation du temps", NameEN:"Submitting an access timekeeper via the hrss", NameFR:"Soumettre une demande aux responsables de la comptabilisation du temps", Provider:"YouTube", VideoCodeEN:"ImBKlwPIoNs", VideoCodeFR:"zgaYsi-bEBk" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"20", Category:"Pay", DateAdded:TODAY+20, DescriptionEN:"Submitting other requests via hrss", DescriptionFR:"Soumettre d'autres demandes liées aux ressources humaines", NameEN:"Submitting other requests via hrss", NameFR:"Soumettre d'autres demandes liées aux ressources humaines", Provider:"YouTube", VideoCodeEN:"Ew13rt-ID4I", VideoCodeFR:"c6ViMQhIiKw" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"21", Category:"Pay", DateAdded:TODAY+21, DescriptionEN:"Submitting a pri creation verification request", DescriptionFR:"Soumettre une demande de création ou de vérification d'un cidp", NameEN:"Submitting a pri creation verification request", NameFR:"Soumettre une demande de création ou de vérification d'un cidp", Provider:"YouTube", VideoCodeEN:"sTeBuMb1kRQ", VideoCodeFR:"BazZqr7aqik" };
    contentData.push(returnedItem);
    returnedItem = {Ref:"22", Category:"Pay", DateAdded:TODAY+22, DescriptionEN:"Tracking the progress of a pay related case via hrss", DescriptionFR:"Faire le suivi dune demande relative à la paye", NameEN:"Tracking the progress of a pay related case via hrss", NameFR:"Faire le suivi dune demande relative à la paye", Provider:"YouTube", VideoCodeEN:"5MdO8bawDY4", VideoCodeFR:"KC1nQNYo9qM" };
    contentData.push(returnedItem);
    
    if( category != "" ) {
        contentData = contentData.filter( function(value, index, array) {
            return value.Category == category;
        });
    }

    return contentData;
};
