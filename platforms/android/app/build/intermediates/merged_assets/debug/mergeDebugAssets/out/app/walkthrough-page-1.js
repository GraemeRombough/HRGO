var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const Button = require("tns-core-modules/ui/button/").Button;
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout").GridLayout;
const Label = require("tns-core-modules/ui/label/").Label;


exports.pageLoaded = function(args) {
   
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
}
exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("main-page");  
}
exports.previousSlide = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("walkthrough-page");
}
exports.nextSlide = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("walkthrough-page-2");
}
