// query-updater.js

var _ = require('underscore');

module.exports = {

    /**
     * Given an array of json objects, use argument json query string to find 
     * and return matching items.  For example, given this array as the jsObject: 
     *   [ { id: '002', name: 'Jane Doe', dob: '1979-01-23' },
     *     { id: '003', name: 'John Doe', dob: '1979-02-20' } ]
     * and this query string as the args: 
     *   { id: '002' }
     * this will return 
     *   [ { id: '002', name: 'Jane Doe', dob: '1979-01-23' } ]
     */
    execute: function( args ) {

        if ( args["args"] && args["jsObject"] ) {
           
           var queryArg = JSON.parse( args["args"] );
           var array = args["jsObject"];

           console.log("Executing query-updater.js for " + JSON.stringify(queryArg)); 
           return _.where( array, queryArg );

        } 

        throw new Error("Query-updater requires a list of json objects and a query json setting.");
    }
}
