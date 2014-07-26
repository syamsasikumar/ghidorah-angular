
module.exports = function(grunt) {   
    grunt.initConfig({
        //tasks in here in object notation
        less: {
            dev: {
                options: {
                    compress: true,
                    sourceMap: true,
                    sourceMapRootpath: '/'
                },
                files: {
                    "build/css/app.css": "app/less/main.less"
                }
            }
        },
        copy: {
          index : {
            files: [
              {
                expand: true,
                        cwd:'app/',
                        src: 'index.html',
                dest: 'build/'  
              }
            ]
          }
        },
        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: [
                    'vendor/**/*.js',
                    'app/js/**/*.js'
                ],
                dest: 'build/js/app.js'
            },
            css: {
                src: 'vendor/css/*.css',
                dest: 'build/css/vendor.css'
            } 
        },
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'build/js/app.min.js': ['build/js/app.js']
                }
            }
        },
        cssmin: {
            css:{
                src: 'build/css/vendor.css',
                dest: 'build/css/vendor.min.css'
            }
        },
        watch: {
          options: {
            livereload: true,
        },
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['concat:js', 'uglify:js'],
            },
            css: {
                files: ['app/less/**/*.less'],
                tasks: ['less:dev'],
            },
            html: {
              files : ['app/index.html'],
              tasks: ['copy:index']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css');

    grunt.registerTask('default', ['copy', 'concat', 'uglify', 'less', 'cssmin', 'watch']);
};