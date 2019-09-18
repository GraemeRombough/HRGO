var frameModule = require("ui/frame");
var buttonModule = require("ui/button");
var view = require("ui/core/view");
var observable = require("data/observable");
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const Button = require("tns-core-modules/ui/button/").Button;
const WebView = require("tns-core-modules/ui/web-view").WebView;
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const FormattedString = require("tns-core-modules/text/formatted-string").FormattedString;
const Span = require("tns-core-modules/text/span").Span;
var pageData = new observable.Observable();
var PercentLength = require("tns-core-modules/ui/styling/style-properties").PercentLength;
const email = require("nativescript-email");
var phone = require("nativescript-phone");
var clipboard           = require("nativescript-clipboard");
var utils               = require("utils/utils");
var dialogs             = require("ui/dialogs");
var Visibility = require("tns-core-modules/ui/enums").Visibility;
var applicationSettings = require("application-settings");
var pagePrefix  = "";
var page;

//var firebase = require("nativescript-plugin-firebase/app");
var firebaseBuffer  = require("~/utilities/FirebaseBuffer");

//const   webViewEvents           = require("~/utilities/WebViewExtender");
//var     HTMLBuilder             = require("~/utilities/HTMLBuilder");
var     pushToFirebase          = require("~/utilities/PushToFirebase");

exports.pageNavTo = function(args) {
   
    page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
};

exports.pageLoaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;

    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        pageData.set("PointsOfContactTitle", "POINT DE CONTACT");
        pagePrefix = "FR_";
    } else {
        pageData.set("PointsOfContactTitle", "POINTS OF CONTACT");
        pagePrefix = "";
    }
    pageData.set( "searchBarVisibility", "collapsed" );
    pageData.set( "SearchCriteria", "" );
    //displayPOCs( getFromDatabase());

    //pushToFirebase.pushToFirebase( "POC", getFromDatabase());

    var showTags    = "";
    if( page.navigationContext != null && page.navigationContext.Tags != null ) {
        showTags    = page.navigationContext.Tags;
    }
    buildListFromFirestore(showTags);
};

exports.onPageSwipe = function(event) {
    if( event.direction == 1 ) {
        console.log("onPageSwipe: " + event.direction);
        const thisPage = event.object.page;
        thisPage.frame.goBack();
    }
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate(pagePrefix + "profile-page");
    
}
exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    //topmost.navigate("feedback-page");
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
}
exports.footer5 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("POC-page");
}

// Toggle the search bar visibility
exports.openSearch = function() {
    if( pageData.get("searchBarVisibility") == "visible") {
        pageData.set( "searchBarVisibility", "collapsed" );

        page.getViewById("SearchBox").off("textChange");
    } else {
        pageData.set( "searchBarVisibility", "visible" );

        page.getViewById("SearchBox").on("textChange" , (lpargs) => {
            var POCList     = pageObject.getViewById("POC_List");
            var pocCount    = POCList.getChildrenCount();
            var pocIndex    = 0;
            var lowercaseSearch = lpargs.value.toLowerCase();

            if( lowercaseSearch != "") {
                var searchWords = lowercaseSearch.split(" ");
                for( pocIndex = 0 ; pocIndex < pocCount ; pocIndex++ ) {
                    var itemVisibility  = Visibility.visible;
                    checkText   = POCList.getChildAt( pocIndex ).src.toLowerCase();

                    searchWords.forEach( word => {
                        if( word != "" && !checkText.includes( word ) ) {
                            itemVisibility  = Visibility.collapse;
                        }
                    });

                    POCList.getChildAt( pocIndex ).visibility   = itemVisibility;
                    /*
                    if( checkText.toLowerCase().includes( lowercaseSearch ) == true ) {
                        POCList.getChildAt( pocIndex ).visibility   = Visibility.visible;
                    } else {
                        POCList.getChildAt( pocIndex ).visibility   = Visibility.collapse;
                    }*/
                }
            } else {
                for( pocIndex = 0 ; pocIndex < pocCount ; pocIndex++ ) {
                    POCList.getChildAt( pocIndex ).visibility   = Visibility.visible;
                }
            }
        } );
    }
}

exports.searchPOC = function() {
    var POCList     = pageObject.getViewById("POC_List");
    var pocCount    = POCList.getChildrenCount();
    var pocIndex    = 0;
    var checkText   = "";

    if( pageData.get("SearchCriteria") != null ) {
        if(pageData.get("SearchCriteria") != "") {
            for( pocIndex = 0 ; pocIndex < pocCount ; pocIndex++ ) {
                checkText   = POCList.getChildAt( pocIndex ).src;
                if( checkText.toLowerCase().includes( pageData.get("SearchCriteria").toLowerCase()) == true ) {
                    POCList.getChildAt( pocIndex ).visibility   = Visibility.visible;
                } else {
                    POCList.getChildAt( pocIndex ).visibility   = Visibility.collapse;
                }
            }
        } else {
            for( pocIndex = 0 ; pocIndex < pocCount ; pocIndex++ ) {
                POCList.getChildAt( pocIndex ).visibility   = Visibility.visible;
            }
        }
    }

    pageData.set( "searchBarVisibility", "collapsed" );
}

