var frameModule = require("ui/frame");
var buttonModule = require("ui/button");
var view = require("ui/core/view");
var observable = require("data/observable");
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const Button = require("tns-core-modules/ui/button/").Button;
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
var pageData = new observable.Observable();
const email = require("nativescript-email");

exports.pageLoaded = function(args) {
   
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
    displayPOCs(getFromDatabase());
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page");
    
};
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
    topmost.navigate("FR_POC-page");
}
exports.searchPOC = function(){
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
    
}
var displayPOCs = function(POCs){
    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();
    for(i = 0; i < POCs.length; i++ ){
        POCList.addChild(createPOCGrid(POCs[i].Title, POCs[i].Phone, POCs[i].Email, POCs[i].Desc));
    }
};
var createPOCGrid = function(POC_t, POC_p, POC_e, POC_d){
    var gridLayout = new layout.GridLayout();
    var POCTitle = new Label();
    var POCPhone = new Button();
    var POCEmail = new Button();
    var POCDesc = new Label();

    POCTitle.text = POC_t;
    POCTitle.className = "POC_H1";
    POCPhone.text = "Téléphone: " + POC_p;
    POCPhone.className = "POC_Phone";
    POCPhone.phone = POC_p;
    POCEmail.text = "Courriel: " + POC_e;
    POCEmail.className = "POC_Phone";
    POCEmail.email = POC_e;
    POCDesc.text = "Description: " + POC_d;
    POCDesc.className = "POC_Body";

    POCPhone.on(buttonModule.Button.tapEvent, callPOC, this);
    POCEmail.on(buttonModule.Button.tapEvent, emailPOC, this);

    layout.GridLayout.setRow(POCTitle, 0);
    layout.GridLayout.setRow(POCPhone, 1);
    layout.GridLayout.setRow(POCEmail, 2);
    layout.GridLayout.setRow(POCDesc, 3);
    gridLayout.addChild(POCTitle);
    gridLayout.addChild(POCPhone);
    gridLayout.addChild(POCEmail);
    gridLayout.addChild(POCDesc);
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var phoneRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var emailRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(phoneRow);
    gridLayout.addRow(emailRow);
    gridLayout.addRow(descRow);
    gridLayout.className = "POC_Grid";

    return gridLayout;

};
var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    dbRow = {Title:"Centre de Service de Paye", Phone:"1-888-HRTOPAY", Email:"", Desc:"You can contact the Public Service Pay Center (PSPC) as your first stop for any pay related issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"HRSS Support Line", Phone:"1-833-747-6363", Email:"", Desc:"The Human Resources Services and Support (HRSS) hotline can be contacted for technical issues related to the HRSS system."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Section 34 Manager Support Line", Phone:"1-833-747-6363", Email:"", Desc:"If you are a Section 34 Manager experiencing issues with time approval related tasks, agents at this hotline can help walk through your issues."};
    databaseReturn.push(dbRow);
    dbRow = {Title:"PSPC Pension Center", Phone:"1-800-561-7930", Email:"", Desc:"PSPC is responsible for all federal pension plans (Public Service, RCMP and Canadian Armed Forces). If you have questions about your pension, contact the Government of Canada Pension Centre"};
    databaseReturn.push(dbRow);
    dbRow = {Title:"Employee Assistance Program", Phone:"1-800-268-7708", Email:"", Desc:"EAP offers solutions to both prevent and address the concerns of employers, employees, and immediate family members."};
    databaseReturn.push(dbRow);
    dbRow ={Title:"Services publics et Approvisionnement Canada: Demandes de renseignements généraux", Phone: "1-800-926-9105", Email: "questions@tpsgc-pwgsc.gc.ca", Desc:"Si vous ne trouvez pas la réponse à vos questions sur le site Web, vous pouvez envoyer vos demandes et vos questions générales aux coordonnées ci-après."};

databaseReturn.push(dbRow);

dbRow ={Title:"Système de gestion d'apprentissage RAD: Bureau d'aide", Phone: "1-844-750-1643 ", Email: "DLN-RAD@FORCES.GC.CA", Desc:"Il s’agit d’un environnement ministériel qui permet de gérer, de développer et de donner de l’instruction en ligne, tout en fournissant à l’Équipe de la Défense un environnement propice à l’éducation permanente et à la mise en commun du savoir."};

