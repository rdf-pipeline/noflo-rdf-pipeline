# noflo-rdf-pipeline test 0002_Noflo_fork_execute_javascript_file

This test demonstrates how the RDF FileNode component can be used to invoke an 
arbitrary piece of JavaScript with command line parameters and get the results to pass 
on.  

To visualize this test, run: 
    $ noflo-server ./noflo_server_graph.json
Then navigate your browser to http://localhost:8080/

If any error is detected, it will be sent to the console/stdout with the standard noflo Core/Output component.
