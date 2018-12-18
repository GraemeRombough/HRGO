var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const Button = require("tns-core-modules/ui/button/").Button;

exports.pageLoaded = function(args) {
    /*
        <StackLayout row="1" class="FooterNav" orientation="horizontal">
        <Button class="Footer_NavIcon" text="&#xe902;" width="20%" tap="goToHome"/>
        <Button class="Footer_NavIcon" text="&#xe904;"  width="20%"/>
        <Button class="Footer_NavIcon" text="&#xe994;"  width="20%"/>
        <Button class="Footer_NavIcon" text="&#xe945;"  width="20%"/>
        <Button class="Footer_NavIcon" text="&#xe953;"  width="20%"/>
        </StackLayout>

        row="1" class="FooterNav"

    */
    
    const page = args.object;
    // >> stack-layout-code-behind
    const myStack = new StackLayout();
    // Set the orientation property
    myStack.orientation = "horizontal";
    myStack.row = 1;
    myStack.className = "FooterNav";
    // >> (hide)
    const fNav1 = new Button();
    fNav1.className = "Footer_NavIcon";
    fNav1.text = String.fromCharCode(0xe902);
    fNav1.width = "20%";
    fNav1.tap = "goToHome";
    // << (hide)
    const fNav2 = new Button();
    fNav2.className = "Footer_NavIcon";
    fNav2.text = String.fromCharCode(0xe904);
    fNav2.width = "20%";
    fNav2.tap = "goToHome";

    const fNav3 = new Button();
    fNav3.className = "Footer_NavIcon";
    fNav3.text = String.fromCharCode(0xe994);
    fNav3.width = "20%";
    fNav3.tap = "goToHome";

    const fNav4 = new Button();
    fNav4.className = "Footer_NavIcon";
    fNav4.text = String.fromCharCode(0xe945);
    fNav4.width = "20%";
    fNav4.tap = "goToHome";

    const fNav5 = new Button();
    fNav5.className = "Footer_NavIcon";
    fNav5.text = String.fromCharCode(0xe953);
    fNav5.width = "20%";
    fNav5.tap = "goToHome";

    // Add views to stack layout
    myStack.addChild(fNav1);
    myStack.addChild(fNav2);
    myStack.addChild(fNav3);
    myStack.addChild(fNav4);
    myStack.addChild(fNav5);
    // << stack-layout-code-behind

    page.content = myStack;
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
