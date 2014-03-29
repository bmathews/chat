// Generated on 2014-02-06 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

        // Define the configuration for all the tasks
    grunt.initConfig({
        app: {
            dir: 'ui',
            dist: 'dist'
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dir %>/scss/',
                    src: '{,*/}*.scss',
                    dest: '<%= app.dir %>/css/',
                    ext: '.css'
                }]
            }
        }
    });

    grunt.registerTask('default', ['sass']);
};