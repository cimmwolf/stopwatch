import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import cssNano from 'cssnano';
import postcss from 'gulp-postcss';
import jpegoptim from 'imagemin-jpegoptim';

function css() {
  return gulp.src('style.css')
      .pipe(postcss([
        autoprefixer,
        cssNano({safe: true}),
      ]))
      .pipe(gulp.dest('./'));
}

function images() {
  return gulp.src('img/**/*')
      .pipe(imagemin([
        jpegoptim({max: 88}),
      ]))
      .pipe(imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng(),
        imagemin.svgo(),
      ]))
      .pipe(gulp.dest('img'));
}

export const publish = gulp.parallel(images, css);
