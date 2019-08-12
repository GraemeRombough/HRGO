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
var pageData = new observable.Observable();
const email = require("nativescript-email");
var phone = require("nativescript-phone");
var Visibility = require("tns-core-modules/ui/enums").Visibility;
var applicationSettings = require("application-settings");
var pagePrefix  = ""

const   webViewEvents           = require("~/utilities/WebViewExtender");
var     HTMLBuilder             = require("~/utilities/HTMLBuilder");

exports.pageNavTo = function(args) {
   
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
};

exports.pageLoaded = function(args) {
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    /*
    page.getViewById("SearchBox").on("propertyChange", function(propertyChangeData) {//}: PropertyChangeData) {
        console.log("propertyChange getViewById: " + propertyChangeData.propertyName);
    });
    page.on("propertyChange", function(propertyChangeData) {//}: PropertyChangeData) {
        console.log("propertyChange page: " + propertyChangeData.propertyName);
    });
   /*
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    displayPOCs(getFromDatabase());*/
    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        pageData.set("PointsOfContactTitle", "POINT DE CONTACT");
        pagePrefix = "FR_";
    } else {
        pageData.set("PointsOfContactTitle", "POINTS OF CONTACT");
        pagePrefix = "";
    }
    displayPOCs( getFromDatabase());
};

exports.onPageSwipe = function(event) {
    if( event.direction == 1 ) {
        console.log("onPageSwipe: " + event.direction);
        const thisPage = event.object.page;
        thisPage.frame.goBack();
    }
};

exports.onTextChange = function(args) {
    console.log("Text change event");
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate(pagePrefix + "main-page");
    
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
exports.searchPOC = function() {
    var POCList     = pageObject.getViewById("POC_List");
    var pocCount    = POCList.getChildrenCount();
    var pocIndex    = 0;
    var checkText   = "";

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
    /*
    var dataBaseReturn = getFromDatabase();
    var filteredResults = [];
    if(pageData.get("SearchCriteria") != ""){
    for (i = 0; i < dataBaseReturn.length; i++) {
        if (dataBaseReturn[i].Title.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Desc.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }
    }
    displayPOCs(filteredResults);
    }else{
        displayPOCs(getFromDatabase());
    }
    */
}
var displayPOCs = function(POCs) {
    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();

    
    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        for(i = 0; i < POCs.length; i++ ){
            POCList.addChild( createPOCWebView( POCs[i].ContentFR ));
        }
    } else {
        for(i = 0; i < POCs.length; i++ ){
            POCList.addChild( createPOCWebView( POCs[i].ContentEN ));
        }
    }

    /*
    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();
    for(i = 0; i < POCs.length; i++ ){
        POCList.addChild(createPOCGrid(POCs[i].Title, POCs[i].Phone, POCs[i].Email, POCs[i].Desc));
    }
    */
};

// Create a webview object ont he page to display the POC data
var createPOCWebView = function( codedString ) {
    var webViewObj  = new WebView();

    var htmlString  = HTMLBuilder.buildHTML( codedString );
    //webViewObj.onLoaded = ;
    webViewObj.on( WebView.loadedEvent, webViewEvents.onWebViewLoaded);
    webViewObj.on( WebView.loadStartedEvent, webViewEvents.onLoadStarted);
    webViewObj.src  = htmlString;
    webViewObj.className = "POC_Grid";
    
    //exports.onLoadStarted = ;

    return webViewObj;
};


var createPOCGrid = function(POC_t, POC_p, POC_e, POC_d){
    var gridLayout = new layout.GridLayout();
    var POCTitle = new Label();
    var POCPhone = new Button();
    var POCEmail = new Button();
    var POCDesc = new Label();

    POCTitle.text = POC_t;
    POCTitle.className = "POC_H1";
    POCDesc.text = "Description: " + POC_d;
    POCDesc.className = "POC_Body";
    POCPhone.text = POC_p;
    //POCPhone.className = "POC_Phone";
    POCPhone.className = "Submit_Button_1";
    POCPhone.phone = POC_p;
    POCEmail.text = POC_e;
    //POCEmail.className = "POC_Phone";
    POCEmail.className = "Submit_Button_1";
    POCEmail.email = POC_e;
    

    POCPhone.on(buttonModule.Button.tapEvent, callPOC, this);
    POCEmail.on(buttonModule.Button.tapEvent, emailPOC, this);

    layout.GridLayout.setRow(POCTitle, 0);
    layout.GridLayout.setRow(POCDesc, 1);
    if(POCPhone.phone !="N/A"){layout.GridLayout.setRow(POCPhone, 2);}
    if(POCEmail.email != "N/A"){layout.GridLayout.setRow(POCEmail, 3);}
    
    gridLayout.addChild(POCTitle);
    gridLayout.addChild(POCDesc);
    if(POCPhone.phone !="N/A"){gridLayout.addChild(POCPhone);}
    if(POCEmail.email != "N/A"){gridLayout.addChild(POCEmail);}
    
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var phoneRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var emailRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(descRow);
    if(POCPhone.phone !="N/A"){gridLayout.addRow(phoneRow);}
    if(POCEmail.email != "N/A"){gridLayout.addRow(emailRow);}
    
    gridLayout.className = "POC_Grid";

    return gridLayout;

};

