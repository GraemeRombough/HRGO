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
    displayPOCs(getFromDatabase());
};

exports.goToHome = function(){
    var topmost = frameModule.topmost();
    topmost.navigate("FR_main-page");
    
};
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
exports.searchPOC = function(){
    var dataBaseReturn = getFromDatabase();
    var filteredResults = [];
    if(pageData.get("SearchCriteria") != ""){
    for (i = 0; i < dataBaseReturn.length; i++) {
        if (dataBaseReturn[i].Title.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Code.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Desc.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }else if(dataBaseReturn[i].Keywords.toLowerCase().includes(pageData.get("SearchCriteria").toLowerCase()) == true ){
            filteredResults.push(dataBaseReturn[i]);
        }
    }
    displayPOCs(filteredResults);
    }else{
        displayPOCs(getFromDatabase());
    }
    
}
var displayPOCs = function(Codes){
    var LeaveList = pageObject.getViewById("POC_List");
    LeaveList.visible = false;
    LeaveList.removeChildren();
    for(i = 0; i < Codes.length; i++ ){
        LeaveList.addChild(createPOCGrid(Codes[i].Title, Codes[i].Paid, Codes[i].Code, Codes[i].Desc));
    }
    pageData.set("SearchCriteria", "");
    LeaveList.visible = true;
};
var createPOCGrid = function(Leave_t, Leave_p, Leave_c, Leave_d){
    var gridLayout = new layout.GridLayout();
    var LeaveTitle = new Label();
    var LeavePaid = new Label();
    var LeaveDesc = new Label();

    LeaveTitle.text = Leave_t + " (" + Leave_c + ")";
    LeaveTitle.className = "POC_H1";
    
    LeaveDesc.text = Leave_d;
    LeaveDesc.className = "POC_Body";

    layout.GridLayout.setRow(LeaveTitle, 0);
    layout.GridLayout.setRow(LeaveDesc, 1);
    gridLayout.addChild(LeaveTitle);
    gridLayout.addChild(LeaveDesc);
    var titleRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    var descRow = new layout.ItemSpec(1, layout.GridUnitType.AUTO);
    gridLayout.addRow(titleRow);
    gridLayout.addRow(descRow);
    gridLayout.className = "POC_Grid";

    return gridLayout;

};
var getFromDatabase = function(){
    var databaseReturn = [];
    var dbRow = {};

    //dbRow = {Title:"Bereavement", Paid:"Yes", Code:"510", Desc:"The intent is to allow an employee time off with pay for purposes related to the death in the immediate family, as defined in the clause relating to bereavement leave.", KeyWords:"death"};    //databaseReturn.push(dbRow);
    dbRow ={Title:"Accidents du travail", Paid:"Oui", Code:"660", Desc:"Ce type de congé s’applique lorsque l’employé est absent du travail en raison d’une blessure ou d’une maladie liée au travail et qu’une demande d’indemnité a été approuvée par la commission d’accidents du travail provinciale (CSST, CSPAAT etc.) responsable. ", Keywords:"AT; lieu de travail"};

databaseReturn.push(dbRow);

dbRow ={Title:"Affaires syndicales (non payés)", Paid:"Dans certains cas", Code:"910", Desc:"La raison de ce congé est de permettre aux représentants syndicaux et aux employés d’exercer leurs droits tels que prévus dans la convention collective.", Keywords:"syndicat; syndicaux; grief; audience"};

databaseReturn.push(dbRow);

dbRow ={Title:"Affaires syndicales (payés)", Paid:"Dans certains cas", Code:"640", Desc:"La raison de ce congé est de permettre aux représentants syndicaux et aux employés d’exercer leurs droits tels que prévus dans la convention collective.", Keywords:"syndicat; syndicaux; grief; audience"};

databaseReturn.push(dbRow);

dbRow ={Title:"Ancienneté (supprimée)", Paid:"Oui", Code:"310", Desc:"Le congé d’ancienneté est un congé payé additionnel au terme de 20 ans de service. La disposition relative au congé d’ancienneté a été supprimée, mais un petit nombre d’employés peuvent toujours posséder des crédits inutilisés, qu’ils ont le droit d’utiliser.", Keywords:""};

databaseReturn.push(dbRow);

dbRow ={Title:"Annuel unique", Paid:"Oui", Code:"121", Desc:"Congé annuel unique.", Keywords:"vacance"};

databaseReturn.push(dbRow);

dbRow ={Title:"Annuel", Paid:"Oui", Code:"110", Desc:"Congé annuel", Keywords:"vacance"};

databaseReturn.push(dbRow);

dbRow ={Title:"Autofinancé", Paid:"Non", Code:"998", Desc:"Ce congé vise à permettre aux employés nommés pour une période indéterminée de reporter le paiement de jusqu’à 33,3 % de leur salaire brut afin de financer une période d’absence au travail et de reprendre leur emploi régulier quand le congé est terminé.  Ce congé doit être demandé plusieurs années à l’avance pour qu’on puisse prendre les dispositions nécessaires afin de déposer l’argent requis dans un compte en fiducie.  Peut être octroyé plus d’une fois.  Ne pas confondre « congé avec étalement du revenu ».  Ce congé dure au moins six (6) mois, mais pas plus de douze (12) mois.", Keywords:"Auto-financé"};

databaseReturn.push(dbRow);

dbRow ={Title:"Bénévolat (supprimé)", Paid:"Oui", Code:"", Desc:"Les employés ont droit, au cours de chaque exercice financier, à  une période de 7.5 heures pour travailler à titre de bénévole pour un organisme ou pour une activité communautaire ou de bienfaisance.", Keywords:"volontaire"};

databaseReturn.push(dbRow);

dbRow ={Title:"Comparution", Paid:"Oui", Code:"610", Desc:"L’intention est d’octroyer un congé payé à un employé assigné à témoigner par la cour ou par une entité ou un représentant dûment constitué(e) de la procédure judiciaire. Un congé pour fonctions judiciaires n’est pas octroyé à un employé qui est demandeur ou défendeur dans une action en justice. La fonction de juré fait également partie de cette disposition et est applicable uniquement pendant la période où l’employé doit comparaître en cour.", Keywords:"court; Jury; subpoena; légal"};

databaseReturn.push(dbRow);

dbRow ={Title:"Compassion", Paid:"Non", Code:"951", Desc:"Ce type de congé est accordé à l’employé pour lui permettre de prendre soin d’un membre gravement malade de sa famille immédiate (selon la définition de la convention collective pertinente) et dont l’espérance de vie ne devrait pas dépasser six mois.", Keywords:"critique; maladie; malade"};

databaseReturn.push(dbRow);

dbRow ={Title:"Compensatoire", Paid:"Oui", Code:"810", Desc:"Normalement, les heures supplémentaires sont payées en argent comptant, mais l’employé peut demander de prendre un congé payé au lieu de recevoir un paiement en argent. ", Keywords:"comp; CTC"};

databaseReturn.push(dbRow);

dbRow ={Title:"Congé non payés pour autres raisons / Autre congés non payés", Paid:"Non", Code:"999", Desc:"Un congé non payé peut être accordé pour des motifs qui pourraient être attribuables à l’employé mais qui ne sont pas visés par les dispositions relatives aux autres types de congé de la convention. Il est particulièrement important de consulter le conseiller en ressources humaines avant d’octroyer ce congé. ", Keywords:"non-rémunéré"};

databaseReturn.push(dbRow);

dbRow ={Title:"Congé payés pour autres raisons / Autre congés payés", Paid:"Oui", Code:"699", Desc:"Un congé payé peut être accordé dans des circonstances où l’employé doit s’absenter du travail pour un motif qui ne lui est pas directement attribuable, ou à des fins autres que celles prévues précisément dans la convention collective.  Lorsque les circonstances empêchant l’employé de se rendre au travail ne lui sont pas directement attribuables, la demande de congé payé ne doit pas être refusée de manière déraisonnable.  Il est particulièrement important de consulter le conseiller en ressources humaines avant d’octroyer ce congé.", Keywords:"avec solde; rémunéré; sport"};

databaseReturn.push(dbRow);

dbRow ={Title:"Déplacement payé (poste isolé)", Paid:"Oui", Code:"670", Desc:"Ce type de congé est destiné aux employés se trouvant dans les postes isolés et vise à leur permettre de se déplacer du poste vers la destination à l’occasion de vacances ou d’un congé de maladie, et à rentrer au poste.", Keywords:""};

databaseReturn.push(dbRow);

dbRow ={Title:"Deuil", Paid:"Oui", Code:"510", Desc:"L’intention est d’octroyer un congé autorisé payé à un employé pour des raisons liées au décès d’un membre de sa famille immédiate comme le définit la clause relativement au congé pour décès.", Keywords:"décès"};

databaseReturn.push(dbRow);

dbRow ={Title:"Direction", Paid:"Oui", Code:"647", Desc:"Ce congé payé accordé par l'administrateur général ou par la personne investie du pouvoir délégué constitue une compensation pour certains employés exclus ou non représentés qui n'ont pas droit au paiement des heures supplémentaires, mais de qui la direction exige d'effectuer des heures supplémentaires ou de travailler ou de voyager un jour de repos ou de congé.", Keywords:"gestion"};

databaseReturn.push(dbRow);

dbRow ={Title:"Employé en déplacement", Paid:"Oui", Code:"665", Desc:"Ce congé est acquis à chaque exercice quand des employés sont absents de leur résidence pendant un nombre donné de jours, jusqu’à concurrence du nombre de jours précisé dans la convention collective. ", Keywords:"voyage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Étalement du revenue", Paid:"Non", Code:"911", Desc:"Il s’agit d’une modalité de travail spéciale qui permet aux employés de réduire leur nombre de semaines de travail au cours d’une période de 12 mois en prenant un congé non payé. La rémunération de la personne participante est réduite en conséquence et est étalée sur l'année.  Le niveau de participation aux régimes de pension et d'avantages sociaux (y compris les cotisations payables) demeure inchangé.  Cette modalité de travail permet à l’employé de continuer à recevoir une rémunération (réduite) chaque mois pendant l’année.", Keywords:"CÉR; revenu; moyenne"};

databaseReturn.push(dbRow);

dbRow ={Title:"Études", Paid:"", Code:"", Desc:"Un congé d’études (non payé) d’une durée allant jusqu’à un (1) an, renouvelable selon accord mutuel, pour fréquenter un établissement reconnu afin d’acquérir une formation favorable au ministère et à l’employé.", Keywords:"éducation; école; diplôme; sabbatique; perfectionnement professionnel"};

databaseReturn.push(dbRow);

dbRow ={Title:"Examens", Paid:"Oui", Code:"620", Desc:"Ce type de congé peut être octroyé à un employé pour qu’il puisse se présenter à  un examen (autre que ceux des processus de sélection au sein de la fonction publique- voir Congé de sélection du personnel) ou soutenir une thèse pendant ses heures de travail prévues et quand le programme d’étude se rattache directement aux fonctions de l’employé ou qu’il améliorera ses qualifications.  On peut mentionner les exemples suivants : examens  liés à des cours techniques, des cours universitaires ou aux programmes d’apprentissage.", Keywords:"examen; cours; apprentissage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Fins d'instruction au sein des Forces de réserve / service militaire (non payés)", Paid:"Dans certains cas", Code:"975", Desc:"Un congé payé dans la catégorie Autres peut être octroyé aux personnes nommées à l’administration publique centrale afin qu’ils puissent servir dans la réserve des Forces canadiennes.  Ce congé devrait être accordé sous « Congé payé ou non payé pour autres raisons » selon la convention collective de l’employé.", Keywords:"formation"};

databaseReturn.push(dbRow);

dbRow ={Title:"Fins d'instruction au sein des Forces de réserve / service militaire (payés)", Paid:"Dans certains cas", Code:"650", Desc:"Un congé payé dans la catégorie Autres peut être octroyé aux personnes nommées à l’administration publique centrale afin qu’ils puissent servir dans la réserve des Forces canadiennes.  Ce congé devrait être accordé sous « Congé payé ou non payé pour autres raisons » selon la convention collective de l’employé.", Keywords:"formation"};

databaseReturn.push(dbRow);

dbRow ={Title:"Jours de remplacement", Paid:"Oui", Code:"851", Desc:"Le jour de remplacement constitue la compensation pour un travail accompli antérieurement pendant un jour férié payé.", Keywords:""};

databaseReturn.push(dbRow);

dbRow ={Title:"Maladie avec certificat", Paid:"Oui", Code:"220", Desc:"Ce congé sert à protéger l’employé contre la perte de salaire lorsqu’il  est incapable d’accomplir les tâches nécessaires à son poste en raison d’une maladie ou d’une blessure. Ce congé ne devrait pas être pris simplement parce qu’il est disponible.  L'employé fournit un certificat médical.  Il n’est plus nécessaire de fournir un certificat médical après un nombre de jours d’absence donné. Fréquemment la déclaration de l’employé qu’il est malade, suffit à justifier son état aux yeux de son employeur.", Keywords:"malade; certifié; non-certifié; billet"};

databaseReturn.push(dbRow);

dbRow ={Title:"Maladie sans certificat", Paid:"Oui", Code:"210", Desc:"Ce congé sert à protéger l’employé contre la perte de salaire lorsqu’il  est incapable d’accomplir les tâches nécessaires à son poste en raison d’une maladie ou d’une blessure. Ce congé ne devrait pas être pris simplement parce qu’il est disponible.  L'employé ne fournit pas de certificat médical.  Il n’est plus nécessaire de fournir un certificat médical après un nombre de jours d’absence donné. Fréquemment la déclaration de l’employé qu’il est malade, suffit à justifier son état aux yeux de son employeur.", Keywords:"malade; certifié; non-certifié; billet"};

databaseReturn.push(dbRow);

dbRow ={Title:"Maternité", Paid:"Non", Code:"925", Desc:"Fournir un congé non payé aux employées avant la date, à la date même ou après la date de la fin de la grossesse.  La plupart des conventions collectives prévoient le versement de prestations de maternité qui viennent compléter les prestations d’assurance emploi.", Keywords:"naissance; paternité"};

databaseReturn.push(dbRow);

dbRow ={Title:"Mission du service extérieur ", Paid:"Oui", Code:"731", Desc:"Ce congé accorde à l’employé du temps libre payé pour les déplacements entre son lieu d’affectation et la ville où se trouve l’administration centrale. Le nombre de crédits de congé dépend du temps passé au poste donné. Le nombre de crédits pouvant être accumulés comporte un minimum et un maximum.", Keywords:""};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales - activités scolaires", Paid:"Oui", Code:"470", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales.  Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales - fermature imprévisible école/garderie", Paid:"Oui", Code:"471", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales. Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales - maladie membre famille", Paid:"Oui", Code:"420", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales. Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales - naissance", Paid:"Oui", Code:"430", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales. Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales - rendez-vous avec professionnel", Paid:"Oui", Code:"472", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales.  Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales adoption", Paid:"Oui", Code:"440", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales.  Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales autre", Paid:"Oui", Code:"490", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales.  Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations familiales rendez-vous", Paid:"Oui", Code:"410", Desc:"L’intention est d’accorder aux employés des périodes de congé pour diverses obligations familiales.  Parmi les situations où ce congé est accordé, on peut mentionner les suivantes : la prestation de soins temporaires à un membre malade de la famille de l'employé selon la définition de la convention collective de celui ci, les besoins liés à l'adoption ou à la naissance d'un enfant, de même que le temps nécessaire pour amener un membre de la famille à des rendez-vous; les activités scolaires, fermeture imprévisible de l’école ou de la garderie et un  rendez-vous chez un professionnel.", Keywords:"soins; OF; adoption; rendez-vous; naissance; mariage"};