var displayPOCs = function(POCs) {
    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();

    var contactIndex    = 0;
    
    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        for(contactIndex = 0; contactIndex < POCs.length; contactIndex++ ){
            POCList.addChild( createPOCWebView( POCs[contactIndex].ContentFR ));
        }
    } else {
        for(contactIndex = 0; contactIndex < POCs.length; contactIndex++ ){
            POCList.addChild( createPOCWebView( POCs[contactIndex].ContentEN ));
        }
    }
};

var makeButton  = function( labelText, linkText, sectionFormat, transactionType) {
    
    var phoneButton     = new Button();
    var buttonText      = new FormattedString();
    var textSpan        = new Span();
    phoneButton.horizontalAlignment = "left";
    if( transactionType == "phone" ) {
        textSpan.text       = String.fromCharCode(0xE942);
        textSpan.color      = "rgb(100, 255, 100)";
        phoneButton.linkText   = linkText;
        phoneButton.addEventListener( "tap", doPhoneCall , this );
    } else if( transactionType == "email" ) {
        textSpan.text       = String.fromCharCode(0xE945);
        textSpan.color      = "rgb(245, 194, 118)";
        phoneButton.linkText   = linkText.replace(" ", "");
        phoneButton.addEventListener( "tap", doEmail , this );
    } else {
        textSpan.text       = String.fromCharCode(0xE9C9);
        textSpan.color      = "rgb(194, 232, 255)";
        phoneButton.linkText  = linkText;
        phoneButton.addEventListener( "tap", doBrowse , this );
    }
    textSpan.fontFamily = "icomoon";
    textSpan.fontSize   = "20";
    textSpan.textAlign  = "left";
    buttonText.spans.push(textSpan);

    textSpan            = new Span();
    textSpan.text       = "  " + labelText;
    textSpan.className  = "POC_Phone";
    buttonText.spans.push(textSpan);

    phoneButton.className       = "POC_Contact";
    phoneButton.formattedText    = buttonText;
    phoneButton.addEventListener( "longPress", doClipboard , this );

    return phoneButton;
}

var makeLabelButton = function( labelText, linkText, sectionFormat, transactionType) {
    
    var categoryText    = new FormattedString();
    var iconSpan        = new Span();

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

    videoLabel.addEventListener( "tap" , function(event) {
        if( this.categoryStack.visibility == Visibility.visible ) {
            this.categoryStack.visibility = Visibility.collapse;
            this.iconSpan.text            = String.fromCharCode(0xEA42) + "  ";
        } else {
            this.categoryStack.visibility = Visibility.visible;
        }
    } , { iconSpan: iconSpan });

    videoStack.addChild( videoLabel );
}

var doPhoneCall = function(event) {
    console.log( "doPhoneCall " + event.object.linkText );
    phone.dial(event.object.linkText,true);
};