databaseReturn.push(dbRow);

dbRow ={Title:"Centre de contact avec la clientèle de SPAC (Employés du Gouvernement du Canada)", Phone: "1-855-686-4729", Email: "N/A", Desc:"Un personnel compétent et enthousiaste est à la disposition des employés pour répondre à toute question relative aux demandes de renseignements sur la paye."};

databaseReturn.push(dbRow);

dbRow ={Title:"Demandes de renseignements sur l'impôt des particuliers", Phone: "1-800-959-7383 ", Email: "N/A", Desc:"Composez ce numéro pour obtenir des renseignements sur l'impôt pour les particuliers, les fiducies, l'impôt international et les non-résidents, notamment les déclarations de revenus, les acomptes provisionnels et les REER, ou pour obtenir nos formulaires et publications."};

databaseReturn.push(dbRow);

dbRow ={Title:"Demandes de renseignements sur les prestations", Phone: "1-800-387-1193 ", Email: "N/A", Desc:"Composez ce numéro pour obtenir des renseignements sur l’allocation canadienne pour enfants (ACE), le crédit pour la TPS/TVH et les programmes provinciaux et territoriaux connexes, ainsi que la prestation pour enfants handicapés."};

databaseReturn.push(dbRow);

dbRow ={Title:"Programmes provinciaux pour l'Ontario (PPO)", Phone: "1-877-627-6664 ", Email: "N/A", Desc:"Composez ce numéro pour vos demandes de renseignements au sujet du versement de la prestation trillium de l'Ontario (PTO) — incluant le crédit de la taxe de vente de l'Ontario (CTVO), le paiement pour le crédit d'impôt de l'Ontario pour les coûts d'énergie et l'impôt foncier (CIOCEIF) et le paiement pour le crédit pour les coûts d'énergie dans le Nord de l'Ontario (CCENO) — le paiement de la subvention aux personnes âgées propriétaires pour l'impôt foncier de l'Ontario (SPAPIFO) et la prestation de transition à la taxe de vente de l'Ontario (PTTVO)."};

databaseReturn.push(dbRow);

dbRow ={Title:"SERT (Système électronique de renseignements par téléphone)", Phone: "1-800-267-6999 ", Email: "N/A", Desc:"Ce service automatisé fournit des renseignements aux particuliers et aux entreprises."};

databaseReturn.push(dbRow);

dbRow ={Title:"Revenu Québec", Phone: "1 800 267-6299 ", Email: "N/A", Desc:"Renseignements généraux, Impôt, Votre dossier fiscal, Changement d'adresse, Avis de cotisation, Dépôt direct Programme d'accompagnement pour les particuliers en affaires."};

databaseReturn.push(dbRow);

dbRow ={Title:"Centres d'apprentissage et de carrière (CAC)", Phone: "Julie Faubert, Chef d’équipe 613-901-6310", Email: "P-OTG.LCCTraining@intern.mil.ca", Desc:"Nos conseillers en apprentissage hautement qualifiés dispensent des services de consultation en matière d’apprentissage et de carrière à des séances en groupes ou en salles de classe."};

databaseReturn.push(dbRow);

dbRow ={Title:"Prix et reconnaissance", Phone: "613-901-7322", Email: "Awards-Recompenses@forces.gc.ca", Desc:"Découvrez la liste des prix disponibles aux employés de SMA(RH-Civ) et comment vous pouvez nommer vos collègues pour souligner l’excellence de leurs rendements. "};

databaseReturn.push(dbRow);

dbRow ={Title:"Programme de la gestion des collectivités", Phone: "613-901-6652", Email: "P-OTG.CommunityMgmt@intern.mil.ca", Desc:"Notre objectif est de donner une expérience positive pour notre effectif grâce à l'application des éléments sur la diversité et l’inclusion, la santé globale, la clarté de la vision organisationnelle et attentes individuelles (par l’entremise de la gestion des collectivités, l'apprentissage organisationnel, etc.)"};

databaseReturn.push(dbRow);

