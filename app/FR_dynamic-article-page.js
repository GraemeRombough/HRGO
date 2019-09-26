var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
var buttonModule = require("ui/button");
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
const HtmlView = require("tns-core-modules/ui/html-view").HtmlView;
const webViewModule = require("tns-core-modules/ui/web-view");
const pageData = new observable.Observable();
var articleReference;
var pageObject;
const email = require("nativescript-email");
var phone = require("nativescript-phone");
var utils   = require("utils/utils");
var platformModule      = require("tns-core-modules/platform");

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    articleReference=page.navigationContext;
    pageObject = page;
    page.bindingContext = pageData;
    createArticle();
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_landing-page");
}
exports.goToHome = function(eventData){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
}
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_profile-page");
    
}
exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    //topmost.navigate("feedback-page");
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:'FR_feedback-page',
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
var getArticleText = function(aID, aLang)
{
    //.findIndex(value)
    var articles = getFromDatabase();
    var articleText;
    var articleTitle;
    var articleBusinessLine;
    for (i = 0; i < articles.length; i++){
        if(articleTitle == null && articles[i].Ref == aID){
            articleTitle = articles[i].Title;
        }
        if(articleBusinessLine == null && articles[i].Ref == aID){
            articleBusinessLine = articles[i].BusinessLine;
        }
        if(articles[i].Ref == aID){
            articleText = articles[i].Content;
            break;
        }
    }
    var articleReturn = {Title:articleTitle, Text:articleText, BusinessLine:articleBusinessLine};
    return articleReturn;
    //return articleText;
}
exports.onLoadStarted = function(args){
    checkURL = args.url.split(":");
    if(checkURL.length > 1){
        if(checkURL[0] == "mailto"){
            console.log(checkURL[1]);
            emailLink(checkURL[1]);
            args.object.stopLoading();
        }else if(checkURL[0] == "tel"){
            console.log(checkURL[1]);
            callLink(checkURL[1]);
            args.object.stopLoading();
        }
        console.log(args.url);
    }
}

var callLink = function(phoneNumber){
    //console.log("call number:" + phoneNumber);
    phone.dial(phoneNumber,true);

};

var textLink = function(phoneNumber){
    //console.log("call number:" + phoneNumber);
    phone.sms(phoneNumber,"");

};

var copyToClipboard = function(clipboardText){
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
}

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
}

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
}

