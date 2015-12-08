# Simple script to execute a single RDF Pipeline Test and verify it's results are correct... or not!
#!/bin/bash 

getTestArgs() 
{
    OPTIND=1         # Reset in case getopts has been used previously in the shell.
    while getopts "h" opt; do
        case "$opt" in
        h)
            echo "usage runTest.sh -h | <testname>"
            exit 0
            ;;
        esac
    done

    shift $((OPTIND-1))
    TEST_NAMES=$@
 
    if [ -z "${TEST_NAMES}" ]; then 
        echo "ERROR: please specify a test name.";
        exit 1;
    fi
}

cleanState() 
{
    GRAPH_NODES=$1
    # Remove the last state files for the nodes we are about to run in this test
    for NODE in GRAPH_NODES 
    do
        rm -f ./state/${NODE}
    done
}

compareFiles() 
{ 
  EXPECTED_FILE=$1
  ACTUAL_FILE=$2
  diff ${EXPECTED_FILE} ${ACTUAL_FILE}
  if [ $? -ne 0 ]; then
    echo ERROR: diff ${EXPECTED_FILE} ${ACTUAL_FILE}
    exit 1;
  fi
}

getTestArgs "$@"

# get the directory that this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Walk each argument (test) specified on the command line - this supports wild cards
TEST_COUNT=0
for TEST_NAME in ${TEST_NAMES}
do
  
    # If it's a directory, execute it as a no flo test
    if [ -d "${TEST_NAME}" ]; then 

        echo "EXECUTING ${TEST_NAME}"

        # Get the expected graph nodes
        NOFLO_GRAPH_NODES=`ls ${SCRIPT_DIR}/${TEST_NAME}/expected_state`

        # switch to the noflo_rdf_pipeline repository root directory to execute noflo
        pushd ${SCRIPT_DIR}/../ > /dev/null

        cleanState "${NOFLO_GRAPH_NODES}"

        # Run the graph
        ./node_modules/noflo/bin/noflo ${SCRIPT_DIR}/${TEST_NAME}/noflo_test_graph.json

        # check all results
        for NODE in $NOFLO_GRAPH_NODES
        do
          compareFiles ${SCRIPT_DIR}/${TEST_NAME}/expected_state/${NODE} ./state/${NODE}  
        done

        # Return to whatever directory we were last in
        popd > /dev/null
        echo "COMPLETED ${TEST_NAME} successfully"
        echo
    
       ((TEST_COUNT++))
    fi

done

if (($TEST_COUNT == 1)); then
    echo Executed ${TEST_COUNT} test.
else
   echo Executed ${TEST_COUNT} tests.
fi
