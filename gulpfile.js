var path = require('path');
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var stylemod = require('gulp-style-modules');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var vulcanize = require('gulp-vulcanize');
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var version = require('gulp-version-append');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var polyclean = require('polyclean');

gulp.task('default', ['scripts', 'css', 'images', 'vulcanize'], function () {
    gulp.src('app/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('app'));
    gulp.src('dist/css/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
    gulp.src('index.html')
        .pipe(version(['js', 'css'], {appendType: "guid"}))
        .pipe(gulp.dest('./'))
});

gulp.task('scripts', function () {
    return gulp.src(['src/coffee/app.component.coffee', 'src/coffee/main.coffee'])
        .pipe(concat('main.js'))
        .pipe(coffee())
        .pipe(addsrc.prepend('bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js'))
        .pipe(addsrc.prepend('bower_components/gsap/src/uncompressed/TweenLite.js'))
        .pipe(addsrc.prepend('bower_components/moment/locale/ru.js'))
        .pipe(addsrc.prepend('bower_components/moment/moment.js'))
        .pipe(addsrc.prepend('node_modules/angular2/bundles/angular2-all.umd.js'))
        .pipe(addsrc.prepend('node_modules/rxjs/bundles/Rx.umd.js'))
        .pipe(addsrc.prepend('node_modules/angular2/bundles/angular2-polyfills.js'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app'));
});

gulp.task('js-modules', function () {
    return gulp.src('src/coffee/*.module.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('dist/js-modules'));
});

gulp.task('css', function () {
    return gulp.src(['src/sass/*.sass', '!src/sass/*.module.sass'])
        .pipe(sass({includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('style-modules', function () {
    return gulp.src('src/sass/*.module.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(stylemod({
            filename: function (file) {
                return path.basename(file.path, path.extname(file.path));
            },
            moduleId: function (file) {
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

gulp.task('web-components', ['style-modules', 'js-modules'], function () {
    return gulp.src('src/components/*')
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(gulp.dest('dist/components'));
});

gulp.task('vulcanize', ['js-modules', 'style-modules'], function () {
    return gulp.src('app.html')
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripComments: true,
            excludes: ['dist/css/', 'app/']
        }))
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.leftAlignJs())
        .pipe(polyclean.uglifyJs())
        .pipe(concat('index.html'))
        .pipe(gulp.dest('./'));
});