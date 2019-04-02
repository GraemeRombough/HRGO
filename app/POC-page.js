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


exports.pageLoaded = function(args) {
   
    const page = args.object;
    page.bindingContext = pageData;  
    pageObject = page;
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
};
exports.searchPOC = function(){
    

    var POCList = pageObject.getViewById("POC_List");
    POCList.removeChildren();
    POCList.addChild(gridLayout);
    /* <GridLayout class="POC_Grid" rows="auto,auto,auto,auto" columns="*, 60">
      <label class="POC_H1" row="0" col="0" text="PSPC Call Center" />
      <label class="POC_Icon" row="0" col="1" text="&#xe93b;"/>
      <label class="POC_Phone" row="1" col="0" colSpan="2" text="Phone: 1-888-HRTOPAY"/>
      <label class="POC_Phone" row="2" col="0" colSpan="2" text="Email: PAY@Canada.ca"/>
      <label class="POC_Body" row="3" col="0" colSpan="2" text="Description: You can contact the Public Service Pay Center (PSPC) as your first stop for any pay related issues."/>
    </GridLayout> */
}
var createPOCGrid = function(POC_t, POC_p, POC_e, POC_d){
    var gridLayout = new layout.GridLayout();
    var POCTitle = new Label();
    var POCPhone = new Button();
    var POCEmail = new Label();
    var POCDesc = new Label();

    POCTitle.text = POC_t;
    POCTitle.className = "POC_H1";
    POCPhone.text = "Phone: " + POC_p;
    POCPhone.className = "POC_Phone";
    POCEmail.text = "Email: " + POC_e;
    POCEmail.className = "POC_Phone";
    POCDesc.text = "Description: " + POC_d;
    POCDesc.className = "POC_Body";
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

}