var doEmail = function(event) {
    console.log( "doEmail " + event.object.linkText );

    clipboard.setText(event.object.linkText).then(function() {
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
    /*
    var toAddress = event.object.linkText.split(";");//[];
    //toAddress.push(event.object.toAddress);
    if (email.available()){
        email.compose({
            subject: "",
            body: "",
            to: toAddress
        });
    } else {
        console.log("Email Not Available");
    }
    */
};

var doBrowse = function(event) {
    utils.openUrl( event.object.linkText );
}

var doClipboard = function(event) {
    clipboard.setText(event.object.linkText).then(function() {
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

// Create a webview object on the page to display the POC data
// iOS does not set the height for the WebView object, so we will instead parse the string and build the objects directly on the page.
var createPOCWebView = function( codedString ) {
    var gridLayout = new layout.GridLayout();

    codedString = codedString.replace("::external::", "::contact::");
    var pocComponents = codedString.split("<*");

    var pocItem = 0;
    var anchorItem  = 0;
    var pocItemSplit;
    var gridItem    = 0;
    var totalText   = "";

    for( pocItem = 0 ; pocItem < pocComponents.length ; pocItem++ ) {
        pocItemSplit = pocComponents[pocItem].split("*>");
        var pocSectionString = "";
        var sectionFormat      = "";

        if( pocItemSplit.length > 1 ) {
            sectionFormat       = pocItemSplit[0];
            pocSectionString    = pocItemSplit[1];
        } else {
            sectionFormat       = "Article_Body";
            pocSectionString    = pocItemSplit[0];
        }
        totalText   += " " + pocSectionString;
        sectionFormat   = sectionFormat.replace("Article", "POC");

        // ::contact:: control code is used for creating anchors with associated icons, depending on the link type.
        //     ::contact::label||link::contact::  to create an image and anchor with the specified label and link
        var textWithExternal = pocSectionString.split("::contact::");
        for( anchorItem=0; anchorItem < textWithExternal.length; anchorItem++ ) {
            if( anchorItem == 0 || textWithExternal[anchorItem] != "" ) {   // don't put a blank line after the closing ::contact:: when there are 2 in a row
                if( textWithExternal[anchorItem].includes("||http://") || textWithExternal[anchorItem].includes("||https://")) {
                    //E9C9
                    var anchorText  = textWithExternal[anchorItem].split("||");
                    var phoneButton  = makeButton( anchorText[0] , anchorText[1] , sectionFormat, "browse" );
                
                    layout.GridLayout.setRow(phoneButton, gridItem);
                    gridLayout.addChild(phoneButton);
                    var sectionRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
                    gridLayout.addRow(sectionRow);
                } else if( textWithExternal[anchorItem].includes("||mailto:")) {
                    //E945
                    var anchorText  = textWithExternal[anchorItem].split("||");
                    var phoneButton  = makeButton( anchorText[0] , anchorText[1].substr(7) , sectionFormat, "email" );
                
                    layout.GridLayout.setRow(phoneButton, gridItem);
                    gridLayout.addChild(phoneButton);
                    var sectionRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
                    gridLayout.addRow(sectionRow);
                } else if( textWithExternal[anchorItem].includes("||tel:")) {
                    //E942
                    var anchorText  = textWithExternal[anchorItem].split("||");
                    var phoneButton  = makeButton( anchorText[0] , anchorText[1].substr(4) , sectionFormat, "phone" );
                
                    layout.GridLayout.setRow(phoneButton, gridItem);
                    gridLayout.addChild(phoneButton);
                    var sectionRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
                    gridLayout.addRow(sectionRow);
                } else {
                    var sectionLabel = new Label();
                    sectionLabel.className = sectionFormat;
                    sectionLabel.text   = textWithExternal[anchorItem];
                    layout.GridLayout.setRow(sectionLabel, gridItem);
                    gridLayout.addChild(sectionLabel);
                    var sectionRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
                    gridLayout.addRow(sectionRow);
                }

                gridItem++;
            }
        }
    }

    gridLayout.src = totalText;
    gridLayout.className = "POC_Grid";
    return gridLayout;
};

var buildListFromFirestore = function(showTags) {
    console.log("***** buildListFromFirestore   - for tags: " + showTags);
    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();

    var queryResults    = firebaseBuffer.readContents("POC");

    if( showTags != "" ) {
        queryResults    = queryResults.filter( function(value, index, array) {
            return value.Tags.includes(showTags);
        });
    }

    queryResults.sort( applicationSettings.getString("PreferredLanguage") == "French" ? compareFrench : compareEnglish );
    displayPOCs( queryResults );

    /*
    const notificationCollection = firebase.firestore().collection("POC").get({ source: "cache" }).then( querySnapshot => {
        var queryResults = [];
        querySnapshot.forEach( colDoc => {
            if( colDoc.data().Tags.includes(showTags)) {
                queryResults.push(colDoc.data());
            }
        });
        queryResults.sort( applicationSettings.getString("PreferredLanguage") == "French" ? compareFrench : compareEnglish );
        displayPOCs( queryResults );
    },
    (errorMesage) => {
        console.log("Error getting query results: " + errorMessage);
    });
    */
};

function compareFrench( a , b ) {
    var compareResult = 0;
    if( a.TitleFR < b.TitleFR ) {
        compareResult = -1;
    } else {
        if( a.TitleFR > b.TitleFR ) {
            compareResult = 1;
        } else {
            if( a.Ref < b.Ref ) {
                compareResult = -1;
            }
        }
    }
    return compareResult;
};

function compareEnglish( a , b ) {
    var compareResult = 0;
    if( a.TitleEN < b.TitleEN ) {
        compareResult = -1;
    } else {
        if( a.TitleEN > b.TitleEN ) {
            compareResult = 1;
        } else {
            if( a.Ref < b.Ref ) {
                compareResult = -1;
            }
        }
    }
    return compareResult;
};


var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};
    
    dbRow = {Ref:1, Tags:``, TitleEN:`PSPC Call Center`, TitleFR:`Centre de Service de Paye`, ContentEN:`<*Article_H1*>PSPC Call Center<*Article_Body*>The Client Contact Centre (CCC) is the first point of contact for current and former federal public servants looking for information or help with compensation and benefits enquiries, and for technical issues when using the Compensation Web Applications (CWA) and the Phoenix pay system.::contact::1-888-HRTOPAY||tel:1-888-HRTOPAY::contact::`, ContentFR:`<*Article_H1*>Centre de Service de Paye<*Article_Body*>Le Centre de contact avec la clientèle (CCC) est le premier point de contact des fonctionnaires fédéraux, actuels et anciens, qui souhaitent obtenir de l’information ou de l’aide concernant des demandes liées à la rémunération et aux avantages sociaux, et pour des problèmes techniques liés aux Applications Web de la rémunération (AWR) et au système de paye Phénix.::contact::1-888-HRTOPAY||tel:1-888-HRTOPAY::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:2, Tags:``, TitleEN:`HRSS Support Line`, TitleFR:`Centre de contact à la clientèle pour le portail SSRH`, ContentEN:`<*Article_H1*>HRSS Support Line<*Article_Body*>The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system.::contact::1-833-747-6363||tel:1-833-747-6363::contact::`, ContentFR:`<*Article_H1*>Centre de contact à la clientèle pour le portail SSRH<*Article_Body*>Les employès et les gestionnaires peuvent communiquer avec le centre de service pour obtenir l'access ou pour naviguer le portail SSRH.::contact::1-833-747-6363||tel:1-833-747-6363::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:3, Tags:``, TitleEN:`Section 34 Manager Support Line`, TitleFR:`Article 34 Ligne de soutien à l'intention des gestionnaires`, ContentEN:`<*Article_H1*>Section 34 Manager Support Line<*Article_Body*>If you are a Section 34 Manager experiencing issues with pay approval related tasks, a representative from HR Connect RH can help resolve your issues.::contact::1-833-747-6363||tel:1-833-747-6363::contact::`, ContentFR:`<*Article_H1*>Article 34 Ligne de soutien à l'intention des gestionnaires<*Article_Body*>Si vous êtes un gestionnaire de l'article 34 et que vous éprouvez des problèmes avec les tâches liées à l'approbation de la paye, un représentant de HR Connect RH peut vous aider à résoudre vos problèmes.::contact::1-833-747-6363||tel:1-833-747-6363::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:4, Tags:``, TitleEN:`PSPC Pension Center`, TitleFR:`Centre des pensions`, ContentEN:`<*Article_H1*>PSPC Pension Center<*Article_Body*>The Government of Canada Pension Centre is the primary office responsible for the administration of the pension plan for Federal Public Service employees, the Public Service Superannuation Act (PSSA).::contact::1-800-561-7930||tel:1-800-561-7930::contact::`, ContentFR:`<*Article_H1*>Centre des pensions<*Article_Body*>Le Centre des pensions du gouvernement du Canada est le principal responsable de l'administration du régime de pensions des fonctionnaires fédéraux, conformément à la Loi sur la pension de la fonction publique (LPFP).::contact::1-800-561-7930||tel:1-800-561-7930::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:5, Tags:``, TitleEN:`Employee Assistance Program`, TitleFR:`Programme d'aide aux employés`, ContentEN:`<*Article_H1*>Employee Assistance Program<*Article_Body*>EAP offers solutions to both prevent and address the concerns of employers, employees, and immediate family members.::contact::1-800-268-7708||tel:1-800-268-7708::contact::`, ContentFR:`<*Article_H1*>Programme d'aide aux employés<*Article_Body*>Nous offrons des solutions pour répondre aux préoccupations des employeurs, des employés et des membres de la famille immédiate.::contact::1-800-268-7708||tel:1-800-268-7708::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:6, Tags:``, TitleEN:`Public Services and Procurement Canada: General Inquiries `, TitleFR:`Services publics et Approvisionnement Canada: Demandes de renseignements généraux`, ContentEN:`<*Article_H1*>Public Services and Procurement Canada: General Inquiries <*Article_Body*>For questions not answered on our website refer to the contact information below.::contact::1-800-926-9105||tel:1-800-926-9105::contact::::contact::questions@tpsgc-pwgsc.gc.ca||mailto:questions@tpsgc-pwgsc.gc.ca::contact::`, ContentFR:`<*Article_H1*>Services publics et Approvisionnement Canada: Demandes de renseignements généraux<*Article_Body*>Si vous ne trouvez pas la réponse à vos questions sur le site Web, vous pouvez envoyer vos demandes et vos questions générales aux coordonnées ci-après.::contact::1-800-926-9105||tel:1-800-926-9105::contact::::contact::questions@tpsgc-pwgsc.gc.ca||mailto:questions@tpsgc-pwgsc.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:7, Tags:``, TitleEN:`DLN Learning Management System: Help Desk `, TitleFR:`Système de gestion d'apprentissage RAD: Bureau d'aide`, ContentEN:`<*Article_H1*>DLN Learning Management System: Help Desk <*Article_Body*>The DLN is an enterprise environment for managing, developing and delivering on-line training, as well as for providing the Defence Team with an environment favourable to continuous learning and the sharing of knowledge.::contact::1-844-750-1643||tel:1-844-750-1643::contact::::contact::DLN-RAD@FORCES.GC.CA||mailto:DLN-RAD@FORCES.GC.CA::contact::`, ContentFR:`<*Article_H1*>Système de gestion d'apprentissage RAD: Bureau d'aide<*Article_Body*>Il s’agit d’un environnement ministériel qui permet de gérer, de développer et de donner de l’instruction en ligne, tout en fournissant à l’Équipe de la Défense un environnement propice à l’éducation permanente et à la mise en commun du savoir.::contact::1-844-750-1643||tel:1-844-750-1643::contact::::contact::DLN-RAD@FORCES.GC.CA||mailto:DLN-RAD@FORCES.GC.CA::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:8, Tags:``, TitleEN:`PSPC Client Contact Centre (Government of Canada Employees)`, TitleFR:`Centre de contact avec la clientèle de SPAC (Employés du Gouvernement du Canada)`, ContentEN:`<*Article_H1*>PSPC Client Contact Centre (Government of Canada Employees)<*Article_Body*>Friendly and knowledgeable operators can answer general questions related to employee pay enquiries.::contact::1-855-686-4729||tel:1-855-686-4729::contact::`, ContentFR:`<*Article_H1*>Centre de contact avec la clientèle de SPAC (Employés du Gouvernement du Canada)<*Article_Body*>Un personnel compétent et enthousiaste est à la disposition des employés pour répondre à toute question relative aux demandes de renseignements sur la paye.::contact::1-855-686-4729||tel:1-855-686-4729::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:9, Tags:``, TitleEN:`Individual tax enquiries`, TitleFR:`Demandes de renseignements sur l'impôt des particuliers`, ContentEN:`<*Article_H1*>Individual tax enquiries<*Article_Body*>Call this number for tax information for individuals, trusts, international tax and non-residents, including personal income tax returns, instalments, and RRSPs or to get our forms and publications.::contact::1-800-959-8281||tel:1-800-959-8281::contact::`, ContentFR:`<*Article_H1*>Demandes de renseignements sur l'impôt des particuliers<*Article_Body*>Composez ce numéro pour obtenir des renseignements sur l'impôt pour les particuliers, les fiducies, l'impôt international et les non-résidents, notamment les déclarations de revenus, les acomptes provisionnels et les REER, ou pour obtenir nos formulaires et publications.::contact::1-800-959-7383||tel:1-800-959-7383::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:10, Tags:``, TitleEN:`Benefit enquiries (CRA Child and family benefits)`, TitleFR:`Demandes de renseignements sur les prestations`, ContentEN:`<*Article_H1*>Benefit enquiries (CRA Child and family benefits)<*Article_Body*>Call this number for information on the Canada child benefit (CCB), the GST/HST credit, and related provincial and territorial programs, as well as the child disability benefit.::contact::1-800-387-1193||tel:1-800-387-1193::contact::`, ContentFR:`<*Article_H1*>Demandes de renseignements sur les prestations<*Article_Body*>Composez ce numéro pour obtenir des renseignements sur l’allocation canadienne pour enfants (ACE), le crédit pour la TPS/TVH et les programmes provinciaux et territoriaux connexes, ainsi que la prestation pour enfants handicapés.::contact::1-800-387-1193||tel:1-800-387-1193::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:11, Tags:``, TitleEN:`Provincial programs for Ontario (PPO)`, TitleFR:`Programmes provinciaux pour l'Ontario (PPO)`, ContentEN:`<*Article_H1*>Provincial programs for Ontario (PPO)<*Article_Body*>Call this number for enquiries related to the Ontario trillium benefit (OTB) payment—includes the Ontario sales tax credit (OSTC), the Ontario energy and property tax credit (OEPTC), and the Northern Ontario energy credit (NOEC)—the Ontario senior homeowners' property tax grant (OSHPTG) payment,and the Ontario sales tax transition benefit (OSTTB).::contact::1-877-627-6645||tel:1-877-627-6645::contact::`, ContentFR:`<*Article_H1*>Programmes provinciaux pour l'Ontario (PPO)<*Article_Body*>Composez ce numéro pour vos demandes de renseignements au sujet du versement de la prestation trillium de l'Ontario (PTO) — incluant le crédit de la taxe de vente de l'Ontario (CTVO), le paiement pour le crédit d'impôt de l'Ontario pour les coûts d'énergie et l'impôt foncier (CIOCEIF) et le paiement pour le crédit pour les coûts d'énergie dans le Nord de l'Ontario (CCENO) — le paiement de la subvention aux personnes âgées propriétaires pour l'impôt foncier de l'Ontario (SPAPIFO) et la prestation de transition à la taxe de vente de l'Ontario (PTTVO).::contact::1-877-627-6664||tel:1-877-627-6664::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:12, Tags:``, TitleEN:`TIPS (Tax Information Phone Service)`, TitleFR:`SERT (Système électronique de renseignements par téléphone)`, ContentEN:`<*Article_H1*>TIPS (Tax Information Phone Service)<*Article_Body*>This automated phone service provides information to individuals and businesses.::contact::1-800-267-6999||tel:1-800-267-6999::contact::`, ContentFR:`<*Article_H1*>SERT (Système électronique de renseignements par téléphone)<*Article_Body*>Ce service automatisé fournit des renseignements aux particuliers et aux entreprises.::contact::1-800-267-6999||tel:1-800-267-6999::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:13, Tags:``, TitleEN:`Revenu Québec`, TitleFR:`Revenu Québec`, ContentEN:`<*Article_H1*>Revenu Québec<*Article_Body*>General information, Income tax, Your tax file, Change of address, Notice of assessment, Direct deposit ,Assistance program for individuals in business.::contact::1-800-267-6299||tel:1-800-267-6299::contact::`, ContentFR:`<*Article_H1*>Revenu Québec<*Article_Body*>Renseignements généraux, Impôt, Votre dossier fiscal, Changement d'adresse, Avis de cotisation, Dépôt direct Programme d'accompagnement pour les particuliers en affaires.::contact::1-800-267-6299||tel:1-800-267-6299::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:14, Tags:``, TitleEN:`Learning and Career Centres (LCCs) - Talent Management for the NCR`, TitleFR:`Centres d'apprentissage et de carrière (CAC)`, ContentEN:`<*Article_H1*>Learning and Career Centres (LCCs) - Talent Management for the NCR<*Article_Body*>Our highly skilled Learning Advisors provide Learning and Career Advisory services through group settings or classroom sessions.::contact::1-613-901-5501||tel:1-613-901-5501::contact::::contact::1-613-901-5502||tel:1-613-901-5502::contact::::contact::P-OTG.LCCTraining@intern.mil.ca||mailto:P-OTG.LCCTraining@intern.mil.ca::contact::`, ContentFR:`<*Article_H1*>Centres d'apprentissage et de carrière (CAC)<*Article_Body*>Nos conseillers en apprentissage hautement qualifiés dispensent des services de consultation en matière d’apprentissage et de carrière à des séances en groupes ou en salles de classe.::contact::1-613-901-5501||tel:1-613-901-5501::contact::::contact::1-613-901-5502||tel:1-613-901-5502::contact::::contact::P-OTG.LCCTraining@intern.mil.ca||mailto:P-OTG.LCCTraining@intern.mil.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:15, Tags:``, TitleEN:`Awards & Recognition`, TitleFR:`Prix et reconnaissance`, ContentEN:`<*Article_H1*>Awards & Recognition<*Article_Body*>Discover the variety of awards available to the HR-Civ team and how you can recognize your colleagues for performance excellence.::contact::1-613-901-7322||tel:1-613-901-7322::contact::::contact::Awards-Recompenses@forces.gc.ca||mailto:Awards-Recompenses@forces.gc.ca::contact::`, ContentFR:`<*Article_H1*>Prix et reconnaissance<*Article_Body*>Découvrez la liste des prix disponibles aux employés de SMA(RH-Civ) et comment vous pouvez nommer vos collègues pour souligner l’excellence de leurs rendements. ::contact::1-613-901-7322||tel:1-613-901-7322::contact::::contact::Awards-Recompenses@forces.gc.ca||mailto:Awards-Recompenses@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:16, Tags:``, TitleEN:`Community Management Program`, TitleFR:`Programme de la gestion des collectivités`, ContentEN:`<*Article_H1*>Community Management Program<*Article_Body*>Our goal is to provide a positive employee experience for our Workforce which is achieved by applying elements of Diversity & Inclusion, Total Health, and clarity of organizational vision and individual expectations (through Community Management, Organizational Learning, etc.)::contact::1-613-901-6652||tel:1-613-901-6652::contact::::contact::P-OTG.CommunityMgmt@intern.mil.ca||mailto:P-OTG.CommunityMgmt@intern.mil.ca::contact::`, ContentFR:`<*Article_H1*>Programme de la gestion des collectivités<*Article_Body*>Notre objectif est de donner une expérience positive pour notre effectif grâce à l'application des éléments sur la diversité et l’inclusion, la santé globale, la clarté de la vision organisationnelle et attentes individuelles (par l’entremise de la gestion des collectivités, l'apprentissage organisationnel, etc.)::contact::1-613-901-6652||tel:1-613-901-6652::contact::::contact::P-OTG.CommunityMgmt@intern.mil.ca||mailto:P-OTG.CommunityMgmt@intern.mil.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:17, Tags:``, TitleEN:`Sexual Misconduct Response Centre - Counsellor`, TitleFR:`Centre d’intervention sur l’inconduite sexuelle`, ContentEN:`<*Article_H1*>Sexual Misconduct Response Centre - Counsellor<*Article_Body*>Contact a Sexual Misconduct Response Centre (SMRC) counsellor, access resources for leadership, and learn about how to recognize harmful and inappropriate sexual behaviour.::contact::1-844-750-1648||tel:1-844-750-1648::contact::::contact::DND.SMRC-CIIS.MDN@forces.gc.ca||mailto:DND.SMRC-CIIS.MDN@forces.gc.ca::contact::`, ContentFR:`<*Article_H1*>Centre d’intervention sur l’inconduite sexuelle<*Article_Body*>Contacter un conseiller du Centre d’intervention sur l’inconduite sexuelle (CIIS), accéder à des ressources pour les dirigeants, et apprendre comment reconnaître les comportements sexuels inappropriés.::contact::1-844-750-1648||tel:1-844-750-1648::contact::::contact::DND.SMRC-CIIS.MDN@forces.gc.ca||mailto:DND.SMRC-CIIS.MDN@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:18, Tags:``, TitleEN:`Canadian Human Rights Commission`, TitleFR:`Commission canadienne des droits `, ContentEN:`<*Article_H1*>Canadian Human Rights Commission<*Article_Body*>Human rights laws protect people in Canada from discrimination based on grounds such as race, sex, religion or disability.::contact::1-888-214-1090||tel:1-888-214-1090::contact::::contact::info.com@chrc-ccdp.gc.ca||mailto:info.com@chrc-ccdp.gc.ca::contact::`, ContentFR:`<*Article_H1*>Commission canadienne des droits <*Article_Body*>Au Canada, vous avez le droit de vivre libre de discrimination. Les lois vous protègent de la discrimination en raison des motifs tels que la race, le sexe, la religion ou une déficience.::contact::1-888-214-1090||tel:1-888-214-1090::contact::::contact::info.com@chrc-ccdp.gc.ca||mailto:info.com@chrc-ccdp.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    /*
    dbRow = {Ref:19, 
        TitleEN:`Conflict and Complaint Management Services centre`, 
        TitleFR:`Centre de services de gestion des conflits et des plaintes`, 
        ContentEN:`<*Article_H1*>Conflict and Complaint Management Services centre<*Article_Body*>If you feel harassed while at work you can report the incident or submit a formal complaint. The Canadian Armed Forces national harassment unit will assist you with if you choose to make a complaint. They can also help you implement workplace prevention strategies from the Integrated Conflict and Complaint Management (ICCM) program.::contact::1-833-328-3351||tel:1-833-328-3351::contact::::contact::ICCMInquiries.Demandesrequete...||mailto:ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca::contact::`, 
        ContentFR:`<*Article_H1*>Centre de services de gestion des conflits et des plaintes<*Article_Body*>Si vous croyez être victime de harcèlement au travail, vous pouvez remplir un rapport ou déposer une plainte dans le but de régler le problème. L'unité nationale de lutte contre le harcèlement des Forces armées canadiennes vous aidera à formuler une plainte, ainsi qu'a mettre en place des mesures de prévention du harcèlement au travail issues du Programme de gestion intégrée des conflits et des plaintes (GICP).::contact::1-833-328-3351||tel:1-833-328-3351::contact::::contact::ICCMInquiries.Demandesrequete...||mailto:ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca::contact::`
    };
    */
    dbRow = {Ref:19, Tags:``, 
        TitleEN:`Integrated Conflict and Complaint Management Program (ICCM)`, 
        TitleFR:`Gestion intégrée des conflits et des plaints (GICP)`, 
        ContentEN:`<*Article_H1*>Integrated Conflict and Complaint Management Program (ICCM)<*Article_Body*>The ICCM provides members with formal and informal conflict resolution information, programs and support through Conflict and Complaint Management Services (CCMS) centres, which can provide you with the options available if you would like to submit a formal complaint or are dealing with conflict. Below is a directory of all CCMS centres located across Canada and who you can contact for help.<*Article_Body*>National contact number and email.::contact::1-833-328-3351||tel:1-833-328-3351::contact::::contact::ICCMInquiries.Demandesrequete...||mailto:ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca::contact::<*Article_Body*>CCMS::contact::Esquimalt||tel:1-250-363-7578::contact::::contact::Edmonton x.6095||tel:1-780-973-4011::contact::::contact::Cold Lake x.8849||tel:1-780-840-8000::contact::::contact::Winnipeg x.6405||tel:1-204-833-2500::contact::::contact::Borden x.2214||tel:1-705-424-1200::contact::::contact::Trenton x.4770||tel:1-613-392-2811::contact::::contact::Toronto||tel:1-416-633-3756::contact::::contact::Kingston x.5641||tel:1-613-541-5010::contact::::contact::Petawawa||tel:1-613-588-4700::contact::::contact::Ottawa ||tel:1-613-995-8710::contact::::contact::Valcartier x.6427||tel:1-418-844-5000::contact::::contact::Montreal x.4116||tel:1-514-252-2777::contact::::contact::Bagotville x.6038||tel:1-418-677-4000::contact::::contact::Halifax||tel:1-902-721-7533::contact::::contact::Greenwood||tel:1-902-599-3742::contact::::contact::Gagetown x.2232||tel:1-506-422-2000::contact::`, 
        ContentFR:`<*Article_H1*>Gestion intégrée des conflits et des plaints (GICP)<*Article_Body*>L'ICCM fournit aux membres des informations, programmes et un soutien officiels et informels de résolution des conflits, par le biais de centres de gestion des conflits et des plaintes (CCMS), qui peuvent vous fournir les options disponibles si vous souhaitez déposer une plainte formelle ou gérer un conflit. Vous trouverez ci-dessous un répertoire de tous les centres CCMS situés partout au Canada et des personnes que vous pouvez contacter pour obtenir de l'aide.<*Article_Body*>Numéro de contact national et email.::contact::1-833-328-3351||tel:1-833-328-3351::contact::::contact::ICCMInquiries.Demandesrequete...||mailto:ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca::contact::SGCP::contact::Esquimalt||tel:1-250-363-7578::contact::::contact::Edmonton x.6095||tel:1-780-973-4011::contact::::contact::Cold Lake x.8849||tel:1-780-840-8000::contact::::contact::Winnipeg x.6405||tel:1-204-833-2500::contact::::contact::Borden x.2214||tel:1-705-424-1200::contact::::contact::Trenton x.4770||tel:1-613-392-2811::contact::::contact::Toronto||tel:1-416-633-3756::contact::::contact::Kingston x.5641||tel:1-613-541-5010::contact::::contact::Petawawa||tel:1-613-588-4700::contact::::contact::Ottawa ||tel:1-613-995-8710::contact::::contact::Valcartier x.6427||tel:1-418-844-5000::contact::::contact::Montreal x.4116||tel:1-514-252-2777::contact::::contact::Bagotville x.6038||tel:1-418-677-4000::contact::::contact::Halifax||tel:1-902-721-7533::contact::::contact::Greenwood||tel:1-902-599-3742::contact::::contact::Gagetown x.2232||tel:1-506-422-2000::contact::`
    };
    databaseReturn.push(dbRow);
    dbRow = {Ref:20, Tags:``, 
        TitleEN:`Office of Disability Management`, 
        TitleFR:`Bureau de gestion d'invalidité`, 
        ContentEN:`<*Article_H1*>Office of Disability Management<*Article_Body*>The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury.::contact::1-833-893-3388||tel:1-833-893-3388::contact::Clients located east of Manitoba may email us at our eastern offices.::contact::Eastern region||mailto:Disability_Management-Gestion_Invalidite@forces.gc.ca::contact::Clients located west of Ontario may email us at our western offices.::contact::Western region||mailto:Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca::contact::`, 
        ContentFR:`<*Article_H1*>Bureau de gestion d'invalidité<*Article_Body*>Le bureau de la gestion de l’invalidité (BGI) a été créé en tant que groupe impartial, collaboratif et inclusif qui offre des services de soutien aux employés et aux superviseurs/gestionnaires qui doivent traiter des questions relatives à l’invalidité en raison d’une maladie, d’un handicap ou d’une blessure.::contact::1-833-893-3388||tel:1-833-893-3388::contact::Clients situés à l’est du Manitoba devront utiliser la boîte de courriel générique de la région de l’Est.::contact::Région de l’Est||mailto:Disability_Management-Gestion_Invalidite@forces.gc.ca::contact::Clients situés Ouest de l'Ontario devront utiliser la boîte de courriel générique de la région de l’Ouest.::contact::Région de l’Ouest||mailto:Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca::contact::`
    };
    databaseReturn.push(dbRow);
    dbRow = {Ref:21, Tags:``, TitleEN:`Mental Health & Wellbeing`, TitleFR:`Santé mentale et mieux-être`, ContentEN:`<*Article_H1*>Mental Health & Wellbeing<*Article_Body*> The Mental Health and Well-Being Corporate Office supports the health and well-being of employees and provides access to tools, resources and services to assist organizations in building a safe, supportive and respectful work environment.::contact::P-OTG.Wellbeing@intern.mil.ca||mailto:P-OTG.Wellbeing@intern.mil.ca::contact::`, ContentFR:`<*Article_H1*>Santé mentale et mieux-être<*Article_Body*>Le Bureau principal de la santé mentale et du mieux-être veille à la santé mentale et au mieux-être des employés, et offre des outils, des ressources et des services afin d’aider les organisations à instaurer un milieu de travail axé sur la sécurité, le soutien et le respect. ::contact::P-OTG.Wellbeing@intern.mil.ca||mailto:P-OTG.Wellbeing@intern.mil.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:22, Tags:``, TitleEN:`Sun Life Financial - Public Service Health Care Plan (PSHCP)`, TitleFR:`Financière Sun Life - Le Régime de soins de santé de la fonction publique (RSSFP)`, ContentEN:`<*Article_H1*>Sun Life Financial - Public Service Health Care Plan (PSHCP)<*Article_Body*>Have your PSHCP contract number (055555) and certificate number available to help us assist you with your questions about your group benefits (e.g. drug, medical).::contact::1-888-757-7427||tel:1-888-757-7427::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`, ContentFR:`<*Article_H1*>Financière Sun Life - Le Régime de soins de santé de la fonction publique (RSSFP)<*Article_Body*>Veuillez avoir votre numéro de contrat du RSSFP (055555) et votre numéro de certificat pour nous aider à répondre à vos questions relatives à votre régime d’assurance collective (p. ex. médicaments, frais médicaux).::contact::1-888-757-7427||tel:1-888-757-7427::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:23, Tags:``, TitleEN:`Sun Life Financial - Pensioners’ Dental Services Plan (PDSP)`, TitleFR:`Financière Sun Life - Le Régime de services dentaires pour les pensionnés (RSDP)`, ContentEN:`<*Article_H1*>Sun Life Financial - Pensioners’ Dental Services Plan (PDSP)<*Article_Body*>Have your PDSP contract number (025555) and certificate number available to help us assist you with your questions about your group benefits.::contact::1-888-757-7427 ||tel:1-888-757-7427 ::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`, ContentFR:`<*Article_H1*>Financière Sun Life - Le Régime de services dentaires pour les pensionnés (RSDP)<*Article_Body*>Veuillez avoir votre numéro de contrat du RSDP (025555) et votre numéro de certificat pour nous aider à répondre à vos questions relatives à votre régime d’assurance collective).::contact::1-888-757-7427||tel:1-888-757-7427::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:24, Tags:``, TitleEN:`Great-West Life - Public Service Dental Care Plan`, TitleFR:`La Great-West - Régime de soins dentaires de la fonction publique `, ContentEN:`<*Article_H1*>Great-West Life - Public Service Dental Care Plan<*Article_Body*>::contact::1-855-415-4414||tel:1-855-415-4414::contact::`, ContentFR:`<*Article_H1*>La Great-West - Régime de soins dentaires de la fonction publique <*Article_Body*>::contact::1-855-415-4414||tel:1-855-415-4414::contact::`};
    databaseReturn.push(dbRow);
    
    return databaseReturn;
};
