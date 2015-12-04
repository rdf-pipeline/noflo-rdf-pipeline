# noflo-rdf-pipeline test 0001_Update_chain_addone

This test shows that a change to a file (max.txt) that is an input of
node :max will cause the change the ripple through the pipeline.

To visualize this test, run: 
    $ noflo-server ./noflo_server_graph.json
Then navigate your browser to http://localhost:8080/

This test runs a sequential graph of 3 FileNodes: Max, Odds, and AddOne.

This test starts when the Max FileNode reads its input file, max.txt, for a starting integer.
Max outputs its state (the integer) to the Odds FileNode.  

Odds reads the state and generates a list of odd 
numbers 1-Max with its updater, saves that state, and passes it to AddOne.  

AddOne reads the Odd state and adds one to each integer.  That result is saved as its state.

If any error is detected, it will be sent to the console/stdout with the standard noflo Core/Output component.
