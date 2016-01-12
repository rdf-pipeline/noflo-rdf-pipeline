/**
 * Simple javascript that will be invoked by a noflo component with a list of
 * of languages as command line arguments.  Command line will look like this: 
 *
 *    node UPickHello.js <Language> ... <Language> 
 *
 * Where the language will be one of the 3 character ISO-639-2 language abbreviations.
 *
 * This script will print hello to the console in whatever languages are specified and  
 * exit.  
 */

var args = process.argv.slice(2);  // strip the node and script off
var langs = args[0].split(" "); // now split up the languages into an array

// Define the languages we support
var languageMap = {
    "haw": "Aloha!",     // Hawaiian
    "ces": "Ahoj!",      // Czech
    "cze": "Ahoj!",      // Czech
    "hrv": "Bok!",       // Croatian
    "fra": "Bonjour!",   // French
    "fre": "Bonjour!",   // French
    "rum": "Buna ziua!", // Romanian
    "ron": "Buna ziua!", // Romanian
    "ita": "Ciao!",      // Italian
    "gle": "Dia duit!",  // Irish
    "ger": "Guten tag!", // German
    "deu": "Guten tag!", // German
    "afr": "Hallo!",     // Africaans
    "eng": "Hello!",     // English
    "dan": "Hej!",       // Danish
    "fin": "Hei!",       // Finnish
    "wel": "Helo!",      // Welsh
    "cym": "Helo!",      // Welsh
    "spa": "Hola!",      // Spanish
    "baq": "Kaixo!",     // Basque
    "eus": "Kaixo!",     // Basque
    "fil": "Kamusta!",   // Filipino
    "hmn": "Nyob zoo!",  // Hmong
    "glg": "Ola!",       // Galician
    "aze": "Salam!",     // Azerbaijani
    "lat": "Salve!",     // Latin
    "zul": "Sawabona!",  // Zulu
    "est": "Tere!",      // Estonian
    "pol": "Witaj!"      // Polish
};

console.log("\nHello from around the world!");
console.log("Name the language that says 'Hello!' in each of the following ways:");

for (var i=0, len=langs.length; i < len; i++ ) {
   var currentLang = langs[i].toLowerCase();
   if ( currentLang in languageMap ) { 
       console.log( languageMap[currentLang] );
   } else {
       console.error("Language " + currentLang + " is not supported.");
   } 
}
