var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var polyclean = require('polyclean');
var htmlmin = require('gulp-htmlmin');
var cache = require('gulp-cached');

gulp.task('default', ['scripts', 'css'], function() {
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

gulp.task('images', function() {
  return gulp.src('img/**/*')
      .pipe(imagemin([
        require('imagemin-jpegoptim')({max: 88}),
      ]))
      .pipe(imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng(),
        imagemin.svgo(),
      ]))
      .pipe(gulp.dest('img'));
});

gulp.task('publish', ['images']);
