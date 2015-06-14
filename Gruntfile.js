'use strict';

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		demo: 'index.html',
		// Task configuration.
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commitFiles: ['-a'],
				commitMessage: 'Release %VERSION%',
				tagName: 'v%VERSION%',
				push: false
			}
		},
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			dist: {
				src: ['lib/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: '<%= ngAnnotate.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'lib/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		karma: {
			test: {
				options: {
					browsers: ['ChromeCanary'],
					singleRun: true
				}
			},
			'travis-ci': {
				options: {
					browsers: ['Firefox'],
					singleRun: true
				}
			},
			options: {
				reporters: ['dots'],
				configFile: 'test/karma.conf.js'
			}
		},
		watch: {
			build: {
				files: '<%= ngAnnotate.dist.src %>',
				tasks: ['build']
			},
			livereload: {
				options: {
					livereload: true
				},
				files: [
					'<%= ngAnnotate.dist.src %>',
					'<%= demo %>'
				]
			}
		},
		connect: {
			server: {
				options: {
					port: 9000,
					livereload: true
				}
			}
		},
		open: {
			dev: {
				path: 'http://localhost:<%= connect.server.options.port %>/<%= demo %>'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-open');

	// Default task.
	grunt.registerTask('default', ['test']);

	// Test tasks.
	grunt.registerTask('test', ['jshint', 'karma:test']);
	grunt.registerTask('travis-ci', ['jshint', 'karma:travis-ci']);

	// Build task.
	grunt.registerTask('build', ['ngAnnotate', 'concat', 'uglify']);

	// Dev task.
	grunt.registerTask('dev', ['connect', 'open', 'watch']);

	// Provides the "karma" task.
	grunt.registerMultiTask('karma', 'Starts up a karma server.', function() {
		var done = this.async();
		require('karma').server.start(this.options(), function(code) {
			done(code === 0);
		});
	});
};
