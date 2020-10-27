// file: ./i18next-parser.config.js
module.exports = {
  
  // see below for more details
  lexers: {
    // hbs: ['HandlebarsLexer'],
    // handlebars: ['HandlebarsLexer'],

    htm: ['HTMLLexer'],
    html: ['HTMLLexer'],

    // mjs: ['JavascriptLexer'],
    js: ['JavascriptLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],

    default: ['JavascriptLexer']
  },

  locales: ['is', 'en'],
  // An array of the locales in your applications

  output: 'public/locales/$LOCALE.json',
  // output: 'locales/$LOCALE/$NAMESPACE.json',
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()

  useKeysAsDefaultValue: true,
  // Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
  // This option takes precedence over the `defaultValue` and `skipDefaultValues` options

  verbose: true,
  // Display info about the parsing including some stats
}
