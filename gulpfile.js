import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import cssNano from 'cssnano';
import postcss from 'gulp-postcss';

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
        mozjpeg({quality: 88, progressive: true}),
        gifsicle(),
        optipng(),
        svgo(),
      ]))
      .pipe(gulp.dest('img'));
}

export const publish = gulp.parallel(images, css);
