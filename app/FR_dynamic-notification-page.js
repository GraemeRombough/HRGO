var frameModule = require("ui/frame");
const observable = require("data/observable");
const pageData = new observable.Observable();
var articleReference;

const webViewEvents = require( "./utilities/WebViewExtender");
const htmlBuilder = require( "./utilities/HTMLBuilder");

exports.pageLoaded = function(args) {
    const page = args.object;
    pageData.set("ActionBarTitle", "Hello World");
    articleReference=page.navigationContext;
    pageObject = page;
    page.bindingContext = pageData;
    
    // With Firebase, the data retrieval will be asynchronous, so that will need to be accounted for.
    var articleData = getArticleText( articleReference.ArticleID );
    pageData.set("ArticleHTML", htmlBuilder.buildHTML( articleData.Text ));
    pageData.set("HeaderTitle", articleData.Title);
};
exports.goToLanding = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_landing-page");
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


// This should prevent the page from loading new http and https links, then send the link to be opened by the default app
// Unlike the documentation I found, the second parameter for shouldOverrideUrlLoading is not giving a string object.  It is giving a WebResourceRequest object.
exports.onWebViewLoaded = webViewEvents.onWebViewLoaded;

exports.onLoadStarted = webViewEvents.onLoadStarted;

var getFromDatabase = function(){
    //returnedItem = {Ref:"", BusinessLine:"", Category:"", Title:"", Type:"", Content:""};
    var returnedItem;
    var contentData = [];
    //PAY ARTICLES
    returnedItem = {Ref:"4", BusinessLine:"Pay", Category:"Phoenix", Title:"Entente d’indemnisation liée à Phénix - Le 26 août, 2019", Type:"Notification", PublishDate:"August 26, 2019 05:00:00", Content:`<*Article_H1*>Entente d’indemnisation liée à Phénix<*Article_Note*>Le 26 août, 2019<*Article_Body*>À la suite de la conclusion de ::external::l’entente||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix.html::external:: concernant les dommages causés par Phénix, des congés annuels supplémentaires ont été ajoutés aux soldes de congés des employés admissibles.<*Article_Body*>Ces congés ont été accordés, pour les exercices 2016-2017 à 2018-2019, pour un maximum de 4 jours, aux employés admissibles en réponse aux répercussions directes ou indirectes subies par suite de la mise en œuvre du système de paye Phénix. Les employés admissibles recevront également 1 jour de congé pour 2019-2020, qui sera accordé après la fin du présent exercice.<*Article_Body*>Ce rajustement des soldes de congés est assujetti aux conditions de votre convention collective et peut donc être utilisé comme des congés annuels. Veuillez consulter les ::external::renseignements en ligne||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix.html::external:: pour :<*Article_List*>les détails sur les modalités de l’entente<*Article_List*>l’admissibilité à l’indemnisation<*Article_List*>la foire aux questions<*Article_List*>les autres types d’indemnisation qui seront mis en œuvre au cours des prochains mois<*Article_Body*>Les employés du MDN peuvent consulter leurs indemnisations liées aux dommages causés par Phénix dans le SGRH en cliquant sur l&#39;onglet « Libre‑service pour les congés » et consulter ensuite votre sommaire des congés. Le congé sera inscrit sous le code « 100 » et de plus amples renseignements sur votre droit au congé seront fournis dans la colonne « Motif rajustement » dans le tableau des transactions de congé.<*Article_Body*>L’entente sur les dommages comprend aussi une indemnité supplémentaire pour les employés admissibles. Cette indemnité, évaluée au cas par cas, sera offerte dans les mois à venir aux personnes qui ont éprouvé de graves difficultés personnelles ou financières en raison de Phénix, qui ont manqué des occasions de gagner des intérêts sur des comptes d’épargne ou dans le cadre d’autres investissements financiers et investissements en capital, et des paiements d’indemnité de départ ou de pension retardés.<*Article_Body*>Cette entente vise aussi les employés non représentés, les cadres et les employés exclus des unités de négociation dont le syndicat a signé l’entente.<*Article_Body*>Si vous avez des questions, ou si vous pensez ne pas avoir reçu tous les congés auxquels vous êtes admissible, veuillez communiquer avec ::external::HR Connect RH||https://collaboration-hr-civ.forces.mil.ca/sites/HRC-CORE/HRCON/Connect%20Library/Forms/template.xsn::external:: (::external::1-833-RHR-MDND||tel:1-833-RHR-MDND::external::). Nous examinerons et modifierons vos congés au besoin, et ce le plus rapidement possible.`};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"3", BusinessLine:"Pay", Category:"Phoenix", Title:"Entente d’indemnisation liée à Phénix - Le 23 juillet, 2019", Type:"Notification", PublishDate:"July 23, 2019 07:00:00", Content:"<*Article_H1*>Entente d’indemnisation liée à Phénix<*Article_Note*>Le 23 juillet, 2019<*Article_Body*>Le système de paye de Phénix a causé beaucoup de stress et de frustration aux employés du MDN ainsi qu’à leurs familles.<*Article_Body*>Le gouvernement du Canada et 15 syndicats de la fonction publique ont conclu ::external::l’entente||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dommages-causes-systeme-paye-phenix.html::external::, qui fut annoncée pour la première fois le mois dernier, en vue d’indemniser les employés actuels et anciens touchés par les problèmes liés au système de paye Phénix.<*Article_Body*>Cette entente, élaborée conjointement par les syndicats et le gouvernement fédéral, s’applique aux employés, aux anciens employés et à la succession des employés décédés représentés par les agents négociateurs suivants du MDN :<*Article_List*>Association canadienne des agents financiers<*Article_List*>Association canadienne des employés professionnels<*Article_List*>Guilde de la Marine Marchande du Canada<*Article_List*>Association des professeurs(es) des collèges militaires du Canada<*Article_List*>Conseil des métiers et du travail du chantier maritime du gouvernement fédéral est<*Article_List*>Conseil des métiers et du travail des chantiers maritimes du gouvernement fédéral ouest<*Article_List*>Association des Chefs d’équipes des chantiers maritimes du gouvernement fédéral<*Article_List*>Fraternité internationale des ouvriers en électricité<*Article_List*>Institut professionnel de la fonction publique du Canada<*Article_Body*>L’entente vise également les employés exclus des syndicats qui ont signé cette entente ainsi que les employés non représentés et les cadres. On s’attend à ce que d’autres organismes concluent sous peu des ententes semblables avec leurs syndicats. L’Alliance de la fonction publique du Canada (AFPC) a décidé de rejeter cette offre ; toutefois, le gouvernement demeure ouvert à l’idée d’inclure à tout moment l’AFPC dans l’entente.<*Article_H2*>Admissibilité<*Article_Body*>Si vous êtes un employé actuel, vous aurez droit aux avantages en question tant que vous avez été à l’effectif pendant au moins un jour ouvrable au cours de l’année financière correspondante.<*Article_Body*>Pour les années financières/exercices 2016-2017 à 2018-2019, vous pouvez vous attendre à recevoir les heures de vacances supplémentaires dans votre banque de congés avant le 12 novembre 2019. Pour l’année financière/l’exercice 2019-2020, vous pouvez vous attendre à les recevoir dans votre banque de congés d’ici le 29 août 2020. Vous n’avez pas à présenter une demande ; elles vous seront automatiquement créditées.<*Article_Body*>Si vous êtes un employé occasionnel, étudiant ou nommé pour une période déterminée de moins de trois mois, vous n’avez pas droit à ces congés.<*Article_Body*>Ce congé offre une indemnisation de base aux employés admissibles. Cela ne diminue pas leur droit de réclamer des frais pour des dépenses, réclamer des dédommagements et des pertes financières.<*Article_Body*>La première phase de la mise en œuvre consiste à accorder des congés annuels supplémentaires aux employés actuels. Plus particulièrement, les employés admissibles recevront :<*Article_List*>2 jours de congé pour 2016-2017<*Article_List*>1 jour de congé pour 2017-2018<*Article_List*>1 jour de congé pour 2018-2019<*Article_Body*>De plus, les employés admissibles recevront 1 jour de congé pour 2019-2020, qui sera accordé à la fin du présent exercice/année financière. L’entente est établie de cette façon pour permettre de s’assurer que les nouveaux employés qui intégreront la fonction publique d’ici mars 2020 seront aussi indemnisés.<*Article_Body*>Vos droits aux congés seront automatiquement ajoutés à vos banques de congés et vous serez avisé lorsqu’ils seront prêts à vous être crédités. De plus amples renseignements sur le moment et la façon de présenter une réclamation en vue d’obtenir l’indemnisation supplémentaire décrite dans cette entente seront également communiqués au cours des prochains mois.<*Article_Body*>Je vous invite à lire la ::external::section de l’entente||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix.html::external:: qui précise les exigences d’admissibilité ainsi que les autres types d’indemnisation qui seront mis en œuvre au cours des prochains mois. Tous les détails de l’entente, y compris ::external::la foire aux questions||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix/faq-entente-dommages-systeme-paye-phenix.html::external::, sont maintenant disponibles sur le site Web ::external::Canada.ca||https://www.canada.ca/fr/secretariat-conseil-tresor/sujets/remuneration/systeme-paye-phenix/dedommagement-employes-federaux-systeme-paye-phenix.html::external::.<*Article_Body*>Le gouvernement continue d’agir sur tous les fronts pour stabiliser le système de paye Phénix et de travailler avec les syndicats de la fonction publique à la mise au point du système de RH et de paye de la prochaine génération, la solution de rechange à long terme au système Phénix.<*Article_Body*>Communiquez avec votre représentant syndical pour toute question relative à l’entente, ou HR Connect RH ou au 1-833-RHR-MDND au sujet de la mise en œuvre des nouveaux droits au congé."};
    contentData.push(returnedItem); 
    returnedItem = {Ref:"2", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"Déclaration du ministère de la Défense nationale et des Forces armées canadiennes", Type:"Notification", PublishDate:"July 19, 2019 05:00:00", Content:"<*Article_H1*>Message de la SM, et du CEMD : Recours collectifs pour inconduite sexuelle dans les FAC et au MDN<*Article_Note*>Le 19 juillet, 2019<*Article_Body*>Le gouvernement du Canada a accepté le règlement de plusieurs recours collectifs traitant de l’inconduite sexuelle, lesquels ont été déposés au nom de membres actuels et anciens des Forces armées canadiennes (FAC).<*Article_Body*>Le règlement proposé touche les membres actuels et anciens des FAC, les employés du ministère de la Défense nationale (MDN) et les employés des fonds non publics (FNP), Forces canadiennes, qui ont été victimes d’inconduite sexuelle – entre autres, de harcèlement sexuel, d’agression sexuelle ou de discrimination fondée sur le sexe, le genre, l’identité de genre ou l’orientation sexuelle – dans le cadre de leur service militaire ou emploi civil. Pour vous renseigner davantage sur les recours collectifs et connaître l’incidence que pourrait avoir sur vous le règlement proposé, visitez le site Web sur les recours collectifs concernant l’inconduite sexuelle au sein des FAC et du MDN, à l’adresse ::external::fac-mdn-recourscollectifinconduitesexuelle.com||https://www.classaction.deloitte.ca/fr-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx::external:: ou appelez au ::external::1-888-626-2611||tel:1-888-626-2611::external::.<*Article_Body*>En notre qualité de hauts dirigeants, rien ne nous importe plus que la création d’un milieu de travail dans lequel vous vous sentez en sécurité, respecté et inclus. Depuis le lancement de l’opération HONOUR il y a quatre ans, nous avons amorcé la création d’un changement de culture durable, lequel comprend non seulement un mandat, mais également un mouvement. Nous écoutons les personnes qui ont été victimes de diverses formes d’inconduite sexuelle et tirons des leçons d’elles, tout en continuant de faire évoluer nos politiques et nos programmes. Nous sommes résolus à établir des mesures de prévention efficaces, ainsi qu’à comprendre pourquoi les incidents d’inconduite sexuelle se produisent. Nous souhaitons remédier à l’inconduite sexuelle de façon appropriée en offrant aux victimes un soutien compatissant. Cet objectif est au cœur des efforts que nous déployons.<*Article_Body*>Ce changement de culture met non seulement l’accent sur les FAC, mais également sur l’Équipe de la Défense et notre milieu de travail. Nous travaillons à bâtir un avenir meilleur pour l’ensemble des membres de l’Équipe de la Défense. Pour ce faire, nous offrons aux membres des FAC du soutien axé sur les victimes par l’intermédiaire du Centre d’intervention sur l’inconduite sexuelle et nous mettons des programmes de mieux-être et d’aide à la disposition du personnel du MDN et des FNP. Si vous avez été victime d’inconduite sexuelle, nous vous incitons à tirer parti des ressources énoncées à la fin du présent message, ainsi qu’à signaler les incidents, de sorte que nous puissions vous appuyer.<*Article_Body*>Le succès de l’Équipe de la Défense et la réalisation de la mission des FAC reposent sur la confiance inébranlable et le travail d’équipe des membres de notre personnel, militaires comme civils, peu importe leur genre ou leurs antécédents. À toutes les personnes qui ont eu le courage de se manifester dans le cadre de ces recours collectifs – ainsi qu’aux personnes qui le feront à l’avenir – nous regrettons sincèrement que vous ayez été victime d’inconduite sexuelle dans notre milieu de travail. Le règlement prévoit le versement d’une indemnité financière, la prise de mesures stratégiques singulières ayant pour objet de faire progresser les initiatives axées sur le changement de culture qui sont déjà en cours, de même que la création de possibilités pour ces personnes de faire connaître les expériences qu’elles ont vécues, au moyen de séances d’échange réparateur et de consultations. Sachez qu’en faisant part de vos expériences, vous ouvrez la voie et vous nous aidez à entraîner un véritable changement durable."};
    contentData.push(returnedItem);
    returnedItem = {Ref:"1", BusinessLine:"Labour Relations", Category:"DM/CDS", Title:"CFAC-MDN Recours Collectif Inconduite Sexuelle", Type:"Notification", PublishDate:"July 19, 2019 05:00:00", Content:`<*Article_H1*>FAC-MDN Recours Collectif Inconduite Sexuelle<*Article_Note*>Le 19 juillet, 2019<*Article_H3*>Mise à jour importante<*Article_Note*>L'audience d'approbation à la Cour fédérale à Ottawa, au 90, rue Sparks, les 19 et 20 septembre 2019, à 10 h. <*Article_Note*>Dans les présentes, le genre masculin est utilisé pour alléger le texte et s’entend de toutes les personnes.<*Article_H2*>Intro​du​ction<*Article_Body*>Êtes-vous un membre ou un ancien membre des Forces armées canadiennes, ou un employé ou un ancien employé du ministère de la Défense nationale (MDN) ou du Personnel des fonds non publics, Forces canadiennes (PFNP)?<*Article_Body*>Avez-vous vécu du harcèlement sexuel, une agression sexuelle ou de la discrimination fondée sur votre sexe, votre genre, votre identité de genre ou votre orientation sexuelle en lien avec le service militaire ou en lien avec l'emploi au sein du MDN ou du PFNP?<*Article_Body*>Il y a un règlement proposé entre le gouvernement du Canada et certains membres et anciens membres des Forces armées canadiennes (« FAC »), et les employés et anciens employés du ministère de la Défense nationale (« MDN ») ou du Personnel des fonds non publics, Forces canadiennes (« PFNP ») qui ont vécu du harcèlement sexuel, une agression sexuelle ou de la discrimination fondée sur le sexe, le genre, l'identité de genre ou l'orientation sexuelle (« Inconduite sexuelle ») en lien avec le service militaire ou en lien avec l'emploi au sein du MDN ou du PFNP.<*Article_Body*>De plus amples renseignements sur le règlement proposé est disponible dans l'avis approuvé par la cour.  Une copie de l'avis est disponible ::external::ici||https://www.classaction.deloitte.ca/fr-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Documentsjudiciaires::external::. Une copie de l'entente de règlement définitive se trouve à l'adresse ici.<*Article_Body*>Si vous appuyez le règlement proposé, ou si vous vous opposez au règlement proposé, vous pouvez soumettre un Formulaire de participation. Le Formulaire de participation se trouve à l'adresse ::external::ici||https://www.classaction.deloitte.ca/fr-ca/Pages/CAF-DNDsexualmisconductclassaction.aspx#head-Documentsjudiciaires::external::. Vous devez envoyer ce formulaire par la poste à FAC MDN Recours Collectif Inconduite Sexuelle a/s Deloitte, Centre Baie Adélaïde, Tour Est, 8 rue Adelaide Ouest, Toronto, ON M5H 0A9 ou par courriel à facmdninconduite@deloitte.ca et il doit être reçu ou oblitéré au plus tard le 30 août 2019.<*Article_Body*>Vous n'avez pas besoin de soumettre un Formulaire de participation pour profiter des avantages du règlement proposé. Si le règlement proposé est approuvé par la Cour fédérale, de plus amples renseignements seront disponibles pour expliquer comment bénéficier des avantages du règlement.<*Article_H2*>Contactez-nous​<*Article_Body*>Si vous avez des questions concernant l’administration du règlement, les coordonnées de l’administrateur intérimaire sont:<*Article_Body*>FAC MDN Recours Collectif Inconduite Sexuelle<br>a/s Deloitte<br>a/s Deloitte<br>Centre Baie Adélaïde, Tour Est<br>8 rue Adelaide Ouest<br>Toronto ON, M5H 0A9<br>Téléphone: ::external::1-888-626-2611||tel:1-888-626-2611::external::<br>Courriel: ::external::facmdninconduite@deloitte.ca||mailto:facmdninconduite@deloitte.ca::external::`};
    contentData.push(returnedItem);
    //
       
    
    return contentData;

}
