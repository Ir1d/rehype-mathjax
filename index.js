const visit = require('unist-util-visit')
const unified = require('unified')
const parse = require('rehype-parse')
const toText = require('hast-util-to-text')

module.exports = rehypeMathjax

const assign = Object.assign

const parseHtml = unified().use(parse, {fragment: true, position: false})

const source = 'rehype-mathjax'

function rehypeMathjax(options) {
  const opts = options || {}
  const throwOnError = opts.throwOnError || false

  return transformMath

  function transformMath(tree, file) {
    visit(tree, 'element', onelement)

    function onelement(element) {
      const classes = element.properties.className || []
      const inline = classes.includes('math-inline')
      const displayMode = classes.includes('math-display')

      if (!inline && !displayMode) {
        return
      }

      const value = toText(element)

      let result = value

      if (inline) {
        result = `$` + result + `$`;
      }
      if (displayMode) {
        result = `$$` + result + `$$`;
      }

      element.children = parseHtml.parse(result).children
    }
  }
}