var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    dbRow = {Ref:1, TitleEN:`PSPC Call Center`, TitleFR:`Centre de Service de Paye`, ContentEN:`<*Article_H2*>PSPC Call Center<*Article_Body*>The Client Contact Centre (CCC) is the first point of contact for current and former federal public servants looking for information or help with compensation and benefits enquiries, and for technical issues when using the Compensation Web Applications (CWA) and the Phoenix pay system.::contact::1-888-HRTOPAY||tel:1-888-HRTOPAY::contact::`, ContentFR:`<*Article_H2*>Centre de Service de Paye<*Article_Body*>Le Centre de contact avec la clientèle (CCC) est le premier point de contact des fonctionnaires fédéraux, actuels et anciens, qui souhaitent obtenir de l’information ou de l’aide concernant des demandes liées à la rémunération et aux avantages sociaux, et pour des problèmes techniques liés aux Applications Web de la rémunération (AWR) et au système de paye Phénix.::contact::1-888-HRTOPAY||tel:1-888-HRTOPAY::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:2, TitleEN:`HRSS Support Line`, TitleFR:`Centre de contact à la clientèle pour le portail SSRH`, ContentEN:`<*Article_H2*>HRSS Support Line<*Article_Body*>The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system.::contact::1-833-747-6363||tel:1-833-747-6363::contact::`, ContentFR:`<*Article_H2*>Centre de contact à la clientèle pour le portail SSRH<*Article_Body*>Les employès et les gestionnaires peuvent communiquer avec le centre de service pour obtenir l'access ou pour naviguer le portail SSRH::contact::1-833-747-6363||tel:1-833-747-6363::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:3, TitleEN:`Section 34 Manager Support Line`, TitleFR:`Section 34`, ContentEN:`<*Article_H2*>Section 34 Manager Support Line<*Article_Body*>If you are a Section 34 Manager experiencing issues with time approval related tasks, agents at this hotline can help walk through your issues.::contact::1-833-747-6363||tel:1-833-747-6363::contact::`, ContentFR:`<*Article_H2*>Section 34<*Article_Body*>::contact::1-833-747-6363||tel:1-833-747-6363::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:4, TitleEN:`PSPC Pension Center`, TitleFR:`Centre des pensions`, ContentEN:`<*Article_H2*>PSPC Pension Center<*Article_Body*>The Government of Canada Pension Centre is the primary office responsible for the administration of the pension plan for Federal Public Service employees, the Public Service Superannuation Act (PSSA).::contact::1-800-561-7930||tel:1-800-561-7930::contact::`, ContentFR:`<*Article_H2*>Centre des pensions<*Article_Body*>Le Centre des pensions du gouvernement du Canada est le principal responsable de l'administration du régime de pensions des fonctionnaires fédéraux, conformément à la Loi sur la pension de la fonction publique (LPFP).::contact::1-800-561-7930||tel:1-800-561-7930::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:5, TitleEN:`Employee Assistance Program`, TitleFR:`Programme d'aide aux employés`, ContentEN:`<*Article_H2*>Employee Assistance Program<*Article_Body*>EAP offers solutions to both prevent and address the concerns of employers, employees, and immediate family members.::contact::1-800-268-7708||tel:1-800-268-7708::contact::`, ContentFR:`<*Article_H2*>Programme d'aide aux employés<*Article_Body*>Nous offrons des solutions pour répondre aux préoccupations des employeurs, des employés et des membres de la famille immédiate.::contact::1-800-268-7708||tel:1-800-268-7708::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:6, TitleEN:`Public Services and Procurement Canada: General Inquiries `, TitleFR:`Services publics et Approvisionnement Canada: Demandes de renseignements généraux`, ContentEN:`<*Article_H2*>Public Services and Procurement Canada: General Inquiries <*Article_Body*>For questions not answered on our website refer to the contact information below.::contact::1-800-926-9105||tel:1-800-926-9105::contact::::contact::questions@tpsgc-pwgsc.gc.ca||mailto:questions@tpsgc-pwgsc.gc.ca::contact::`, ContentFR:`<*Article_H2*>Services publics et Approvisionnement Canada: Demandes de renseignements généraux<*Article_Body*>Si vous ne trouvez pas la réponse à vos questions sur le site Web, vous pouvez envoyer vos demandes et vos questions générales aux coordonnées ci-après.::contact::1-800-926-9105||tel:1-800-926-9105::contact::::contact::questions@tpsgc-pwgsc.gc.ca||mailto:questions@tpsgc-pwgsc.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:7, TitleEN:`DLN Learning Management System: Help Desk `, TitleFR:`Système de gestion d'apprentissage RAD: Bureau d'aide`, ContentEN:`<*Article_H2*>DLN Learning Management System: Help Desk <*Article_Body*>The DLN is an enterprise environment for managing, developing and delivering on-line training, as well as for providing the Defence Team with an environment favourable to continuous learning and the sharing of knowledge.::contact::1-844-750-1643||tel:1-844-750-1643::contact::::contact::DLN-RAD@FORCES.GC.CA||mailto:DLN-RAD@FORCES.GC.CA::contact::`, ContentFR:`<*Article_H2*>Système de gestion d'apprentissage RAD: Bureau d'aide<*Article_Body*>Il s’agit d’un environnement ministériel qui permet de gérer, de développer et de donner de l’instruction en ligne, tout en fournissant à l’Équipe de la Défense un environnement propice à l’éducation permanente et à la mise en commun du savoir.::contact::1-844-750-1643||tel:1-844-750-1643::contact::::contact::DLN-RAD@FORCES.GC.CA||mailto:DLN-RAD@FORCES.GC.CA::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:8, TitleEN:`PSPC Client Contact Centre (Government of Canada Employees)`, TitleFR:`Centre de contact avec la clientèle de SPAC (Employés du Gouvernement du Canada)`, ContentEN:`<*Article_H2*>PSPC Client Contact Centre (Government of Canada Employees)<*Article_Body*>Friendly and knowledgeable operators can answer general questions related to employee pay enquiries.::contact::1-855-686-4729||tel:1-855-686-4729::contact::`, ContentFR:`<*Article_H2*>Centre de contact avec la clientèle de SPAC (Employés du Gouvernement du Canada)<*Article_Body*>Un personnel compétent et enthousiaste est à la disposition des employés pour répondre à toute question relative aux demandes de renseignements sur la paye.::contact::1-855-686-4729||tel:1-855-686-4729::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:9, TitleEN:`Individual tax enquiries`, TitleFR:`Demandes de renseignements sur l'impôt des particuliers`, ContentEN:`<*Article_H2*>Individual tax enquiries<*Article_Body*>Call this number for tax information for individuals, trusts, international tax and non-residents, including personal income tax returns, instalments, and RRSPs or to get our forms and publications::contact::1-800-959-8281||tel:1-800-959-8281::contact::`, ContentFR:`<*Article_H2*>Demandes de renseignements sur l'impôt des particuliers<*Article_Body*>Composez ce numéro pour obtenir des renseignements sur l'impôt pour les particuliers, les fiducies, l'impôt international et les non-résidents, notamment les déclarations de revenus, les acomptes provisionnels et les REER, ou pour obtenir nos formulaires et publications.::contact::1-800-959-7383||tel:1-800-959-7383::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:10, TitleEN:`Benefit enquiries (CRA Child and family benefits)`, TitleFR:`Demandes de renseignements sur les prestations`, ContentEN:`<*Article_H2*>Benefit enquiries (CRA Child and family benefits)<*Article_Body*>Call this number for information on the Canada child benefit (CCB), the GST/HST credit, and related provincial and territorial programs, as well as the child disability benefit.::contact::1-800-387-1193||tel:1-800-387-1193::contact::`, ContentFR:`<*Article_H2*>Demandes de renseignements sur les prestations<*Article_Body*>Composez ce numéro pour obtenir des renseignements sur l’allocation canadienne pour enfants (ACE), le crédit pour la TPS/TVH et les programmes provinciaux et territoriaux connexes, ainsi que la prestation pour enfants handicapés.::contact::1-800-387-1193||tel:1-800-387-1193::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:11, TitleEN:`Provincial programs for Ontario (PPO)`, TitleFR:`Programmes provinciaux pour l'Ontario (PPO)`, ContentEN:`<*Article_H2*>Provincial programs for Ontario (PPO)<*Article_Body*>Call this number for enquiries related to the Ontario trillium benefit (OTB) payment—includes the Ontario sales tax credit (OSTC), the Ontario energy and property tax credit (OEPTC), and the Northern Ontario energy credit (NOEC)—the Ontario senior homeowners' property tax grant (OSHPTG) payment,and the Ontario sales tax transition benefit (OSTTB).::contact::1-877-627-6645||tel:1-877-627-6645::contact::`, ContentFR:`<*Article_H2*>Programmes provinciaux pour l'Ontario (PPO)<*Article_Body*>Composez ce numéro pour vos demandes de renseignements au sujet du versement de la prestation trillium de l'Ontario (PTO) — incluant le crédit de la taxe de vente de l'Ontario (CTVO), le paiement pour le crédit d'impôt de l'Ontario pour les coûts d'énergie et l'impôt foncier (CIOCEIF) et le paiement pour le crédit pour les coûts d'énergie dans le Nord de l'Ontario (CCENO) — le paiement de la subvention aux personnes âgées propriétaires pour l'impôt foncier de l'Ontario (SPAPIFO) et la prestation de transition à la taxe de vente de l'Ontario (PTTVO).::contact::1-877-627-6664||tel:1-877-627-6664::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:12, TitleEN:`TIPS (Tax Information Phone Service)`, TitleFR:`SERT (Système électronique de renseignements par téléphone)`, ContentEN:`<*Article_H2*>TIPS (Tax Information Phone Service)<*Article_Body*>This automated phone service provides information to individuals and businesses.::contact::1-800-267-6999||tel:1-800-267-6999::contact::`, ContentFR:`<*Article_H2*>SERT (Système électronique de renseignements par téléphone)<*Article_Body*>Ce service automatisé fournit des renseignements aux particuliers et aux entreprises.::contact::1-800-267-6999||tel:1-800-267-6999::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:13, TitleEN:`Revenu Québec`, TitleFR:`Revenu Québec`, ContentEN:`<*Article_H2*>Revenu Québec<*Article_Body*>General information, Income tax, Your tax file, Change of address, Notice of assessment, Direct deposit ,Assistance program for individuals in business::contact::1-800-267-6299||tel:1-800-267-6299::contact::`, ContentFR:`<*Article_H2*>Revenu Québec<*Article_Body*>Renseignements généraux, Impôt, Votre dossier fiscal, Changement d'adresse, Avis de cotisation, Dépôt direct Programme d'accompagnement pour les particuliers en affaires.::contact::1-800-267-6299||tel:1-800-267-6299::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:14, TitleEN:`Learning and Career Centres (LCCs) - Talent Management for the NCR`, TitleFR:`Centres d'apprentissage et de carrière (CAC)`, ContentEN:`<*Article_H2*>Learning and Career Centres (LCCs) - Talent Management for the NCR<*Article_Body*>Our highly skilled Learning Advisors provide Learning and Career Advisory services through group settings or classroom sessions.::contact::1-613-901-6310||tel:1-613-901-6310::contact::::contact::P-OTG.LCCTraining@intern.mil.ca||mailto:P-OTG.LCCTraining@intern.mil.ca::contact::`, ContentFR:`<*Article_H2*>Centres d'apprentissage et de carrière (CAC)<*Article_Body*>Nos conseillers en apprentissage hautement qualifiés dispensent des services de consultation en matière d’apprentissage et de carrière à des séances en groupes ou en salles de classe.::contact::1-613-901-6310||tel:1-613-901-6310::contact::::contact::P-OTG.LCCTraining@intern.mil.ca||mailto:P-OTG.LCCTraining@intern.mil.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:15, TitleEN:`Awards & Recognition`, TitleFR:`Prix et reconnaissance`, ContentEN:`<*Article_H2*>Awards & Recognition<*Article_Body*>Discover the variety of awards available to the HR-Civ team and how you can recognize your colleagues for performance excellence.::contact::1-613-901-7322||tel:1-613-901-7322::contact::::contact::Awards-Recompenses@forces.gc.ca||mailto:Awards-Recompenses@forces.gc.ca::contact::`, ContentFR:`<*Article_H2*>Prix et reconnaissance<*Article_Body*>Découvrez la liste des prix disponibles aux employés de SMA(RH-Civ) et comment vous pouvez nommer vos collègues pour souligner l’excellence de leurs rendements. ::contact::1-613-901-7322||tel:1-613-901-7322::contact::::contact::Awards-Recompenses@forces.gc.ca||mailto:Awards-Recompenses@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:16, TitleEN:`Community Management Program`, TitleFR:`Programme de la gestion des collectivités`, ContentEN:`<*Article_H2*>Community Management Program<*Article_Body*>Our goal is to provide a positive employee experience for our Workforce which is achieved by applying elements of Diversity & Inclusion, Total Health, and clarity of organizational vision and individual expectations (through Community Management, Organizational Learning, etc.)::contact::1-613-901-6652||tel:1-613-901-6652::contact::::contact::P-OTG.CommunityMgmt@intern.mil.ca||mailto:P-OTG.CommunityMgmt@intern.mil.ca::contact::`, ContentFR:`<*Article_H2*>Programme de la gestion des collectivités<*Article_Body*>Notre objectif est de donner une expérience positive pour notre effectif grâce à l'application des éléments sur la diversité et l’inclusion, la santé globale, la clarté de la vision organisationnelle et attentes individuelles (par l’entremise de la gestion des collectivités, l'apprentissage organisationnel, etc.)::contact::1-613-901-6652||tel:1-613-901-6652::contact::::contact::P-OTG.CommunityMgmt@intern.mil.ca||mailto:P-OTG.CommunityMgmt@intern.mil.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:17, TitleEN:`Sexual Misconduct Response Centre - Counsellor`, TitleFR:`Centre d’intervention sur l’inconduite sexuelle`, ContentEN:`<*Article_H2*>Sexual Misconduct Response Centre - Counsellor<*Article_Body*>Contact a Sexual Misconduct Response Centre (SMRC) counsellor, access resources for leadership, and learn about how to recognize harmful and inappropriate sexual behaviour::contact::1-844-750-1648||tel:1-844-750-1648::contact::::contact::DND.SMRC-CIIS.MDN@forces.gc.ca||mailto:DND.SMRC-CIIS.MDN@forces.gc.ca::contact::`, ContentFR:`<*Article_H2*>Centre d’intervention sur l’inconduite sexuelle<*Article_Body*>Contacter un conseiller du Centre d’intervention sur l’inconduite sexuelle (CIIS), accéder à des ressources pour les dirigeants, et apprendre comment reconnaître les comportements sexuels inappropriés.::contact::1-844-750-1648||tel:1-844-750-1648::contact::::contact::DND.SMRC-CIIS.MDN@forces.gc.ca||mailto:DND.SMRC-CIIS.MDN@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:18, TitleEN:`Canadian Human Rights Commission`, TitleFR:`Commission canadienne des droits `, ContentEN:`<*Article_H2*>Canadian Human Rights Commission<*Article_Body*>Human rights laws protect people in Canada from discrimination based on grounds such as race, sex, religion or disability.::contact::1-888-214-1090||tel:1-888-214-1090::contact::::contact::info.com@chrc-ccdp.gc.ca||mailto:info.com@chrc-ccdp.gc.ca::contact::`, ContentFR:`<*Article_H2*>Commission canadienne des droits <*Article_Body*>Au Canada, vous avez le droit de vivre libre de discrimination. Les lois vous protègent de la discrimination en raison des motifs tels que la race, le sexe, la religion ou une déficience.::contact::1-888-214-1090||tel:1-888-214-1090::contact::::contact::info.com@chrc-ccdp.gc.ca||mailto:info.com@chrc-ccdp.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:19, TitleEN:`Conflict and Complaint Management Services centre`, TitleFR:`Centre de services de gestion des conflits et des plaintes`, ContentEN:`<*Article_H2*>Conflict and Complaint Management Services centre<*Article_Body*>If you feel harassed while at work you can report the incident or submit a formal complaint. The Canadian Armed Forces national harassment unit will assist you with if you choose to make a complaint. They can also help you implement workplace prevention strategies from the Integrated Conflict and Complaint Management (ICCM) program.::contact::1-833-328-3351||tel:1-833-328-3351::contact::::contact::ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca||mailto:ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca::contact::`, ContentFR:`<*Article_H2*>Centre de services de gestion des conflits et des plaintes<*Article_Body*>Si vous croyez être victime de harcèlement au travail, vous pouvez remplir un rapport ou déposer une plainte dans le but de régler le problème. L'unité nationale de lutte contre le harcèlement des Forces armées canadiennes vous aidera à formuler une plainte, ainsi qu'a mettre en place des mesures de prévention du harcèlement au travail issues du Programme de gestion intégrée des conflits et des plaintes (GICP).::contact::1-833-328-3351||tel:1-833-328-3351::contact::::contact::ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca||mailto:ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:20, 
        TitleEN:`Office of Disability Management`, 
        TitleFR:`Bureau de gestion d'invalidité`, 
        ContentEN:`<*Article_H2*>Office of Disability Management<*Article_Body*>The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury.::contact::1-833-893-3388||tel:1-833-893-3388::contact::Clients located east of Manitoba may email us at our eastern offices::contact::Disability_Management-Gestion_Invalidite@forces.gc.ca||mailto:Disability_Management-Gestion_Invalidite@forces.gc.ca::contact::Clients located west of Ontario may email us at our western offices::contact::Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca||mailto:Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca::contact::`, 
        ContentFR:`<*Article_H2*>Bureau de gestion d'invalidité<*Article_Body*>Le bureau de la gestion de l’invalidité (BGI) a été créé en tant que groupe impartial, collaboratif et inclusif qui offre des services de soutien aux employés et aux superviseurs/gestionnaires qui doivent traiter des questions relatives à l’invalidité en raison d’une maladie, d’un handicap ou d’une blessure. ::contact::1-833-893-3388||tel:1-833-893-3388::contact::Clients situés à l’est du Manitoba devront utiliser la boîte de courriel générique de la région de l’Est::contact::Disability_Management-Gestion_Invalidite@forces.gc.ca||mailto:Disability_Management-Gestion_Invalidite@forces.gc.ca::contact::Clients situés Ouest de l'Ontario devront utiliser la boîte de courriel générique de la région de l’Ouest::contact::Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca||mailto:Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca::contact::`
    };
    databaseReturn.push(dbRow);
    /*
    dbRow = {Ref:20, TitleEN:`Office of Disability Management - EAST (NL, PEI, NS, NB, QC, ON)`, TitleFR:`Bureau de gestion d'invalidité - EST (NL, PE, NS, NB, QC, ON)`, ContentEN:`<*Article_H2*>Office of Disability Management - EAST (NL, PEI, NS, NB, QC, ON)<*Article_Body*>The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury.::contact::1-833-893-3388||tel:1-833-893-3388::contact::::contact::Disability_Management-Gestion_Invalidite@forces.gc.ca||mailto:Disability_Management-Gestion_Invalidite@forces.gc.ca::contact::`, ContentFR:`<*Article_H2*>Bureau de gestion d'invalidité - EST (NL, PE, NS, NB, QC, ON)<*Article_Body*>Le bureau de la gestion de l’invalidité (BGI) a été créé en tant que groupe impartial, collaboratif et inclusif qui offre des services de soutien aux employés et aux superviseurs/gestionnaires qui doivent traiter des questions relatives à l’invalidité en raison d’une maladie, d’un handicap ou d’une blessure. ::contact::1-833-893-3388||tel:1-833-893-3388::contact::::contact::Disability_Management-Gestion_Invalidite@forces.gc.ca||mailto:Disability_Management-Gestion_Invalidite@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:21, TitleEN:`Office of Disability Management - WEST (MB, SK, BC, NU, NT, YK)`, TitleFR:`Bureau de gestion d'invalidité - OUEST (MB, SK, BC, NU, NT, YK)`, ContentEN:`<*Article_H2*>Office of Disability Management - WEST (MB, SK, BC, NU, NT, YK)<*Article_Body*>The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury.::contact::1-833-893-3388||tel:1-833-893-3388::contact::::contact::Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca||mailto:Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca::contact::`, ContentFR:`<*Article_H2*>Bureau de gestion d'invalidité - OUEST (MB, SK, BC, NU, NT, YK)<*Article_Body*>Le bureau de la gestion de l’invalidité (BGI) a été créé en tant que groupe impartial, collaboratif et inclusif qui offre des services de soutien aux employés et aux superviseurs/gestionnaires qui doivent traiter des questions relatives à l’invalidité en raison d’une maladie, d’un handicap ou d’une blessure. ::contact::1-833-893-3388||tel:1-833-893-3388::contact::::contact::Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca||mailto:Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca::contact::`};
    databaseReturn.push(dbRow);
    */
    dbRow = {Ref:21, TitleEN:`Mental Health & Wellbeing`, TitleFR:`Santé mentale et mieux-être`, ContentEN:`<*Article_H2*>Mental Health & Wellbeing<*Article_Body*> The Mental Health and Well-Being Corporate Office supports the health and well-being of employees and provides access to tools, resources and services to assist organizations in building a safe, supportive and respectful work environment.::contact::P-OTG.Wellbeing@intern.mil.ca||mailto:P-OTG.Wellbeing@intern.mil.ca::contact::`, ContentFR:`<*Article_H2*>Santé mentale et mieux-être<*Article_Body*>Le Bureau principal de la santé mentale et du mieux-être veille à la santé mentale et au mieux-être des employés, et offre des outils, des ressources et des services afin d’aider les organisations à instaurer un milieu de travail axé sur la sécurité, le soutien et le respect. ::contact::P-OTG.Wellbeing@intern.mil.ca||mailto:P-OTG.Wellbeing@intern.mil.ca::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:22, TitleEN:`Sun Life Financial - Public Service Health Care Plan (PSHCP)`, TitleFR:`Financière Sun Life - Le Régime de soins de santé de la fonction publique (RSSFP)`, ContentEN:`<*Article_H2*>Sun Life Financial - Public Service Health Care Plan (PSHCP)<*Article_Body*>Have your PSHCP contract number (055555) and certificate number available to help us assist you with your questions about your group benefits (e.g. drug, medical).::contact::1-888-757-7427||tel:1-888-757-7427::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`, ContentFR:`<*Article_H2*>Financière Sun Life - Le Régime de soins de santé de la fonction publique (RSSFP)<*Article_Body*>Veuillez avoir votre numéro de contrat du RSSFP (055555) et votre numéro de certificat pour nous aider à répondre à vos questions relatives à votre régime d’assurance collective (p. ex. médicaments, frais médicaux).::contact::1-888-757-7427||tel:1-888-757-7427::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:23, TitleEN:`Sun Life Financial - Pensioners’ Dental Services Plan (PDSP)`, TitleFR:`Financière Sun Life - Le Régime de services dentaires pour les pensionnés (RSDP)`, ContentEN:`<*Article_H2*>Sun Life Financial - Pensioners’ Dental Services Plan (PDSP)<*Article_Body*>Have your PDSP contract number (025555) and certificate number available to help us assist you with your questions about your group benefits.::contact::1-888-757-7427 ||tel:1-888-757-7427 ::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`, ContentFR:`<*Article_H2*>Financière Sun Life - Le Régime de services dentaires pour les pensionnés (RSDP)<*Article_Body*>Veuillez avoir votre numéro de contrat du RSDP (025555) et votre numéro de certificat pour nous aider à répondre à vos questions relatives à votre régime d’assurance collective).::contact::1-888-757-7427||tel:1-888-757-7427::contact::::contact::can_ottawaservice@sunlife.com||mailto:can_ottawaservice@sunlife.com::contact::`};
    databaseReturn.push(dbRow);
    dbRow = {Ref:24, TitleEN:`Great-West Life - Public Service Dental Care Plan`, TitleFR:`La Great-West - Régime de soins dentaires de la fonction publique `, ContentEN:`<*Article_H2*>Great-West Life - Public Service Dental Care Plan<*Article_Body*>::contact::1-855-415-4414||tel:1-855-415-4414::contact::`, ContentFR:`<*Article_H2*>La Great-West - Régime de soins dentaires de la fonction publique <*Article_Body*>::contact::1-855-415-4414||tel:1-855-415-4414::contact::`};
    databaseReturn.push(dbRow);