var createArticle = function()
{   
    /* const contentStack = new StackLayout();
    const myScroller = new ScrollView();
    const articleStack = new StackLayout();
    // Set the orientation property
    articleStack.orientation = "vertical";
    articleStack.col = 1;
    articleStack.className = "Article_MainStack";
    contentStack.orientation = "vertical";
    contentStack.row = 0;
    var headerLabel = new Label();
    headerLabel.text = articleReference.ArticleTitle;
    headerLabel.className = "HeaderLabel";
    var LabelArray = [];
    console.log("Create Article: ");   
    var curArticleText = getArticleText(articleReference.ArticleID);
    var articleItemSplit;
    var articleComponents = curArticleText.Text.split("<*");
    var articleSlide = pageObject.getViewById("articleContent");
    articleSlide.removeChildren();
    for (z=0; z<articleComponents.length; z++){
        articleItemSplit = articleComponents[z].split("*>");
        var articleLabel = new Label();
        //LabelArray.push(new Label());
        var textString = "";
        if(articleItemSplit[0] == "Article_List"){
            textString = "\u2022 ";
        }
        if(articleItemSplit[1]){
            textString += articleItemSplit[1]
        }
        articleLabel.className = articleItemSplit[0];
        articleLabel.text = textString;
        articleSlide.addChild(articleLabel);
    }
    pageData.set("HeaderTitle", curArticleText.Title); */
    var bodyStyle = `.Article_Body{ height:auto; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 25px; margin-right: 25px; margin-top: 28px; margin-bottom:14px; padding-bottom:0px; white-space: normal; color: #333;}`;
    var h1Style = `.Article_H1{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 14px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var h2Style = `.Article_H2{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 24px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 14px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var h3Style = `.Article_H3{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 20px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 25px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var noteStyle = `.Article_Note{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; font-style: italic; margin-left: 25px; margin-right: 25px; margin-top: 5px; margin-bottom:5px; white-space: normal; color: #333;}`;
    var listStyle = `.Article_List{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 50px; margin-right: 25px; margin-top: 18px; margin-bottom:5px; white-space: normal; color: #333;}`;
    var allStyles = bodyStyle + h1Style + h2Style + h3Style + noteStyle + listStyle;
    var headerHTML = `<html><head><style>${allStyles}</style></head><body>`;
    var footerHTML = "</body></html>"
    var totalHTML;
    totalHTML = headerHTML;
    var webView = new webViewModule.WebView();
    const contentStack = new StackLayout();
    const myScroller = new ScrollView();
    const articleStack = new StackLayout();
    // Set the orientation property
    articleStack.orientation = "vertical";
    articleStack.col = 1;
    articleStack.className = "Article_MainStack";

    contentStack.orientation = "vertical";
    contentStack.row = 0;
    
    var headerLabel = new Label();
    headerLabel.text = articleReference.ArticleTitle;
    headerLabel.className = "HeaderLabel";

    var LabelArray = [];
    console.log("Create Article: ");   
    var curArticleText = getArticleText(articleReference.ArticleID);
    var articleItemSplit;

    var articleComponents = curArticleText.Text.split("<*");
    var articleSlide = pageObject.getViewById("articleContent");
    //articleSlide.removeChildren();
    for (z=0; z<articleComponents.length; z++){
        var currentHTML;
        articleItemSplit = articleComponents[z].split("*>");
        var articleLabel = new Label();
        var textString = "";
        if(articleItemSplit[0] == "Article_List"){
            textString = "\u2022 ";
        }
        if(articleItemSplit[1]){
            textString += articleItemSplit[1]
        }
        if(textString.includes("::external::")){
            var textWithExternal = textString.split("::external::");
            console.log("TextWithExternal: " + textWithExternal.length);
            var htmlString = `<div class="${articleItemSplit[0]}">`;
            for(i=0; i < textWithExternal.length; i++){
                if(textWithExternal[i].includes("||")){
                    var linkText = textWithExternal[i].split("||");
                    htmlString += `<a href="${linkText[1]}" data-rel="external">${linkText[0]}</a>`;      
                }else{
                    
                    htmlString += `${textWithExternal[i]}`;
                }
            }
            articleLabel.className = articleItemSplit[0];
            var htmlParagraph = new HtmlView();
            htmlString += "</div>";
            totalHTML += htmlString;
        }else{
            totalHTML += `<div class="${articleItemSplit[0]}">${textString}</div>`;   
        }    
    }
    totalHTML += footerHTML;
    console.log(totalHTML);
    pageData.set("ArticleHTML", totalHTML);
    pageData.set("HeaderTitle", curArticleText.Title);

}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Renseignements sur votre paye", Title:"Principes de base de la rémunération", Type:"Article", Content:"<*Article_H1*>Renseignements sur votre paye<*Article_Body*>Le Centre des services de paye de la fonction publique est responsable de tous les services liés à la paye et aux avantages sociaux. Si vous avez des questions d’ordre général au sujet de votre paye, veuillez appeler le Centre de contact avec la clientèle<*Article_H1*>Principes de base de la rémunération<*Article_Body*>Apprenez-en davantage sur la rémunération à la fonction publique y compris le fonctionnement de la paye de la fonction publique, les conventions collectives et les taux de rémunération pour les employés fédéraux.<*Article_Body*>Consultez la page Votre paye et les changements dans votre vie de SPAC pour obtenir de l’information sur les demandes de congé, la mise à jour de l’état matrimonial ou de la situation d’emploi, le changement des renseignements personnels, le fait de devenir parent et d’autres événements de la vie.<*Article_H1*>Gestion des horaires des employés<*Article_Body*>En tant que gestionnaire délégué aux termes de l’article 34, vous devez veiller à ce que les horaires de travail de vos employés soient entrés correctement dans Phénix.<*Article_Body*>Les horaires de travail varient d’une personne à l’autre. Dans le cas des employés à temps partiel, ils peuvent également varier d’un contrat à l’autre.<*Article_Body*>Une mauvaise gestion et tenue à jour des horaires des employés entraîneront des résultats incorrects dans le Libre-service, ce qui pourrait avoir une incidence sur les paiements des employés.<*Article_Body*>Consultez GCpedia pour obtenir plus de renseignements sur la manière de saisir ou de supprimer les horaires des employés.<*Article_Body*>Pour obtenir de l’aide sur la saisie des horaires, les gestionnaires délégués aux termes de l’article 34 peuvent communiquer avec un responsable du temps."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"2", BusinessLine:"Pay", Category:"Renseignements sur votre paye", Title:"Consulter et comprendre votre paye", Type:"Article", Content:"<*Article_H1*>Consulter et comprendre votre paye<*Article_Body*>Accéder au système de paye Phénix pour :<*Article_List*>visualiser vos talons de paye et vos relevés d’impôts;<*Article_List*>utiliser des calculateurs de pension ou d’impôt;<*Article_List*>mettre à jour vos renseignements personnels.<*Article_Body*>Pour ce faire, vous aurez besoin d’une maClé ou d’une carte à puce ou carte IPC délivrée par votre ministère.<*Article_Body*>Pour une explication détaillée de votre talon de chèque de paye, consultez la page Web Comment interpréter votre talon de paye de Services publics et Approvisionnement Canada (SPAC)."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"3", BusinessLine:"Pay", Category:"Renseignements sur votre paye", Title:"Problèmes de paye", Type:"Article", Content:"<*Article_H1*>Problèmes de paye<*Article_Body*>Si vous avez besoin de fonds d’urgence, demander une avance sur salaire.*** Signalez votre problème de rémunération en suivant ces trois étapes.<*Article_H2*>Étape 1<*Article_List*>Parlez de votre problème de paye à votre gestionnaire.<*Article_List*>Assurez-vous que tous les documents requis pour appuyer votre demande (y compris les documents de dotation et de paye) ont été soumis par votre gestionnaire.<*Article_List*>Soumettez votre demande par l’entremise de l’outil Services et soutien en ressources humaines (SSRH) en sélectionnant Signaler un problème de paye – Étape 1 : Soumettre un formulaire de rétroaction Phoenix ou Soumettre une demande d’intervention de paye.<*Article_H2*>Étape 2<*Article_List*>Si votre cas n’est pas résolu dans les 21 jours, veuillez passer à Signaler un problème de paye – Étape 2 : Acheminer votre problème de paye à un niveau supérieur dans l’outil Services et soutien en ressources humaines (SSRH).<*Article_List*>L’Unité de la rémunération travaillera de concert avec le Centre des services de paye pour résoudre votre problème. Les cas sont acheminés par ordre de priorité. Voici la manière dont l’ordre de priorité est établi :<*Article_List*>  Priorité 1 : les employés qui ne reçoivent pas leurs avantages sociaux ni leur salaire de base (y compris les étudiants et les employés occasionnels); décès en cours d’emploi; congé sans solde (invalidité); paiements complémentaires de congé de maternité/paternité; cessation d’emploi; relevé d'emploi; mutations; griefs liés aux relations de travail; autres situations où l’employé ne reçoit pas de salaire de base.<*Article_List*>  Priorité 2 : les employés dont le versement du salaire risque d’être interrompu, y compris les salaires supérieurs au salaire minimum; contestations de trop-payé; congé avec étalement de revenu; congé de transition préalable à la retraite; dossiers de priorité 3 non réglés depuis plus de 18 mois.<*Article_List*>  Priorité 3 : nominations intérimaires, promotions, augmentations, pensions pour 35 ans de service et congés pour anciens militaires.<*Article_H2*>Étape 3<*Article_List*>Un conseiller en rémunération communiquera avec vous pour recueillir plus d’information sur votre problème de paye et tenter de le résoudre."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"4", BusinessLine:"Pay", Category:"Renseignements sur votre paye", Title:"Demande d’avance de salaire en cas d’urgence", Type:"Article", Content:"<*Article_H1*>Demande d’avance de salaire en cas d’urgence<*Article_Body*>Si vous avez besoin d’une avance de salaire en cas d’urgence (ASU), informez-en votre gestionnaire. Lorsqu’un employé demande une avance de salaire en cas d’urgence, soumettre une demande par l’intermédiaire de l’outil Services et soutien en ressources humaines (SSRH) en sélectionnant l’option Demande d’intervention de paye (DIP).<*Article_Body*>À moins qu’un employé choisisse de payer immédiatement les montants dus, le recouvrement de ces montants commencera une fois que :<*Article_List*>tout l’argent dû à l’employé a été payé;<*Article_List*>l’employé a été payé correctement pendant trois (3) périodes de paye consécutives;<*Article_List*>une entente de recouvrement a été conclue.<*Article_Note*>Si vous avez des questions sur le processus, veuillez communiquer avec le Centre des services de paye"};
    contentData.push(returnedItem);
    returnedItem = {Ref:"5", BusinessLine:"Pay", Category:"Échéances et processus relatifs à la paye", Title:"Rôles des employés", Type:"Article", Content:"<*Article_H1*>Rôles des employés<*Article_List*>Assurez-vous d’avoir correctement désigné votre gestionnaire délégué aux termes de l’article 34 dans le Libre‑service de Phénix.<*Article_List*>Si vous occupez un poste intérimaire, vous devez sélectionner votre gestionnaire délégué aux termes de l’article 34 dans le dossier correspondant (même si vous ne changez pas de gestionnaire). Les nominations intérimaires engendrent la création d’un nouveau dossier d’employé, et les renseignements compris dans le dossier du poste d’attache de l’employé n’y sont pas automatiquement transférés.<*Article_List*>Si vous ne travaillez pas selon un horaire régulier du lundi au vendredi, informez votre gestionnaire de votre horaire.<*Article_List*>Si vous n’avez pas accès au Libre-service des employés dans Phénix, informez votre gestionnaire de vos heures de travail et de vos congés non payés.<*Article_List*>Entrez vos heures supplémentaires et vos demandes de congé en fonction des dates limites indiquées. Informez votre gestionnaire chaque fois que vous soumettez une demande. Les gestionnaires ne reçoivent pas automatiquement d’avis lorsqu’une demande est en attente d’approbation."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"6", BusinessLine:"Pay", Category:"Échéances et processus relatifs à la paye", Title:"Rôles des gestionnaires délégués aux termes de l’article 34", Type:"Article", Content:"<*Article_H1*>Rôles des gestionnaires délégués aux termes de l’article 34<*Article_List*>Assurez-vous que vos employés vous ont désigné comme gestionnaire délégué aux termes de l’article 34 dans le Libre-service de Phénix.<*Article_List*>Entrez et examinez les horaires des employés qui ne travaillent pas selon un horaire régulier et traitez toutes les demandes en suspens une fois par semaine.<*Article_List*>Assurez-vous que vos employés entrent leurs mouvements de paye de base, notamment les heures travaillées dans le cas des employés qui travaillent selon les besoins, les heures supplémentaires et les congés non payés (CNP) de cinq jours ou moins, dans le Libre-service de Phénix au cours de la période de paye où ils ont eu lieu (au plus tard le jeudi de la semaine de paye).<*Article_List*>Examinez et traitez les demandes relatives à la paye dans le Libre-service de Phénix chaque semaine (Phénix NE VOUS ENVOIE PAS automatiquement d’avis lorsqu’une nouvelle demande est envoyée).<*Article_List*>Si vous avez des incertitudes au sujet du traitement d’un mouvement de paye, communiquez avec les responsables des services de soutien aux gestionnaires délégués aux termes de l’article 34 : ::external::1-833-747-6363||tel:1-833-747-6363::external::.<*Article_List*>Traitez les demandes de congé dans le SGRH/PeopleSoft.<*Article_H3*>Gestionnaires militaires : <*Article_Body*>Fournissez au responsable du temps du MDN les documents nécessaires pour veiller à ce que les mouvements de paye des employés, notamment les feuilles de temps des employés qui travaillent selon les besoins, les heures supplémentaires et les CNP de cinq jours ou moins, soient traités dans le Libre-service de Phénix en votre nom."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"7", BusinessLine:"Pay", Category:"Échéances et processus relatifs à la paye", Title:"Demandes de traitement aux termes de l’article 34", Type:"Article", Content:"<*Article_H1*>Demandes de traitement aux termes de l’article 34 relatives à la paye dans le Libre-service de Phénix<*Article_Body*>Chaque semaine, les gestionnaires délégués aux termes de l’article 34 doivent examiner et traiter les mouvements de paye envoyés dans le Libre-service de Phénix afin de prévenir des problèmes de paye. Les retards d’approbation occasionnent des retards de paiement et, dans certains cas, des problèmes dans Phénix.<*Article_Body*>Veuillez suivre les étapes suivantes pour veiller à ce que vos employés reçoivent à temps le montant qui leur est dû :<*Article_List*>Assurez-vous que vos employés vous ont désigné en tant que gestionnaire délégué aux termes de l’article 34 dans le Libre-service de Phénix.<*Article_List*>Chaque semaine, examinez et traitez les demandes relatives à la paye de vos employés qui ont été envoyées dans le Libre-service de Phénix. Les gestionnaires doivent traiter toutes les demandes relatives à la paye au plus tard le vendredi de chaque semaine (ou le jeudi si le vendredi est un jour férié).<*Article_List*>Le système de paye Phénix ne vous envoie pas automatiquement d’avis lorsqu’un mouvement de paye est soumis. Demandez à vos employés de vous aviser chaque fois qu’ils présentent une demande. Conseil : configurez un rappel hebdomadaire dans votre calendrier afin de vérifier si des demandes sont en attente d’approbation.<*Article_List*>Pour obtenir de plus amples renseignements sur la façon d’accéder aux mouvements de paye et de les approuver, veuillez lire le document Aide à la formation – Comment approuver les heures payables.<*Article_List*>Si vous avez des incertitudes au sujet du traitement d’un mouvement de paye, communiquez avec les services de soutien aux gestionnaires délégués aux termes de l’article 34 au ::external::1-833-747-6363||tel:1-833-747-6363::external:: pour obtenir de l’aide.<*Article_Note*>Remarque : Si les mouvements de paye ne sont pas entrés ou approuvés dans les six mois, ils ne pourront pas être traités par l’entremise de Phénix. Par conséquent, le gestionnaire délégué aux termes de l’article 34 devra envoyer un formulaire de demande d’intervention de paye aux fins de traitement par l’entremise de l’outil Services et soutien en ressources humaines."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"8", BusinessLine:"Pay", Category:"Échéances et processus relatifs à la paye", Title:"Mouvements de RH/dotation qui ont une incidence sur la paye", Type:"Article", Content:"<*Article_H1*>Mouvements de RH/dotation qui ont une incidence sur la paye<*Article_Body*>Les gestionnaires doivent respecter les échéances ci-dessous lorsqu’ils soumettent des mouvements de RH :<*Article_List*>Retournez la trousse de la lettre d’offre (y compris la lettre d’offre signée et tous les documents de paye pertinents) à la personne-ressource de la dotation indiquée dans la lettre d’offre 15 jours ouvrables avant la date d’entrée en poste.<*Article_List*>Les gestionnaires sous-délégataires des pouvoirs et les employés doivent approuver les demandes de RH dans le SGRH 15 jours ouvrables avant la date d’entrée en fonction.<*Article_List*>Soumettez les demandes d’intervention de paye (DIP) pour les employés qui entrent en poste ou reviennent d’un congé sans solde par l’intermédiaire de l’outil Services et soutien en ressources humaines avant leur départ ou dès leur retour au travail pour que leur paye puisse être immédiatement mise en marche ou interrompue."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"9", BusinessLine:"Pay", Category:"Heures et horaires de travail", Title:"Heures supplémentaires", Type:"Article", Content:"<*Article_H1*>Heures supplémentaires<*Article_Body*>Le terme « heures supplémentaires » renvoie à la rémunération du travail autorisé effectué en plus des heures normales de travail quotidiennes ou hebdomadaires ou pendant les jours de repos auxquels un employé a normalement droit, conformément aux dispositions de la convention collective ou des conditions d’emploi pertinentes.<*Article_Body*>Les heures supplémentaires doivent être autorisées à l’avance et approuvées conformément à l’article 34 de la Loi sur la gestion des finances publiques (LGFP) et à la convention collective applicable à l’employé.<*Article_Body*>Remarque : Les employés occupant un poste exclu ou sous-représenté n’ont pas droit aux heures supplémentaires. Au lieu de cela, ils peuvent être admissibles à un congé de direction. Pour obtenir de plus amples renseignements sur les employés considérés comme exclus/non représentés, consultez l’annexe de la Directive sur les conditions d’emploi.<*Article_H2*>Rémunération sous forme de congé (congé compensatoire)<*Article_Body*>Pour demander la rémunération d’heures supplémentaires sous forme de congé (congé compensatoire), voici le processus à suivre :<*Article_List*>Remplissez le formulaire « DND 907 » à partir du Répertoire des formulaires de la Défense.<*Article_List*>Soumettez le formulaire à votre gestionnaire délégué aux termes de l’article 34 pour approbation et signature.<*Article_List*>Une fois le formulaire reçu, le gestionnaire délégué aux termes de l’article 34 soumet le formulaire par l’entremise de l’outil Services et soutien en ressources humaines (SSRH). Sous l’onglet Autres, veuillez sélectionner Services supplémentaires en temps de congés compensatoires.<*Article_H2*>Rémunération en argent<*Article_Body*>Pour obtenir une rémunération des heures supplémentaires en argent, veuillez suivre le processus suivant :<*Article_H3*>Employés qui relèvent de gestionnaires civils délégués aux termes de l’article 34 :<*Article_List*>Toutes les heures supplémentaires doivent être soumises par l’employé, ou au nom de ce dernier, directement dans Phénix.<*Article_List*>Les gestionnaires délégués aux termes de l’article 34 doivent approuver la demande au plus tard à 14 h (HNE) le lundi d’une semaine qui n’est pas une semaine de paye.<*Article_List*>Les employés doivent s’assurer que leurs données sont entrées dans Phénix au plus tard à 20 h 30 HNE le dimanche de la semaine de paye.<*Article_H3*>Employés qui relèvent de gestionnaires militaires :<*Article_List*>Remplissez le formulaire « DND 907 » dans le Répertoire des formulaires de la Défense.<*Article_List*>Présentez le formulaire à votre gestionnaire délégué aux termes de l’article 34 pour approbation et signature.<*Article_List*>Une fois approuvé, soumettez-le par l’entremise de l’outil Services et soutien en ressources humaines (SSRH) pour traitement bimensuel ou mensuel.<*Article_List*>Sous l’onglet « Comptabil. du temps », veuillez sélectionner « Rémunération pour services supplémentaires, en argent ».<*Article_H3*>Gestionnaires délégués aux termes de l’article 34 :<*Article_List*>Les employés doivent soumettre leurs heures supplémentaires directement dans Phénix au plus tard à 20 h 30 le dimanche de la semaine de paye.<*Article_List*>Les gestionnaires délégués aux termes de l’article 34 doivent terminer l’approbation au plus tard à 14 h (HNE) le lundi de la semaine suivante qui n’est pas une semaine de paye, pour s’assurer que le paiement sera traité à temps.<*Article_H1*>Gestionnaires militaires délégués aux termes de l’article 34 :<*Article_List*>·       Les gestionnaires militaires délégués aux termes de l’article 34 doivent approuver et signer le formulaire « DND 907 » du Répertoire des formulaires de la Défense.<*Article_List*>·       Une fois le formulaire approuvé, les gestionnaires militaires délégués aux termes de l’article 34 doivent le soumettre aux deux semaines ou mensuellement par l’intermédiaire de l’outil Services et soutien en ressources humaines (SSRH) pour traitement.<*Article_List*>·       Sous l’onglet « Comptabil. du temps », veuillez sélectionner « Rémunération pour services supplémentaires, en argent ».<*Article_Note*>Remarque : Lorsqu’un jour férié tombe le vendredi ou le lundi où il faudrait normalement soumettre ou approuver les feuilles de temps dans Phénix, la date limite est devancée.<*Article_H1*>Gestion des horaires des employés<*Article_Body*>En tant que gestionnaire délégué aux termes de l’article 34, vous devez veiller à ce que les horaires de travail de vos employés soient entrés correctement dans Phénix.<*Article_Body*>Les horaires de travail varient d’une personne à l’autre. Dans le cas des employés à temps partiel, ils peuvent également varier d’un contrat à l’autre.<*Article_Body*>Une mauvaise gestion et tenue à jour des horaires des employés entraîneront des résultats incorrects dans le Libre-service, ce qui pourrait avoir une incidence sur les paiements des employés.<*Article_Body*>Consultez GCpedia pour obtenir plus de renseignements sur la manière de saisir ou de supprimer les horaires des employés.<*Article_Body*>Pour obtenir de l’aide sur la saisie des horaires, les gestionnaires délégués aux termes de l’article 34 peuvent communiquer avec un responsable du temps."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"10", BusinessLine:"Pay", Category:"Heures et horaires de travail", Title:"Gestion des horaires des employés", Type:"Article", Content:"<*Article_H1*>Gestion des horaires des employés<*Article_Body*>En tant que gestionnaire délégué aux termes de l’article 34, vous devez veiller à ce que les horaires de travail de vos employés soient entrés correctement dans Phénix.<*Article_Body*>Les horaires de travail varient d’une personne à l’autre. Dans le cas des employés à temps partiel, ils peuvent également varier d’un contrat à l’autre.<*Article_Body*>Une mauvaise gestion et tenue à jour des horaires des employés entraîneront des résultats incorrects dans le Libre-service, ce qui pourrait avoir une incidence sur les paiements des employés.<*Article_Body*>Consultez GCpedia pour obtenir plus de renseignements sur la manière de saisir ou de supprimer les horaires des employés.<*Article_Body*>Pour obtenir de l’aide sur la saisie des horaires, les gestionnaires délégués aux termes de l’article 34 peuvent communiquer avec un responsable du temps.<*Article_H1*>Gestion des horaires des employés<*Article_Body*>En tant que gestionnaire délégué aux termes de l’article 34, vous devez veiller à ce que les horaires de travail de vos employés soient entrés correctement dans Phénix.<*Article_Body*>Les horaires de travail varient d’une personne à l’autre. Dans le cas des employés à temps partiel, ils peuvent également varier d’un contrat à l’autre.<*Article_Body*>Une mauvaise gestion et tenue à jour des horaires des employés entraîneront des résultats incorrects dans le Libre-service, ce qui pourrait avoir une incidence sur les paiements des employés.<*Article_Body*>Consultez GCpedia pour obtenir plus de renseignements sur la manière de saisir ou de supprimer les horaires des employés.<*Article_Body*>Pour obtenir de l’aide sur la saisie des horaires, les gestionnaires délégués aux termes de l’article 34 peuvent communiquer avec un responsable du temps."};
    contentData.push(returnedItem);   
//STUDENT ARTICLES
    returnedItem = {Ref:"11", BusinessLine:"Students", Category:"Information sur l’embauche d’étudiant", Title:"Information sur l’embauche d’étudiants à l’intention des gestionnaires", Type:"Article", Content:"<*Article_H1*>Information sur l’embauche d’étudiants à l’intention des gestionnaires<*Article_List*>Commencez à embaucher vos étudiants tôt. <*Article_List*>Appuyez l’intégration des étudiants en entreprenant un processus d’embauche en temps opportun à l’aide du NOUVEAU calculateur de la date de début d’emploi des étudiants. <*Article_List*>  Présentez le dossier de dotation complet au moins 30 jours ouvrables avant la date de début choisie. <*Article_List*>  Établissez la date de fin d’emploi des étudiants un jour de paie afin d’éliminer les retards dans l’émission de leur dernière paye. <*Article_List*>Préparez un espace de travail fonctionnel pour les étudiants à leur arrivée.<*Article_List*>Accueillez les étudiants en ayant recours à des mécanismes d’orientation qui permettront aux étudiants de comprendre leur engagement en vertu du Code des valeurs et de l’éthique du secteur public. <*Article_List*>Donnez aux étudiants un aperçu du Coin des étudiants du MDN, en soulignant les ressources clés comme la liste des formations et le Passeport de l’étudiant;<*Article_List*>Confiez aux étudiants, pendant toute la période d’emploi, du travail significatif qui leur permettra d’apprendre et de contribuer à l’atteinte des objectifs de l’organisation;"};
    contentData.push(returnedItem);
    returnedItem = {Ref:"12", BusinessLine:"Students", Category:"Information sur l’embauche d’étudiant", Title:"Équipe nationale d’embauche des étudiants", Type:"Article", Content:"<*Article_H1*>Équipe nationale d’embauche des étudiants<*Article_Body*>Notre équipe offre des outils virtuels, des listes de vérifications et des processus simplifiés afin d’aider les gestionnaires à identifier, à évaluer et à embaucher rapidement les nouveaux étudiants, à réembaucher d’anciens étudiants et à intégrer d’anciens étudiants (nouveaux diplômés) dans des postes civils d’une durée indéterminée ou déterminée."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"13", BusinessLine:"Students", Category:"Information sur l’embauche d’étudiant", Title:"Vérification de la fiabilité des étudiants", Type:"Article", Content:"<*Article_H1*>Le processus de vérification de la fiabilité des étudiants<*Article_Body*>Communiquez avec l’agent de sécurité de votre section afin d’entamer le processus de vérification de la fiabilité et de veiller à satisfaire aux exigences supplémentaires relatives au filtrage de sécurité. Veuillez consulter les instructions de sécurité pour obtenir de plus amples renseignements.<*Article_Note*>REMARQUE : Pour que l’USS établisse l’ordre de priorité des demandes, ajoutez qui suit dans la ligne d’objet de la demande : EMBAUCHE D’ÉTUDIANTS POUR L’AF 2019-2020."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"14", BusinessLine:"Students", Category:"Information sur l’embauche d’étudiant", Title:"Des nouveaux programmes PFETE ciblés", Type:"Article", Content:"<*Article_H1*>Des nouveaux programmes PFETE ciblés<*Article_H3*>Le programme d’opportunité d’emploi pour étudiants autochtones (OEEA)<*Article_Body*>Les gestionnaires recruteurs peuvent maintenant accéder à ce bassin d’étudiants talentueux en présentant des demandes de candidatures à la CFP et en sélectionnant le répertoire du programme OEEA.<*Article_H3*>Occasion d’emploi pour étudiants en situation de handicap (OEEH)<*Article_Body*>OEEH est une initiative nationale de recrutement qui vise les étudiants qui déclarent être en situation de handicap pour une occasion d’emploi pour étudiants. Présentez une demande de candidatures à la CFP<*Article_H3*>Occasion d’emploi pour étudiant réserviste (OEER)<*Article_Body*>Les gestionnaires peuvent s’attendre à recevoir des étudiants référés qui ont une bonne compréhension de la terminologie du MDN et un niveau de fiabilité de la sécurité. Les gestionnaires peuvent accéder à cet inventaire en sélectionnant le répertoire du programme OEER."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"15", BusinessLine:"Students", Category:"Information sur l’embauche d’étudiant", Title:"e-Dotation et réembauche des étudiants", Type:"Article", Content:"<*Article_H1*>e-Dotation et réembauche des étudiants<*Article_Body*>Toutes les demandes de réembauche d’étudiants continueront d’être soumises au moyen du portail de la e-Dotation. The National Student Hiring Team will work in the e-Staffing system to complete the transaction and issue the letter of offer to the hiring manager.  "};
    contentData.push(returnedItem);
    returnedItem = {Ref:"16", BusinessLine:"Students", Category:"FAQ", Title:"FAQ - PFETE", Type:"Article", Content:"<*Article_H1*>FAQ concernant le Programme fédéral d’expérience de travail étudiant (PFETE)<*Article_H3*>Un non-Canadien satisfaisant aux exigences du poste peut-il être embauché?<*Article_Body*>Conformément à l’alinéa 39(1)(c) de la Loi sur l’emploi dans la fonction publique, la préférence doit être accordée aux citoyens canadiens. Il faut donc offrir un stage à un étudiant canadien qui satisfait aux exigences avant d’offrir le poste à un étudiant qui n’a pas la citoyenneté canadienne.<*Article_H3*>Lorsqu’il n’y a pas de Canadiens satisfaisant aux exigences ou lorsque leur nombre n’est pas suffisant pour répondre aux besoins de l’organisation, est-ce que des postulants qui n’ont pas la citoyenneté canadienne peuvent être nommés?<*Article_Body*>Oui. S’il n’y a pas de Canadiens qui satisfont aux exigences du poste ou si leur nombre est insuffisant pour répondre aux besoins de l’organisation, les non‑Canadiens répondant aux exigences du poste peuvent être nommés. Toutefois, les non-Canadiens sélectionnés doivent être légalement autorisés à travailler au Canada<*Article_H3*>Les étudiants sont-ils admissibles au régime de pension et aux avantages sociaux?<*Article_Body*>Oui, la plupart des étudiants sont admissibles au régime de pension et aux avantages sociaux. L’admissibilité et les dates relatives à chacun des avantages varient en fonction des heures de travail des étudiants (temps plein ou temps partiel) et de la durée de l’emploi, respectivement. Pour obtenir de plus amples renseignements, veuillez consulter le Guide des prestations pour les étudiants dans le Libre-service de Phénix.<*Article_H3*>Un étudiant peut-il occuper deux emplois du PFETE en même temps?<*Article_Body*>Rien dans la politique n’empêche un étudiant d’effectuer deux affectations (« double emploi »).<*Article_Body*>Cela dit, la situation de double emploi ne doit pas créer de conflit d’intérêts pour l’une ou l’autre des organisations (ou pour l’un ou l’autre des gestionnaires d’embauche). Par conséquent, les gestionnaires d’embauche des deux organisations doivent être au courant de la situation. Il est important de se rappeler que les étudiants doivent travailler à temps partiel pendant la session d’études et à temps plein seulement pendant l’été (37,5 heures).<*Article_Body*>En outre, il faut garder à l’esprit qu’en raison de leur charge de travail scolaire, certains étudiants sont obligés de limiter le nombre d’heures travaillées, alors que d’autres pourront en consacrer davantage. Ainsi, le gestionnaire d’embauche et l’étudiant doivent établir ensemble l’horaire de travail. Il faut demeurer conscient que l’un des principaux objectifs des programmes d’emploi pour étudiants (pour permettre la réussite scolaire et l’équilibre entre le travail et la vie personnelle) pourrait ne pas être atteint si l’étudiant travaille trop.<*Article_H3*>Un étudiant du programme Coop peut-il être réembauché en tant qu’étudiant du PFETE?<*Article_Body*>Oui, pourvu qu’il satisfasse aux critères d’admissibilité précisés dans la Politique sur l’embauche des étudiants.<*Article_H3*>Quelle est la différence entre un programme d’enseignement coopératif et un stage?<*Article_Body*>Le programme Coop est un programme d’enseignement comprenant en alternance une formation reçue en classe et des sessions de travail pertinent durant lesquelles le rendement est évalué.<*Article_Body*>Le stage est une formation sur place sous la supervision d’employés expérimentés. Il vise à donner à l’étudiant les compétences et connaissances nécessaires à l’entrée sur le marché du travail.<*Article_H3*>Quelle est la durée normale des affectations?<*Article_Body*>C’est l’établissement d’enseignement de l’étudiant qui détermine la durée de chacune des affectations. Les programmes d’enseignement coopératif durent généralement quatre mois et les stages entre quatre et dix-huit mois. Sous réserve de l’approbation préalable de l’établissement d’enseignement, les gestionnaires peuvent offrir plusieurs stages consécutifs.<*Article_H3*>Un étudiant peut-il être embauché quel que soit le programme d’enseignement coopératif ou le stage auquel il participe?<*Article_Body*>Non. Seuls les étudiants inscrits à un programme d’enseignement coopératif ou de stage approuvé par la Commission de la fonction publique (CFP) peuvent être embauchés. On peut consulter la liste de tous les programmes approuvés sur le site Web de la CFP, dans la section « Programmes approuvés ».<*Article_Body*>Lorsqu’un programme comprend des stages de travail obligatoires et optionnels, seuls les stages de travail obligatoires pour l’obtention du diplôme peuvent être effectués à la fonction publique.<*Article_H3*>Faut-il préparer un plan d’apprentissage pour les étudiants participant au programme d’enseignement coopératif ou de stage?<*Article_Body*>Oui, la Politique du Conseil du Trésor sur l’embauche des étudiants exige de préparer un plan d’apprentissage pour chaque affectation. Les ministères peuvent élaborer un plan d’apprentissage sur mesure ou bien utiliser le plan générique fourni par l’établissement d’enseignement, et l’assortir d’une description de l’affectation. De plus, les ministères doivent évaluer les progrès des étudiants.<*Article_Body*>La rétroaction constitue un élément important du processus d’apprentissage. Le plan d’apprentissage est donc essentiel, car il fixe les objectifs que l’étudiant doit atteindre. De plus, c’est un outil qui permet d’évaluer les progrès et le rendement de l’étudiant à la fin de l’affectation."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"17", BusinessLine:"Students", Category:"FAQ", Title:"FAQ - Embauche d’un(e) ancien(ne) étudiant(e)", Type:"Article", Content:"<*Article_H1*>FAQ concernant l’embauche d’un(e) ancien(ne) étudiant(e)<*Article_H3*>Comment puis-je embaucher un ancien étudiant au sein de mon organisation?<*Article_Body*>Le mécanisme de dotation pour l’embauche d’un ancien étudiant (anciennement appelé « transition des étudiants ») est généralement un processus externe non annoncé, pour lequel le mérite est appliqué et une autorisation en matière de priorité est requise. La Norme de service est de 82 jours ouvrables. Une fois que votre demande de dotation a été reçue par l’Équipe nationale d’embauche d’étudiants (ENEE), un conseiller en dotation de l’Équipe sera assigné pour vous aider avec le processus d’embauche. Les 82 jours ouvrables tiennent compte des évaluations de langue seconde (ELS) et des vérifications de sécurité qui peuvent être requises; si le candidat a déjà des résultats d’ELS ou si le test n’est pas requis, le temps de traitement diminue en conséquence.<*Article_Body*>Un conseiller en dotation de l’ENEE vous fournira des conseils judicieux et des échéanciers tout au long du processus.<*Article_H3*>J’aimerais embaucher un ancien étudiant, mais je n’ai pas de candidat pour mon poste. Par où commencer?<*Article_Body*>Il existe de nombreuses façons de communiquer avec de jeunes diplômés talentueux : communiquez avec d’autres gestionnaires qui ont embauché des étudiants, consultez les centres de placement de carrière des universités et collèges locaux ou les associations d’anciens étudiants (communiquez avec l’ENEE pour obtenir des conseils) ou envisagez d’embaucher des étudiants du Programme fédéral d’expérience de travail étudiant (PFETE) ou de programmes d’alternance travail‑études dans le cadre du plan des RH immédiat et à long terme de votre organisation.<*Article_Body*>Pour entrer immédiatement en contact avec les nouveaux diplômés, inscrivez-vous à GCcollab et jetez un coup d’œil au Carrefour de carrière.<*Article_Body*>Vous pouvez facilement faire une recherche pour trouver des candidats admissibles et disponibles à l’aide de l’Inventaire d’intégration des étudiants du Carrefour de carrière de GCcollab. Il s’agit d’un outil de recherche de talents et de réseautage qui tire parti de l’information que les utilisateurs partagent dans leur profil GCcollab afin de trouver des occasions pertinentes. Il s’agit d’un espace numérique permettant aux étudiants d’indiquer qu’ils souhaitent trouver un emploi et aux gestionnaires d’afficher des postes vacants et des offres d’emploi. Il aide à relier les étudiants et les gestionnaires à l’échelle du gouvernement et est accessible aux fonctionnaires fédéraux, provinciaux et territoriaux, ainsi qu’aux universitaires et aux étudiants de toutes les universités et collèges canadiens.<*Article_Body*>Inscrivez-vous dès maintenant à GCcollab et remplissez votre profil. Les gestionnaires peuvent afficher des offres d’emploi sur la plateforme Carrefour de carrière, consulter des offres sur GCcollab, ou encore rechercher des profils d’utilisateurs pour trouver des talents externes en fonction des compétences recherchées. Si vous cherchez à embaucher d’anciens étudiants du MDN, allez à l’onglet « Trouver des membres » ou à l’onglet « Rechercher des possibilités » sur la page d’accueil du Carrefour de carrière et triez par « Intégration des étudiants », puis entrez vos critères souhaités pour un poste spécifique.<*Article_H3*>Quelles sont les conditions d’admissibilité pour l’embauche d’un ancien étudiant? <*Article_Body*>Le SMA(RH-Civ) a fourni les lignes directrices suivantes pour l’embauche d’anciens étudiants pour le MDN (Bulletin 101 du DPOS, juin 2018) : les anciens étudiants sont admissibles à l’embauche à condition qu’ils :<*Article_List*>n’occupent pas actuellement un emploi à temps plein, à temps partiel, saisonnier ou pour une période déterminée dans la fonction publique; <*Article_List*>aient obtenu un diplôme d’un établissement d’enseignement reconnu au plus tard 60 mois (5 ans) avant la date de nomination, en faisant preuve d’une certaine souplesse pour prolonger ce délai s’il y a lieu pour le poste à pourvoir; <*Article_List*>satisfassent aux critères de mérite et aux conditions d’emploi du poste. <*Article_Body*>Si vous avez en tête un candidat qui répond aux critères ci-dessus et que vous avez un poste vacant, communiquez avec l’ENEE pour en savoir plus !<*Article_H3*>L’embauche d’un ancien étudiant nécessite-t-elle une autorisation en matière de priorité? <*Article_Body*>Oui! L’embauche d’un ancien étudiant est une nomination en vertu de la Loi sur l’emploi dans la fonction publique (LEFP), qui comprend l’obligation d’évaluer les personnes bénéficiant d’un droit de priorité avant de considérer d’autres candidats. Le processus d’autorisation en matière de priorité prend environ 10 jours ouvrables et doit être pris en compte dans le délai de traitement des dossiers. Si une personne bénéficiant d’un droit de priorité manifeste son intérêt pour le poste, elle doit être évaluée en fonction des qualifications essentielles et des conditions d’emploi du poste d’une manière équitable, transparente et opportune. Conformément à la LEFP, si une personne bénéficiant d’un droit de priorité est jugée qualifiée pour le poste, cette personne sera nommée au poste à pourvoir.<*Article_H3*>Mon conseiller en dotation peut-il présenter une autorisation en matière de priorité?  <*Article_Body*>Non. Un conseiller en dotation de l’ENEE vous aidera dans le processus d’embauche d’un ancien étudiant du début à la fin. Cela assure la continuité du service et le traitement efficace et rapide du dossier de dotation. Cela nous permet également de formuler des recommandations en lien avec les efforts de rajeunissement associés à l’embauche d’anciens étudiants.<*Article_H3*>Dois-je évaluer le candidat? <*Article_Body*>Oui. L’évaluation du candidat confirme de quelle manière le candidat satisfait à chacune des qualifications essentielles du poste telles que présentées dans les critères de mérite, y compris la compétence dans les langues officielles. La documentation de l’évaluation peut comprendre, sans toutefois s’y limiter, des notes d’entrevue et de vérification des références, une preuve de scolarité, le curriculum vitae et une lettre de présentation du candidat, ainsi que des évaluations narratives rédigées par des gestionnaires qui peuvent attester que le candidat satisfait aux critères de mérite. Votre conseiller en dotation de l’ENEE peut travailler avec vous pour s’assurer que suffisamment d’information est recueillie pour démontrer de quelle manière le candidat répond aux exigences de qualifications essentielles du poste.<*Article_H3*>Quels sont les renseignements contenus dans la justification de la décision de sélection? <*Article_Body*>Il y a au moins deux éléments contenus dans la justification de la décision de sélection, tel qu’il est décrit dans le Guide de la Directive SMA(RH-Civ), Nominations :<*Article_List*>une brève explication du choix du processus de dotation;<*Article_List*>le nom du candidat retenu, ainsi que la confirmation qu’il satisfait aux critères de mérite essentiels du poste à pourvoir.<*Article_Body*>La justification de la décision de sélection comprend également d’autres facteurs qui ont été pris en compte, comme les plans de recrutement et de maintien en poste des employés, la planification de la relève, la représentation en matière d’équité en emploi, etc. Veuillez consulter un exemple d’une Justification sur le site SharePoint de l’ENEE sur le recrutement de talents étudiants pour obtenir des conseils.<*Article_H3*>Pourquoi me recommande-t-on de prévoir 25 jours ouvrables entre la date d’émission de la lettre d’offre et la date de début prévue de l’employé?<*Article_Body*>Les normes de service du SCT décrivent ces recommandations afin d’éviter les problèmes liés à la rémunération.<*Article_H3*>Si un candidat a satisfait à toutes les exigences du programme, mais n’a pas de diplôme, que dois-je faire?<*Article_Body*>La preuve de la réussite du programme peut comprendre des documents tels qu’un diplôme, un relevé de notes ou une lettre de l’établissement d’enseignement. Le document doit clairement confirmer que le programme d’études a été réussi et indiquer la date d’obtention du diplôme. Le gestionnaire doit valider cette information et confirmer que le candidat a satisfait à ces critères de mérite en tant qu’élément essentiel du dossier d’embauche d’un ancien étudiant.<*Article_H3*>Dois-je fournir une preuve de citoyenneté et un diplôme? <*Article_Body*>En vertu de la Loi sur l’emploi dans la fonction publique, les citoyens canadiens doivent être considérés pour des postes avant les autres candidats. La confirmation de la citoyenneté canadienne du candidat est une exigence du dossier. Toutefois, les documents personnels ne doivent pas être conservés dans le dossier de dotation. Une confirmation écrite du gestionnaire d’embauche suffira.<*Article_Body*>De même, la preuve de la réussite d’un programme, comme un diplôme, est une partie essentielle de l’embauche d’un ancien étudiant. Le gestionnaire n’est pas tenu de fournir une copie du diplôme, mais la confirmation écrite que le gestionnaire a validé la qualification scolaire est une exigence du dossier. Notez toutefois que pour certaines professions à risque élevé, le gestionnaire pourrait exiger des preuves plus tangibles d’attestation d’études. Le conseiller en dotation doit alors fournir des copies de ces attestations ou indiquer qu’il les a consultées. Cette information devra être consignée au dossier de dotation.<*Article_H3*>Qu’est-ce qu’une lettre d’offre conditionnelle?<*Article_Body*>Une lettre d’offre conditionnelle est une offre d’emploi conditionnelle. Toutefois, avant de pouvoir procéder à la dotation, le mérite doit être entièrement évalué, toutes les exigences de l’offre conditionnelle (obtention d’un diplôme, administration de tests et conditions d’emploi, par exemple vérification de sécurité) doivent être respectées et la prestation de serment doit avoir eu lieu. Le candidat ne peut commencer à travailler tant qu’il ne remplit pas toutes les conditions.<*Article_Body*>Les personnes bénéficiant d’un droit de priorité doivent être considérées en premier et l’autorisation en matière de priorité doit être reçue avant qu’une lettre d’offre conditionnelle puisse être émise.<*Article_H3*>Pourquoi mes critères de mérite nécessitent-ils tant de changements? <*Article_Body*>Les candidats à l’embauche d’un ancien étudiant ont le potentiel d’avoir une brillante carrière dans la fonction publique, mais ils n’ont souvent pas une vaste expérience. L’ENEE recommande que les critères de mérite de votre poste mettent l’accent sur les compétences personnelles requises pour le poste, plutôt que sur l’expérience et les connaissances approfondies qui peuvent être acquises au travail. En examinant l’ébauche de vos critères de mérite, votre conseiller en dotation de l’ENEE peut également cerner les redondances dans les qualifications essentielles auxquelles l’ancien étudiant répondrait probablement étant donné qu’il a récemment terminé un programme d’études. Un autre avantage de cette approche est qu’elle simplifie votre processus d’évaluation.<*Article_H3*>Parlez-moi du filtrage de sécurité. <*Article_Body*>L’exigence de sécurité d’un poste est une condition d’emploi que le candidat doit satisfaire avant d’être nommé. Pour les postes nécessitant l’accès à des renseignements et à des biens classifiés, il est à noter que les exigences en matière de sécurité d’un poste ne peuvent être déclassées pour faciliter le processus d’embauche (Ordonnances et directives de sécurité de la Défense nationale - Chapitre 4). Veuillez communiquer avec le superviseur de la sécurité de votre unité pour amorcer le processus de filtrage de sécurité ou le transfert d’un autre ministère. Veuillez consulter le site Web du DGSD pour en savoir davantage.<*Article_H3*>Où puis-je trouver de l’information sur les normes de qualification minimales? <*Article_Body*>Toutes les nominations sont régies par les Normes de qualification pour l’administration publique centrale, tel que déterminé par le SCT pour chaque groupe d’emploi et classification. Les critères de mérite du poste doivent refléter à la fois la norme de qualification applicable et les exigences d’admissibilité pour l’embauche d’un ancien étudiant; c’est-à-dire que le candidat doit avoir obtenu son diplôme d’un établissement d’enseignement reconnu dans les 60 mois suivant sa nomination.<*Article_H3*>Pourquoi mon employé devrait-il commencer le premier jour d’une période de paye?<*Article_Body*>Le fait que votre employé commence le premier jour d’une période de paye lui permettra de recevoir un salaire complet de deux semaines à sa première paye. Comme nous sommes payés à terme échu, le fait qu’un employé commence à travailler un lundi ou une semaine non payée entraînerait un temps d’attente supplémentaire avant que celui‑ci ne reçoive un paiement complet.<*Article_Body*>Cela dit, dans le cas d’un emploi pour une période déterminée, le premier jour d’une période de paye n’est pas aussi important que le dernier jour d’une période de paye. Dans ce cas, le salarié n’a pas à attendre son dernier paiement.<*Article_H3*>Si mon employé connaît un retard de rémunération, quelle pourrait en être la raison?<*Article_Body*>Tout est une question de coordination. Le MDN est le seul responsable de l’embauche et de la réembauche d’un employé. Pour que la nomination soit effective et que la paye commence, l’entrée des données doit être effectuée par les RH et tous les documents doivent être soumis au Centre des services de paye en temps opportun. Cela comprend le retour de la lettre d’offre, ainsi que tous les autres documents requis tels que le serment, les données pour le dépôt direct, les formulaires fiscaux, etc. Le Centre des services de paye de la fonction publique a établi une norme de service de 20 jours ouvrables pour le début et la fin de la paye. Si un employé n’a toujours pas reçu de paiement après la période de 20 jours ouvrables, il a le droit de demander une avance de salaire d’urgence (ASU)."};
    contentData.push(returnedItem);
    //LEAVE ARTICLES
    returnedItem = {Ref:"19", BusinessLine:"Pay", Category:"Congés", Title:"Principes de base des Congés", Type:"Article", Content:"<*Article_H1*>Congés<*Article_Body*>« Congé » désigne l’absence autorisée du travail d’un employé pendant ses heures de travail normales ou régulières. Pour obtenir de plus amples renseignements, veuillez consulter la Directive sur les congés et les modalités de travail spéciales et la Convention collective pour la fonction publique du Secrétariat du Conseil du Trésor.<*Article_H2*>Congé payé (Libre-service) <*Article_H2*>Congé non payé (CNP)<*Article_H3*>Employés qui relèvent d’un gestionnaire civil (article 34) :<*Article_Body*>Pour effectuer une demande de CNP de plus de cinq jours, l’employé doit remplir le formulaire GC 178 dans le Répertoire des formulaires de la Défense. Le gestionnaire pourra ensuite approuver et soumettre la demande dans le système Services et soutien en ressources humaines, en sélectionnant l’option « Soumettre une demande d’intervention de paye ».<*Article_H3*>Employés qui relèvent d’un gestionnaire militaire (article 34) :<*Article_Body*>Pour effectuer une demande de CNP de moins de six jours, l’employé doit remplir le formulaire GC 178 dans le Répertoire des formulaires de la Défense. Le gestionnaire pourra ensuite approuver et soumettre la demande dans le système Services et soutien en ressources humaines, en sélectionnant l’option « Accéder à l’outil de comptabilisation du temps »; la demande pourra ainsi être traitée par un responsable de la comptabilisation du temps.<*Article_Body*>Pour effectuer une demande de CNP de plus de cinq jours, l’employé doit remplir le formulaire GC 178 dans le Répertoire des formulaires de la Défense. Le gestionnaire pourra ensuite approuver et soumettre la demande dans le système Services et soutien en ressources humaines, en sélectionnant l’option « Soumettre une demande d’intervention de paye ».<*Article_Note*>Nota : Seul un gestionnaire autorisé peut approuver une demande de congé. Le niveau de délégation varie en fonction de la nature et de la durée d’une demande de congé.<*Article_Body*>Les gestionnaires ayant le pouvoir délégué d’approuver les congés doivent :<*Article_List*>approuver toutes les demandes de congé en faisant preuve d’équité, de cohérence et de transparence;<*Article_List*>indiquer aux employés les sources d’information pertinentes (p. ex., conseiller en rémunération ministériel) avant d’approuver une demande de congés ou de modalités de travail spéciales pouvant avoir une incidence sur la rémunération ou les avantages sociaux;<*Article_List*>Obtenir des conseils et des directives des conseillers en ressources humaines concernant les demandes de congé non payé attribuable à une maladie ou au titre d’activités politiques aux termes de la Loi sur l’emploi dans la fonction publique;<*Article_List*>remettre au conseiller en rémunération ministériel les demandes approuvées en vue du traitement des congés non payés ou des modalités de travail spéciales. "};
    contentData.push(returnedItem);
    returnedItem = {Ref:"20", BusinessLine:"Pay", Category:"Congés", Title:"Congé avec étalement du revenu", Type:"Article", Content:"<*Article_H1*>Congé avec étalement du revenu<*Article_Body*>Un congé avec étalement du revenu permet aux employés admissibles de réduire le nombre de semaines de travail effectuées au cours d’une période de 12 mois en prenant un congé non payé d’une durée pouvant aller de cinq semaines à trois mois.<*Article_Body*>La rémunération de l’employé est réduite et étalée sur la période de 12 mois afin de tenir compte de la présence réduite au travail. Les prestations de retraite et les avantages sociaux, ainsi que les cotisations, sont les mêmes qu’avant l’entente.<*Article_List*>Une fois le congé approuvé, le gestionnaire doit soumettre la demande dans le système Services et soutien en ressources humaines afin que la source fiable puisse envoyer le formulaire ainsi qu’une demande d’intervention de paye au Centre des services de paye.<*Article_H2*>Fonctionnement<*Article_Body*>La politique s’applique à tous les employés représentés par tous les syndicats, ainsi qu’aux employés non représentés et exemptés.<*Article_Body*>Le congé proprement dit peut être pris en deux périodes à l’intérieur des 12 mois. Chaque période doit durer au moins cinq semaines, et la somme des deux périodes ne doit pas dépasser trois mois. Bien qu’il reçoit un revenu tout au long de la période de 12 mois, l’employé est réputé être en congé non payé les jours non travaillés."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"21", BusinessLine:"Pay", Category:"Congés", Title:"Congé de transition à la retraite", Type:"Article", Content:"<*Article_H1*>Congé de transition à la retraite<*Article_Body*>Il s’agit de modalités de travail spéciales en vertu desquelles les employés admissibles qui sont à moins de deux ans de leur retraite ont le droit de réduire leur semaine de travail jusqu’à concurrence de 40 p. 100. Pour les employés à temps plein, cela équivaut à 2 jours par tranche de cinq jours de travail.<*Article_H2*>Comment présenter une demande<*Article_H2*>Fonctionnement<*Article_Body*>La rémunération de l’employé est rajustée pour tenir compte de la semaine de travail réduite, mais le niveau de participation aux régimes de pension et d’avantages sociaux (y compris les cotisations payables) demeure inchangé. L’employé demeure assujetti à la convention collective ou aux conditions d’emploi (CE) applicables, et sa situation d’emploi (temps plein/temps partiel) demeure la même."};
    contentData.push(returnedItem);

    //STUDENT PRE-ONBOARDING
    returnedItem = {Ref:"22", BusinessLine:"Students", Category:"Student Onboarding", Title:"Avant l’accueil et l’intégration des étudiants", Type:"Article", Content:"<*Article_H1*>Avant l’accueil et l’intégration des étudiants <*Article_Body*>Nous voulons aider à faire de votre processus d’intégration une expérience positive!  Avant de commencer votre emploi au Ministère de la Défense nationale (MDN), veuillez-vous assurer de prendre le temps de passer en revue les renseignements ci-dessous afin de vous préparer à votre première journée de travail.  <*Article_H2*>Renseignez-vous sur qui nous sommes<*Article_List*>Allez à la page ::external::À propos de nous||http://www.forces.gc.ca/fr/a-propos-de-nous.page::external:: pour vous renseigner sur l’Équipe de la Défense et les priorités organisationnelles.  <*Article_H2*>Familiarisez-vous avec la structure organisationnelle du MDN, les grades et les insignes des FAC<*Article_List*>Accédez à la page ::external::À propos – Structure de l’organisation||http://www.forces.gc.ca/fr/a-propos-structure-org/index.page::external:: pour vous renseigner sur la structure hiérarchique de haut niveau du MDN. <*Article_List*>Accédez à la page ::external::Grades et nomination||https://www.canada.ca/fr/ministere-defense-nationale/services/histoire-militaire/histoire-patrimoine/insignes-drapeaux/grades/insignes-grade-fonction.html::external pour vous renseigner sur les grades au sein des Forces armées canadiennes (FAC). <*Article_H2*>Familiarisez-vous aux Conditions d’emploi des étudiants<*Article_List*>Les étudiants sont payés conformément aux ::external::Conditions d’emploi pour les étudiants||https://www.tbs-sct.gc.ca/pol/doc-fra.aspx?id=12583::external:: (taux de rémunération des étudiants). Le jour de rémunération est toutes les deux semaines, le mercredi, et vous pouvez vous attendre à être payé trois à quatre semaines à compter de la date de début de votre emploi (::external::car nous sommes payés à terme échu||https://www.canada.ca/fr/secretariat-conseil-tresor/services/remuneration/taux-remuneration/taux-remuneration-etudiants.html::external::).<*Article_List*>À défaut d’un congé, les étudiants ont droit à une indemnité de congé équivalant à quatre pour cent de leurs gains pour les heures normales de travail et les heures supplémentaires.<*Article_H2*>Lisez et remplissez tous les formulaires fournis par votre gestionnaire ou les Ressources humaines (RH)<*Article_List*>Lettre d’offre<*Article_List*>Formulaire de dépôt direct<*Article_List*>Formulaires d’impôt (fédéral et provincial)<*Article_List*>Questionnaire de l’employé<*Article_List*>Brochure Les activités politiques et vous!<*Article_List*>Brochure Code de valeurs et d’éthique du MDN et des FC<*Article_List*>Formulaire d’auto-identification du MDN/des FC<*Article_H2*>Préparez-vous pour votre premier jour de travail<*Article_Body*>Si votre gestionnaire n’a pas communiqué avec vous, veuillez communiquer avec lui ou avec elle pour confirmer la date et l’heure prévue d’arrivée, le lieu de travail, les options de transport ou de stationnement, ce qu’il faut faire lorsque vous arrivez, etc. <*Article_List*>Soyez prêt à discuter avec votre gestionnaire de votre rôle et de vos attentes, des heures de travail et des pauses, des mesures d’adaptation en milieu de travail nécessaires, ainsi que de la rémunération. Préparez vos questions puisque votre gestionnaire se réservera du temps pour passer en revue votre lettre d’offre et d’autres documents associés aux RH avec vous.<*Article_List*>Renseignez-vous au sujet du code vestimentaire, de la langue de travail (y compris la désignation de votre unité de travail) et des autres attentes culturelles en milieu de travail. <*Article_H2*>Ce que vous devez apporter<*Article_Body*>Pièce d’identité valide avec photo émise par le gouvernement (c.-à-d. permis de conduire, passeport, etc.) pour obtenir un laissez-passer temporaire.<*Article_Body*>La lettre d’offre et tout autre formulaire, tel qu’indiqué par votre gestionnaire. <*Article_H2*>Au MDN<*Article_Body*>Au MDN, vous aurez accès au Programme d’accueil et d’intégration des étudiants, qui vous aidera à prendre connaissance de votre nouvel environnement de travail. De plus amples renseignements vous seront fournis à votre arrivée. Nous vous encourageons à tirer profit des renseignements et des outils offerts concernant l’accueil et l’intégration afin de bien comprendre votre rôle et de vous assurer de vivre une expérience de travail positive parmi nous.<*Article_Body*>Si vous avez des questions, veuillez communiquer avec ::external::l’Équipe d’accueil et d’intégration des étudiants du MDN.||mailto:DNDOnboarding-AcceuiletintégrationduMDN@forces.gc.ca::external::"};
    contentData.push(returnedItem);

    return contentData;
}
