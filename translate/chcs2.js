#!/usr/bin/env node

'use strict';

/**
 * Mike Carifio <mike@carif.io>
 *
 *     Scaffolding stolen from http://shapeshed.com/command-line-utilities-with-nodejs/
 *     Need it to run this file in webstorm under the debugger, a productivity boast.
 */

var jsonld = require('jsonld'); // https://github.com/digitalbazaar/jsonld.js/
var decomment = require('decomment');
var fs = require('fs');
var util = require('util');
var log4js = require('log4js'); // https://github.com/nomiddlename/log4js-node
var logger = log4js.getLogger(); // TODO mike@carif.io: scope?
var program = require('commander'); // https://www.npmjs.com/package/commander
var _ = require('underscore');

// TODO mike@carif.io: add template expansion. Already in node?
// var template = require('some template thing')

// TODO mike@carif.io: turn this into a node module
// var translate = require('translate');




// Long sequence of is_chcs*(candidate) => boolean. These predicates tell you that you have a chcs object of a
// certain type. They all work by looking for a type tag and matching a regular expression.

/**
 *
 * @param {object} candidate -- candidate to test
 * @returns {boolean}
 */


/**
 * Returns true iff object 'candidate' is a chcs type matched by 'regular_expression' without regard to whitespace.
 * @param {regex} regular_expression - how to match the 'type' tag
 * @returns {Function} - typically assigned to a memorable function name, e.g. is_chcsPerson.
 */
function is_chcsType(candidate, regular_expression) {
    return typeof candidate == 'object' && candidate['type'] && candidate['type'].match(regular_expression);
}

function is_chcsPerson(candidate) {
    return is_chcsType(candidate, /chcss:\s*2\s*$/);
}


/**
 * Translate an entire chcs @graph object depending on the translate function.
 * Assumes a 1-1 translation strategy.
 *
 * @param {list[object]} graph - The jsonld generated by an 'all' report in LDR.
 * @param {Function(document) => boolean} isType - a predicate of one argument, a document, that returns true iff the document
 *        is the right chcs type.
 * @param {Function(document) => object} translate
 * @returns {list[object]} - the turtle or fhir representing the report kind e.g. 'medsop' or 'medinp'
 */

function translate_graph_1to1(graph, isType, translate) {
    // traverse the graph either
    if (_.isArray(graph)) {
        // http://cryto.net/~joepie91/blog/2015/05/04/functional-programming-in-javascript-map-filter-reduce/
        return graph.filter(isType).map(translate);
    } else if (isType(g)) {
        return translate(g);
    } else {
        return null;
    }
}



function lift(graph) {
    //"use strict";
    logger.warn("lift tbs");
}

/**
 * TBS Translate an entire chcs @graph object depending on the translate function.
 * Assumes a 1-1 translation strategy.
 *
 * @param {list[object]} graph - The jsonld generated by an 'all' report in LDR.
 * @param {Function(list[document]) => object} lift - lifts values out of graph to be passed to translate
 * @param {Function(object) => list} translate - translates graph after lifting out the arguments
 * @returns {list[object]} - the turtle or fhir representing the report kind e.g. 'medsop' or 'medinp'
 */

function translate_graph(graph, lift, translate) {
    logger.error("not yet implemented")
    var args = lift(graph); //
    var l = Object.keys(args);
    args.length = l; // you can apply a dict that has a length and parameters by position, e.g. {'length':2, 0:1, 1:2}
    return [ translate.apply(null, args) ];
}





/**
 * Lift the demographics data out of a chcs object into an "array-like" object.
 * Keys are indexed by position. The result is suitable for javascript function apply.
 * @param {object} chcs_patient_object - input chcs object to extract demographics (patient data)
 * @returns {Array-like object} - {length: 3, 0: name, 1: gender, 2: dob }
 */

// Not sure this is useful yet.
function lift_demographics(chcs_patient_object) {
    var name = chcs_patient_object['label'];
    var gender = chcs_patient_object['sex-2'].label;
    var dob = chcs_patient_object['dob-2'].value;
    // transforms here if needed
    var result = {0: name, 1: gender, 2: dob};
    result.length = Object.keys(result).length;
    return result;
}


/**
 *
 * Mapping taken from http://hl7-fhir.github.io/patient.html
 * @param chcs_patient_object
 * @returns {object} - with fihr key/values
 *
 * TODO: log warnings? Makes the function busy.
 */
