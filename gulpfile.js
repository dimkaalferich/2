const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const htmlPartial = require('gulp-html-partial');
 
gulp.task('html', () => {
   return gulp.src(['./src/*.html'])
        .pipe(htmlPartial({
            basePath: './src/partials/',
            tagName: 'partial',
            variablePrefix: '@@'
        }))
        .pipe(gulp.dest('./build'));
});

const scriptFiles = [
   './src/js/lib.js',
   './src/js/main.js'
]

gulp.task('styles', () => {
   return gulp.src('./src/sass/**/*.scss')
   .pipe(sass().on('error', sass.logError))
   .pipe(autoprefixer({ 
       cascade: false
   }))
   .pipe(cleanCSS({level: 2}))
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
});


gulp.task('scripts', () => {
   return gulp.src(scriptFiles)
      .pipe(concat('script.js'))
      .pipe(uglify({
         toplevel: true
      }))
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
});

gulp.task('del', () => {
   return del(['build/*'])
});

gulp.task('compress', () => {
   gulp.src('./src/images/*')
   .pipe(imagemin())
   .pipe(gulp.dest('build/images'));
 });

gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: './build'
      }
   });
   gulp.watch('./src/images/**', gulp.series('compress'))
   gulp.watch('./src/sass/**/*.scss', gulp.series('styles'))
   gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
   gulp.watch('./src/*.html').on('change', browserSync.reload);
   gulp.watch('./src/partials/*.html').on('change', browserSync.reload);
   gulp.watch('./src/*.html', gulp.series('html'));
   gulp.watch('./src/partials/*.html', gulp.series('html'));
   gulp.series('html');
});


gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts'), 'watch'));