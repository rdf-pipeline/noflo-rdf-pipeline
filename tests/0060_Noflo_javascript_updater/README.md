# noflo-rdf-pipeline test 0060_Noflo_javascript_updater 

This test verifies dynamically loaded javascript updater execution with two
RDF pipeline components: 

   1. json-file-node component which reads a json file and optionally executes a javascript
      updater on the file before forwarding it to the next component

   2. js-node component which takes one or more javascript objects, executes a javascript
      updater against them, and forward to the next noflo component.

State for these components is saved to a file for test validation and for recovery purposes.

To visualize this test, run: 
    $ noflo-server ./noflo_server_graph.json
Then navigate your browser to http://localhost:8080/
