var MarkdownIt = require('markdown-it');
var Plugin = require('markdown-it-regexp');
var unescapeAll = require('markdown-it/lib/common/utils').unescapeAll;
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
var markdownItAttrs = require('markdown-it-attrs');
//var markdownItAnchor = require('markdown-it-anchor');

function getYouTubeId(a){var b=a.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);if(b&&b[7].length==11){return b[7]}else{return undefined}}

var md = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true,
  //highlight: function (str, lang) {
  //  return '<div class="col '+lang+'">'+str+'</div>';
  //}
});

md.renderer.rules.image = function (tokens, idx, options, env, slf) {
  var token = tokens[idx],
      aIndex = token.attrIndex('src');

  var youtubeId = getYouTubeId(token.attrs[aIndex][1]);

  if (youtubeId) {
    return '\n<div class="embed-responsive video-iframe">\n' +
           '  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + youtubeId + '"></iframe>\n' +
           '</div>\n';
  }

  var alt = slf.render(token.children, options, env).split('|');

  token.attrs[token.attrIndex('alt')][1] = alt.shift();

  if (alt.length > 0) {
    //tokens[idx].type = 'block';
    return '\n<figure class="wp-caption">\n  <img src="' + token.attrs[aIndex][1] + '">\n  <figcaption class="wp-caption-text">' + alt.shift() + '</figcaption>\n</figure>\n';
  }

  return slf.renderToken(tokens, idx, options);

  // pass token to default renderer.
  //return defaultRender(tokens, idx, options, env, slf);
};

var defaultFenceRender = md.renderer.rules.fence;

md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
  var token = tokens[idx],
      info = token.info ? unescapeAll(token.info).trim() : '',
      langName = '',
      html = '',
      highlighted, i, tmpAttrs, tmpToken;

  if (info) {
    langName = info.split(/\s+/g)[0];
  }

  if (/first-col-\d+/.test(langName)) {
    html += '<div class="row">';
  }

  //console.log(slf.render(tokens, options, env))

  if (/col-\d+/.test(langName)) {
    html += '\n  <div class="'+langName.replace(/first-|last-/g, '')+'">\n    ' + md.render(token.content) + '  </div>';
  }

  if (/last-col-\d+/.test(langName)) {
    html += '\n</div>';
  }

  if (html) {
    return html;
  }

  return defaultFenceRender(tokens, idx, options, env, slf);
};

var Button = Plugin(
  /~\[([^\]]*)\]\(([^\)]*)\)/,
  function(match, utils) {
    var label = match[1];
    var url = match[2];
    //console.log('img stuff: ', label, url, match);
    var html = '<span class="wp-button"><a href="'+url+'">'+label+'</a></span>';
    return html;
  }
);
md.use(Button);
md.use(markdownItAttrs);

/*
md.use(markdownItAnchor, {
  level: 1,
  // slugify: string => string,
  permalink: false,
  // renderPermalink: (slug, opts, state, permalink) => {},
  permalinkClass: 'header-anchor',
  permalinkSymbol: '¶',
  permalinkBefore: false
})

*/
module.exports = md