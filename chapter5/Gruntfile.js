module.exports = (grunt) => {
    /* configure plugins */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cafemocha: {
            all: {src: 'public/qa/tests-*.js', options: {ui: 'tdd'}}
        },
        jshint: {
            app: ['index.js', 'public/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
            options: {'esversion': 6}
        },
        /* Not available linkchecker in macOS so that we commanded below */
        // exec: {
        //     linkchecker: {cmd: 'linkchecker http://localhost:3000'}
        // }
    });

    /* load plugins to grunt */
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec',
    ].forEach((task) => {
        grunt.loadNpmTasks(task);
    });
    grunt.registerTask('default', ['cafemocha', 'jshint']);
};