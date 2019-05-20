module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: '',
                process: function (src, filepath) {
                    src = src.trim();
                    if (src.indexOf('use strict') === 1) {
                        src = '\n(function() {\n' + src + '\n})();\n';
                    }
                    return '\n/* Source: ' + filepath + '*/\n' + src;
                }
            },
            stricts: {
                src: [
                    'app/*.js',
                    'app/js/**/*.js',
                    'tmp/js/templates.min.js'
                ],
                dest: 'dist/js/script.min.js'
            }
        },

        jshint: {
            options: {
                strict: true,
                jshintrc: '.jshintrc'
            },
            all: ['dist/js/script.min.js']
        },

        html2js: {
            app: {
                src: [
                    'app/index.html',
                    'app/views/*.html'
                ],
                dest: 'tmp/js/templates.min.js',
                options: {
                    base: '',
                    module: 'app.templates',
                    // DO NOT USE htmlmin => this change templates!
                    disable_htmlmin: {
                        collapseBooleanAttributes: false,
                        collapseWhitespace: false,
                        removeAttributeQuotes: false,
                        removeComments: false,
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: false,
                        removeScriptTypeAttributes: false,
                        removeStyleLinkTypeAttributes: false
                    }
                }
            }
        },

        uglify: {
            js: {
                files: [{
                    'dist/js/script.min.js': 'dist/js/script.min.js'
                }],
                options: {
                    expand: true,
                    dest: 'dist/js/script.min.js'
                }
            }
        },

        sass: {
            options: {
                style: 'expanded',
                implementation: require('node-sass'),
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/styles.css': 'app/css/styles.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')(),
                    require('cssnano')({
                        zindex: false
                    })
                ]
            },
            app: {
                src: 'dist/css/styles.css'
            }
        },

        clean: {
            temp: [
                'tmp/*'
            ]
        },

        watch: {
            js: {
                files: [
                    'app/app.js',
                    'app/js/controllers/*.js',
                    'app/js/services/*.js'
                ],
                tasks: ['concat:stricts', 'jshint', 'uglify:js']
            },
            sass: {
                files: [
                    'app/css/*.scss'
                ],
                tasks: ['sass:dist', 'postcss']
            },
            html: {
                files: [
                    'app/index.html',
                    'app/views/*.html'
                ],
                tasks: ['html2js:app', 'uglify', 'clean']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['html2js:app', 'concat:stricts', 'uglify:js', 'sass:dist', 'postcss:app', 'clean']);
    grunt.registerTask('build', ['html2js:app', 'concat:stricts', 'jshint', 'uglify:js', 'sass:dist', 'postcss:app', 'clean', 'watch']);
};