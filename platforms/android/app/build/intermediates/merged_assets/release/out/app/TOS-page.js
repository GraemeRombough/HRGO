var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
var buttonModule = require("ui/button");
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
const pageData = new observable.Observable();
var articleReference;
var pageObject;

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    //articleReference=page.navigationContext;
    pageObject = page;
    page.bindingContext = pageData;
    createArticle();
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("landing-page");
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
    topmost.navigate("profile-page");
    
}
exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    //topmost.navigate("feedback-page");
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:'feedback-page',
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
var createArticle = function()
{   
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
    headerLabel.text = "Terms and Conditions";
    headerLabel.className = "HeaderLabel";

    var LabelArray = [];
    console.log("Create Article: ");   
    var curArticleText = getArticleText(1);
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
    pageData.set("HeaderTitle", curArticleText.Title);

}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Your Pay Information", Title:"Terms and Conditions", Type:"Article", Content:"<*Article_H1*>1. Privacy <*Article_Body*>The Department of National Defence (DND) is committed to providing websites and applications that respect the privacy of visitors. This privacy notice summarizes the privacy practices for DND online activities. <*Article_Body*>All personal information collected by this institution is governed by the Privacy Act. This means that you will be informed of the purpose for which your personal information is being collected and how to exercise your right of access to that information. <*Article_H2*>Disclaimer  <*Article_Body*>It is recommended that users have a password on their phone to protect any personal information you access or store through the HR GO RH application.  <*Article_Body*>The information contained in HR GO RH has been presented with all due care.  Neither the Department of National Defence nor its partners warrant or represent that the information is free from errors or omissions. While the information is considered to be true and correct at the date of publication, changes in circumstances after the time of publication may impact on the accuracy of the information. The information may change without notice.  <*Article_Body*>In the case of discrepancy between tools, calculations or information provided on the application as compared to that provided from source information or appearing elsewhere within the DWAN, users should consult with an HR professional for clarification and confirmation. <*Article_H2*>Your Privacy and the Internet <*Article_Body*>The nature of the Internet is such that Web servers automatically collect certain information about a visit to a website, including the visitor’s Internet Protocol (IP) address. IP addresses are unique numbers assigned by Internet Service Providers (ISP) to all devices used to access the Internet. Web servers automatically log the IP addresses of visitors to their sites. The IP address, on its own, does not identify an individual. However, in certain circumstances, such as with the co-operation of an ISP for example, it could be used to identify an individual using the site. For this reason, the Government of Canada considers the IP address to be personal information, particularly when combined with other data automatically collected when visitor requests a Web page such as the page or pages visited, date and time of the visit. <*Article_Body*>Unless otherwise noted, DND does not automatically gather any specific information from you, such as your name, telephone number or email address. DND would obtain this type of information only if you supply it to us, for example, by email or by filling in a contact form. In such cases, how your personal information is handled will be provided in a Personal Information Collection Statement. <*Article_Body*>In cases where services are provided by organizations outside of the Government of Canada, such as social media platforms or mobile applications, IP addresses may be recorded by the Web server of the third-party service provider. <*Article_Body*>DND employs software programs to monitor network traffic, and to identify unauthorized attempts to upload or change information or otherwise cause damage. These programs are also used to gather anonymous information such as statistics to improve the functionality of our applications. These software programs receive and record the Internet Protocol (IP) address of the computer that has contacted our applications, the date and time of the visit and the pages visited. We make no attempt to link these addresses with the identity of individuals visiting our website unless an attempt to damage the website has been detected. <*Article_Body*>DND employs a fully automated Anti-Spam Filter to protect its employees and networks from spam. Incoming email messages that are flagged by the software as spam are deleted automatically by the technology without notification. The program is set to block email that is considered obvious spam because of its content (for example, pornographic, racist, get-rich-quick schemes, junk commercial solicitations) as determined by general industry best practice. <*Article_Body*>Questions or comments regarding this privacy policy, or the administration of the Privacy Act in the Department of National Defence may be directed to the DND Privacy Coordinator by: <*Article_List*>E-mail: atip@forces.gc.ca <*Article_List*>Telephone: (613) 992-0996 or toll free 1-888-272-8207 <*Article_List*>Facsimile: (613) 995-5777 <*Article_List*>Mail:  <*Article_List*>Treasury Board of Canada Secretariat <*Article_List*>L'Esplanade Laurier, East Tower <*Article_List*>140 O'Connor Street, 8th Floor <*Article_List*>Ottawa, Canada K1A 0R5 <*Article_Body*>If you are not satisfied with our response to your privacy concern, you may wish to contact the Office of the Privacy Commissioner by e-mail at: info@privcom.gc.ca, by telephone at 1-800-282-1376 or visit their website at: http://www.priv.gc.ca/index_e.asp. <*Article_H2*>Communicating with the Government of Canada <*Article_Body*>If you choose to send DND an email or complete a feedback form online, your personal information is used by DND in order to respond to your inquiry. The information you provide will only be shared with another government institution if your inquiry relates to that institution. DND does not use the information to create individual profiles nor does it disclose the information to anyone other than to those in the federal government who need to provide you with a response. Any disclosure of your personal information is in accordance with the Privacy Act. <*Article_Body*>Emails and other electronic methods used to communicate with the Government of Canada are not secure unless it is specifically stated on a Web or application page. Therefore, it is recommended that you do not send sensitive personal information, such as your Social Insurance Number or your date of birth, through non-secure electronic means. <*Article_Body*>Personal information from emails or completed feedback forms is collected pursuant to the Privacy Act. Such information may be used for statistical, evaluation and reporting purposes and is included in Personal Information Bank PSU 914 Public Communications <*Article_H2*>Third-Party Social Media and Sites  <*Article_Body*>DND use of social media serves as an extension of its presence on the app. Social media accounts are public and are not hosted on Government of Canada servers. Users who choose to interact with us via social media should read the terms of service and privacy policies of these third-party service providers and those of any applications you use to access them. <*Article_Body*>Personal information that you provide to the Government of Canada via social media accounts is collected under the authority of the Privacy Act. This information is collected to capture conversations (e.g. questions and answers, comments, “likes”, retweets) between you and DND. It may be used to respond to inquiries, or for statistical, evaluation and reporting purposes. Comments posted that violate Canadian law will be deleted and disclosed to law enforcement authorities. Comments that violate our rules of engagement will also be deleted. The personal information is included in Personal Information Bank PSU 938 Outreach Activities. <*Article_Body*>Links to other Internet Sites are for information only. Care has been taken in providing these links as suitable reference resources. However, due to the changing nature of the Internet content, it is the responsibility of the users to make their own investigations, decisions, enquiries about the information retrieved from other Internet Sites. Providing these links does not imply any endorsement, non-endorsement, support or commercial gain by HR GO RH. <*Article_H2*>Improving your Experience on the HR GO RH App <*Article_Body*>A digital marker is a resource created by the visitors’ browser in order to remember certain pieces of information for the Web server to reference during the same or subsequent visit to the website. Examples of digital markers are “cookies” or HTML5 web storage. Some examples of what digital markers do are as follows: <*Article_List*>they allow a website to recognize a previous visit each time the visitor accesses the site; <*Article_List*>they track what information is viewed on a site which helps website administrators ensure visitors find what they are looking for. <*Article_Body*>DND uses sessional digital markers on some portions of its website. During your on-line visit, your browser exchanges data with DND’s Web server. The digital markers used do not allow DND/ to identify individuals. <*Article_Body*>You may adjust your browser settings to reject digital markers, including cookies, if you so choose. However, it may affect your ability to interact with DND/CAF’s website. <*Article_Body*>Cookies are also used as an integral part of the identification process for some of our online applications. This is for security purposes to determine that you are who you say you are and to provide you with your confidential account information during an online session. No personal information is kept in session cookies and they are stored only in your browser’s temporary (cache) memory. When you log out of your session, the cookie is no longer valid and is discarded when you close your browser. <*Article_H2*>Web Analytics <*Article_Body*>Web analytics is the collection, analysis, measurement, and reporting of data about Web traffic and visits for purposes of understanding and optimizing Web usage. Information in digital markers may be used in conjunction with computer request data to identify and track your online interactions with the forces.gc.ca website. <*Article_Body*>Forces.gc.ca uses Google Analytics, Webtrends and log file analysis to improve the website. When your computer requests a forces.gc.ca Web page, the following types of information are collected and used for Web analytics: <*Article_List*>the originating IP address <*Article_List*>the date and time of the request <*Article_List*>the type of browser used <*Article_List*>the page(s) visited <*Article_List*>referral website <*Article_List*>Opting out of Google Analytics <*Article_Body*>If you wish, you may opt out of being tracked by Google Analytics by disabling or refusing the cookies; by disabling JavaScript within your browser; or by using the Google Analytics Opt-Out Browser Add-On. Disabling Google Analytics or JavaScript will still permit you to access comparable information or services from our websites. However, if you disable your session cookie option, you will still be able to access our public website, but you might have difficulties accessing any secure services. <*Article_H2*>Log File Analysis <*Article_Body*>Forces.gc.ca uses log file analysis internally and retains information collected for Web analytics for a maximum period of 18 months. After this period, the information must be disposed of in accordance with the Standard on Privacy and Web Analytics or as authorized by the Librarian and Archivist of Canada. The information is not disclosed to an external third party service provider. <*Article_H2*>Google Analytics Data Collection <*Article_Body*>Data collected for Web analytics purposes goes outside of Canada to Google servers and may be processed in any country where Google operates servers. Data may be subject to the governing legislation of that country, [for example the USA Patriot Act]. For further information about Google Analytics, please refer to the Google Analytics terms of service. <*Article_Body*>Information used for the purpose of Web analytics is collected pursuant to section 5 of the Department of Human Resources and Skills Development Act and section 4 of the Privacy Act. Such data may be used for communications and information technology statistical purposes, audit, and evaluation, research, planning and reporting. For more information on how your privacy is safeguarded in relation to web analytics, see the Standard on Privacy and Web Analytics.  <*Article_H2*>Protecting the Security of Government of Canada Websites <*Article_Body*>DND/CAF employs software programs to monitor network traffic to identify unauthorized attempts to upload or change information, or otherwise cause damage. This software receives and records the IP address of the computer that has contacted our website, the date and time of the visit and the pages visited. We make no attempt to link these addresses with the identity of individuals visiting our site unless an attempt to damage the site has been detected. <*Article_Body*>This information is collected pursuant to section 161 of the Financial Administration Act. The information may be shared with appropriate law enforcement authorities if suspected criminal activities are detected. Such information may be used for network security related statistical purposes, audit, evaluation, research, planning and reporting and is included in Personal Information Bank PSU 939 Security Incidents. <*Article_H2*>Inquiring about these Practices <*Article_Body*>Any questions, comments, concerns or complaints you may have regarding the administration of the Privacy Act and privacy policies regarding DND Web presence may be directed to our Access to Information and Privacy Coordinator by email at: atip@forces.gc.ca <*Article_Body*>If you are not satisfied with DND response to your privacy concern, you may wish to contact the Office of the Privacy Commissioner by telephone at 1-800-282-1376. <*Article_H1*>2. Non-Government of Canada Servers <*Article_Body*>To improve the functionality of Government of Canada websites, certain files (such as open source libraries, images and scripts) may be delivered automatically to your browser via a trusted third-party server or content delivery network. The delivery of these files is intended to provide a seamless user experience by speeding response times and avoiding the need for each visitor to download these files. Where applicable, specific privacy statements covering these files are included in our Privacy Notice. <*Article_H1*>3. Providing Content in Canada's Official Languages <*Article_Body*>The Official Languages Act, the Official Languages (Communications with and Services to the Public) Regulations and Treasury Board policy requirements establish when we use both English and French to provide services to or communicate with members of the public. When there is no obligation to provide information in both official languages, content may be available in one official language only. Information provided by organizations not subject to the Official Languages Act is in the language(s) provided. Information provided in a language other than English or French is only for the convenience of our visitors. <*Article_H1*>4. Hyperlinking <*Article_Body*>Links to websites not under the control of the Government of Canada, including those to our social media accounts, are provided solely for the convenience of our website visitors. We are not responsible for the accuracy, currency or reliability of the content of such websites. The Government of Canada does not offer any guarantee in that regard and is not responsible for the information found through these links, nor does it endorse the sites and their content. <*Article_Body*>Visitors should also be aware that information offered by non-Government of Canada sites to which this website links is not subject to the Privacy Act, the Official Languages Act and may not be accessible to persons with disabilities. The information offered may be available only in the language(s) used by the sites in question. With respect to privacy, visitors should research the privacy policies of these non-Government websites before providing personal information. <*Article_H1*>5. Crown copyright protected works <*Article_Body*>This section has been moved to: Crown copyright protected works <*Article_H1*>6. Government of Canada Symbols <*Article_Body*>Certain official symbols of the Government of Canada, including the Canada Wordmark, the Arms of Canada, and the flag symbol may not be reproduced, whether for commercial or non-commercial purposes, without prior written authorization. <*Article_Body*>As these symbols are not managed by DND/CAF, a request for authorization must be forwarded to the Treasury Board of Canada Secretariat at the following address: <*Article_List*>information@fip-pcim.gc.ca <*Article_List*>Federal Identity Program <*Article_List*>Treasury Board of Canada Secretariat <*Article_List*>300 Laurier Avenue West <*Article_List*>Ottawa, Canada K1A 0R5 <*Article_List*>Telephone: 613-957-2533 <*Article_List*>Facsimile: 613-946-5187 <*Article_H1*>7. Our Commitment to Accessibility <*Article_Body*>The Government of Canada is committed to achieving a high standard of accessibility as defined in the Standard on Web Accessibility and the Standard on Optimizing Websites and Applications for Mobile Devices. In the event of difficulty using our Web pages, applications or device-based mobile applications, please contact us for assistance or to obtain alternative formats such as regular print, Braille or another appropriate format. <*Article_H2*>Copyright <*Article_Body*>Information that we post is subject to the Copyright Act. <*Article_H2*>Privacy <*Article_Body*>Our social media accounts are not Government of Canada websites and represent only our presence on third-party service providers. <*Article_Body*>For more information, please refer to our Privacy Notice regarding third-party social media. <*Article_H2*>Official Languages <*Article_Body*>The Government of Canada respects the Official Languages Act and is committed to ensuring that our information of is available in both French and English and that both versions are equal quality. <*Article_Body*>We reply to comments in the official language in which they are posted. If we think the response is a question of general public interest, we may respond in both official languages. <*Article_Body*>We may share links that direct users to sites of organizations or other entities that are not subject to the Official Languages Act and available only in the language(s) in which they are written. When content is available in only one language, we make an effort to provide similar content in the other official language. <*Article_H2*>Questions and Media Requests <*Article_Body*>Media are asked to send questions to the appropriate Media Contact or submit a media query electronically and refrain from submitting questions to the DND/CAF social media accounts as comments. Reporters’ questions will be removed. "};
    contentData.push(returnedItem);

    return contentData;
}
