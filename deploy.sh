#!/bin/bash

domain="http://54.93.165.244/"
date="$(date +'%Y-%m-%dT%H:%M:%S+00:00')"

read -d '' sitemap << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>$domain</loc>
    <lastmod>$date</lastmod>
  </url>
</urlset>
EOF

echo "$sitemap" > ./static/sitemap.xml

cp ./static/{browserconfig.xml,sitemap.xml,manifest.json,robots.txt} ./dist/
sftp -i ./bitnami.pem bitnami@54.93.165.244:htdocs/ << EOF
put -r dist/*

exit
EOF
echo
