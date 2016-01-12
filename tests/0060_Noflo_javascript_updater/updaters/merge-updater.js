// js-updater.js

var _ = require('underscore');

module.exports = {

    /**
     * merges a patient record with their associated lab records into one 
     * javascript object and returns it to the caller.  This script expects 
     * just one patient and it's labs.  
     */
    execute: function( args ) {
  
        console.log("Executing merge-updater.js for Patient and Lab results");
        var patientArg = _.findWhere(args, {name: "Patient"});
        var merged = { "Patient": patientArg.js_object }
       
        var labs = Array();
        for (i=0, len=args.length; i < len; i++ ) { 
           current = args[i];
           if ( current.name === "Lab" ) {
              if ( current.js_object.hasOwnProperty('key') ) delete current.js_object['key'];
              labs.push( current.js_object );
           }
        }

        merged["Lab"] = labs;
        return merged;
    }
}
