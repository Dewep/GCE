const includePaths = ['app/styles']

module.exports = {
  plugins: {
    vue: {
      sass: {
        includePaths
      }
    },
    sass: {
      options: {
        includePaths
      }
    }
  },
  files: {
    javascripts: {
      joinTo: 'app.js'
    },
    stylesheets: {
      joinTo: 'app.css'
    }
  }
}
