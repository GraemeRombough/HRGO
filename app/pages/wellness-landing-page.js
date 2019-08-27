//pages/EAPNewsletter-page
var frameModule     = require("ui/frame");
var observable = require("data/observable");
const Label = require("tns-core-modules/ui/label/").Label;
var platformModule      = require("tns-core-modules/platform");
var applicationSettings = require("application-settings");
var app = require("application");
var pageData = new observable.Observable();
var page;
var pageObject;
var pagePrefix  = "";
var currentLanguage = "";

var eapStackVisible=false;


exports.pageLoaded = function(args) {
    page = args.object;
    args.object.bindingContext = pageData;
    pageObject = page;

    //don't reload all of the data if the user just went back without changing the language
    if( currentLanguage != applicationSettings.getString("PreferredLanguage") || page.getViewById("eapStackControl").getChildrenCount() == 0 ) {
        currentLanguage = applicationSettings.getString("PreferredLanguage");

        pageData.set("actionBarTitle" , (currentLanguage=="French" ? "Santé et bien-être" : "Health and wellness") );

        pageData.set("lblEAPNewsletters", (currentLanguage=="French" ? "Bulletins du EAP" : "EAP Newsletters"));
        pageData.set("eapStackVisible", false );

        pageData.set("lblPublicServices", (currentLanguage=="French" ? "Services publics" : "Public Services"));
        pageData.set("publicServicesVisible", false );

        pageData.set("lblInternalServices", (currentLanguage=="French" ? "Services internes du DND" : "Internal DND Services"));
        pageData.set("internalServicesVisible", false );

        pageData.set("lblTools", (currentLanguage=="French" ? "Outils" : "Tools"));
        pageData.set("toolsVisible", false );
        //page.getViewById("eapViewToggle").bindingContext.set("labelText", (currentLanguage=="French" ? "Bulletins du EAP" : "EAP Newsletters"));
        //page.getViewById("servicesViewToggle").bindingContext.set("labelText", (currentLanguage=="French" ? "Services" : "Services"));
        //page.getViewById("toolsViewToggle").bindingContext.set("labelText", (currentLanguage=="French" ? "Outils" : "Tools"));

        buildEAPNewsletters();
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

function buildEAPNewsletters() {
    var eapStack    = page.getViewById("eapStackControl");
    eapStack.removeChildren();
    
    var newsletterList  = getEAPNewslettersFromDatabase();
    newsletterList.forEach( function(newsletter) {
        var eapSelection    = new Label();
        eapSelection.className  = "Main_Nav_SubLine";
        eapSelection.text       = (currentLanguage=="French" ? newsletter.TitleFR : newsletter.TitleEN);
        eapSelection.addEventListener( "tap" , loadNewsletter , { contents: (currentLanguage=="French" ? newsletter.ContentFR : newsletter.ContentEN), title: (currentLanguage=="French" ? newsletter.TitleFR : newsletter.TitleEN) });
        eapStack.addChild(eapSelection);
    });

    var publicServicesStack     = page.getViewById("publicServicesStack");
    publicServicesStack.removeChildren();

    var contactsAndResources    = getMentalHealthFromDatabase();
    contactsAndResources.forEach( function(newsletter) {
        var eapSelection    = new Label();
        eapSelection.className  = "Main_Nav_SubLine";
        eapSelection.text       = (currentLanguage=="French" ? newsletter.TitleFR : newsletter.TitleEN);
        eapSelection.addEventListener( "tap" , loadNewsletter , { contents: (currentLanguage=="French" ? newsletter.ContentFR : newsletter.ContentEN), title: (currentLanguage=="French" ? newsletter.TitleFR : newsletter.TitleEN) });
        publicServicesStack.addChild(eapSelection);
    });
};

var getEAPNewslettersFromDatabase = function() {
    var returnedItem;
    var contentData = [];
    
    returnedItem = {Ref:"1", 
        TitleEN:`Volume 24.5`, 
        ContentEN:`<*Article_H1*>Demystifying mindfulness and practising it at work<*Article_Body*>A multi-year study of companies has demonstrated that training in mindfulness improves:<*Article_List*>level of attention by over 48%<*Article_List*>individual performance by over 40%<*Article_List*>ability to prioritize by over 34%<*Article_List*>employee satisfaction by over 31%<*Article_List*>ability to perform under pressure by over 34%.<*Article_H2*>What is mindfulness?<*Article_Body*>Mindfulness is a synonym for “self-awareness.” This means being conscious of the here and now. Mindfulness guides us in reacting differently in certain situations, so potentially improving our level of performance at work.<*Article_Body*>Mindfulness allows us to take an observer’s position on our thoughts and emotions, thus developing our emotional agility when faced with the events and changes that occur in all spheres of our daily life.<*Article_H2*>What is mindful leadership?<*Article_Body*>According to writer Geneviève Desautels, Master’s in Business Administration, mindful leaders are defined by their ability to develop their awareness and their attention. In daily life, they are fully aware of what they are doing, and they listen to themselves, others, and their environment. They seek out clarity by giving themselves the space to take an introspective and sympathetic look at themselves and their performance.<*Article_Note*>Mindful leadership is a state of being: before all else, those who exercise it are in charge of their own lives.<*Article_Body*>Here are some of the characteristics of mindful leadership:<*Article_List*>Listening to understand, instead of listening to answer.<*Article_List*>Being sympathetic toward yourself and toward others.<*Article_List*>Avoiding judging others, and putting yourself in their place.<*Article_List*>Being able to recognize your emotions, and being attentive to the impact on others of your words and actions.<*Article_List*>Developing self-knowledge: think about your own experience.<*Article_List*>Being curious to learn about the other person by asking more questions, instead of jumping in or proposing solutions.<*Article_List*>Learning to be quiet and giving the other person time to think before answering.<*Article_List*>Having enough self-confidence to allow yourself to make mistakes, and recognize them right away.<*Article_H2*>Mindfulness training at work in five steps<*Article_Body*>Mindfulness consists in living in the present moment.<*Article_Body*>To practise mindfulness, simply take a few minutes in the day to refocus and relax. Below we offer a five-step method to be mindful at work:<ol><li>Sit down at your desk. Set your feet flat on the floor, without crossing them. Straighten your back, moving it slightly away from the back of the chair. Rest your hands on your thighs. Posture should be upright.</li><li>Close your eyes.</li><li>Concentrate on your breathing: in and out.</li><li>Don’t try to stop thinking, but when you are no longer concentrating on your breathing, simply refocus on your chest.</li><li>Once the session is over (it is up to each individual to decide when), take a deep breath, stretch, then calmly begin a new activity.</li></ol><*Article_Body*>When practised continuously and integrated in your daily routine, mindfulness leads you to pay attention to every instant of what you are doing. Walking is a good example of this informal practice, where you can direct your attention to the smells outdoors, physical sensations, colours in the landscape, and your breathing in step with your pace.<*Article_Body*>There are also applications and podcasts that offer guided mindfulness exercises.<*Article_H2*>Good luck with your mindfulness training!<br><*Override*><p width="100%" style="text-align:center; color: white; background-color: rgb(102,141,197); padding: 15px 15px 10px 10px;"><b>To access confidential psychosocial support services, contact your Employee Assistance Program at</b><br>::external::1-800-268-7708||tel:1-800-268-7708::external::<br><b>or for the hearing impaired at</b><br>::external::1-800-567-5803||tel:1-800-567-5803::external::<br><br>::external::www.healthcanada.gc.ca/eas||http://www.healthcanada.gc.ca/eas::external::</p>`,
        TitleFR:`Volume 24,5`,
        ContentFR:`<*Article_H1*>Démystifier la pleine conscience et comment la mettre en pratique au travail?<*Article_Body*>Selon une étude réalisée sur plusieurs années auprès d’entreprises, il a été démontré que de s’entraîner à la pleine conscience améliore de plus de:<*Article_List*>48% le niveau d’attention<*Article_List*>40 % la performance individuelle<*Article_List*>34% l’habileté à prioriser<*Article_List*>31% la satisfaction des employés<*Article_List*>34% la capacité à performer sous pression<*Article_H2*>Qu’est-ce la pleine conscience?<*Article_Body*>La pleine conscience est le terme que l’on utilise pour parler de « mindfulness » ou de « présence attentive ». Ce sont tous des synonymes qui impliquent d’abord une présence à soi. Il s’agit d’être conscient du « ici et maintenant ». La pleine conscience guide la personne à réagir différemment face à certaines situations, ce qui peut améliorer le niveau de performance au travail.<*Article_Body*>La pleine conscience nous permet de prendre une position d’observateur par rapport à nos pensées et à nos émotions. C’est ainsi que nous développons notre agilité émotionnelle à faire face aux événements et aux changements qui se présentent chaque jour dans toutes les sphères de notre vie.<*Article_H2*>Qu’est-ce que le leadership conscient?<*Article_Body*>Selon Geneviève Desautels, détentrice d’une Maîtrise en administration des affaires, auteure, le leader conscient se définit par sa capacité à développer sa présence et son attention. Au quotidien, il est présent dans ce qu’il accomplit, il est à l’écoute de lui-même, d’autrui et de son environnement. Il demeure à la recherche de clarté en se donnant de l’espace pour porter un regard introspectif et bienveillant sur lui-même et sur sa performance.<*Article_Note*>Le leadership conscient est un état d’être et la personne qui l’exerce est d’abord un leader de sa propre vie.<*Article_Body*>Voici quelques-unes des caractéristiques du leadership conscient :<*Article_List*>Écouter pour comprendre au lieu d’écouter pour répondre.<*Article_List*>Être bienveillant envers soi-même et envers les autres.<*Article_List*>Éviter de juger pour se mettre à la place de son interlocuteur.<*Article_List*>Savoir reconnaître ses émotions et porter attention à l’impact de ses paroles et de ses gestes sur les autres.<*Article_List*>Développer la connaissance de soi grâce à l’introspection.<*Article_List*>Être curieux d’apprendre à connaître l’autre en posant davantage de questions plutôt que d’énonçer des affirmations ou de proposer des solutions.<*Article_List*>Apprendre à supporter le silence et ne chercher à meubler l’espace lorsque son interlocuteur prend le temps de réfléchir avant de s’exprimer.<*Article_List*>Avoir suffisamment confiance en soi pour se donner droit à l’erreur et la reconnaître rapidement.<*Article_H2*>Comment s’entraîner à la pleine conscience au travail en 5 étapes<*Article_Body*>La pleine conscience consiste à vivre le moment présent.<*Article_Body*>Pour pratiquer la pleine conscience, il suffit de prendre quelques minutes au cours de la journée pour vous recentrer et vous détendre. Vous trouverez ci-dessous une méthode pour vous entraîner à la pleine conscience au travail, en 5 étapes :<ol><li>S’asseoir à son bureau. Poser les pieds à plat, sans les croiser. Redresser le dos en le décollant légèrement du dossier. Laisser les mains au repos, sur les cuisses. La posture doit être « droite, alerte et digne.<li>Fermer les yeux.<li>Se concentrer sur sa respiration, en particulier sur les mouvements réguliers du ventre.<li>Ne pas chercher à arrêter de penser, mais à l’instant même où on se rend compte qu’on n’est plus concentré sur sa respiration, simplement revenir en pensée, aux mouvements du ventre.<li>Une fois la séance terminée (à chacun de choisir la durée qui lui convient), respirer, s’étirer, puis démarrer tranquillement une nouvelle activité.</ol><*Article_Body*>Lorsqu’elle est pratiquée sur une base continue et intégrée dans notre quotidien, la pleine conscience nous amène à accorder de l’attention à chaque instant de l’activité réalisée. La marche est un bon exemple de cette pratique informelle, où l’attention peut être dirigée sur les odeurs ressenties à l’extérieur, sur les sensations physiques, sur la couleur des paysages et sur le souffle qui s’accentue au rythme des pas.<*Article_Body*>Finalement, sachez qu’il existe aussi des applications et des balados qui permettent la pratique d’exercices guidés de la pleine conscience.<*Article_H2*>Et, bon entraînement à la pleine conscience!<*Override*><p width="100%" style="text-align:center; color: white; background-color: rgb(102,141,197); padding: 15px 15px 10px 10px;"><b>Pour avoir accès à des services de soutien psychosocial confidentiels, communiquez avec votre Programme d’aide aux employés au</b><br>::external::1-800-268-7708||tel:1-800-268-7708::external::<br><b>ou pour les malentendants au</b><br>::external::1-800-567-5803||tel:1-800-567-5803::external::<br><br>::external::www.santecanada.gc.ca/sae||http://www.santecanada.gc.ca/sae::external::</p>`
    };
    contentData.push(returnedItem);
    
    return contentData;
};

var getMentalHealthFromDatabase = function() {
    var returnedItem;
    var contentData = [];
    
    returnedItem = {Ref:1,
        TitleEN:`Employee Assistance Program (EAP)`,
        ContentEN:`<*Article_H1*>Employee Assistance Program (EAP)<*Article_Body*>The Employee Assistance Program (EAP) is a confidential, voluntary and neutral service available to civilian employees and their immediate family members when dealing with personal or professional issues that are affecting their personal well-being and/or work performance.<*Article_Body*>If you need support, please contact:<*Article_List*>DND’s ::external::EAP Peer Referral Agents||http://eap-pae.forces.mil.ca/EAPRALists.aspx::external:: (available during regular working hours)<*Article_List*>Professional mental health counselling services through ::external::Health Canada – Employee Assistance Services||https://www.canada.ca/en/health-canada/services/environmental-workplace-health/occupational-health-safety/employee-assistance-services.html::external:: at ::external::1-800-268-7708||tel:1-800-268-7708::external:: (available 24 hours a day, 7 days a week, 365 days a year)<*Article_Body*>For more information about the EAP, how to become an internal peer referral agent, and/or to schedule a presentation/briefing on EAP services, please contact: ::external::EAP Corporate Office||mailto:P-OTG.EAPCorpOff@intern.mil.ca::external::`,
        TitleFR:`Le Programme d’aide aux employés (PAE)`,
        ContentFR:`<*Article_H1*>Le Programme d’aide aux employés (PAE)<*Article_Body*>Le Programme d’aide aux employés (PAE) du Ministère de la Défense nationale (MDN) est entièrement voué à la prestation d’une aide aux employés et aux membres admissibles de leur famille aux prises avec des difficultés personnelles ou professionnelles qui pourraient avoir un effet négatif sur leur bien-être personnel et/ou leur rendement professionnel.<*Article_Body*>Si vous avez besoin de soutien, veuillez communiquer avec :<*Article_List*>::external::Les agents d'orientation du PAE du MDN||http://eap-pae.forces.mil.ca/EAPRALists.aspx::external:: (disponibles pendant les heures normales de travail)<*Article_List*>Services professionnels de counseling en santé mentale par l'entremise de ::external::Santé Canada - Services d'aide aux employés||https://www.canada.ca/fr/sante-canada/services/sante-environnement-milieu-travail/sante-securite-travail/service-aide-employes.html::external:: au ::external::1-800-268-7708||tel:1-800-268-7708::external:: (disponible 24 heures sur 24, 7 jours sur 7, 365 jours par année)<*Article_Body*>Pour plus d'informations sur le PAE, comment devenir un agent interne de référence par les pairs et/ou pour planifier une présentation/briefing sur les services du PAE, veuillez communiquer avec : ::external::P-OTG.EAPCorpOff@intern.mil.ca||mailto:P-OTG.EAPCorpOff@intern.mil.ca::external::`
        };
        contentData.push(returnedItem);
    returnedItem = {Ref:2,
        TitleEN:`Crisis Text Line`,
        ContentEN:`<*Article_H1*>Crisis Text Line<*Article_Body*>Crisis Text Line, 24/7 provides young people and anyone who needs support with 24/7, free nationwide texting support for those in crisis.  The professionally trained Crisis Line Responders are there to answer your call 24 hours a day, seven days a week.<*Article_Body*>Text ::external::686868||sms:686868::external:: from anywhere in Canada, call ::external::1-800-668-6868||tel:1-800-668-6868::external::, or live chat ::external::https://kidshelpphone.ca/live-chat||https://kidshelpphone.ca/live-chat::external::`,
        TitleFR:`Crisis Text Line/Ligne de texte de crise`,
        ContentFR:`<*Article_H1*>Crisis Text Line/Ligne de texte de crise<*Article_Body*>Crisis Text Line, fournit aux jeunes et à tous ceux qui ont besoin de soutien 24/7, un soutien gratuit par SMS à l'échelle nationale pour ceux qui sont en crise.  Les répondeurs de ligne de crise formés professionnellement sont là pour répondre à votre appel 24 heures par jour, sept jours par semaine.<*Article_Body*>Texte ::external::686868||sms:686868::external:: de n'importe où au Canada, composez le ::external::1-800-668-6868||tel:1-800-668-6868::external::, ou discutez en direct ::external::https://jeunessejecoute.ca/clavarde-en-ligne/||https://jeunessejecoute.ca/clavarde-en-ligne/::external::`
        };
        contentData.push(returnedItem);
    returnedItem = {Ref:3,
        TitleEN:`Mental Health Training`,
        ContentEN:`<*Article_H1*>Mental Health Training<*Article_List*>Mental Health in the Workplace for Managers: This online training course offered via ::external::Defence Learning Network (DLN)||https://www.canada.ca/en/department-national-defence/services/benefits-military/education-training/professional-development/defence-learning-network.html::external:: aims to increase the level of confidence of managers and supervisors of civilian employees when dealing with mental health issues. The training provides tips, tools, and resources to support employees experiencing psychological distress in the workplace.<*Article_List*>Mental Health in the Workplace for Employees: This online training course offered through ::external::Defence Learning Network||https://www.canada.ca/en/department-national-defence/services/benefits-military/education-training/professional-development/defence-learning-network.html::external:: provides employees with a general understanding of mental health, mental illness, and its impact on the workplace.<*Article_List*>Mental Health Conversations: This in-class training offered through the ::external::Learning and Career Centres (LCCs)||http://lcc-cac.forces.mil.ca/lcc-cac/en/ncc_courseDetails_e.asp?lccid=13&courseID=1211::external::, enables managers to practice effective conversations with employees who are experiencing mental health issues, by using appropriate communication tools. Participants will have the opportunity to practice through role playing, give and receive feedback, and learn about available resources to help support employees.<*Article_List*>Mental Health Workshops (only in NCR): These workshops are available through ::external::HR-Civ’s Mental Health & Well-Being Team||mailto:P-OTG.Wellbeing@intern.mil.ca::external:: on a variety of topics including: Resiliency, Civility & Respect in the Workplace, Mental Health and Stigma, and Healthy Workplace Factors – How they impact your mental health.`,
        TitleFR:`Formation en Santé mentale`,
        ContentFR:`<*Article_H1*>Formation en Santé mentale<*Article_List*>Lasanté mentale en milieu de travail pour les gestionnaires : Cette formation en ligne offertepar l’intermédiaire du ::external::Réseau d’apprentissage de la Défense (RAD)||https://www.canada.ca/fr/ministere-defense-nationale/services/avantages-militaires/education-formation/perfectionnement-professionnel/reseau-apprentissage-defense.html::external:: accroît le niveau de confiance des gestionnaires etdes superviseurs du MDN en ce qui concerne la résolution de problèmes de santé mentale. Elle présente des conseils, des outils et des ressources axés sur le soutien des employés qui vivent une détresse psychologique en milieu de travail.<*Article_List*>Lasanté mentale en milieu de travail pour les employés : Cette formation en ligne offertepar l’intermédiaire du ::external::Réseau d’apprentissage de la Défense||https://www.canada.ca/fr/ministere-defense-nationale/services/avantages-militaires/education-formation/perfectionnement-professionnel/reseau-apprentissage-defense.html::external:: permet aux employés d’avoir une bonne compréhension générale de la santé mentale et des maladies mentales, ainsi que de leurs répercussions sur le milieu de travail.<*Article_List*>Conversationssur la santé mentale : Ce cours en salle de classe offerte par l’intermédiaire des ::external::Centres d’apprentissage et de carrière (CAC)||http://lcc-cac.forces.mil.ca/lcc-cac/fr/ncc_courseDetails_f.asp?lccid=13&courseID=1211::external:: permet aux gestionnaires de s’exercer à tenir des conversations efficaces avec des employés aux prises avec des problèmes de santé mentale en utilisant des outils de communication appropriés. Les participants auront l’occasionde pratiquer des jeux de rôle, de donner et de recevoir une rétroaction et de se renseigner sur des ressources accessibles visant à soutenir les employés.<*Article_List*>Atelier sur la santé mentale (seulement dans la RCN) : Ces ateliers sont présentés par l’intermédiaire de ::external::l’équipe responsable de la santé mentale et du bien-être de l’organisation des RH-Civ||mailto:P-OTG.Wellbeing@intern.mil.ca::external::. Ils traitent de divers sujets, entre autres, larésilience, la civilité et le respect en milieu de travail, la santé mentale et la stigmatisation, ainsi que les facteurs propices à un milieu de travail sain et l’incidence de ces derniers sur la santé mentale.`
        };
        contentData.push(returnedItem);
    returnedItem = {
        Ref:4,
        TitleEN:`Activities and Resources for Managers for Creating a Healthy Workplace`,
        ContentEN:`<*Article_H1*>Activities and Resources for Managers for Creating a Healthy Workplace<*Article_Body*>October is ::external::Canada’s Healthy Workplace Month (CHWM)||http://healthyworkplacemonth.ca/en/about/about::external:: and the Defence Team is encouraged to organize and participate in team activities, and to access resources to learn more about building and maintaining a healthy workplace – not only during October, but all year.  This toolkit provides you witha range of resources and activities that can be used to engage your staff in CHWM.  Activities and resources have been organized using three themes: mental health; physical health; and workplace health (see tabs below) to encompass key elements of health. ::external::http://intranet.mil.ca/en/news/special-events/annual-themes/healthy-workplace-month-toolkit.page||http://intranet.mil.ca/en/news/special-events/annual-themes/healthy-workplace-month-toolkit.page::external::`,
        TitleFR:`Activités et ressources pour les gestionnaires pour créer un milieu de travail sain`,
        ContentFR:`<*Article_H1*>Activités et ressources pour les gestionnaires pour créer un milieu de travail sain<*Article_Body*>Le ::external::Mois national de la santé au travail (MNST)||http://healthyworkplacemonth.ca/fr/about/about::external:: est en Octobre, et nous encourageons l’Équipede la Défense à organiser et participer dans les activités d’équipe et à y participer ainsi qu’à consulter les ressources offertes pour en apprendre davantage sur la création et le maintien d’un milieu de travail sain – pas seulement en Octobre, mais toutl’année. Cette boîte à outils vous donne accès à une gamme de ressources et d’activités qui peuvent être utilisées pour inciter votre personnel à prendre part au MNST. Ces activités et ces ressources ont été organisées selon trois thèmes afin d’englober leséléments clés de la santé : la santé mentale, la santé physique et la santé au travail (voir les onglets ci-dessous).  ::external::http://intranet.mil.ca/fr/nouvelles/activites-speciales/themes-annuels/mois-sante-au-travail-trousse.page||http://intranet.mil.ca/fr/nouvelles/activites-speciales/themes-annuels/mois-sante-au-travail-trousse.page::external::`
        };
        contentData.push(returnedItem);



        
        
    return contentData;
};
