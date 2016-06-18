var MarkdownIt = require('markdown-it');

module.exports = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true,
});