module.exports = (grunt => {
    /* configure plugins */
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to
                                              // false)
                    noFail: false, // Optionally set to not fail on failed tests (will still fail on other errors)
                    ui: 'tdd'
                },
                src: ['qa/tests-*.js']
            }
        },
        jshint: {
            app: ['app.js', 'index.js', 'lib/**/*.js', 'handlers/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
            options: {'esversion': 6}
        },
        less: {
            development: {
                options: {
                    customFunctions: {
                        static: function(lessObject, name) {
                            return 'url("' +
                                require('./lib/static.js').map(name.value) +
                                '")';
                        }
                    }
                },
                files: {
                    'public/css/main.css': 'less/main.less',
                    'public/css/cart.css': 'less/cart.less',
                }
            }
        },
        uglify: {
            all: {
                files: {
                    'public/js/meadowlark.min.js': ['public/js/**/*.js']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/css/meadowlark.css': ['public/css/**/*.css', '!public/css/meadowlark*.css']
                }
            },
            minify: {
                src: 'public/css/meadowlark.css',
                dest: 'public/css/meadowlark.min.css'
            },
        },
        hashres: {
            options: {
                fileNameFormat: '${name}.${hash}.${ext}'
            },
            all: {
                src: [
                    'public/js/meadowlark.min.js',
                    'public/css/meadowlark.min.css',
                ],
                dest: [
                    // 'views/layouts/main.handlebars',
                    'config.js',
                ]
            }
        },
    });

    /* load plugins to grunt */
    [
        'grunt-mocha-test',
        'grunt-contrib-jshint',
        'grunt-contrib-less',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-hashres',
    ].forEach((task) => {
        grunt.loadNpmTasks(task);
    });
    grunt.registerTask('default', ['jshint', 'mochaTest', 'less', 'uglify', 'cssmin', 'hashres']);
});
