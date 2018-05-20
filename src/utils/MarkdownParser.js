import MarkdownIt from 'markdown-it'
import mila from 'markdown-it-link-attributes'
const md = new MarkdownIt().use(mila, {
  target: '_blank',
  rel: 'noopener'
})
export default md

/**
 *
 *
 * @param {any} text
 * @param {boolean} [inline=false]
 * @param {string} [rootTag='span']
 * @returns
 */
let gt = function (text, inline = false, rootTag = 'span') {
  // check if root tag exists when inline = true
  if (inline === true && !rootTag) {
    throw new Error('[MarkdownParser] When using inline option you must specify a root tag')
  }
  let templateMarkdown
  if (inline) {
    // we parse this with markdown
    // and add a root tag of our choice
    templateMarkdown = (rootTag ? '<' + rootTag + '>' : '') + md.renderInline(text) + (rootTag ? '</' + rootTag + '>' : '')
  } else {
    // or use this if you have multiline elements or you want a <p> tag as root of a single line
    templateMarkdown = (rootTag ? '<' + rootTag + '>' : '') + md.render(text) + (rootTag ? '</' + rootTag + '>' : '')
  }

  // QUICK HACK:
  // [Else](Something "Optional") will get compiled to html links
  // so we replace any <a href="Something" title="Optional">Else</a>
  // with <router-link :to="{name: 'Something' params: {Optional}}">Else</router-link>
  // NOTE: this should leave alone links wich contains non-word characters like . or / so wexternal links still work
  let template = templateMarkdown.replace(/<a href="([\w]+)"[ ]*(title="([^"]*)")?[^>]*>([^<]+)<\/a>/igm, (match, p1, p2, p3, p4) => {
    return '<router-link :to="{name: \'' + p1 + '\'' + (p2 ? ', params: {' + p3 + '}' : '') + '}">' + p4 + '</router-link>'
  })
  // return a new component so that router-links get parsed and rendered
  return template
}
let gc = function (text, inline = false, rootTag = 'div') {
  return {
    name: 'Markdown',
    template: gt(text, inline, rootTag)
  }
}

export {gc as getComponent, gt as getTemplate}
