var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var buttonModule = require("ui/button");
const Button = require("tns-core-modules/ui/button/").Button;
var pageData = new observable.Observable();
var selectedProcess, selectedRole;
var pageObject;
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;
const fromObject = require("tns-core-modules/data/observable").fromObject;
var pageVM;
const Label = require("tns-core-modules/ui/label/").Label;
var subNavTitle = "YourPayInformation";

exports.onNavigatingTo = function(args){
    const page = args.object;
    pageObject = page;
    page.bindingContext = pageData;
    loadProcesses();
}
exports.pageLoaded = function(args) {
    
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    //alert(args.object.value).then(() => {
    console.log(subNavTitle);
    //});
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};
function loadRoles(args){
    //<Button text="Employee" class="Main_Nav_SubLine" tap="loadResponsibilities"/>
    var dbReturn = getFromDataBase();
    var relatedRoles = [];
    selectedProcess = args.object.text;
    console.log(selectedProcess);
    for (i=0; i < dbReturn.length; i++){
        if (dbReturn[i].process == selectedProcess){
            relatedRoles.push(dbReturn[i]);
        }
    }
    console.log(relatedRoles.length);
    var rolesStack = pageObject.getViewById("rolesLayout");
    rolesStack.removeChildren();
    for(z=0; z<relatedRoles.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = relatedRoles[z].role;
        addLabel.on(buttonModule.Button.tapEvent, loadResponsibilities, this);
        rolesStack.addChild(addLabel);
    }
    pageData.set("Process", false);
    pageData.set("Roles", true);
}
function loadProcesses(){
    //<Button text="Extra Duty Pay" class="Main_Nav_SubLine" tap="loadRoles"/>
    var dbReturn = getFromDataBase();
    var processes = [];
    var itemIsDuplicate = false;
    for(i = 0; i < dbReturn.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < processes.length; x++){
            if (dbReturn[i].process == processes[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            processes.push(dbReturn[i].process);
        }
    }
    //Load in buttons
    var responsibilitiesStack = pageObject.getViewById("processesLayout");
    responsibilitiesStack.removeChildren();
    for(z=0; z<processes.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = processes[z];
        addLabel.on(buttonModule.Button.tapEvent, loadRoles, this);
        responsibilitiesStack.addChild(addLabel);
    }
    pageData.set("Process", true);
    pageData.set("Roles", false);
    pageData.set("Responsibilities", false);
    
}
function loadResponsibilities(eventData) {
    var responsibilitiesStack = pageObject.getViewById("responsibilityContent");
    selectedRole = eventData.object.text;
    //console.log(eventData.object.text);
    var dbReturn = getFromDataBase();
    var descriptionText = "";
    //Get proper description
    for(i=0; i<dbReturn.length; i++){
        if(dbReturn[i].process == selectedProcess && dbReturn[i].role == selectedRole){
            descriptionText = dbReturn[i].description;
            break;
        }
    }
    //load into description area
    var descriptionItemSplit;
    var descriptionComponents = descriptionText.split("<*");
    responsibilitiesStack.removeChildren();
    var headerLabel = new Label()
    headerLabel.text = selectedProcess + "  > " + selectedRole;
    headerLabel.className = "Article_H2";
    responsibilitiesStack.addChild(headerLabel);
    for (z=0; z<descriptionComponents.length; z++){
        descriptionItemSplit = descriptionComponents[z].split("*>");
        var descLabel = new Label();
        descLabel.className = descriptionItemSplit[0];
        descLabel.text = descriptionItemSplit[1];
        responsibilitiesStack.addChild(descLabel);
    }
    pageData.set("Process", false);
    pageData.set("Roles", false);
    pageData.set("Responsibilities", true);
  }

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
var getFromDataBase = function(){
    var databaseReturn = [];
    var databaseLine = {};
    databaseLine = {process:"Avance de salaire d’urgence", role:" L’employé", description:"<*Article_Body*>L’employé doit parler avec son gestionnaire s’il souhaite présenter une demande d’avance de salaire d’urgence. <*Article_Note*>Remarque: Les employés ne sont pas obligés d’accepter une avance de salaire d’urgence qui leur est offerte. "};

databaseLine = {process:"Avance de salaire d’urgence", role:" L’employé", description:"<*Article_Body*>L’employé doit parler avec son gestionnaire s’il souhaite présenter une demande d’avance de salaire d’urgence. <*Article_Note*>Remarque: Les employés ne sont pas obligés d’accepter une avance de salaire d’urgence qui leur est offerte. "};

databaseLine = {process:"Avance de salaire d’urgence", role:" Finances", description:"<*Article_Body*>À la réception du formulaire de demande de paiement (accessible uniquement sur le réseau du gouvernement du Canada) envoyé par le Centre des services de paye, le personnel des Finances est tenu :<*Article_List*>d’obtenir l’autorisation de l’avance de salaire d’urgence en vertu de l’article 34 (conformément aux processus ministériels liés à la signature);<*Article_List*>d’émettre le paiement de l’avance de salaire d’urgence;<*Article_List*>d’envoyer le formulaire de demande de paiement signé par courriel crypté, par télécopieur ou par la poste au Service du courrier du Centre des services de paye.  "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Avance de salaire d’urgence", role:"Gestionnaire", description:"<*Article_Body*>Les gestionnaires sont tenus :<*Article_List*>de déterminer si une avance de salaire d’urgence peut être accordée, conformément à la Directive sur les conditions d’emploi;<*Article_List*>d’obtenir l’approbation pour la demande d’avance de salaire d’urgence en suivant les procédures ministérielles;<*Article_List*>de transmettre la demande d’avance de salaire d’urgence par écrit, en suivant les étapes suivantes : <*Article_List*>   étape no 1 : remplir un Formulaire de demande d’intervention de paye<*Article_List*>  étape no 2 : remplir et signer la demande d’avance de salaire d’urgence<*Article_Note*>  étape no 3 : demander à la source fiable : ◾de valider la signature<*Article_Note*>de soumettre la demande au Centre des services de paye par courriel crypté, par télécopieur ou par la poste au Service du courrier du Centre des services de paye. "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Embauche ou réembauche", role:"Ressources humaines", description:"<*Article_Body*>Le personnel des ressources humaines est chargé de ce qui suit : <*Article_List*>préparer la lettre d’offre pour les nouveaux employés;<*Article_List*>s’assurer que toute la documentation requise, y compris la lettre d’offre et le serment ou l’affirmation solennelle des nouveaux employés (au besoin), est reçue par le gestionnaire recruteur;<*Article_List*>vérifier et créer le code d’identification de dossier personnel (CIDP) de l’employé dans le Système central d’indexation;<*Article_List*>remplir adéquatement et en temps opportun les enregistrements de renseignements personnels dans le Système de gestion des ressources humaines; <*Article_List*>vérifier les données;<*Article_List*>s’assurer que l’information a bel et bien été reçue dans Phénix. <*Article_Body*>Le personnel des RH est chargé de recueillir les documents ci-après et de les envoyer par courriel crypté, par télécopieur ou par la poste au moyen d’une source fiable au Centre des services de paye; ces documents doivent être accompagnés d’un Formulaire de demande d’intervention de paye dûment rempli : <*Article_List*>le questionnaire de l’employé signé et daté;<*Article_List*>le formulaire TD1 et le formulaire d’impôt provincial remplis;<*Article_List*>la lettre d’offre et d’acceptation (cas exceptionnels uniquement, par exemple, salaire au-dessus du taux minimum, ainsi que certaines indemnités qui pourraient être propres à un employé précis [comme un employé réembauché] ou tout autre document faisant autorité [comme la lettre de nomination]); ◦si la lettre d’offre et d’acceptation est requise, l’approbation en vertu de l’article 34 de la Loi sur la gestion des finances publiques doit être authentifiée par la source fiable avant l’envoi de la lettre au Centre des services de paye. <*Article_List*>le formulaire de dépôt direct signé. "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Embauche ou réembauche", role:"Gestionnaire", description:"<*Article_H2*>Le gestionnaire disposant de pouvoirs en vertu de l’article 34 de la Loi sur la gestion des finances publiques(article 34) et la personne détenant des pouvoirs de dotation sont responsables de ce qui suit : <*Article_List*>signer la lettre d’offre;<*Article_List*>administrer le serment ou l’affirmation solennelle et s’assurer que le document est signé et envoyé aux RH (au besoin);<*Article_List*>confirmer l’arrivée de l’employé le premier jour de travail; <*Article_List*>s’assurer que l’employé a demandé une maCLÉ;<*Article_List*>effectuer toutes les tâches pertinentes dans la fonction de libre‑service des gestionnaires de Phénix, y compris les suivantes : <*Article_List*>  examiner l’horaire de travail de l’employé, notamment vérifier le statut des entrées effectuées en libre-service;<*Article_List*>  créer et assigner l’horaire de travail de l’employé. "};

databaseReturn.push(databaseLine);

databaseLine = {process:"Embauche ou réembauche", role:"Nouvel employé", description:"<*Article_H2*>Le nouvel employé<*Article_Body*>est chargé de signer ce qui suit : <*Article_List*>la lettre d’offre et d’acceptation;<*Article_List*>le serment GC-29 (au besoin).<*Article_Body*>Le nouvel employé doit remplir tous les documents requis et les transmettre au personnel des RH, accompagnés de tout autre renseignement nécessaire, notamment les suivants :<*Article_List*>le numéro d’assurance sociale;<*Article_List*>le formulaire TD1 et le formulaire d’impôt provincial;<*Article_List*>le questionnaire de l’employé;<*Article_List*>le formulaire d’inscription au dépôt direct TPSGC 8437. <*Article_Body*>Le nouvel employé doit exécuter les mesures suivantes dans le système de paye Phénix : <*Article_List*>obtenir une maCLÉ ou la mettre à jour : ◦l’employé doit avoir une adresse électronique valide du gouvernement et un code d’identification de dossier personnel (CIDP) et fournir sa date de naissance; <*Article_List*>établir la relation avec le gestionnaire (article 34) dans la fonction de libre-service de Phénix;<*Article_List*>saisir les entrées de gestion du temps appropriées. <*Article_H2*>Double emploi<*Article_Body*>L’employé en situation de double emploi doit aviser son gestionnaire qu’il est en congé non payé de son poste d’attache. <*Article_H2*>Réembauche<*Article_Body*>L’employé desservi par le Centre des services de paye doit remplir les documents suivants : <*Article_List*>le formulaire TD1 et le formulaire d’impôt provincial;<*Article_List*>le questionnaire de l’employé;<*Article_List*>le formulaire d’inscription au dépôt direct TPSGC 8437.<*Article_Body*>À la réception de la trousse d’information sur l’adhésion au régime l’employé éligible doit :<*Article_List*>accuser réception du formulaire Avis concernant la participation au régime (TPSGC 2018) au moyen des outils personnalisés de pension, accessibles à partir des Applications Web de la rémunération<*Article_Body*>ou<*Article_List*>remplir le formulaire Renseignements sur l’adhésion et confirmation de la participation au régime (TPSGC 571).  "};

databaseReturn.push(databaseLine);
    

    return databaseReturn;
}

