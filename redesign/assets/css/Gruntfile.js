module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			msp: {
				options: {
					sourceMap: true,
					sourceMapFilename: "msp.css.map",
					sourceMapFilename: "msp_compat.css.map"
				},
				files: {
					"msp.css": "msp.less",
					"msp_compat.css": "msp_compat.less"
				}
			}
		},
		stripCssComments: {
	        dist: {
	            files: {
	                'msp.css': 'msp.css',
	                'msp_compat.css' : 'msp_compat.css'
	            }
	        }
	    },
		cmq: {
			options: {
		      log: false
		    },
			msp: {
				files : {
					'msp.css': ['msp.css'],
					'msp_compat.css': ['msp_compat.css']
				}
			}
		},
		watch: {
			files: ['*.less'],
			tasks: ['less:msp', 'cmq:msp'],
		}
	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.registerTask('default', ['less:msp', 'cmq:msp', 'watch']);
}