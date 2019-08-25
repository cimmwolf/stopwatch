/* global require */
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const cssNano = require('cssnano');
const postcss = require('gulp-postcss');

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
