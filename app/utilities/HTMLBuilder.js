
/**
 * Generate an HTML document from the value found in the codedString parameter.
 */
exports.buildHTML = function(codedString)
{
    //STYLE HTML STRINGS
    var bodyStyle = `.Article_Body{ height:auto; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 25px; margin-right: 25px; margin-top: 28px; margin-bottom:14px; padding-bottom:0px; white-space: normal; color: #333;}`;
    var h1Style = `.Article_H1{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 14px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var h2Style = `.Article_H2{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 24px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 14px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var h3Style = `.Article_H3{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 20px; line-height: 1.1; font-weight: 700; margin-bottom: 10px; color: #333; margin-left: 25px; margin-bottom:11.5px; margin-top: 38px; white-space: normal;}`;
    var noteStyle = `.Article_Note{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; font-style: italic; margin-left: 25px; margin-right: 25px; margin-top: 5px; margin-bottom:5px; white-space: normal; color: #333;}`;
    var listStyle = `.Article_List{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; margin-left: 50px; margin-right: 25px; margin-top: 18px; margin-bottom:5px; white-space: normal; color: #333;}`;
    var contactStyle = `.Article_Contact{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.1; font-weight: 400; color: #333; margin-left: 25px; vertical-align: middle; white-space: normal;}`;
    var allStyles = bodyStyle + h1Style + h2Style + h3Style + noteStyle + listStyle + contactStyle;
    var headerHTML = `<html><head><style>${allStyles}</style></head><body>`;
    var footerHTML = "</body></html>"
    var totalHTML;
    totalHTML = headerHTML;

    console.log("Create Article: ");   
    var curArticleText = codedString;
    var articleItemSplit;

    var articleComponents = curArticleText.split("<*");

    var articleItem = 0;
    var anchorItem  = 0;

    for( articleItem=0 ; articleItem < articleComponents.length ; articleItem++ ) {
        articleItemSplit = articleComponents[articleItem].split("*>");
        var articleSectionString = "";
        if(articleItemSplit[0] == "Article_List"){
            articleSectionString = "\u2022 ";
        }
        if(articleItemSplit[1]){
            articleSectionString += articleItemSplit[1]
        }

        // parse articleSectionString for special control codes, and format accordingly.

        // ::external:: control code is for creating inline anchors, using the format
        //     ::external::label||link::external::  to create an anchor with the specified label and link
        if(articleSectionString.includes("::external::")){
            var textWithExternal = articleSectionString.split("::external::");
            console.log("TextWithExternal: " + textWithExternal.length);
            var htmlString = "";
            for( anchorItem=0; anchorItem < textWithExternal.length; anchorItem++){
                if(textWithExternal[anchorItem].includes("||")){
                    var linkText = textWithExternal[anchorItem].split("||");
                    htmlString += `<a href="${linkText[1]}">${linkText[0]}</a>`;
                }else{
                    
                    htmlString += `${textWithExternal[anchorItem]}`;
                }
            }
            
            articleSectionString    = htmlString;
        }

        // ::contact:: control code is used for creating anchors with associated icons, depending on the link type.
        //     ::contact::label||link::contact::  to create an image and anchor with the specified label and link
        if(articleSectionString.includes("::contact::")){
            var textWithExternal = articleSectionString.split("::contact::");
            console.log("TextWithContact: " + textWithExternal.length);
            var htmlString = "";
            for( anchorItem=0; anchorItem < textWithExternal.length; anchorItem++){
                if(textWithExternal[anchorItem].includes("||")){
                    var linkText = textWithExternal[anchorItem].split("||");
                    var icon ="";
                    if( linkText[1].startsWith("http://") || linkText[1].startsWith("https://") ) {
                        icon ="./images/web.png";
                    } else if( linkText[1].startsWith( "mailto:")) {
                        icon ="./images/email.png";
                    } else if( linkText[1].startsWith( "tel:")) {
                        icon ="./images/phone.png";
                    }
                    htmlString += `<div><img src="${icon}" style="vertical-align: middle;"><span style="vertical-align: middle;"><a href="${linkText[1]}" style="margin-left: 5px;">${linkText[0]}</a></span></div>`;
                }else{
                    
                    htmlString += `${textWithExternal[anchorItem]}`;
                }
            }
            
            articleSectionString    = htmlString;
        }

        if( articleItemSplit[0] != "Override") {
            totalHTML += `<div class="${articleItemSplit[0]}">${articleSectionString}</div>`;
        } else {
            totalHTML += articleSectionString;
        }
    }
    totalHTML += footerHTML;
    
    return totalHTML;
};
