module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            stricts: {
                options: {
                    banner: '',
                    process: function(src, filepath) {
                        src = src.trim();
                        if (src.indexOf('use strict') === 1) {
                            src = '\n(function() {\n' + src + '\n})();\n';
                        }

                        return '\n/* Source: ' + filepath + '*/\n' + src;
                    }
                },
                src: [
                    'app/*.js',
                    'app/js/**/*.js',
                    'tmp/js/templates.min.js'
                ],
                dest: 'dist/js/script.min.js'
            },
            assets: {
                src: [
                    'app/lib/angular/angular.min.js',
                    'app/lib/angular/angular-route.min.js',
                    'app/lib/angular/angular-animate.min.js',
                    'app/lib/other/**/*.js'
                ],
                dest: 'dist/js/assets.min.js'
            },
            css: {
                src: [
                    'dist/css/styles.min.css',
                    'app/lib/other/**/*.css'
                ],
                dest: 'dist/css/styles.min.css'
            }
        },

        htmlangular: {
            options: {
                tmplext: 'html.tmpl',
                angular: true,
                doctype: false,
                charset: false,
                reportpath: null,
                reportCheckstylePath: null,
                relaxerror: [
                    'Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.'
                ]
            },
            files: {
                src: ['app/index.html', 'app/views/*.html.tmpl']
            }
        },

        html2js: {
            app: {
                src: [
                    'app/index.html',
                    'app/views/*.html.tmpl'
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
                    'dist/js/script.min.js': 'dist/js/script.min.js',
                    'dist/js/assets.min.js': 'dist/js/assets.min.js'
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
                    'dist/css/styles.min.css': 'app/css/styles.scss'
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
                src: 'dist/css/styles.min.css'
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
                tasks: ['concat', 'uglify:js']
            },
            sass: {
                files: [
                    'app/css/*.scss'
                ],
                tasks: ['sass:dist', 'concat:css', 'postcss']
            },
            html: {
                files: [
                    'app/index.html',
                    'app/views/*.html.tmpl'
                ],
                tasks: ['htmlangular', 'html2js:app', 'uglify', 'clean']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html-angular-validate');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['htmlangular', 'html2js:app', 'concat', 'uglify:js', 'sass:dist', 'concat:css', 'postcss:app', 'clean']);
    grunt.registerTask('build', ['default', 'watch']);
};
