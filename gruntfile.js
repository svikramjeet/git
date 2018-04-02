module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlmin: {// Task
            dist: {// Target
                options: {// Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {// Dictionary of files
                    './resources/views/analytics/test.blade.php': './resources/views/test.blade.php'
                }
            }
        },
        concat: {
            css: {
                files: {
                    './public/css/concat.css': [
                        './public/css/style.css'
                    ]
                }
            }
        },
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'sourceMap.map'
                },
                build: {
//                    src: 'src/<%= pkg.name %>.js',
                    dest: 'build/<%= pkg.name %>.min.js'
                },
                files: {
                    './public/js/composite.min.js': [
                        './public/js/custom/common.js',
                        './public/js/custom/feed.js'
                    ]
                }
            }
        }

    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');    
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'htmlmin']);
};