dbRow ={Title:"Centre d’intervention sur l’inconduite sexuelle", Phone: "1-844-750-1648    24/7 line", Email: "DND.SMRC-CIIS.MDN@forces.gc.ca", Desc:"Contacter un conseiller du Centre d’intervention sur l’inconduite sexuelle (CIIS), accéder à des ressources pour les dirigeants, et apprendre comment reconnaître les comportements sexuels inappropriés."};

databaseReturn.push(dbRow);

dbRow ={Title:"Gestion intégrée des conflits et des plaintes", Phone: "Marc Potvin             (613) 944-6189", Email: "marc.potvin@forces.gc.ca ", Desc:"Le centre de services de gestion des conflits et des plaintes (SGCP) de votre région vous fournira du soutien si vous souhaitez déposer une plainte officielle ou si vous faites face à un conflit. "};

databaseReturn.push(dbRow);

dbRow ={Title:"Commission canadienne des droits ", Phone: "1-888-214-1090", Email: "info.com@chrc-ccdp.gc.ca", Desc:"Au Canada, vous avez le droit de vivre libre de discrimination. Les lois vous protègent de la discrimination en raison des motifs tels que la race, le sexe, la religion ou une déficience."};

databaseReturn.push(dbRow);

dbRow ={Title:"centre de services de gestion des conflits et des plaintes", Phone: " 1-833-328-3351", Email: "N/A", Desc:"Si vous croyez être victime de harcèlement au travail, vous pouvez remplir un rapport ou déposer une plainte dans le but de régler le problème. L'unité nationale de lutte contre le harcèlement des Forces armées canadiennes vous aidera à formuler une plainte, ainsi qu'a mettre en place des mesures de prévention du harcèlement au travail issues du Programme de gestion intégrée des conflits et des plaintes (GICP)."};

databaseReturn.push(dbRow);

dbRow ={Title:"Bureau de gestion d'invalidité", Phone: "1-833-893-3388 ", Email: "Disability_Management-Gestion_Invalidite@forces.gc.ca", Desc:"Le bureau de la gestion de l’invalidité (BGI) a été créé en tant que groupe impartial, collaboratif et inclusif qui offre des services de soutien aux employés et aux superviseurs/gestionnaires qui doivent traiter des questions relatives à l’invalidité en raison d’une maladie, d’un handicap ou d’une blessure. "};

databaseReturn.push(dbRow);

dbRow ={Title:"Santé mentale et mieux-être", Phone: "N/A", Email: "P-OTG.Wellbeing@intern.mil.ca", Desc:"Le Bureau principal de la santé mentale et du mieux-être veille à la santé mentale et au mieux-être des employés, et offre des outils, des ressources et des services afin d’aider les organisations à instaurer un milieu de travail axé sur la sécurité, le soutien et le respect. "};

databaseReturn.push(dbRow);

dbRow ={Title:"Financière Sun Life - Le Régime de soins de santé de la fonction publique (RSSFP)", Phone: "1-888-757-7427 ", Email: "can_ottawaservice@sunlife.com", Desc:"Veuillez avoir votre numéro de contrat du RSSFP (055555) et votre numéro de certificat pour nous aider à répondre à vos questions relatives à votre régime d’assurance collective (p. ex. médicaments, frais médicaux)."};

databaseReturn.push(dbRow);

dbRow ={Title:"Financière Sun Life - Le Régime de services dentaires pour les pensionnés (RSDP)", Phone: "1-888-757-7427 ", Email: "can_ottawaservice@sunlife.com", Desc:"Veuillez avoir votre numéro de contrat du RSDP (025555) et votre numéro de certificat pour nous aider à répondre à vos questions relatives à votre régime d’assurance collective)."};

databaseReturn.push(dbRow);

dbRow ={Title:"La Great-West - Régime de soins dentaires de la fonction publique ", Phone: " 1 855 415 4414", Email: "N/A", Desc:""};

databaseReturn.push(dbRow);
    return databaseReturn;
};

var callPOC = function(eventData){
    console.log(eventData.object.phone);
};
var emailPOC = function(eventData){
    console.log(eventData.object.email);
    if (email.available()){
        email.compose({
            subject: "",
            body: "",
            to: eventData.object.email
        });
    } else {
        console.log("Email Not Available");
    }
};