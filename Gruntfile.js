module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodemon: {
            dev: {
                options: {
                    file: 'webapp/server.js',
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: '8282'
                    }
                }
            }
        },

        jshint: {

            backEnd: [ 'webapp/**/*.js' ],
            frontEnd: [ 'public/app/scripts/**/*.js']
        },

        watch: {

            scripts: {
                files: ['<%= jshint.backEnd %>', '<%= jshint.frontEnd %>'],
                tasks: ['jshint']
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['']);
};
