var path = require('path');
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var stylemod = require('gulp-style-modules');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var vulcanize = require('gulp-vulcanize');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var polyclean = require('polyclean');
var htmlmin = require('gulp-htmlmin');
var cache = require('gulp-cached');

gulp.task('default', ['scripts', 'css', 'components', 'images'], function () {
    return gulp.src([
        'bower_components/app-*/*.html',
        'bower_components/iron-*/*.html',
        'bower_components/paper-*/*.html',
        'bower_components/google-*/*.html',
        'bower_components/gold-*/*.html',
        'bower_components/neon-*/*.html',
        'bower_components/platinum-*/*.html',
        'bower_components/polymer/*.html',
        'dist/components/*.html'
    ], {base: './'})
        .pipe(cache('components'))
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.leftAlignJs())
        .pipe(polyclean.uglifyJs())
        .pipe(htmlmin({removeComments: true}))
        .pipe(gulp.dest('bower_components'));
});

gulp.task('scripts', function() {
  return gulp.src(['bower_components/moment/locale/ru.js'])
      .pipe(cache('uglifying'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('css', ['sass'], function() {
  gulp.src('dist/css/*.css')
      .pipe(cssnano())
      .pipe(gulp.dest('dist/css'));
});

gulp.task('sass', function() {
  return gulp.src(['src/sass/*.sass', '!src/sass/*.module.sass'])
      .pipe(sass({includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      }))
      .pipe(gulp.dest('dist/css'));
});

gulp.task('components', ['style-modules', 'js-modules', 'scripts'], function() {
  return gulp.src('src/components/*')
      .pipe(vulcanize({
        inlineScripts: true,
        inlineCss: true,
        stripComments: true,
        excludes: ['bower_components/', 'dist/components/'],
        stripExcludes: false
      }))
      .pipe(gulp.dest('dist/components'));
});

gulp.task('js-modules', function() {
  return gulp.src('src/coffee/*.module.coffee')
      .pipe(cache('jsmod'))
      .pipe(coffee())
      .pipe(gulp.dest('dist/js-modules'));
});

gulp.task('style-modules', function() {
  return gulp.src('src/sass/*.module.sass')
      .pipe(cache('cssmod'))
      .pipe(sass().on('error', sass.logError))
      .pipe(stylemod({
        filename: function(file) {
          return path.basename(file.path, path.extname(file.path));
        },
        moduleId: function(file) {
          return path.basename(file.path, path.extname(file.path));
        }
      }))
      .pipe(gulp.dest('dist/css-modules'));
});

gulp.task('images', function () {
    return gulp.src(['src/img/**/*', 'bower_components/d-style/src/img/main-background.jpg'])
        .pipe(newer('dist/img'))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});