function translate_demographics_fihr(chcs_patient_object) {
    var result = {
        "resourceType" : "Patient",
        "active" : true, // Whether this patient's record is in active use
    };

    // fihr name
    if (_.has(chcs_patient_object, 'label')) {
        result.name = [ chcs_patient_object.label ];
    } else {
        logger.warn("Expecting a patient name, found nothing");
    }

    // fihr gender
    if (_.has(chcs_patient_object, 'sex-2')) {
        result.gender = chcs_patient_object['sex-2'].label;
    } else {
        logger.warn("Expecting a patient name, found nothing");
    }

    // fihr birthDate
    if (_.has(chcs_patient_object, 'dob-2')) {
        // TODO convert dob-2 datetime into just a date?
        result.birthDate = chcs_patient_object['dob-2'].value;
    } else {
        logger.warn("Expecting a patient name, found nothing");
    }

    return result;
}



function generate_turtle_demographics(d) {
    return {'turtle-demographics': {'name': d['label'], 'gender': d['sex-2'].label, 'dob': d['dob-2'].value}};
}

function generate_fihr_demographics(d) {
    return {'fihr-demographics': {'name': d['label'], 'gender': d['sex-2'].label, 'dob': d['dob-2'].value}};
}


function translate_context(context) {
    logger.warn("translate_context needs implementation");
    return context;
}









/**
 * Process the chcs jsonld file.
 * @param {string} filename
 * @returns {object}
 */

function process_file(filename) {
    try {

        logger.info('process ' + filename);
        // if (!filename.match(/\.jsonld$/))
        //    logger.warn(util.format("Expected filename '%s' to end with '.jsonld'. Did not.", filename));

        // minify and load filename into an object; minify removes comments
        var chcs = load(filename);

        // Translate the object from chcs jsonld to fhir jsonld
        //var result = {
        //    "@context": translate_context(chcs["@context"]),
        //    "@graph": translate_graph_1to1(chcs["@graph"], is_chcsPerson, translate_demographics_fihr), // Array => Array
        //};

        var result = translate_graph_1to1(chcs["@graph"], is_chcsPerson, translate_demographics_fihr); // Array => Array

        // See the result
        logger.debug(pretty_print(result[0]));

        return result;

    } catch (err) {
        logger.error(err);
    }

}


/**
 * Read the chcs from stdin and process that.
 * @param {Readable Stream} s - usually stdin or something directed toward it.
 * @returns {(string|object)} -- turtle string or json fhir
 */
function process_stream(s) {
    logger.error("tbs");
}



/**
 * Exact the program version from package.json if you can find package.json
 * @param default_version
 * @returns {*}
 */
function get_version(default_version) {
    var result = default_version;
    try {
        result = load("../package.json").version;
    } finally {
        return result;
    }
}

// https://github.com/tj/commander.js/
program
    .version(get_version('0.0.1'))
    .option('-v, --verbose', 'verbose')
    .option('-h, --help', 'usage')
    .option('--level [level]', 'log level usage', 'DEBUG')
    .option('--log [log_file]', 'log file')
    .parse(process.argv);

logger.setLevel(program.level);


// TODO mcarifio: must be a way to just process these all as streams?
if (program.args.length > 0) {
    // process urls (files) from the command line
    program.args.forEach(process_file);
} else {
    // process stdin
    process_stream(process.stdin);
}














//------------------------------------------------------
// utility functions that need a home elsewhere

/**
 * Pretty print a JSON object.
 * @param json
 */

function pretty_print(json) {
    return JSON.stringify(json, null, 2);
}


// TODO: underscore? utility library?
function isList(o) { return o.constructor == Array; }

/**
 * Deep clone of input object o for any type. Protect against modification of object o.
 * @param {object} o - input object
 * @returns {object} - copy of o, same contents different memory
 */

function clone(o) {
    return JSON.parse(JSON.stringify(o));
}


/**
 * Slurp returns the contents of filename as a utf8 string.
 * @param {string} filename
 * @returns {string}
 *
 * TODO mike@carif.io: Does node|js have a pathname repr?
 */
function slurp(filename) {
    // TODO mike@carif.io: async this eventually
    // https://nodejs.org/api/fs.html#fs_fs_readfilesync_file_options
    return fs.readFileSync(filename, "utf8");
}




/**
 * Load a file and return it as a JSON object. Remove comments.
 * @param {string} filename
 * @returns {object} - JSON object from filename
 */

function load(filename) {
    var s = slurp(filename);
    var j = decomment(s);
    // logger.debug(j);
    return JSON.parse(j);
}
