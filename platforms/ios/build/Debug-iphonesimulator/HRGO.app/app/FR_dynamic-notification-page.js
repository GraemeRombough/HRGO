var frameModule = require("ui/frame");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const ScrollView = require("tns-core-modules/ui/scroll-view/").ScrollView;
const Label = require("tns-core-modules/ui/label/").Label;
const layout = require("tns-core-modules/ui/layouts/grid-layout");
const Button = require("tns-core-modules/ui/button/").Button;
var buttonModule = require("ui/button");
const observable = require("data/observable");
const ActionBar = require("tns-core-modules/ui/action-bar/").ActionBar;
const FormattedString = require("tns-core-modules/text/formatted-string").FormattedString;
const Span = require("tns-core-modules/text/span").Span;
const pageData = new observable.Observable();
const HtmlView = require("tns-core-modules/ui/html-view").HtmlView;
var articleReference;
var pageObject;

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
    topmost.navigate("FR_main-page");
    
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
    topmost.navigate("FR_POC-page");
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
        if(textString.includes("::external::")){
            var newFormattedText = new FormattedString();
//label.formattedText = formattedStringLabel;
            var textWithExternal = textString.split("::external::");
            console.log("TextWithExternal: " + textWithExternal.length);
            var inlineStyles = `style="height:auto; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 25px; margin-right: 25px; margin-top: 28px; margin-bottom:14px; padding-bottom:0px; white-space: normal; color: #333;"`;
            
            var htmlString = `<div ${inlineStyles}>`;
            for(i=0; i < textWithExternal.length; i++){
                if(textWithExternal[i].includes("||")){
                    var linkText = textWithExternal[i].split("||");
                    var labelSpan = new Span();
                   // console.log(linkText[1]);
                    labelSpan.text = linkText[0];
                    //labelSpan.text = `<a href="google.com> link here </a>`;
                    htmlString += `<a href="${linkText[1]}">${linkText[0]}</a>`;
                    //labelSpan.text = "<a href='http://google.com'>Hello World</a>";
                    labelSpan.url = linkText[1];
                    labelSpan.style.color = "rgb(0,31,91)";
                    newFormattedText.spans.push(labelSpan);
                }else{
                    var labelSpan = new Span();
                    labelSpan.text = textWithExternal[i];
                    newFormattedText.spans.push(labelSpan);
                    htmlString += `${textWithExternal[i]}`;
                }
            }
            articleLabel.className = articleItemSplit[0];
            articleLabel.formattedText = newFormattedText;
            //newFormattedText.className = articleItemSplit[0];
            var htmlParagraph = new HtmlView();
            //htmlParagraph.className = "Article_Body";
            htmlString += "</div>";

            htmlParagraph.html = htmlString;
            //articleSlide.addChild(articleLabel);
            //articleSlide.addChild(newFormattedText);
            articleSlide.addChild(htmlParagraph);
            
            //console.log(htmlString);
        }else{
            articleLabel.className = articleItemSplit[0];
            articleLabel.text = textString;
            articleSlide.addChild(articleLabel);
        }
        
    }
    pageData.set("HeaderTitle", curArticleText.Title);

}
var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"1", BusinessLine:"Pay", Category:"Phoenix", Title:"Entente d’indemnisation liée à Phénix", Type:"Notification", PublishDate:"July 23, 2019 07:00:00", Content:"<*Article_H1*>Entente d’indemnisation liée à Phénix<*Article_Note*>Le 23 juillet, 2019<*Article_Body*>Le système de paye de Phénix a causé beaucoup de stress et de frustration aux employés du MDN ainsi qu’à leurs familles.<*Article_Body*>Le gouvernement du Canada et 15 syndicats de la fonction publique ont conclu ::external::l’entente||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dommages-causes-systeme-paye-phenix.html::external::, qui fut annoncée pour la première fois le mois dernier, en vue d’indemniser les employés actuels et anciens touchés par les problèmes liés au système de paye Phénix.<*Article_Body*>Cette entente, élaborée conjointement par les syndicats et le gouvernement fédéral, s’applique aux employés, aux anciens employés et à la succession des employés décédés représentés par les agents négociateurs suivants du MDN :<*Article_List*>Association canadienne des agents financiers<*Article_List*>Association canadienne des employés professionnels<*Article_List*>Guilde de la Marine Marchande du Canada<*Article_List*>Association des professeurs(es) des collèges militaires du Canada<*Article_List*>Conseil des métiers et du travail du chantier maritime du gouvernement fédéral est<*Article_List*>Conseil des métiers et du travail des chantiers maritimes du gouvernement fédéral ouest<*Article_List*>Association des Chefs d’équipes des chantiers maritimes du gouvernement fédéral<*Article_List*>Fraternité internationale des ouvriers en électricité<*Article_List*>Institut professionnel de la fonction publique du Canada<*Article_Body*>L’entente vise également les employés exclus des syndicats qui ont signé cette entente ainsi que les employés non représentés et les cadres. On s’attend à ce que d’autres organismes concluent sous peu des ententes semblables avec leurs syndicats. L’Alliance de la fonction publique du Canada (AFPC) a décidé de rejeter cette offre ; toutefois, le gouvernement demeure ouvert à l’idée d’inclure à tout moment l’AFPC dans l’entente.<*Article_H2*>Admissibilité<*Article_Body*>Si vous êtes un employé actuel, vous aurez droit aux avantages en question tant que vous avez été à l’effectif pendant au moins un jour ouvrable au cours de l’année financière correspondante.<*Article_Body*>Pour les années financières/exercices 2016-2017 à 2018-2019, vous pouvez vous attendre à recevoir les heures de vacances supplémentaires dans votre banque de congés avant le 12 novembre 2019. Pour l’année financière/l’exercice 2019-2020, vous pouvez vous attendre à les recevoir dans votre banque de congés d’ici le 29 août 2020. Vous n’avez pas à présenter une demande ; elles vous seront automatiquement créditées.<*Article_Body*>Si vous êtes un employé occasionnel, étudiant ou nommé pour une période déterminée de moins de trois mois, vous n’avez pas droit à ces congés.<*Article_Body*>Ce congé offre une indemnisation de base aux employés admissibles. Cela ne diminue pas leur droit de réclamer des frais pour des dépenses, réclamer des dédommagements et des pertes financières.<*Article_Body*>La première phase de la mise en œuvre consiste à accorder des congés annuels supplémentaires aux employés actuels. Plus particulièrement, les employés admissibles recevront :<*Article_List*>2 jours de congé pour 2016-2017<*Article_List*>1 jour de congé pour 2017-2018<*Article_List*>1 jour de congé pour 2018-2019<*Article_Body*>De plus, les employés admissibles recevront 1 jour de congé pour 2019-2020, qui sera accordé à la fin du présent exercice/année financière. L’entente est établie de cette façon pour permettre de s’assurer que les nouveaux employés qui intégreront la fonction publique d’ici mars 2020 seront aussi indemnisés.<*Article_Body*>Vos droits aux congés seront automatiquement ajoutés à vos banques de congés et vous serez avisé lorsqu’ils seront prêts à vous être crédités. De plus amples renseignements sur le moment et la façon de présenter une réclamation en vue d’obtenir l’indemnisation supplémentaire décrite dans cette entente seront également communiqués au cours des prochains mois.<*Article_Body*>Je vous invite à lire la ::external::section de l’entente||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix.html::external:: qui précise les exigences d’admissibilité ainsi que les autres types d’indemnisation qui seront mis en œuvre au cours des prochains mois. Tous les détails de l’entente, y compris ::external::la foire aux questions||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix/faq-entente-dommages-systeme-paye-phenix.html::external::, sont maintenant disponibles sur le site Web ::external::Canada.ca||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix.html::external::.<*Article_Body*>Le gouvernement continue d’agir sur tous les fronts pour stabiliser le système de paye Phénix et de travailler avec les syndicats de la fonction publique à la mise au point du système de RH et de paye de la prochaine génération, la solution de rechange à long terme au système Phénix.<*Article_Body*>Communiquez avec votre représentant syndical pour toute question relative à l’entente, ou HR Connect RH ou au 1-833-RHR-MDND au sujet de la mise en œuvre des nouveaux droits au congé."};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"2", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"Déclaration du ministère de la Défense nationale et des Forces armées canadiennes", Type:"Notification", PublishDate:"July 18, 2019 05:00:00", Content:"<*Article_H1*>Déclaration du ministère de la Défense nationale et des Forces armées canadiennes<*Article_Note*>Le 18 juillet, 2019<*Article_Body*>La sous-ministre Jody Thomas et le chef d’état-major de la défense, le général Jonathan Vance, ont émis la déclaration suivante :<*Article_Body*>« Aujourd’hui, le gouvernement du Canada a annoncé que les Forces armées canadiennes et le ministère de la Défense nationale se sont entendus sur un règlement avec les demandeurs visés par des recours collectifs, lesquels ont été intentés par sept anciens membres des FAC.<*Article_Body*>« Le règlement proposé prévoit une indemnité financière, la possibilité de tirer parti d’un programme de démarches réparatrices, et plusieurs autres mesures visant à remédier à l’inconduite sexuelle dans les FAC.<*Article_Body*>« Nous sommes contents que le gouvernement et les demandeurs se soient entendus sur un règlement d’ensemble, lequel fera progresser la réalisation d’un changement de culture réel et durable. Nous reconnaissons notre obligation d’offrir un milieu de travail sécuritaire aux femmes et aux hommes des Forces armées canadiennes, aux employés du ministère de la Défense nationale et aux membres du personnel des fonds non publics, Forces canadiennes, qui ont été touchés par l’inconduite sexuelle – ce qui comprend le harcèlement sexuel, l’agression sexuelle et la discrimination fondée sur le sexe, le genre, l’identité de genre ou l’orientation sexuelle – dans le cadre de leur service militaire ou de leur emploi civil.<*Article_Body*>« À toutes les personnes qui ont eu le courage de se manifester dans le cadre de ces recours collectifs, ainsi qu’aux personnes qui le feront à l’avenir, nous regrettons sincèrement que vous ayez été touchées par une inconduite sexuelle dans notre milieu de travail.<*Article_Body*>« Nous reconnaissons qu’il faut beaucoup de courage pour se manifester, faire part d’expériences difficiles et douloureuses, et réclamer un changement.<*Article_Body*>« Nous souhaitons que le règlement permette aux victimes et aux survivants d’agression sexuelle, de harcèlement et de discrimination de tourner la page, de guérir et de sentir que leurs expériences sont reconnues. Le règlement prévoit plusieurs mesures qui permettront aux FAC et au MDN de continuer à prendre les dispositions nécessaires pour qu’ils puissent produire un changement positif durable. »"};
    contentData.push(returnedItem);
       
    
    return contentData;
}
