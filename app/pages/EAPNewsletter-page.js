var     observable              = require("data/observable");
const   pageData                = new observable.Observable();
var     applicationSettings     = require("application-settings");
const   webViewEvents           = require("~/utilities/WebViewExtender");
var     HTMLBuilder             = require("~/utilities/HTMLBuilder");
var frameModule = require("ui/frame");
var     page;
var     actionBarHiddenPage     = false;

const   timerModule             = require("tns-core-modules/timer");
var     scrollDetection         = false;
var     lastValue               = 0;
var     scrollStartValue        = 0;

var     pagePrefix;

exports.pageLoaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    var articleData = getFromDatabase()[0];
    var theme       = "high-contrast";//applicationSettings.getString("Theme");
    if( applicationSettings.getString("PreferredLanguage") == "French" ) {
        pageData.set("actionBarTitle", articleData.TitleFR);
        
        var formattedText   = HTMLBuilder.buildHTML( articleData.ContentFR );
        pageData.set("ArticleHTML", formattedText);
        pagePrefix = "FR_";
    } else {
        pageData.set("actionBarTitle", articleData.TitleEN);
        
        var formattedText   = HTMLBuilder.buildHTML( articleData.ContentEN );
        pageData.set("ArticleHTML", formattedText);
        pagePrefix = "";
    }

    scrollDetection         = false;
};

exports.goBack = function(args) {
    const thisPage = args.object.page;
    thisPage.frame.goBack();
};


exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate(pagePrefix + "main-page");
    
};

exports.goBack = function(args){
    const thisPage = args.object.page;
    thisPage.frame.goBack()
};

exports.footer3 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate(pagePrefix + "profile-page");
    
};

exports.footer4 = function(){
    console.log("Go To Feedback");
    var topmost = frameModule.topmost();
    //topmost.navigate("feedback-page");
    var pageDetails = String(topmost.currentPage).split("///");
    const TODAY = new Date();
    var navigationOptions={
        moduleName:pagePrefix + 'feedback-page',
        context:{Language: "ENG",
                PageName: pageDetails[1].split("/")[1].split(".")[0],
                DateTime: TODAY
                }
            }
    topmost.navigate(navigationOptions); 
};

exports.footer5 = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("POC-page");
};

exports.showSideDrawer = function(args) {
    console.log("Show side drawer");
};

exports.onWVSwipe = function(event) {
    console.log("onWVSwipe: " + event.direction);
    if( event.direction == 1 ) {
        console.log("onWVSwipe: " + event.direction);
        page.frame.goBack();
    } else if ( event.direction == 4 && !actionBarHiddenPage ) {
        actionBarHiddenPage = true;
        page.actionBarHidden    = actionBarHiddenPage;
    } else if( event.direction == 8 && actionBarHiddenPage ) {
        actionBarHiddenPage = false;
        page.actionBarHidden    = actionBarHiddenPage;
    }
};

exports.onWVScroll = function(event) {
    const actionBar = page.actionBar;
    console.log("Scroll value: " + event.scrollY + " Scroll delta: " + event.deltaY);

    var articleWebView  = page.getViewById("myWebView");


    if( actionBarHiddenPage && event.deltaY > 50 ) {
        actionBarHiddenPage     = false;
        page.actionBarHidden    = actionBarHiddenPage;
    } else if( !page.actionBarHidden && event.deltaY > -50 ) {
        console.log(`onWVScroll: delta: [` + event.deltaY + `] ` + articleWebView.scrollY);
        actionBarHiddenPage     = true;
        page.actionBarHidden    = actionBarHiddenPage;
    }
};

// detecting quick swipe scrolling where the the scroll view keeps going after the user has released the screen
exports.onSVScroll = function(event) {

    if( !scrollDetection ) {
        scrollDetection     = true;
        lastValue           = event.scrollY;
        scrollStartValue    = event.scrollY;
        const scrollView    = page.getViewById("pageScrollView");
        const gridLayout    = page.getViewById("pageGridLayout");
        const titleHeight   = page.actionBar.getActualSize().height;

        const   timerID = timerModule.setInterval(() => {
            if( lastValue == scrollView.verticalOffset ) {
                timerModule.clearInterval( timerID );
                scrollDetection = false;
                console.log( "scroll done" );
            } else {
                lastValue = scrollView.verticalOffset;
                console.log("startValue = " + scrollStartValue + "; lastValue = " + lastValue);

                if( lastValue > scrollStartValue ) {
                    if( (lastValue - scrollStartValue) > titleHeight && !actionBarHiddenPage ) {    // hide
                        actionBarHiddenPage = true;
                        page.actionBarHidden    = actionBarHiddenPage;
                        gridLayout.rows = "*,5";
                        
                        scrollStartValue = lastValue;
                    } else if( actionBarHiddenPage ) {
                        scrollStartValue = lastValue;
                    }
                } else {
                    if( (scrollStartValue - lastValue) > titleHeight && actionBarHiddenPage ) {    // show
                        actionBarHiddenPage = false;
                        page.actionBarHidden    = actionBarHiddenPage;
                        gridLayout.rows = "*,60";
                        
                        scrollStartValue = lastValue;
                    } else if( !actionBarHiddenPage ) {
                        scrollStartValue = lastValue;
                    }
                }
            }
        }, 100);
    }
};

exports.onWVPan = function(event) {
    /*
    var pageScrollView  = page.getViewById("pageScrollView");
    if( event.deltaY < (-1 * (page.actionBar.getActualSize().height)) && !actionBarHiddenPage ) {
        actionBarHiddenPage = true;
        page.actionBarHidden    = actionBarHiddenPage;
        console.log( "toggle actionBarHiddenPage: " + actionBarHiddenPage + "  deltaY = " + event.deltaY + "  scrollY = " + pageScrollView.verticalOffset + "  actionBar height = ");
    } else if( event.deltaY > page.actionBar.getActualSize().height && actionBarHiddenPage ) {
        actionBarHiddenPage = false;
        page.actionBarHidden    = actionBarHiddenPage;
        console.log( "toggle actionBarHiddenPage: " + actionBarHiddenPage + "  deltaY = " + event.deltaY + "  scrollY = " + pageScrollView.verticalOffset);
    } else if( pageScrollView.verticalOffset == 0 && actionBarHiddenPage ) {
        actionBarHiddenPage = false;
        page.actionBarHidden    = actionBarHiddenPage;
        console.log( "toggle actionBarHiddenPage: " + actionBarHiddenPage + "  deltaY = " + event.deltaY + "  scrollY = " + pageScrollView.verticalOffset);
    }
    */
};

exports.onWebViewLoaded = function(webargs) {
    webargs.enableZoom  = true;
    webViewEvents.onWebViewLoaded(webargs);
}

exports.onLoadStarted = webViewEvents.onLoadStarted;

var getFromDatabase = function() {
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