/*
    dbRow = {Title:"PSPC Call Center", Phone:"1-888-HRTOPAY", Email:"N/A", Desc:"The Client Contact Centre (CCC) is the first point of contact for current and former federal public servants looking for information or help with compensation and benefits enquiries, and for technical issues when using the Compensation Web Applications (CWA) and the Phoenix pay system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"HRSS Support Line", Phone:"1-833-747-6363", Email:"N/A", Desc:"The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Section 34 Manager Support Line", Phone:"1-833-747-6363", Email:"N/A", Desc:"If you are a Section 34 Manager experiencing issues with time approval related tasks, agents at this hotline can help walk through your issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"PSPC Pension Center", Phone:"1-800-561-7930", Email:"N/A", Desc:"The Government of Canada Pension Centre is the primary office responsible for the administration of the pension plan for Federal Public Service employees, the Public Service Superannuation Act (PSSA)."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Employee Assistance Program", Phone:"1-800-268-7708", Email:"N/A", Desc:"EAP offers solutions to both prevent and address the concerns of employers, employees, and immediate family members."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Public Services and Procurement Canada: General Inquiries ", Phone:"1-800-926-9105", Email:"questions@tpsgc-pwgsc.gc.ca", Desc:"For questions not answered on our website refer to the contact information below."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"DLN Learning Management System: Help Desk ", Phone:"1-844-750-1643", Email:"DLN-RAD@FORCES.GC.CA", Desc:"The DLN is an enterprise environment for managing, developing and delivering on-line training, as well as for providing the Defence Team with an environment favourable to continuous learning and the sharing of knowledge."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"PSPC Client Contact Centre (Government of Canada Employees)", Phone:"1-855-686-4729", Email:"N/A", Desc:"Friendly and knowledgeable operators can answer general questions related to employee pay enquiries."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Individual tax enquiries", Phone:"1-800-959-8281", Email:"N/A", Desc:"Call this number for tax information for individuals, trusts, international tax and non-residents, including personal income tax returns, instalments, and RRSPs or to get our forms and publications"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Benefit enquiries (CRA Child and family benefits)", Phone:"1-800-387-1193", Email:"N/A", Desc:"Call this number for information on the Canada child benefit (CCB), the GST/HST credit, and related provincial and territorial programs, as well as the child disability benefit."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Provincial programs for Ontario (PPO)", Phone:"1-877-627-6645", Email:"N/A", Desc:"Call this number for enquiries related to the Ontario trillium benefit (OTB) payment—includes the Ontario sales tax credit (OSTC), the Ontario energy and property tax credit (OEPTC), and the Northern Ontario energy credit (NOEC)—the Ontario senior homeowners' property tax grant (OSHPTG) payment,and the Ontario sales tax transition benefit (OSTTB)."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"TIPS (Tax Information Phone Service)", Phone:"1-800-267-6999", Email:"N/A", Desc:"This automated phone service provides information to individuals and businesses."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Revenu Québec", Phone:"1-800-267-6299", Email:"N/A", Desc:"General information, Income tax, Your tax file, Change of address, Notice of assessment, Direct deposit ,Assistance program for individuals in business"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Learning and Career Centres (LCCs) - Talent Management for the NCR", Phone:"1-613-901-6310", Email:"P-OTG.LCCTraining@intern.mil.ca", Desc:"Our highly skilled Learning Advisors provide Learning and Career Advisory services through group settings or classroom sessions."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Awards & Recognition", Phone:"1-613-901-7322", Email:"Awards-Recompenses@forces.gc.ca", Desc:"Discover the variety of awards available to the HR-Civ team and how you can recognize your colleagues for performance excellence."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Community Management Program", Phone:"1-613-901-6652", Email:"P-OTG.CommunityMgmt@intern.mil.ca", Desc:"Our goal is to provide a positive employee experience for our Workforce which is achieved by applying elements of Diversity & Inclusion, Total Health, and clarity of organizational vision and individual expectations (through Community Management, Organizational Learning, etc.)"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sexual Misconduct Response Centre - Counsellor", Phone:"1-844-750-1648", Email:"DND.SMRC-CIIS.MDN@forces.gc.ca", Desc:"Contact a Sexual Misconduct Response Centre (SMRC) counsellor, access resources for leadership, and learn about how to recognize harmful and inappropriate sexual behaviour"};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Canadian Human Rights Commission", Phone:"1-888-214-1090", Email:"info.com@chrc-ccdp.gc.ca", Desc:"Human rights laws protect people in Canada from discrimination based on grounds such as race, sex, religion or disability."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Conflict and Complaint Management Services centre", Phone:"1-833-328-3351", Email:"ICCMInquiries.DemandesrequeteGICPDGGP@forces.gc.ca", Desc:"If you feel harassed while at work you can report the incident or submit a formal complaint. The Canadian Armed Forces national harassment unit will assist you with if you choose to make a complaint. They can also help you implement workplace prevention strategies from the Integrated Conflict and Complaint Management (ICCM) program."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Office of Disability Management - EAST (NL, PEI, NS, NB, QC, ON)", Phone:"1-833-893-3388", Email:"Disability_Management-Gestion_Invalidite@forces.gc.ca", Desc:"The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Office of Disability Management - WEST (MB, SK, BC, NU, NT, YK)", Phone:"1-833-893-3388", Email:"Disability_Management_West-Gestion_Invalidite_Ouest@forces.gc.ca", Desc:"The Office of Disability Management (ODM) was created to be an impartial, collaborative and inclusive group that supports employees and supervisors/managers dealing with disability-related matter due to illness, impairment and injury."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Mental Health & Wellbeing", Phone:"N/A", Email:"P-OTG.Wellbeing@intern.mil.ca", Desc:" The Mental Health and Well-Being Corporate Office supports the health and well-being of employees and provides access to tools, resources and services to assist organizations in building a safe, supportive and respectful work environment."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sun Life Financial - Public Service Health Care Plan (PSHCP)", Phone:"1-888-757-7427", Email:"can_ottawaservice@sunlife.com", Desc:"Have your PSHCP contract number (055555) and certificate number available to help us assist you with your questions about your group benefits (e.g. drug, medical)."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Sun Life Financial - Pensioners’ Dental Services Plan (PDSP)", Phone:"1-888-757-7427" , Email:"can_ottawaservice@sunlife.com", Desc:"Have your PDSP contract number (025555) and certificate number available to help us assist you with your questions about your group benefits."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Great-West Life - Public Service Dental Care Plan", Phone:"1-855-415-4414", Email:"N/A", Desc:""};
    databaseReturn.push(dbRow);
*/
    return databaseReturn;
};

var callPOC = function(eventData){
    console.log(eventData.object.phone);
    phone.dial(eventData.object.phone,true);

};
var emailPOC = function(eventData){
    console.log(eventData.object.email);
    var toAddress = [];
    toAddress.push(eventData.object.email);
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