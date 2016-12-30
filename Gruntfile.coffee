module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  serveStatic = require 'serve-static'
  grunt.initConfig
    watch:
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['build']
      jade:
        files: ["src/**/*.jade"]
        tasks: ['build']
      stylus:
        files: ["src/**/*.stylus"]
        tasks: ['build']
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
  grunt.registerTask 'build', [
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
  grunt.registerTask 'default', [
    'build'
    'watch'
  ]