databaseReturn.push(dbRow);

dbRow ={Title:"Obligations personnelles", Paid:"Non", Code:"945", Desc:"La majorité des conventions collectives prévoient deux périodes prolongées de congé non payé pour besoins personnels pendant la carrière de l’employé au sein de la fonction publique. Certaines autres conventions en permettent plus que deux.  Selon la plus part des conventions collectives, ce congé peut être octroyé une fois pour une période maximale de trois (3) mois et une fois pour une période de plus de trois (3) mois qui n’excède pas une (1) année.", Keywords:"3-mois; 12-mois"};

databaseReturn.push(dbRow);

dbRow ={Title:"Parental", Paid:"Non", Code:"941", Desc:"L’employé prend ce congé pour s’occuper ou pour assurer la garde d’un nouveau-né ou d’un enfant adopté pour une période maximale de 37 semaines à l’intérieur d’une période de 52 semaines débutant le jour de la naissance de l’enfant ou le jour où l’enfant est confié aux soins de l’employé.   La plupart des conventions collectives prévoient le versement de prestations parentales qui viennent compléter les prestations d’assurance emploi.", Keywords:"parent; maternité; paternité; adoption"};

databaseReturn.push(dbRow);

dbRow ={Title:"Personnel", Paid:"Oui", Code:"530", Desc:"Les employés ont le droit, pour chaque exercice financier, de prendre un congé de l'equivalent en heures de deux jours ouvrables pour des raisons personnelles.", Keywords:"volontaire"};

