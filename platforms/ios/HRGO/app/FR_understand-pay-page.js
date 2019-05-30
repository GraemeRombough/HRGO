var frameModule = require("ui/frame");
var view = require("ui/core/view");
var observable = require("data/observable");
var buttonModule = require("ui/button");
const Button = require("tns-core-modules/ui/button/").Button;
var pageData = new observable.Observable();
var selectedSection, selectedItem;
var pageObject;
var pageVM;
const Label = require("tns-core-modules/ui/label/").Label;
var subNavTitle = "YourPayInformation";

exports.onNavigatingTo = function(args){
    const page = args.object;
    pageObject = page;
    page.bindingContext = pageData;
    loadSections();
}
exports.pageLoaded = function(args) {
    
};
exports.navToggle = function(args){
    subNavTitle = args.object.value;
    console.log(subNavTitle);
    pageData.set(subNavTitle, !pageData.get(subNavTitle));
};

function loadSections(){
    //<Button text="Extra Duty Pay" class="Main_Nav_SubLine" tap="loadRoles"/>
    var dbReturn = getFromDataBase();
    var sections = [];
    var itemIsDuplicate = false;
    for(i = 0; i < dbReturn.length; i++){
        itemIsDuplicate = false;
        for(x = 0; x < sections.length; x++){
            if (dbReturn[i].section == sections[x]){
                itemIsDuplicate = true;
            }
        }
        if (itemIsDuplicate == false){
            sections.push(dbReturn[i].section);
        }
    }

    //Load in buttons
    var sectionStack = pageObject.getViewById("sectionLayout");
    sectionStack.removeChildren();
    for(z=0; z<sections.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = sections[z];
        addLabel.on(buttonModule.Button.tapEvent, loadItems, this);
        sectionStack.addChild(addLabel);
    }
    pageData.set("Section", true);
    pageData.set("Item", false);
    pageData.set("Descriptions", false);
    
}
function loadItems(args){
    //<Button text="Employee" class="Main_Nav_SubLine" tap="loadResponsibilities"/>
    var dbReturn = getFromDataBase();
    var relatedItems = [];
    selectedSection = args.object.text;
    //console.log(selectedProcess);
    for (i=0; i < dbReturn.length; i++){
        if (dbReturn[i].section == selectedSection && dbReturn[i].item != ""){
            relatedItems.push(dbReturn[i]);
        }
        if (dbReturn[i].section == selectedSection && dbReturn[i].item == ""){
            var descriptionsStack = pageObject.getViewById("descriptionContent");
            descriptionsStack.removeChildren();
            var descLabel = new Label();
            var titleLabel = new Label()
            descLabel.text = dbReturn[i].description;
            descLabel.className = "Article_Body";
            titleLabel.text = dbReturn[i].section;
            titleLabel.className = "Article_H3";
            descriptionsStack.addChild(titleLabel);
            descriptionsStack.addChild(descLabel);
            pageData.set("Section", false);
            pageData.set("Items", true);
        }
    }
    //console.log(relatedRoles.length);
    var itemsStack = pageObject.getViewById("itemLayout");
    itemsStack.removeChildren();
    for(z=0; z<relatedItems.length; z++){
        var addLabel = new Button();
        addLabel.className = "Main_Nav_SubLine";
        addLabel.text = relatedItems[z].item;
        addLabel.on(buttonModule.Button.tapEvent, loadDescriptions, this);
        itemsStack.addChild(addLabel);
    }

    pageData.set("Section", false);
    pageData.set("Item", true);
    pageData.set("Descriptions", true);
}
function loadDescriptions(eventData) {
    var descriptionsStack = pageObject.getViewById("descriptionContent");
    selectedItem = eventData.object.text;
    //console.log(eventData.object.text);
    var dbReturn = getFromDataBase();
    var descriptionText = "";
    //Get proper description
    for(i=0; i<dbReturn.length; i++){
        if(dbReturn[i].section == selectedSection && dbReturn[i].item == selectedItem){
            descriptionText = dbReturn[i].description;
            descriptionsStack.removeChildren();
            var descLabel = new Label();
            var titleLabel = new Label();
            descLabel.text = dbReturn[i].description;
            descLabel.className = "Article_Body";
            titleLabel.text = dbReturn[i].item;
            titleLabel.className = "Article_H3";
            descriptionsStack.addChild(titleLabel);
            descriptionsStack.addChild(descLabel);
            break;
        }
    }
    pageData.set("Section", false);
    pageData.set("Item", false);
    pageData.set("Items", true);
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
    
databaseLine ={section:"Autres Retenues", item: "Cotisations Syndicales", description: "Le montant déduit pour les cotisations syndicales."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Autres Retenues", item: "Presentation de décès", description: "Le montant déduit pour la couverture du Régime de prestations supplémentaires de décès."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Autres Retenues", item: "Assurance-invalidité", description: "Le montant déduit pour l`assurance-invalidité."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Autres Retenues", item: "Assurance-santé", description: "La somme retenue pour les primes du régime d`assurance-maladie provincial pour les provinces d`Alberta et de la Colombie-Britannique."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Autres Retenues", item: "Assurance médicale de groupe", description: "La somme retenue pour le Régime de soins de santé de la fonction publique (RSSFP), si vous avez décidé de participer à ce régime."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Autres Retenues", item: "Allo./Pres. Imposables", description: "Le montant des prestations versées par l`employeur qui sont ajoutées au revenu à des fins fiscales. "};

databaseReturn.push(databaseLine);

databaseLine ={section:"Autres Retenues", item: "Services médicaux C.-B", description: "Le montant retenu pour les soins de santé provinciaux de la C.-B."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Allocations et retenues", item: "Paiement rétroactif", description: "Une paye rétroactive est un paiement effectué pendant la période de paye en cours pour toute augmentation du salaire ou du traitement versé pendant une période antérieure."};

databaseReturn.push(databaseLine);

databaseLine ={section:"Allocations et retenues", item: "Rémunération intérimaire ", description: "Non disponible"};

databaseReturn.push(databaseLine);

databaseLine ={section:"Allocations et retenues", item: "Rajustements salarieux", description: "Non disponible"};
    return databaseReturn;
}

