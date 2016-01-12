#!/usr/bin/env node
/**
 * Mike Carifio <michael.carifio@asmr.com> <mike@carif.io>
 *
 *     Scaffolding stolen from http://shapeshed.com/command-line-utilities-with-nodejs/
 */

var jsonld = require('jsonld'); // https://github.com/digitalbazaar/jsonld.js/
var jsmin = require('jsmin');
var fs = require('fs');
var util = require('util');
var log4js = require('log4js'); // https://github.com/nomiddlename/log4js-node
var logger = log4js.getLogger(); // TODO mike@carif.io: scope?

// TODO mike@carif.io: run nodejs command line app from within Intellij WebStorm?


// TODO mike@carif.io: no builtin js clone? Don't believe it... */
// Deep copy object o so you don't modify it.
function clone(o /*:object*/) {
    return JSON.parse(JSON.stringify(o));
}


// slurp returns the contents of filename as a utf8 string.
function slurp(filename /*:Pathname*/) {
    // TODO mike@carif.io: async this eventually
    // https://nodejs.org/api/fs.html#fs_fs_readfilesync_file_options
    return fs.readFileSync(filename, "utf8");
}


// TODO mike@carif.io
// Load a file and return it as a JSON object. Remove comments.
function load(filename) {
    var s = slurp(filename);
    var j = jsmin.jsmin(s);
    return JSON.parse(j);
}


// TODO mike@carif.io: all to get here
// translate converts chcs jsonld into fhir jsonld
function translate(chcs) {
    var result = clone(chcs);
    // translate result in place and then return it
    return result;
}

// Indent JSON object json.
function pretty_print(json /*:JSON*/) {
    return JSON.stringify(json, null, 2);
}


// Process the chcs jsonld file.
function process_file(filename /*:Pathname*/ ) {

    try {

        logger.info('process ' + filename);
        if (!filename.match(/\.jsonld$/))
            logger.warn(util.format("Expected filename '%s' to end with '.jsonld'. Did not.", filename));

        // minify and load filename into an object; minify removes comments
        var chcs /*:JSONLD*/ = load(filename);

        // Translate the object from chcs jsonld to fhir jsonld
        var fhir /*:JSONLD*/ = translate(chcs)

        // See the result
        logger.debug(pretty_print(fhir));

    } catch (err) {
        logger.error(err);
    }

}



// TODO mike@carif.io: add command line processing
process.argv.slice(2).forEach(process_file);



