module.exports = (grunt) =>

  watchTasks = ['less','uglify']

  grunt.initConfig
    less:
      production:
        options:
          yuicompress: true
        files: [
          src: 'styles/*.less'
          dest: 'styles/main.min.css'
        ]
    uglify:
      production:
        files:
          'scripts/main.min.js':'scripts/main.js'

    watch:
      less:
        files: ['styles/*.less', "*.html", "scripts/main.js"]
        tasks: watchTasks


  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.registerTask 'default', watchTasks.concat ['watch']