databaseReturn.push(dbRow);

dbRow ={Title:"Personnel", Paid:"Oui", Code:"540", Desc:"Les employés ont le droit, pour chaque exercice financier, de prendre un congé de l'equivalent en heures de deux jours ouvrables pour des raisons personnelles.", Keywords:"volontaire"};

databaseReturn.push(dbRow);

dbRow ={Title:"Promotion professionnelle / Perfectionnement professionnel", Paid:"Oui", Code:"620", Desc:"Ce congé peut être octroyé pour une activité qui, selon l’employeur, est susceptible d’aider une personne à poursuivre ou maintenir son perfectionnement professionnel, à l’aider à maintenir ou obtenir les crédits nécessaires pour satisfaire aux exigences des ordres professionnels ou de permettre au ministère à réaliser ses objectifs.", Keywords:"professionnel; carrière; développement"};

databaseReturn.push(dbRow);

dbRow ={Title:"Réinstallation du conjoint", Paid:"Non", Code:"930", Desc:"Ce congé est octroyé pour une période maximale d’une (1) année si le conjoint ou le conjoint de fait est réinstallé de manière permanente et pour une période maximale de cinq (5) années si le conjoint est réinstallé de manière temporaire.", Keywords:"déménagement; époux; épouse; conjointe"};

