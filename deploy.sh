#!/bin/bash

read -d '' sitemap << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>http://$1/</loc>
    <lastmod>$(date +'%Y-%m-%dT%H:%M:%S+00:00')</lastmod>
  </url>
</urlset>
EOF

read -d '' robots << EOF
User-agent: *
Disallow: /public/
Sitemap: http://$1/sitemap.xml
EOF

echo "$robots" > ./public/robots.txt
echo "$sitemap" > ./public/sitemap.xml

cp ./public/{browserconfig.xml,sitemap.xml,manifest.json,robots.txt} ./dist/
sftp -i ./bitnami.pem bitnami@$1:htdocs/ << EOF
put -r dist/*

exit
EOF
