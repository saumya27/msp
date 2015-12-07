module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      msp_new: {
        options: {
          sourceMap: true,
          sourceMapFilename: "msp_new.css.map"
        },
        files: {
          "msp_new.css": "msp_new.less"
        }
      },
      msp_compat: {
        options: {
          sourceMap: true,
          sourceMapFilename: "msp_compat.css.map"
        },
        files: {
          "msp_compat.css": "msp_compat.less"
        }
      }
    },
    cmq: {
      options: {
        log: false
      },
      msp: {
        files : {
          "msp_new.css": ["msp_new.css"],
          "msp_compat.css": ["msp_compat.css"]
        }
      }
    },
    watch: {
      files: ["*.less"],
      tasks: ["less:msp_new", "less:msp_compat", "cmq:msp"]
    }
  });
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-combine-media-queries");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["less:msp_new", "less:msp_compat", "cmq:msp", "watch"]);
}