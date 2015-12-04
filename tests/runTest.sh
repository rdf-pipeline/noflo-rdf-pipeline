# Simple script to execute a single RDF Pipeline Test and verify it's results are correct... or not!
#!/bin/bash 

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
TEST_NAME=$@

if [ -z $TEST_NAME ]; then 
   echo "ERROR: please specify a test name.";
   exit 1;
fi
echo
echo "EXECUTING ${TEST_NAME}"

# get the directory that this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

NOFLO_GRAPH_NODES=`ls ${SCRIPT_DIR}/${TEST_NAME}/expected_state`

# switch to the noflo_rdf_pipeline repository root directory to execute noflo
pushd ${SCRIPT_DIR}/../ > /dev/null

# Remove the last state files for the nodes we are about to run in this test
for NODE in $NOFLO_GRAPH_NODES
do
  rm -f ./state/${NODE}
done

# Run the graph
./node_modules/noflo/bin/noflo ${SCRIPT_DIR}/${TEST_NAME}/noflo_test_graph.json

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

for NODE in $NOFLO_GRAPH_NODES
do
  compareFiles ${SCRIPT_DIR}/${TEST_NAME}/expected_state/${NODE} ./state/${NODE}  
done

# Return to whatever directory we were last in
popd > /dev/null
echo "COMPLETED ${TEST_NAME} successfully"
echo
