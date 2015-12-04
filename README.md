# noflo-rdf-pipeline
Noflo implementation of the RDF Pipeline, building on the original design in the
rdf-pipeline/framework respository.  

## Development

Register this project globally

    noflo-rdf-pipeline$ npm link

Checkout noflo-server

    $ git clone https://github.com/rdf-pipeline/noflo-server.git

Checkout noflo-rdf-components

    $ git clone https://github.com/rdf-pipeline/noflo-rdf-components.git

From the noflo-server project directory run:

    noflo-server$ npm link noflo-rdf-components

Add the noflo-server to the local path:

    noflo-server$ npm link

Then run the noflo-server

    $ noflo-server

Or execute an RDF pipeline test

    $ tests/runTest.sh 0001_Update_chain_addone
