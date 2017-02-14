module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  grunt.initConfig
    express:
      options: {}
      web:
        options:
          script: 'build/server/app.js'
          opts: ['--expose-gc']
    watch:
      options:
        spawn: false
        livereload: true
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['dobuild']
      jade:
        files: ["src/**/*.jade"]
        tasks: ['dobuild']
      stylus:
        files: ["src/**/*.stylus"]
        tasks: ['dobuild']
    coffee:
      options:
        sourceMap: true
      default:
        files: [{
          expand: true
          cwd: 'src'
          src: ['**/*.coffee']
          dest: 'build'
          ext: '.js'
        }]
    jade:
      default:
        files: [{
          expand: true
          cwd: 'src'
          src: ['**/*.jade']
          dest: 'build'
          ext: '.html'
        }]
    injector:
      default:
        files:
          "build/client/index.html": ['build/client/**/*.js', 'build/client/**/*.css']
    stylus:
      default:
        files:
          "build/client/app.css": "src/client/**/*.stylus"
    wiredep:
      options:
        directory: 'bower'
      target:
        src: 'build/client/index.html'
    clean:
      build: 'build'
      dist: 'dist'
      html: 'build/client/*/**/*.html'
    filerev:
      build:
        src: [
          'build/client/**/*.js'
          'build/client/**/*.css'
        ]
    usemin:
      html: ['build/client/**/*.html']
      js: ['build/client/**/*.js']
      css: ['build/client/**/*.css']
      options:
        assetsDirs: ['build/client']
        patterns:
          js: [
            /'([^']+\.html)'/
          ]
    ngtemplates:
      options:
        module: 'pod'
      main:
        cwd: 'build/client'
        src: [
          '*/**/*.html'
        ]
        dest: 'build/client/templates.js'
    file_append:
      main:
        files: [{
          append: '<script src="http://localhost:35729/livereload.js" type="text/javascript"></script>'
          input: 'build/client/index.html'
          output: 'build/client/index.html'
        }]
    ndxmin:
      options:
        base: 'build/client'
        dest: 'dist'
        ignoreExternal: false
      all:
        html: ['build/client/index.html']
  grunt.registerTask 'dobuild', [
    'clean:build'
    'coffee'
    'jade'
    'stylus'
    'ngtemplates'
    'filerev'
    'usemin'
    'wiredep'
    'injector'
    'clean:html'
  ]
  grunt.registerTask 'build', [
    'dobuild'
    'clean:dist'
    'ndxmin'
    'clean:build'
  ]
  grunt.registerTask 'default', [
    'dobuild'
    'file_append'
    'express:web'
    'watch'
  ]