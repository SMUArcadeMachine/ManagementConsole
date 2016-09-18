#!/bin/bash
mysql -u ${MYSQL_USER} -p${MYSQL_PASS} < /database_setup.sql