databaseReturn.push(dbRow);

dbRow ={Title:"Sélection du personnel", Paid:"Oui", Code:"630", Desc:"L’intention est d’octroyer un congé payé à un employé pour lui permettre de participer à un processus de dotation au sein de la fonction publique. Ce congé doit inclure, pour l’employé, un temps de déplacement raisonnable à destination et en provenance de l’endroit où la présence de celui-ci est requise.", Keywords:"entrevue; emploi"};

databaseReturn.push(dbRow);

dbRow ={Title:"Service extérieur  (supprimé) ", Paid:"", Code:"710", Desc:"Même si le congé lié au service extérieur a été supprimé, les employés peuvent toujours se prévaloir des crédits de congé qui leur restent.  Il peut être utilisé de la même manière que les congés annuels.", Keywords:""};

databaseReturn.push(dbRow);

dbRow ={Title:"Soin de la famille proche", Paid:"Non", Code:"", Desc:"Ce congé est octroyé à l’employé afin qu’il puisse veiller aux soins des membres de la famille comme le décrit l’article pertinent de la convention collective. ", Keywords:"famille; soins"};

databaseReturn.push(dbRow);

dbRow ={Title:"Temps libre", Paid:"Oui", Code:"", Desc:"Le temps libre payé est utilisé pour autoriser des absences sans toucher les crédits de congé, de congé de maladie ou d’autres congés.  En général, ce type d’absence dure moins de quatre heures. Techniquement, il s’agit d’une forme de congé payé pour d’autres raisons.  Les employés devraient tenter de fixer leurs rendez-vous personnels en dehors des heures de travail.", Keywords:"discrétion; congé; rendez-vous"};

databaseReturn.push(dbRow);

dbRow ={Title:"Transition préalable à la retraite", Paid:"Non", Code:"", Desc:"Le congé de transition préalable à la retraite est une modalité de travail spéciale qui permet aux employés admissibles qui sont à moins de deux ans de leur retraite de réduire leur semaine de travail jusqu’à concurrence de 40 p.100. Dans le cas d’une personne à temps plein, cela équivaut à deux jours au maximum par tranche de cinq jours ouvrables.", Keywords:"CTR"};

databaseReturn.push(dbRow);

    return databaseReturn;
};
