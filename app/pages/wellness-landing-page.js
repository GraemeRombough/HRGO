//pages/EAPNewsletter-page
var frameModule     = require("ui/frame");
var observable = require("data/observable");
const Label = require("tns-core-modules/ui/label/").Label;
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");
var app = require("application");
var pageData = new observable.Observable();
const fromObject = require("tns-core-modules/data/observable").fromObject;
const StackLayout    = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const FormattedString = require("tns-core-modules/text/formatted-string").FormattedString;
const Span = require("tns-core-modules/text/span").Span;
var page;
var pageObject;
var pagePrefix  = "";
var currentLanguage = "";

var eapStackVisible=false;

var firebase = require("nativescript-plugin-firebase/app");


exports.pageLoaded = function(args) {
    page = args.object;
    pageObject = page;

    //don't reload all of the data if the user just went back without changing the language
    if( currentLanguage != applicationSettings.getString("PreferredLanguage") ) {
        pageData = fromObject({
            selectedLanguage: ((applicationSettings.getString("PreferredLanguage") == "French") ? 1 : 0),
            lblTitle: ["Health and wellness", "Santé et bien-être"],
            lblServices: ["Health Services", "Services de santé"],
            lblAwards: ["Awards and Recognition", "Prix et reconnaissance"],
            lblEAPNewsletters: ["EAP Newsletters", "Bulletins du EAP"],
            lblVideos: ["Videos", "Videos"],
            lblVideosMentalHealth: ["13 factors for psychological health and safety in the workplace", "13 facteurs qui contribuent à la santé et à la sécurité psychologiques en milieu de travail"],
            publicServicesVisible: false,
            awardsVisible: false,
            eapStackVisible: false,
            videosVisible: false
        });
        args.object.bindingContext = pageData;

        currentLanguage = applicationSettings.getString("PreferredLanguage");

        buildContentFromFirebase();
    }
};

exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
};

exports.goToUtility = function(args){
    var topmost = frameModule.topmost();
    topmost.navigate(args.object.pageName);
};

exports.navToggle = function(args) {
    pageData.set( args.object.toggle , !pageData.get( args.object.toggle ));
}

function loadNewsletter(event) {

    console.log("Go To pages/EAPNewsletter-page: " + event.object );
    var topmost = frameModule.topmost();
    var navigationOptions={
        moduleName:'pages/EAPNewsletter-page',
        context:{Language: "ENG",
                artcleID: this.ref,
                contents: this.contents,
                title: this.title
                }
            }
    topmost.navigate(navigationOptions);
};

function goToVideos(event) {
    console.log("Go To pages/video-landing-page: " + event.object + " : category = " + this.contents);
    var categories  = "";
    var tags        = "";
    var articleComponents = this.contents.split("<*");

    articleComponents.forEach( function(section){
        sectionSplit    = section.split("*>");
        if( sectionSplit[0] == "Category" ) {
            categories  = sectionSplit[1];
        } else {
            tags        = sectionSplit[1];
        }
    });


    var topmost = frameModule.topmost();
    var navigationOptions={
        moduleName:'pages/video-landing-page',
        context:{Language: "ENG",
                 Category: categories,
                 Tags: tags
                }
            }
    topmost.navigate(navigationOptions); 

};

function generateCategoryToggle(category, selectedLanguage, categoriesStack) {
    var currentCategory = new Label();
    var categoryText    = new FormattedString();
    var labelArray      = [category.TitleEN , category.TitleFR];

    pageData.set( category.Category + "Visible" , false );
    pageData.set( "lbl" + category.Category + "Category", labelArray );

    currentCategory.className    = "Video_Category";
    
    var iconSpan        = new Span();
    /*
    iconSpan.bind( {
        sourceProperty: category.Category + "Visible",
        targetProperty: "text",
        twoWay: false,
        expression: category.Category + "Visible ? '" + String.fromCharCode(0xEA43) + " ' : '" + String.fromCharCode(0xEA42) + " '"
    } , pageData );*/
    iconSpan.text       = String.fromCharCode(0xEA42) + " ";
    iconSpan.fontFamily = "icomoon";
    categoryText.spans.push(iconSpan);
    
    var labelSpan       = new Span();
    labelSpan.text      = labelArray[selectedLanguage];
    categoryText.spans.push(labelSpan);

    categoryText.width = "100%";

    categoryStack      = new StackLayout();
    
    var videoLabel = new Label();
    videoLabel.width    = "100%";
    videoLabel.className    = "Video_Category";
    videoLabel.formattedText    = categoryText;
    videoLabel.addEventListener( "tap" , function(event) {
        var showCategory    = !pageData.get(this.toggleValue);
        this.iconSpan.text  = (showCategory ? String.fromCharCode(0xEA43) : String.fromCharCode(0xEA42)) + " ";

        this.categoryStack.visibility    = showCategory ? 'visible' : 'collapsed' ;

        pageData.set( this.toggleValue , showCategory );
    } , { toggleValue: category.Category, iconSpan: iconSpan, categoryStack: categoryStack });
    categoryStack.id            = "stk" + category.Category + "Stack";
    categoryStack.className     = "Video_Category_Stack";
    categoryStack.visibility    = 'collapsed';

    categoriesStack.addChild( videoLabel );
    categoriesStack.addChild( categoryStack );

    return categoryStack;
};

