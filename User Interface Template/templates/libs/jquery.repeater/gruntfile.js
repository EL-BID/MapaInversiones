module.exports = function (grunt) {
    var bannerTemplate = '' +
        '// <%= pkg.name %> version <%= pkg.version %>\n' +
        '// <%= pkg.repository.url %>\n' +
        '// (<%= pkg.license %>) <%= grunt.template.today("dd-mm-yyyy") %>\n' +
        '// <%= pkg.author %>\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        preprocess : {
            options: {
                context : {
                    DEBUG: true
            ***REMOVED***
          ***REMOVED***
            test : {
                src : 'test/index.pre.html',
                dest : 'test/index.html'
          ***REMOVED***
            index: {
                src: 'index.pre.html',
                dest: 'index.html'
        ***REMOVED***
      ***REMOVED***

        concat: {
            options: {
                separator: '\n',
                banner: bannerTemplate
          ***REMOVED***
            dist: {
                src: [
                    'src/intro.js',
                    'src/lib.js',
                    'src/jquery.input.js',
                    'src/repeater.js',
                    'src/outro.js'
                ],
                dest: '<%= pkg.name %>.js'
        ***REMOVED***
      ***REMOVED***

        uglify: {
            options: { banner: bannerTemplate ***REMOVED***,
            dist: {
                files: { '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'] ***REMOVED***
        ***REMOVED***
      ***REMOVED***

        qunit: {
            // http://stackoverflow.com/questions/22409002/qunitphantomjs-ajax-success-handler-not-called-in-grunt-using-qunit-with-phant
            options : {
                '--web-security': false,
                '--local-to-remote-url-access': true
          ***REMOVED***
            all: ['test/index.html']
      ***REMOVED***

        watch: {
            scripts: {
                files: ['**/*'],
                tasks: ['preprocess', 'concat', 'uglify', 'qunit'],
                options: { spawn: true ***REMOVED***
        ***REMOVED***
    ***REMOVED***

***REMOVED***);

    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('default', ['preprocess', 'concat', 'uglify', 'qunit']);
    grunt.registerTask('test', ['preprocess', 'concat', 'uglify', 'qunit']);
***REMOVED***;
