const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const cssNano = require('cssnano');
const polyclean = require('polyclean');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cached');
const postcss = require('gulp-postcss');

gulp.task('default', function() {
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

gulp.task('css', function() {
  gulp.src('style.css')
      .pipe(postcss([
        autoprefixer,
        cssNano({safe: true}),
      ]))
      .pipe(gulp.dest('./'));
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

gulp.task('publish', ['images', 'css']);
