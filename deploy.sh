#!/bin/bash

clear

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

echo "This script is going to deploy on production."$'\n'
options=("Let's do this!" "Fuck, no!")

PS3=$'\n'"Are your sure? "
deploy=false

select option in "${options[@]}"
do
  case $option in
		"Let's do this!")
			deploy=true
      break ;;
		*) break ;;
  esac
done

clear

if $deploy ; then

  cp ./public/{browserconfig.xml,sitemap.xml,manifest.json,robots.txt} ./dist/
  sftp -i ./bitnami.pem bitnami@$1:htdocs/ << EOF
  put -r ./dist/*

exit
EOF
fi
