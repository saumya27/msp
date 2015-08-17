module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			msp: {
				options: {
					sourceMap: true,
					sourceMapFilename: "msp.css.map"
				},
				files: {
					"msp.css": "msp.less"
				}
			}
		},
		stripCssComments: {
	        dist: {
	            files: {
	                'msp.css': 'msp.css'
	            }
	        }
	    },
		watch: {
			files: ['*.less'],
			tasks: ['default'],
		}
	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['less:msp', 'watch']);
}