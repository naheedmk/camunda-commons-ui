// # camunda-commons-ui
// @name camunda-commons-ui
//
// This file is an entry point for modules which depends on
// camunda-commons-ui to get the libraries

/* jshint node: true */
'use strict';
var _ = require('lodash');


// ## requirejs
// @name camunda-commons-ui.requirejs
//
// This function is aimed to provide a common (but overridable)
// configuration for grunt require.js tasks.
//
// @param options
// @param options.pathPrefix should be the path to
//                           camunda-commons-ui relative from
//                           the project running the grunt task
function requirejsConf(options) {
  options = options || {};

  if (typeof options.pathPrefix === 'undefined') {
    options.pathPrefix = '../node_modules/camunda-commons-ui';
  }

  var conf = {
    stubModules: [
      'text'
    ],

    paths: {
      'camunda-commons-ui':         'lib',

      // #### npm dependencies
      'angular-data-depend':        'node_modules/angular-data-depend/src/dataDepend',
      'angular-translate':          'node_modules/angular-translate/dist/angular-translate',
      'angular-moment':             'node_modules/angular-moment/angular-moment',
      'camunda-bpm-sdk-js':         'node_modules/camunda-bpm-sdk-js/dist/camunda-bpm-sdk-angular',
      jquery:                       'node_modules/jquery/dist/jquery',
      moment:                       'node_modules/moment/moment',
      requirejs:                    'node_modules/requirejs/require',
      ngDefine:                     'node_modules/requirejs-angular-define/dist/ngDefine',
      text:                         'node_modules/requirejs-text/text',
      lodash:                       'node_modules/lodash/lodash',
      sax:                          'node_modules/sax/lib/sax',

      // #### vendor dependencies
      angular:                      'vendor/angular',
      'angular-animate':            'vendor/angular-animate',
      'angular-cookies':            'vendor/angular-cookies',
      'angular-loader':             'vendor/angular-loader',
      'angular-mocks':              'vendor/angular-mocks',
      'angular-resource':           'vendor/angular-resource',
      'angular-route':              'vendor/angular-route',
      'angular-sanitize':           'vendor/angular-sanitize',
      'angular-scenario':           'vendor/angular-scenario',
      'angular-touch':              'vendor/angular-touch',
      'angular-ui':                 'vendor/angular-ui',
      'angular-bootstrap':          'vendor/ui-bootstrap-tpls-0.11.0',
      'jquery-ui-core':             'vendor/jquery.ui.core',
      'jquery-ui-mouse':            'vendor/jquery.ui.mouse',
      'jquery-ui-widget':           'vendor/jquery.ui.widget',
      'jquery-ui-draggable':        'vendor/jquery.ui.draggable',
      'jquery-mousewheel':          'vendor/jquery.mousewheel',
      'jquery-overscroll':          'vendor/jquery.overscroll',
      domReady:                     'vendor/domReady',
      'placeholders-js':            'vendor/placeholders.main',
      'bpmn-js':                    'vendor/bpmn-viewer',
      'snap-svg':                   'vendor/snap.svg'
    },

    shim: {
      angular: {
        deps: ['jquery'],
        exports: 'angular'
      },

      'bpmn-js':              [
                                'snap-svg',
                                'sax',
                                'lodash'
                              ],
      'snap-svg':             {
                                exports: 'Snap'
                              },

      'placeholders-js':      [
                                'vendor/placeholders.utils.js',
                                'vendor/placeholders.jquery.js'
                              ],
      'camunda-commons-ui':   [
                                'angular',
                                'angular-resource',
                                'angular-route',
                                'angular-sanitize',
                                'angular-translate',
                                'angular-bootstrap',
                                'moment',
                                'placeholders-js'
                              ],
      'angular-animate':      ['angular'],
      'angular-cookies':      ['angular'],
      'angular-loader':       ['angular'],
      'angular-mocks':        ['angular'],
      'angular-resource':     ['angular'],
      'angular-route':        ['angular'],
      'angular-sanitize':     ['angular'],
      'angular-scenario':     ['angular'],
      'angular-touch':        ['angular'],
      'angular-bootstrap':    ['angular'],
      'angular-translate':    ['angular'],
      'jquery-overscroll':    ['jquery'],
      'jquery-mousewheel':    ['jquery'],

      'jquery-ui-core':       ['jquery'],
      'jquery-ui-widget':     ['jquery-ui-core'],
      'jquery-ui-mouse':      ['jquery-ui-widget'],
      'jquery-ui-draggable':  [
                                'jquery-ui-widget',
                                'jquery-ui-mouse'
                              ]
    },

    packages: [
      {
        name: 'camunda-commons-ui',
        location: 'lib',
        main: 'index'
      },
      {
        name: 'camunda-commons-ui/util',
        location: 'lib/util',
        main: 'index'
      }
    ]
  };

  // prefix all the paths
  _.each(conf.paths, function (val, key) {
    conf.paths[key] = options.pathPrefix + '/' + val;
  });
  _.each(conf.packages, function (val, key) {
    if (conf.packages[key].location) {
      conf.packages[key].location = options.pathPrefix + '/' + conf.packages[key].location;
    }
  });

  return conf;
}


function livereloadSnippet(grunt) {
  return function (data) {
    var buildTarget = grunt.config('buildTarget');
    var livereloadPort = grunt.config('pkg.gruntConfig.livereloadPort');
    if (buildTarget !== 'dist' && livereloadPort) {
      grunt.log.writeln('Enabling livereload for ' + data.name + ' on port: ' + livereloadPort);
      var contents = grunt.file.read(data.path);

      contents = contents
                  .replace(/\/\* live-reload/, '/* live-reload */')
                  .replace(/LIVERELOAD_PORT/g, livereloadPort);

      grunt.file.write(data.path, contents);
    }
  };
}


function builder(grunt) {
  return function(mode) {
    mode = mode || 'prod';
    var pkg = grunt.config.data.pkg;
    var config = pkg.gruntConfig;

    grunt.config.data.buildTarget = (mode === 'prod' ? config.prodTarget : config.devTarget);
    grunt.log.subhead('Will build the "'+ pkg.name +'" project in "'+ mode +'" mode and place it in "'+ grunt.config('buildTarget') +'"');
    if (mode === 'dev') {
      grunt.log.writeln('Will serve on port "'+
        config.connectPort +
        '" and liverreload available on port "'+
        config.livereloadPort +
        '"');
    }

    var tasks = [
      'clean',
      'copy',
      'less',
      'requirejs'
    ];

    grunt.task.run(tasks);
  };
}


module.exports = {
  // @name camunda-commons-ui.utils
  utils: {
    // @name camunda-commons-ui.utils._
    _: _
  },

  builder: builder,

  livereloadSnippet: livereloadSnippet,

  requirejs: requirejsConf
};