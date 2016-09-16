'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var path = require('path');
var mountFolder = function (connect, dir) {
    return connect.static(path.resolve(dir));
};
var extend = require('node.extend');
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var external_config = grunt.file.exists('./grunt-config.json') ? grunt.file.readJSON('./grunt-config.json') : {};
    var config = {
        run: '/var/www/html/ember/',
        app: 'app',
        dist: 'build',
        compressed_dist: 'compressed_build',
        libs: [
            'app/bower_components/script-loader/script-loader.js',
            'app/bower_components/jquery/jquery.js',
            'app/bower_components/loglevel/dist/loglevel.min.js',
            'app/bower_components/jquery-ui/jquery-ui.js',
            'app/bower_components/handlebars/handlebars.js',
            'app/bower_components/ember/ember.js',
            'app/bower_components/ember-animated-outlet/ember-animated-outlet.js',
            'app/bower_components/ember-data/ember-data.js',
            'app/bower_components/underscore/underscore.js',
            'app/bower_components/ember-auth/dist/ember-auth.js',
            'app/bower_components/bootstrap/bootstrap_v2.js',
            'app/bower_components/bootstrap-modal/js/bootstrap-modal.js',
            'app/bower_components/bootstrap-modal/js/bootstrap-modalmanager.js',
            'app/bower_components/momentjs/moment.js',
            'app/bower_components/toastr/toastr.js',
            'app/bower_components/createAlert/createAlert.js',
            'app/bower_components/bootbox/bootbox.js',
            'app/bower_components/jquery.knob/jquery.knob.js',
            'app/bower_components/jquery.slimscroll/jquery.slimscroll.js',
            'app/bower_components/jquery.fileupload/jquery.ui.widget.js',
            'app/bower_components/jquery.fileupload/file-upload-templates.js',
            'app/bower_components/jquery.fileupload/load-image.min.js',
            'app/bower_components/jquery.fileupload/canvas-to-blob.min.js',
            'app/bower_components/jquery.fileupload/jquery.fileupload.js',
            'app/bower_components/jquery.fileupload/jquery.fileupload-process.js',
            'app/bower_components/jquery.fileupload/jquery.fileupload-image.js',
            'app/bower_components/jquery.fileupload/jquery.fileupload-fp.js',
            'app/bower_components/jquery.fileupload/jquery.fileupload-ui.js',
            'app/bower_components/jquery.fileupload/jquery.iframe-transport.js',
            'app/bower_components/jquery-timeago/jquery.timeago.js',
            'app/bower_components/chosen.jquery/chosen.jquery.js',
            'app/bower_components/select2/select2.js',
            'app/bower_components/bootstrap-datepicker/bootstrap-datepicker.js',
            'app/bower_components/jquery.lazyload/jquery.lazyload.js',
            'app/bower_components/jquery.form/jquery.form.js',
            'app/bower_components/jquery-autosize/jquery.autosize.js',
            'app/bower_components/spin/spin.js',
            'app/bower_components/spin/jquery.spin.js',
            'app/bower_components/images-loaded/images-loaded.js',
            'app/bower_components/jquery.parse/jquery.parse.js',
            'app/bower_components/typeahead/dist/bloodhound.js',
            'app/bower_components/typeahead/dist/typeahead.jquery.js',
            'app/bower_components/less/dist/less-1.7.0.js',
            'app/bower_components/sortable/Sortable.js'
        ],
        styles: [
            'app/styles/font-faces.css',
            'app/styles/bootstrap.css',
            'app/styles/bootstrap-buttons.css',
            'app/styles/bootstrap-modal.css',
            'app/styles/font-awesome.css',
            'app/styles/font-awesome-2.css',
            'app/styles/glyphicons.css',
            'app/styles/chosen.css',
            'app/styles/select2.css',
            'app/styles/jquery.fileupload-ui.css',
            'app/styles/typeahead.css',
            'app/styles/main.css'
        ],
        preprocessFiles: [{
            src: '<%= config.app %>/scripts/app.js',
            dest: '<%= config.dist %>/js/app.js'
        },{
            src: '<%= config.app %>/index.html',
            dest: '<%= config.dist %>/index.html'
        },{
            cwd: '<%= config.app %>/scripts/assets/preprocess',
            expand: true,
            src: ['*'],
            dest: '<%= config.dist %>/js/assets'
        },{
            src: '<%= config.app %>/scripts/config.js',
            dest: '<%= config.app %>/scripts/config-processed.js'
        }]
    };
    config = extend(config,external_config);


    grunt.initConfig({
        config: config,
        watch: {
            options: {
                livereload: true
            },
            emberTemplates: {
                files: '<%= config.app %>/templates/**/*.hbs',
                tasks: ['emberTemplates']
            },
            emblem: {
                files: '<%= config.app %>/templates/**/*.emblem',
                tasks: ['emblem']
            },
            coffee: {
                files: ['<%= config.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            less: {
                files: ['<%= config.app %>/styles/{,*/}*.less'],
                tasks: ['less','concat:css']
            },
            neuter: {
                files: ['<%= config.app %>/scripts/**/*.js','!<%= config.app %>/scripts/assets/*.js'],
                tasks: ['preprocess:dev','neuter:dev']
            },
            assets: {
                files: ['<%= config.app %>/scripts/assets/**/*','<%= config.app %>/styles/assets/**/*'],
                tasks: ['copy:assets']
            },
            libs: {
                files: '<%= config.libs %>',
                tasks: ['concat:lib']
            },
            styles: {
                files: '<%= config.styles %>',
                tasks: ['concat:css']
            }
        },
        connect: {
            options: {
                port: 9876,
                base: '.',
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0',
                livereload: true
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, config.dist),
                            mountFolder(connect, config.app)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>/<%= config.app %>/index.html'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>',
                        '<%= config.compressed_dist %>'
                    ]
                }]
            },
            server: '<%= config.dist %>'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '<%= config.dist %>/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '<%= config.dist %>/spec',
                    ext: '.js'
                }]
            }
        },
        concat: {
            lib: {
                files: {
                    '<%= config.dist %>/js/dev-lib.js': '<%= config.libs %>'
                }
            },
            css: {
                files: {
                    '<%= config.dist %>/css/dev-main.css': '<%= config.styles %>'
                }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            index_files: {
                files: [{
                    cwd: '<%= config.app %>',
                    expand: true,
                    src: ['robots.txt'],
                    dest: '<%= config.dist %>'
                }]
            },
            fonts: {
                files: [{
                    cwd: '<%= config.app %>/assets/fonts',
                    expand: true,
                    src: ['**/*.{eot,ttf,woff}'],
                    dest: '<%= config.dist %>/fonts/'
                }]
            },
            images: {
                files: [{
                    cwd: '<%= config.app %>/assets/img',
                    expand: true,
                    src: ['**/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}'],
                    dest: '<%= config.dist %>/img/'
                }]
            }
        },
        concurrent: {
            ser: [
                'emberTemplates',
                'emblem'
            ],
            test: [
                'emberTemplates',
                'emblem'
            ],
            dist: [
                'emberTemplates',
                'emblem',
                'imagemin',
                'htmlmin'
            ]
        },
        emberTemplates: {
            options: {
                templateName: function (sourceFile) {
                    var templatePath = config.app + '/templates/';
                    return sourceFile.replace(templatePath, '');
                }
            },
            dist: {
                files: {
                    '<%= config.app %>/scripts/compiled-handlebars-templates.js': '<%= config.app %>/templates/**/*.hbs'
                }
            }
        },
        emblem: {
            compile: {
                files: {
                    '<%= config.app %>/scripts/compiled-emblem-templates.js': '<%= config.app %>/templates/**/*.emblem'
                },
                options: {
                    root: '<%= config.app %>/templates/',
                    dependencies: {
                        jquery: '<%= config.app %>/bower_components/jquery/jquery.js',
                        ember: '<%= config.app %>/bower_components/ember/ember.js',
                        emblem: '<%= config.app %>/bower_components/emblem/dist/emblem.js',
                        handlebars: '<%= config.app %>/bower_components/handlebars/handlebars.js'
                    }
                }
            }
        },
        neuter: {
            dev: {
                options: {
                    filepathTransform: function (filepath) {
                        return 'app/' + filepath;
                    },
                    includeSourceURL: true,
                    template: "window.virtualsSetupFunctions.push(function() { {%= src %} ; });"
                },
                src: '<%= config.app %>/scripts/management-console.js',
                dest: '<%= config.dist %>/js/dev-main.js'

            },
            prod: {
                options: {
                    filepathTransform: function (filepath) {
                        return 'app/' + filepath;
                    }
                },
                src: '<%= config.app %>/scripts/management-console.js',
                dest: '<%= config.dist %>/js/dev-main.js'

            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true
            }
        },
        less: {
            dev: {
                files: [{
                    src: '<%= config.app %>/styles/*.less',
                    dest: '<%= config.app %>/styles/less.css'
                }]
            }
        },
        preprocess : {
            dev: {
                options: {
                    inline : true,
                    context : {
                        DEBUG: true,
                        DEBUG_LEVEL: '<%= config.debug_level %>',
                        WWW: '<%= config.www_dev %>',
                        HASH: '<%= config.hash_dev %>',
                    }
                },
                files: config.preprocessFiles
            },
            prod: {
                options: {
                    inline : true,
                    context : {
                        DEBUG: false,
                        WWW: '<%= config.www_prod %>',
                        HASH: '<%= config.hash_prod %>',
                    }
                },
                files: config.preprocessFiles
            }
        }
    });
    /*
     A task to run the application's unit tests via the command line.
     Not tested.
     */
    grunt.registerTask('test', ['_devBuild', 'karma', 'jshint']);

    /*
     Development build task. Run to test website.
     */
    grunt.registerTask('default', ['_devBuild', 'connect', 'open', 'watch']);

    /*
     Production builds
     */

    /*
     Build types
     */
    grunt.registerTask('_devBuild',             ['clean','preprocess:dev', '_buildJSDev', '_buildCSS','_buildConcat' ,'_moveStatic']);

    /*
     Sub builds
     */
    grunt.registerTask('_buildJSDev',             ['emberTemplates', 'emblem','neuter:dev' ]);
    grunt.registerTask('_buildCSS',               ['less']);
    grunt.registerTask('_buildConcat',            ['concat']);
    grunt.registerTask('_moveStatic',             ['copy']);

};
