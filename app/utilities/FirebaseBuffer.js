
var fileSystem  = require("tns-core-modules/file-system");
var TextModule = require("tns-core-modules/text");

function writeContents( tableName , contents ) {
    var appFolder   = fileSystem.knownFolders.documents().getFolder("firebaseBuffer");
    var bufferFile  = appFolder.getFile(tableName);

    bufferFile.writeTextSync(JSON.stringify(contents), fwerr=>{ 
        throw fwerr;
    }, TextModule.encoding.UTF_8);
}

function readContents( tableName ) {
    var appFolder   = fileSystem.knownFolders.documents().getFolder("firebaseBuffer");
    var bufferFile  = appFolder.getFile(tableName);

    var decodedArray    = JSON.parse( bufferFile.readTextSync( frerr => {
        throw frerr;
    }, TextModule.encoding.UTF_8));

    return decodedArray;
}

exports.writeContents = writeContents;
exports.readContents = readContents;