function generateContentLine(content, selectedLanguage) {
    var contentLabel    = new Label();
    contentLabel.className  = "Main_Nav_SubLine";
    contentLabel.text       = (currentLanguage=="French" ? content.TitleFR : content.TitleEN);
    contentLabel.data       = { contents: (selectedLanguage==1 ? content.ContentFR : content.ContentEN), title: (selectedLanguage==1 ? content.TitleFR : content.TitleEN) };
    contentLabel.addEventListener( "tap" , (content.Function == "LoadVideoCategory" ? goToVideos : loadNewsletter) , contentLabel.data );
    
    return contentLabel;
}

function contentCompare( a , b ) {
    var compareResult = 0;
    if( a.PublishDate < b.PublishDate ) {
        compareResult = -1;
    } else {
        if( a.PublishDate > b.PublishDate ) {
            compareResult = 1;
        } else {
            if( a.Ref < b.Ref ) {
                compareResult = -1;
            } else if( a.Ref > b.Ref ) {
                compareResult = 1;
            }
        }
    }
    return compareResult;
};

function buildContentFromFirebase() {
    var selectedLanguage    = pageData.get("selectedLanguage");
    var categoriesStack     = page.getViewById("categoriesStack");
    categoriesStack.removeChildren();

    firebase.firestore().collection("wellness-landing-page").get({ source: "cache" }).then( querySnapshot => {
        var contentRecords  = [];

        querySnapshot.forEach( contentRec => {
            console.log("contentRecords count = " + contentRec.data().Ref);
            contentRecords.push( contentRec.data());
        });

        firebase.firestore().collection("Categories").get({ source: "cache" }).then( categorySnapshot => {
            categorySnapshot.forEach( category => {
                var categoryStack   = generateCategoryToggle(category.data(), selectedLanguage, categoriesStack);
                var filteredList    = contentRecords.filter( function(value, index, array) {
                    return category.data().Category == value.Category;
                });
        
                filteredList.sort(contentCompare);
                filteredList.forEach( function(content) {
                    categoryStack.addChild( generateContentLine(content, selectedLanguage));
                });
            });
        });
    });
};

