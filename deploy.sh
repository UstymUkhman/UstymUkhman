#!/bin/bash

cp ./{browserconfig.xml,sitemap.xml,manifest.json,robots.txt} ./dist/
sftp -i ./bitnami.pem bitnami@54.93.165.244:htdocs/ <<EOF
put -r dist/*

exit
EOF
echo
