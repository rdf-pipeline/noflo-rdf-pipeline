#! /bin/bash

DATA_FILE=$1
QUERY_STRING=$2

# echo Patients QUERY_STRING: $QUERY_STRING
# echo Patients QUERY_STRINGS: $QUERY_STRINGS

# QUERY_STRING "id=(002,003,004)" --> PATTERN "id=(002|003|004)"
export PATTERN=`echo "$QUERY_STRING" | sed 's/,/|/g'`

echo Patients PATTERN: "$PATTERN"

egrep "$PATTERN" ${DATA_FILE}
exit 0