/*
var getCategoriesFromDatabase = function() {
    var returnedItem;
    var contentData = [];
    
    returnedItem = {
        Ref:1, 
        Category: "Services",
        TitleEN:`Health Services`,
        TitleFR:`Services de santé`,
        Page:`wellness-landing-page`,
        Order:1
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:2, 
        Category: "Awards",
        TitleEN:`Awards and Recognition`,
        TitleFR:`Prix et reconnaissance`,
        Page:`wellness-landing-page`,
        Order:2
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:3, 
        Category: "EAPNewsletter",
        TitleEN:`EAP Newsletters`,
        TitleFR:`Bulletins du EAP`,
        Page:`wellness-landing-page`,
        Order:3
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:4, 
        Category: "Videos",
        TitleEN:`Videos`,
        TitleFR:`Videos`,
        Page:`wellness-landing-page`,
        Order:4
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:5, 
        Category: "Contacts",
        TitleEN:`Contacts`,
        TitleFR:`Contacts`,
        Page:`wellness-landing-page`,
        Order:5
        };
    contentData.push(returnedItem);

    return contentData;
};

var getMentalHealthFromDatabase = function() {
    var returnedItem;
    var contentData = [];

    var TODAY   = new Date();
    
    returnedItem = {
        Ref:1, 
        PublishDate: TODAY,
        Category: "EAPNewsletter",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Volume 24.5`, 
        ContentEN:`<*Article_H1*>Demystifying mindfulness and practising it at work<*Article_Body*>A multi-year study of companies has demonstrated that training in mindfulness improves:<*Article_List*>level of attention by over 48%<*Article_List*>individual performance by over 40%<*Article_List*>ability to prioritize by over 34%<*Article_List*>employee satisfaction by over 31%<*Article_List*>ability to perform under pressure by over 34%.<*Article_H2*>What is mindfulness?<*Article_Body*>Mindfulness is a synonym for “self-awareness.” This means being conscious of the here and now. Mindfulness guides us in reacting differently in certain situations, so potentially improving our level of performance at work.<*Article_Body*>Mindfulness allows us to take an observer’s position on our thoughts and emotions, thus developing our emotional agility when faced with the events and changes that occur in all spheres of our daily life.<*Article_H2*>What is mindful leadership?<*Article_Body*>According to writer Geneviève Desautels, Master’s in Business Administration, mindful leaders are defined by their ability to develop their awareness and their attention. In daily life, they are fully aware of what they are doing, and they listen to themselves, others, and their environment. They seek out clarity by giving themselves the space to take an introspective and sympathetic look at themselves and their performance.<*Article_Note*>Mindful leadership is a state of being: before all else, those who exercise it are in charge of their own lives.<*Article_Body*>Here are some of the characteristics of mindful leadership:<*Article_List*>Listening to understand, instead of listening to answer.<*Article_List*>Being sympathetic toward yourself and toward others.<*Article_List*>Avoiding judging others, and putting yourself in their place.<*Article_List*>Being able to recognize your emotions, and being attentive to the impact on others of your words and actions.<*Article_List*>Developing self-knowledge: think about your own experience.<*Article_List*>Being curious to learn about the other person by asking more questions, instead of jumping in or proposing solutions.<*Article_List*>Learning to be quiet and giving the other person time to think before answering.<*Article_List*>Having enough self-confidence to allow yourself to make mistakes, and recognize them right away.<*Article_H2*>Mindfulness training at work in five steps<*Article_Body*>Mindfulness consists in living in the present moment.<*Article_Body*>To practise mindfulness, simply take a few minutes in the day to refocus and relax. Below we offer a five-step method to be mindful at work:<ol><li>Sit down at your desk. Set your feet flat on the floor, without crossing them. Straighten your back, moving it slightly away from the back of the chair. Rest your hands on your thighs. Posture should be upright.</li><li>Close your eyes.</li><li>Concentrate on your breathing: in and out.</li><li>Don’t try to stop thinking, but when you are no longer concentrating on your breathing, simply refocus on your chest.</li><li>Once the session is over (it is up to each individual to decide when), take a deep breath, stretch, then calmly begin a new activity.</li></ol><*Article_Body*>When practised continuously and integrated in your daily routine, mindfulness leads you to pay attention to every instant of what you are doing. Walking is a good example of this informal practice, where you can direct your attention to the smells outdoors, physical sensations, colours in the landscape, and your breathing in step with your pace.<*Article_Body*>There are also applications and podcasts that offer guided mindfulness exercises.<*Article_H2*>Good luck with your mindfulness training!<br><*Override*><p width="100%" style="text-align:center; color: white; background-color: rgb(102,141,197); padding: 15px 15px 10px 10px;"><b>To access confidential psychosocial support services, contact your Employee Assistance Program at</b><br>::external::1-800-268-7708||tel:1-800-268-7708::external::<br><b>or for the hearing impaired at</b><br>::external::1-800-567-5803||tel:1-800-567-5803::external::<br><br>::external::www.healthcanada.gc.ca/eas||http://www.healthcanada.gc.ca/eas::external::</p>`,
        TitleFR:`Volume 24,5`,
        ContentFR:`<*Article_H1*>Démystifier la pleine conscience et comment la mettre en pratique au travail?<*Article_Body*>Selon une étude réalisée sur plusieurs années auprès d’entreprises, il a été démontré que de s’entraîner à la pleine conscience améliore de plus de:<*Article_List*>48% le niveau d’attention<*Article_List*>40 % la performance individuelle<*Article_List*>34% l’habileté à prioriser<*Article_List*>31% la satisfaction des employés<*Article_List*>34% la capacité à performer sous pression<*Article_H2*>Qu’est-ce la pleine conscience?<*Article_Body*>La pleine conscience est le terme que l’on utilise pour parler de « mindfulness » ou de « présence attentive ». Ce sont tous des synonymes qui impliquent d’abord une présence à soi. Il s’agit d’être conscient du « ici et maintenant ». La pleine conscience guide la personne à réagir différemment face à certaines situations, ce qui peut améliorer le niveau de performance au travail.<*Article_Body*>La pleine conscience nous permet de prendre une position d’observateur par rapport à nos pensées et à nos émotions. C’est ainsi que nous développons notre agilité émotionnelle à faire face aux événements et aux changements qui se présentent chaque jour dans toutes les sphères de notre vie.<*Article_H2*>Qu’est-ce que le leadership conscient?<*Article_Body*>Selon Geneviève Desautels, détentrice d’une Maîtrise en administration des affaires, auteure, le leader conscient se définit par sa capacité à développer sa présence et son attention. Au quotidien, il est présent dans ce qu’il accomplit, il est à l’écoute de lui-même, d’autrui et de son environnement. Il demeure à la recherche de clarté en se donnant de l’espace pour porter un regard introspectif et bienveillant sur lui-même et sur sa performance.<*Article_Note*>Le leadership conscient est un état d’être et la personne qui l’exerce est d’abord un leader de sa propre vie.<*Article_Body*>Voici quelques-unes des caractéristiques du leadership conscient :<*Article_List*>Écouter pour comprendre au lieu d’écouter pour répondre.<*Article_List*>Être bienveillant envers soi-même et envers les autres.<*Article_List*>Éviter de juger pour se mettre à la place de son interlocuteur.<*Article_List*>Savoir reconnaître ses émotions et porter attention à l’impact de ses paroles et de ses gestes sur les autres.<*Article_List*>Développer la connaissance de soi grâce à l’introspection.<*Article_List*>Être curieux d’apprendre à connaître l’autre en posant davantage de questions plutôt que d’énonçer des affirmations ou de proposer des solutions.<*Article_List*>Apprendre à supporter le silence et ne chercher à meubler l’espace lorsque son interlocuteur prend le temps de réfléchir avant de s’exprimer.<*Article_List*>Avoir suffisamment confiance en soi pour se donner droit à l’erreur et la reconnaître rapidement.<*Article_H2*>Comment s’entraîner à la pleine conscience au travail en 5 étapes<*Article_Body*>La pleine conscience consiste à vivre le moment présent.<*Article_Body*>Pour pratiquer la pleine conscience, il suffit de prendre quelques minutes au cours de la journée pour vous recentrer et vous détendre. Vous trouverez ci-dessous une méthode pour vous entraîner à la pleine conscience au travail, en 5 étapes :<ol><li>S’asseoir à son bureau. Poser les pieds à plat, sans les croiser. Redresser le dos en le décollant légèrement du dossier. Laisser les mains au repos, sur les cuisses. La posture doit être « droite, alerte et digne.<li>Fermer les yeux.<li>Se concentrer sur sa respiration, en particulier sur les mouvements réguliers du ventre.<li>Ne pas chercher à arrêter de penser, mais à l’instant même où on se rend compte qu’on n’est plus concentré sur sa respiration, simplement revenir en pensée, aux mouvements du ventre.<li>Une fois la séance terminée (à chacun de choisir la durée qui lui convient), respirer, s’étirer, puis démarrer tranquillement une nouvelle activité.</ol><*Article_Body*>Lorsqu’elle est pratiquée sur une base continue et intégrée dans notre quotidien, la pleine conscience nous amène à accorder de l’attention à chaque instant de l’activité réalisée. La marche est un bon exemple de cette pratique informelle, où l’attention peut être dirigée sur les odeurs ressenties à l’extérieur, sur les sensations physiques, sur la couleur des paysages et sur le souffle qui s’accentue au rythme des pas.<*Article_Body*>Finalement, sachez qu’il existe aussi des applications et des balados qui permettent la pratique d’exercices guidés de la pleine conscience.<*Article_H2*>Et, bon entraînement à la pleine conscience!<*Override*><p width="100%" style="text-align:center; color: white; background-color: rgb(102,141,197); padding: 15px 15px 10px 10px;"><b>Pour avoir accès à des services de soutien psychosocial confidentiels, communiquez avec votre Programme d’aide aux employés au</b><br>::external::1-800-268-7708||tel:1-800-268-7708::external::<br><b>ou pour les malentendants au</b><br>::external::1-800-567-5803||tel:1-800-567-5803::external::<br><br>::external::www.santecanada.gc.ca/sae||http://www.santecanada.gc.ca/sae::external::</p>`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:2,
        PublishDate: TODAY,
        Category:"Services",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Employee Assistance Program (EAP)`,
        ContentEN:`<*Article_H1*>Employee Assistance Program (EAP)<*Article_Body*>The Employee Assistance Program (EAP) is a confidential, voluntary and neutral service available to civilian employees and their immediate family members when dealing with personal or professional issues that are affecting their personal well-being and/or work performance.<*Article_Body*>If you need support, please contact:<*Article_List*>DND’s ::external::EAP Peer Referral Agents||http://eap-pae.forces.mil.ca/EAPRALists.aspx::external:: (available during regular working hours)<*Article_List*>Professional mental health counselling services through ::external::Health Canada – Employee Assistance Services||https://www.canada.ca/en/health-canada/services/environmental-workplace-health/occupational-health-safety/employee-assistance-services.html::external:: at ::external::1-800-268-7708||tel:1-800-268-7708::external:: (available 24 hours a day, 7 days a week, 365 days a year)<*Article_Body*>For more information about the EAP, how to become an internal peer referral agent, and/or to schedule a presentation/briefing on EAP services, please contact: ::external::EAP Corporate Office||mailto:P-OTG.EAPCorpOff@intern.mil.ca::external::`,
        TitleFR:`Le Programme d’aide aux employés (PAE)`,
        ContentFR:`<*Article_H1*>Le Programme d’aide aux employés (PAE)<*Article_Body*>Le Programme d’aide aux employés (PAE) du Ministère de la Défense nationale (MDN) est entièrement voué à la prestation d’une aide aux employés et aux membres admissibles de leur famille aux prises avec des difficultés personnelles ou professionnelles qui pourraient avoir un effet négatif sur leur bien-être personnel et/ou leur rendement professionnel.<*Article_Body*>Si vous avez besoin de soutien, veuillez communiquer avec :<*Article_List*>::external::Les agents d'orientation du PAE du MDN||http://eap-pae.forces.mil.ca/EAPRALists.aspx::external:: (disponibles pendant les heures normales de travail)<*Article_List*>Services professionnels de counseling en santé mentale par l'entremise de ::external::Santé Canada - Services d'aide aux employés||https://www.canada.ca/fr/sante-canada/services/sante-environnement-milieu-travail/sante-securite-travail/service-aide-employes.html::external:: au ::external::1-800-268-7708||tel:1-800-268-7708::external:: (disponible 24 heures sur 24, 7 jours sur 7, 365 jours par année)<*Article_Body*>Pour plus d'informations sur le PAE, comment devenir un agent interne de référence par les pairs et/ou pour planifier une présentation/briefing sur les services du PAE, veuillez communiquer avec : ::external::P-OTG.EAPCorpOff@intern.mil.ca||mailto:P-OTG.EAPCorpOff@intern.mil.ca::external::`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:3,
        PublishDate: TODAY,
        Category:"Services",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Crisis Text Line`,
        ContentEN:`<*Article_H1*>Crisis Text Line<*Article_Body*>Crisis Text Line, 24/7 provides young people and anyone who needs support with 24/7, free nationwide texting support for those in crisis.  The professionally trained Crisis Line Responders are there to answer your call 24 hours a day, seven days a week.<*Article_Body*>Text ::external::686868||sms:686868::external:: from anywhere in Canada, call ::external::1-800-668-6868||tel:1-800-668-6868::external::, or live chat ::external::https://kidshelpphone.ca/live-chat||https://kidshelpphone.ca/live-chat::external::`,
        TitleFR:`Crisis Text Line/Ligne de texte de crise`,
        ContentFR:`<*Article_H1*>Crisis Text Line/Ligne de texte de crise<*Article_Body*>Crisis Text Line, fournit aux jeunes et à tous ceux qui ont besoin de soutien 24/7, un soutien gratuit par SMS à l'échelle nationale pour ceux qui sont en crise.  Les répondeurs de ligne de crise formés professionnellement sont là pour répondre à votre appel 24 heures par jour, sept jours par semaine.<*Article_Body*>Texte ::external::686868||sms:686868::external:: de n'importe où au Canada, composez le ::external::1-800-668-6868||tel:1-800-668-6868::external::, ou discutez en direct ::external::https://jeunessejecoute.ca/clavarde-en-ligne/||https://jeunessejecoute.ca/clavarde-en-ligne/::external::`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:4,
        PublishDate: TODAY,
        Category:"Services",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Mental Health Training`,
        ContentEN:`<*Article_H1*>Mental Health Training<*Article_List*>Mental Health in the Workplace for Managers: This online training course offered via ::external::Defence Learning Network (DLN)||https://www.canada.ca/en/department-national-defence/services/benefits-military/education-training/professional-development/defence-learning-network.html::external:: aims to increase the level of confidence of managers and supervisors of civilian employees when dealing with mental health issues. The training provides tips, tools, and resources to support employees experiencing psychological distress in the workplace.<*Article_List*>Mental Health in the Workplace for Employees: This online training course offered through ::external::Defence Learning Network||https://www.canada.ca/en/department-national-defence/services/benefits-military/education-training/professional-development/defence-learning-network.html::external:: provides employees with a general understanding of mental health, mental illness, and its impact on the workplace.<*Article_List*>Mental Health Conversations: This in-class training offered through the ::external::Learning and Career Centres (LCCs)||http://lcc-cac.forces.mil.ca/lcc-cac/en/ncc_courseDetails_e.asp?lccid=13&courseID=1211::external::, enables managers to practice effective conversations with employees who are experiencing mental health issues, by using appropriate communication tools. Participants will have the opportunity to practice through role playing, give and receive feedback, and learn about available resources to help support employees.<*Article_List*>Mental Health Workshops (only in NCR): These workshops are available through ::external::HR-Civ’s Mental Health & Well-Being Team||mailto:P-OTG.Wellbeing@intern.mil.ca::external:: on a variety of topics including: Resiliency, Civility & Respect in the Workplace, Mental Health and Stigma, and Healthy Workplace Factors – How they impact your mental health.`,
        TitleFR:`Formation en Santé mentale`,
        ContentFR:`<*Article_H1*>Formation en Santé mentale<*Article_List*>Lasanté mentale en milieu de travail pour les gestionnaires : Cette formation en ligne offertepar l’intermédiaire du ::external::Réseau d’apprentissage de la Défense (RAD)||https://www.canada.ca/fr/ministere-defense-nationale/services/avantages-militaires/education-formation/perfectionnement-professionnel/reseau-apprentissage-defense.html::external:: accroît le niveau de confiance des gestionnaires etdes superviseurs du MDN en ce qui concerne la résolution de problèmes de santé mentale. Elle présente des conseils, des outils et des ressources axés sur le soutien des employés qui vivent une détresse psychologique en milieu de travail.<*Article_List*>Lasanté mentale en milieu de travail pour les employés : Cette formation en ligne offertepar l’intermédiaire du ::external::Réseau d’apprentissage de la Défense||https://www.canada.ca/fr/ministere-defense-nationale/services/avantages-militaires/education-formation/perfectionnement-professionnel/reseau-apprentissage-defense.html::external:: permet aux employés d’avoir une bonne compréhension générale de la santé mentale et des maladies mentales, ainsi que de leurs répercussions sur le milieu de travail.<*Article_List*>Conversationssur la santé mentale : Ce cours en salle de classe offerte par l’intermédiaire des ::external::Centres d’apprentissage et de carrière (CAC)||http://lcc-cac.forces.mil.ca/lcc-cac/fr/ncc_courseDetails_f.asp?lccid=13&courseID=1211::external:: permet aux gestionnaires de s’exercer à tenir des conversations efficaces avec des employés aux prises avec des problèmes de santé mentale en utilisant des outils de communication appropriés. Les participants auront l’occasionde pratiquer des jeux de rôle, de donner et de recevoir une rétroaction et de se renseigner sur des ressources accessibles visant à soutenir les employés.<*Article_List*>Atelier sur la santé mentale (seulement dans la RCN) : Ces ateliers sont présentés par l’intermédiaire de ::external::l’équipe responsable de la santé mentale et du bien-être de l’organisation des RH-Civ||mailto:P-OTG.Wellbeing@intern.mil.ca::external::. Ils traitent de divers sujets, entre autres, larésilience, la civilité et le respect en milieu de travail, la santé mentale et la stigmatisation, ainsi que les facteurs propices à un milieu de travail sain et l’incidence de ces derniers sur la santé mentale.`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:5,
        PublishDate: TODAY,
        Category:"Services",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Activities and Resources for Managers for Creating a Healthy Workplace`,
        ContentEN:`<*Article_H1*>Activities and Resources for Managers for Creating a Healthy Workplace<*Article_Body*>October is ::external::Canada’s Healthy Workplace Month (CHWM)||http://healthyworkplacemonth.ca/en/about/about::external:: and the Defence Team is encouraged to organize and participate in team activities, and to access resources to learn more about building and maintaining a healthy workplace – not only during October, but all year.  This toolkit provides you witha range of resources and activities that can be used to engage your staff in CHWM.  Activities and resources have been organized using three themes: mental health; physical health; and workplace health (see tabs below) to encompass key elements of health. ::external::http://intranet.mil.ca/en/news/special-events/annual-themes/healthy-workplace-month-toolkit.page||http://intranet.mil.ca/en/news/special-events/annual-themes/healthy-workplace-month-toolkit.page::external::`,
        TitleFR:`Activités et ressources pour les gestionnaires pour créer un milieu de travail sain`,
        ContentFR:`<*Article_H1*>Activités et ressources pour les gestionnaires pour créer un milieu de travail sain<*Article_Body*>Le ::external::Mois national de la santé au travail (MNST)||http://healthyworkplacemonth.ca/fr/about/about::external:: est en Octobre, et nous encourageons l’Équipede la Défense à organiser et participer dans les activités d’équipe et à y participer ainsi qu’à consulter les ressources offertes pour en apprendre davantage sur la création et le maintien d’un milieu de travail sain – pas seulement en Octobre, mais toutl’année. Cette boîte à outils vous donne accès à une gamme de ressources et d’activités qui peuvent être utilisées pour inciter votre personnel à prendre part au MNST. Ces activités et ces ressources ont été organisées selon trois thèmes afin d’englober leséléments clés de la santé : la santé mentale, la santé physique et la santé au travail (voir les onglets ci-dessous).  ::external::http://intranet.mil.ca/fr/nouvelles/activites-speciales/themes-annuels/mois-sante-au-travail-trousse.page||http://intranet.mil.ca/fr/nouvelles/activites-speciales/themes-annuels/mois-sante-au-travail-trousse.page::external::`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:6,
        PublishDate: TODAY,
        Category:"Services",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Did you know?`,
        ContentEN:`<*Article_H1*>Did you know?<*Article_List*>Civilian Defence Team members have $2000 per calendar year available for psychological services, as part of the Sunlife benefits package.<*Article_List*>Children and spouses also have the same coverage, $2000 per year.<*Article_List*>The Employee Assistance Program also offers short term counselling sessions to both employees, and their dependents. Coverage includes up to 8 sessions a year, per topic, however there is no limit to the number of topics you seek help onin a given year. For immediate 24/7 assistance, call: ::external::1-800-268-7708||tel:1-800-268-7708::external:: or ::external::1-800-567-5803||tel:1-800-567-5803::external:: (for the hearing impaired)<*Article_List*>There are also various departmental Mental Health Resources that are available, and all Defence Team members are encouraged to access help if needed.<*Article_List*>70% of working Canadians are concerned about psychological health and safety in the workplace.<*Article_List*>Psychological health and safety means preventing harm to mental health, and promoting psychological well-being.<*Article_List*>Mental health and safety is just as important as physical health and safety... let's face it... there is no health without mental health.`,
        TitleFR:`Le saviez‑vous? `,
        ContentFR:`<*Article_H1*>Le saviez‑vous?<*Article_List*>Dans le cadre de la protection offerte par Sun Life, les membres civils de l’Équipe de la Défense ont droit à un remboursement des frais pour services psychologiques de 2 000 $ par année financière.<*Article_List*>Leurs enfants et conjoint bénéficient de la même protection, soit 2 000 $ par année.<*Article_List*>Le Programme d’aide aux employés offre aussi des séances de counseling à court terme aux employés et aux personnes à leur charge. Jusqu’à huit séances sont offertes gratuitement par sujet par an; il n’y a toutefois pas de limite au nombre de sujets pouvant être abordés au cours d’une année. Pour obtenir de l’aide immédiate, composez le ::external::1-800-268-7708||tel:1-800-268-7708::external::, ou le ::external::1‑800-567-5803||tel:1‑800-567-5803::external:: pour les personnes malentendantes.<*Article_List*>Diverses ressources ministérielles pour le soutien de la santé mentale sont également mises à votre disposition, et je vous invite à en profiter.<*Article_List*>Saviez-vous que 70% des Canadiens sont préoccupés par la santé et la sécurité psychologiques dans leur milieu de travail?<*Article_List*>La santé et la sécurité mentales sont aussi importantes que la santé et la sécurité physiques. Qu’on se le dise… on ne peut pas être en santé sans prendre soin desa santé mentale.`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:7,
        PublishDate: TODAY,
        Category:"Videos",
        Tags: "",
        Function: "LoadVideoCategory",
        TitleEN:`13 factors for psychological health and safety in the workplace`,
        ContentEN:`<*Category*>Health`,
        TitleFR:`13 facteurs qui contribuent à la santé et à la sécurité psychologiques en milieu de travail`,
        ContentFR:`<*Category*>Health`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:8,
        PublishDate: TODAY,
        Category:"Awards",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`E-Cards`,
        ContentEN:`<*Article_H1*>E-Cards<*Article_Body*>Successfully developing a culture of recognition within your team will increase engagement, productivity and wellness levels of employees. Recognition can take many forms, includingformal and informal methods.<*Article_Body*>Formal recognition can be given through well-established awards and recognition programs at the Corporateor Group/Command level or show informal recognition with a few words of genuine praise or a simple thank you card. ::external::https://www.seasons.ca/eCards/eCards.asp||https://www.seasons.ca/eCards/eCards.asp::external::`,
        TitleFR:`Cartes électroniques`,
        ContentFR:`<*Article_H1*>Cartes électroniques<*Article_Body*>Le développement réussi d'une culture de reconnaissance au sein de votre équipe augmentera l'engagement, la productivité et le niveau de mieux-être des employés.La reconnaissance peut prendre de nombreuses formes, y compris des méthodes formelles et informelles.<*Article_Body*>La reconnaissance formelle peut être donnée par le biais de récompenses et de programmes de reconnaissance bien établis au niveau corporatif ou de groupe/commandementou faire preuve d'une reconnaissance informelle avec quelques mots d'éloges sincères ou une simple carte de remerciement. ::external::https://www.seasons.ca/eCards/eCards.asp||https://www.seasons.ca/eCards/eCards.asp::external::`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:9,
        PublishDate: TODAY,
        Category:"Awards",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`DND Long Service Award (LSA) Program `,
        ContentEN:`<*Article_H1*>DND Long Service Award (LSA) Program<*Article_Body*>The Long Service Award Program recognizes civilian employees who have reached 15, 25, 35, 45 and 50* years of service within the public service.This includes time served as a member or a reservist (Class B*and C) with the Canadian Armed Forces as well as any previous years of service within another federal department. In order to qualify for the program, employees must be employed at DND at the time the anniversary is reached.<*Article_Body*>To enquire about the LSA program, please contact: ::external::DND.LongServAwardProg-ProgPrixLongServ.MND@forces.gc.ca||mailto:DND.LongServAwardProg-ProgPrixLongServ.MND@forces.gc.ca::external::`,
        TitleFR:`Le Programme des prix de long service (PPLS) du MDN`,
        ContentFR:`<*Article_H1*>Le Programme des prix de long service (PPLS) du MDN<*Article_Body*>Le Programme des prix de long service (PPLS) reconnaît les employés ayant atteint 15, 25, 35, 45 et 50* ans de service dans la fonctionpublique. Les périodes de service à titre de militaire ou de réserviste (en service de classe B* ou de classe C) au sein des Forces armées canadiennes ainsi que toutes les années antérieuresde service auprès d’un autre ministère fédéral sont prises en compte dans le calcul du nombre d’années de service. Afin d’être admissibles au Programme, les employés doivent travailler au MDN à la date de l’anniversaire.<*Article_Body*>Toute question/requête concernant le PPLS peut être acheminée à l’adresse suivante: ::external::DND.LongServAwardProg-ProgPrixLongServ.MND@forces.gc.ca||mailto:DND.LongServAwardProg-ProgPrixLongServ.MND@forces.gc.ca::external::`
        };
    contentData.push(returnedItem);
    returnedItem = {
        Ref:10,
        PublishDate: TODAY,
        Category:"Awards",
        Tags: "",
        Function: "LoadArticle",
        TitleEN:`Retirement Certificates`,
        ContentEN:`<*Article_H1*>Retirement Certificates<*Article_Body*>Upon retirement, employees are entitled to receive a Retirement Certificate signed by the Prime Minister of Canada.<*Article_Body*>For all retirement certificate requests, please send an email (1 request/employee per email please) to: ::external::+Retirement Certificates - Certificats de retraite@ADM(HR-Civ)DCHRNS@Ottawa-Hull||mailto:+Retirement Certificates - Certificats de retraite@ADM(HR-Civ)DCHRNS@Ottawa-Hull::subject::Retirement Certificate::body::Name (as it should appear on certificate):%0ATotal years of service to appear on certificate, including time served as military, if applicable (rounded up):%0AMonth and year of retirement:%0ALanguage of certificate:%0A%0AShipping Information%0APoint of contact name:%0APoint of contact address (full mailing address for items shipped by courier, not internal address):%0APoint of contact email address:%0APoint of contact phone number:%0A::external:: providing the following information; please note that your request cannot be processed without all of the following information. <b>Please ensure you include all the details requested.</b><ol><li>Name (as it should appear on certificate):</li><li>Total years of service to appear on certificate, including time served as military, if applicable (rounded up):</li><li>Month and year of retirement:</li><li>Language of certificate:</li></ol><*Article_Body*>Shipping Information<ol><li>Point of contact name:</li><li>Point of contact address (full mailing address for items shipped by courier, not internal address):</li><li>Point of contact email address:</li><li>Point of contact phone number:</li></ol><*Article_Body*>If you require the certificate sooner than the retirement date, please advise accordingly.`,
        TitleFR:`Certificats de retraite`,
        ContentFR:`<*Article_H1*>Certificats de retraite<*Article_Body*>Pour souligner leur retraite, les employés du MDN ont droit à un certificat de retraite signé par le premier ministre du Canada.<*Article_Body*>Pour toute demande de certificat de retraite, veuillez envoyer un courriel (un employé/demande par courriel s.v.p.) à : ::external::+Retirement Certificates - Certificats de retraite@ADM(HR-Civ) DCHRNS@Ottawa-Hull||mailto:+Retirement Certificates - Certificats de retraite@ADM(HR-Civ) DCHRNS@Ottawa-Hull::subject::Certificat de retraite::body::Nom (tel qu’il devrait apparaître sur le certificat) :%0ANombre total d’années de service y compris le temps passé comme militaire, s’il y a lieu (arrondi au supérieur) :%0AMois et année de la retraite :%0ALangue du certificat :%0A%0AInformation sur la livraison%0ANom du point de contact :%0AAdresse complète du point de contact (adresse postale complète pour les envois expédiés par messagerie, adresse non interne) :%0AAddresse e-mail du point de contact :%0ANuméro de téléphone du point de contact :%0A::external:: en fournissant l’information suivante, veuillez noter que votre demande ne peut pas être traitée sans toutes les informations suivantes. <b>Veuillez-vous assurer d'inclure tous les détails demandés.</b><ol><li>Nom (tel qu’il devrait apparaître sur le certificat) :</li><li>Nombre total d’années de service y compris le temps passé comme militaire, s’il y a lieu (arrondi au supérieur) :</li><li>Mois et année de la retraite :</li><li>Langue du certificat :</li></ol><*Article_Body*>Information sur la livraison<ol><li>Nom du point de contact :</li><li>Adresse complète du point de contact (adresse postale complète pour les envois expédiés par messagerie, adresse non interne) :</li><li>Addresse e-mail du point de contact :</li><li>Numéro de téléphone du point de contact :</li></ol><*Article_Body*>Si vous avez besoin du certificat avant la date de départ à la retraite, veuillezen aviser.`
        };
    contentData.push(returnedItem);

    return contentData;
};
*/