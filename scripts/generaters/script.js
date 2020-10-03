'use strict';
const fs = require('hexo-fs');
const url = require('url');


hexo.extend.generator.register('script', function(locals){
  const config = hexo.config;
  const theme = hexo.theme.config;

  var env = require('../../package.json')

  var siteConfig = {
    version: env['version'],
    hostname: config.url,
    root: config.root,
    statics: theme.statics,
    favicon: {
      normal: theme.images + "/favicon.ico",
      hidden: theme.images + "/failure.ico"
    },
    js: {
      valine: theme.vendors.js.valine,
      chart: theme.vendors.js.chart,
      copy_tex: theme.vendors.js.copy_tex,
      mediumzoom: theme.vendors.js.mediumzoom
    },
    css: {
      valine: theme.css + "/comment.css",
      katex: theme.vendors.css.katex,
      mermaid: theme.css + "/mermaid.css"
    },
    loader: theme.loader,
    search : null,
    valine: theme.valine,
    quicklink: {
      timeout : theme.quicklink.timeout,
      priority: theme.quicklink.priority
    }
  };

  if(config.algolia) {
    siteConfig.search = {
      appID    : config.algolia.appId,
      apiKey   : config.algolia.apiKey,
      indexName: config.algolia.indexName,
      hits     : theme.search.hits
    }
  }

  if(theme.audio) {
    siteConfig.audio = theme.audio
  }

  var text = '';

  ['utils', 'dom', 'global', 'sidebar', 'page', 'pjax'].forEach(function(item) {
    text += fs.readFileSync('themes/shoka/source/js/_app/'+item+'.js').toString();
  });

  if(theme.fireworks && theme.fireworks.enable) {
    text += fs.readFileSync('themes/shoka/source/js/_app/fireworks.js').toString();
    siteConfig.fireworks = theme.fireworks.color
  }

  text = 'var CONFIG = ' + JSON.stringify(siteConfig) + ';' + text;

  return {
      path: theme.js + '/app.js',
      data: function(){
        return hexo.render.renderSync({text:  text, engine: 'js'});
      }
    };
});
