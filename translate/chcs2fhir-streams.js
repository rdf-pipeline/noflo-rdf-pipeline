#!/usr/bin/env node
/**
 * Mike Carifio <michael.carifio@asmr.com> <mike@carif.io>
 *
 *     Scaffolding stolen from http://shapeshed.com/command-line-utilities-with-nodejs/
 */


var yargs = require('yargs');
var argv = yargs
    .usage('$0 [-o pathname] input.jsonld')
    .argv;

var jsonld = require('jsonld'); // https://github.com/digitalbazaar/jsonld.js/
var jsmin = require('jsmin');
var fs = require('fs');
var util = require('util');
var process = require('process');



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


// Load a file and return it as a JSON object. Removes comments.
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

        return fhir;

    } catch (err) {
        logger.error(err);
    }

}


function process_file0(filename) {
    return process_stream(fs.createReadStream(filename, {encoding: 'utf8'}));
}

function process_stream(s /*:stream.Readable*/ ) {

    try {

        // minify and load filename into an object; minify removes comments
        var input = s.read().toString();
        var chcs /*:JSONLD*/ = JSON.parse(jsmin.jsmin(input));

        // Translate the object from chcs jsonld to fhir jsonld
        var fhir /*:JSONLD*/ = translate(chcs)

        // See the result
        logger.debug(pretty_print(fhir));

        return fhir;

    } catch (err) {
        logger.error(err);
    }

}



// Any files enumerated at the command line?
if (argv._.length == 0) {
    // Nope. Use stdin.
    // TODO mike@carif.io: portable way to do this using process.stdin?
    // [ process.stdin.fd ].forEach(process_file)
    ['/dev/stdin'].forEach(process_file);
} else {
    argv._.forEach(process_file0);
}


