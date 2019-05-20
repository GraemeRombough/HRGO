var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const Button = require("tns-core-modules/ui/button/").Button;
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout").GridLayout;
const Label = require("tns-core-modules/ui/label/").Label;


exports.pageLoaded = function(args) {
    const page = args.object;
    // >> stack-layout-code-behind
    const articleStack = new StackLayout();
    // Set the orientation property
    articleStack.orientation = "vertical";
    articleStack.col = 1;
    articleStack.className = "Article_MainStack";
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");
    
}
exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
}
