# personal-website

## Build Setup

``` bash
# install dependencies
yarn
# serve with hot reload at localhost:8080
yarn start

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# build for production and hide version and other debug info
npm run build --deploy --domain="http://www.targetdomain.com"
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


# Localization Instructions

- install https://poeditor.com/
- add extract tool to path (ex: `C:\Program Files (x86)\Poedit\GettextTools\bin`)
- check documentation https://github.com/Polyconseil/vue-gettext
- use the `v-translate` directive and always add a `v-translate-comment` for translators
- use `this.$gettext('Something')` when in Javascript and always add a js comment in the line before that for translators
- run `npm run locale:extract`
- open the `\locale\template.pot`
- translate or send the pot template to translators
- save the translation PO file in `\locale\translated`
- run `npm run locale:compile`


# linting in Sublime Text 3 (oudated and probably invalid)

- install `SublimeLinter`
- install `SublimeLinter-contrib-eslint`
- install `SublimeLinter-contrib-stylelint`
- click `Preferences -> Browse Packages...`
- open the `SublimeLinter-contrib-stylelint` folder
- replace `linter.py` with the one in the root of the project (the original one has bugs)
- restart sublime
- if linting doesn't work anymore simply restart sublime to fix it...sometimes it happens

# LFS Video
Source Tree
- Repository -> GIT LFS -> Initialize repository
- Commit MP4 and track file type as LFS
