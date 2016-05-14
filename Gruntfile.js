module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['client/client.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        },
      },
    },

    uglify: {
      build: {
        src: 'client/client.js',
        dest: 'server/public/assets/scripts/client.min.js'
      }
    },

    copy: {
      main : {
        expand: true,
        cwd: 'node_modules/',
        src: [
          'angular/angular.min.js',
          'angular/angular.min.js.map',
          'angular/angular-csp.css'
        ],
        dest: 'server/public/vendor/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s)
  grunt.registerTask('default', ['copy', 'uglify']);
};
