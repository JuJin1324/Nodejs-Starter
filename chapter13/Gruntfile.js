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
            app: ['index.js', 'public/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
            options: {'esversion': 6}
        },
    });

    /* load plugins to grunt */
    [
        'grunt-mocha-test',
        'grunt-contrib-jshint',
    ].forEach((task) => {
        grunt.loadNpmTasks(task);
    });
    grunt.registerTask('default', ['jshint', 'mochaTest']);
});
