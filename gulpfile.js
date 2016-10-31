'use strict';

const gulp         = require('gulp');
const pug          = require('gulp-pug');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const browserSync  = require('browser-sync').create();
const del          = require('del');
const stylus       = require('gulp-stylus');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flexboxfixer = require('postcss-flexboxfixer');
const mqpacker     = require('css-mqpacker');
const cssnano      = require('cssnano');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const fs           = require('fs');



/* ===========================
=            PUG             =
=========================== */

gulp.task('pug', function() {
  return gulp.src('src/pug/**/index.pug')
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        sound: 'notwork'
      })
    }))
  .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(notify({
      message: 'Pug complite: <%= file.relative %>!',
      sound: 'Pop'
    }));
});

/* =====  End of PUG  ====== */





/* =============================
=            STYLE             =
============================= */

gulp.task('style', function() {
  return gulp.src('src/stylus/style.styl')
  .pipe(plumber({
    errorHandler: notify.onError({
      message: 'Error: <%= error.message %>',
      sound: 'notwork'
    })
  }))
  .pipe(stylus())
  .pipe(postcss([
    flexboxfixer,
    autoprefixer({browsers: ['last 2 version']}),
    mqpacker,
    cssnano({safe:true})
    ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css/'))
  .pipe(notify({
    message:'Style complite: <%= file.relative %>!',
    sound: 'Pop'
  }));
});

/* =====  End of STYLE  ====== */





/* ===========================
=            IMG             =
=========================== */

gulp.task('img', function() {
  return gulp.src(['!svg-sprite/*.*', 'src/img/**/*.*'])
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [
    {removeViewBox: false},
    {cleanupIDs: false}
    ],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('build/img/'));
});

/* =====  End of IMG  ====== */





/* ==========================
=            JS             =
========================== */

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(rename('scripts.min.js'))
  .pipe(gulp.dest('build/js/'))
  .pipe(notify({
    message:'JS complite: <%= file.relative %>!',
    sound: 'Pop'
  }));
});

/* =====  End of JS  ====== */





/* ==================================
=            Gulp FONTS            =
================================== */

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*.*')
  .pipe(gulp.dest('build/fonts'));
});

/* =====  End of Gulp FONTS  ====== */





/* =============================
=            CLEAN             =
============================= */

gulp.task('clean',function() {
  return del('build/');
});

/* =====  End of CLEAN  ====== */





/* ==============================
=            SERVER             =
============================== */

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    notify: false,
    open: false,
    ui: false
  });
  browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

/* =====  End of SERVER  ====== */





/* =============================
=            BUILD             =
============================= */

gulp.task('build', gulp.series('clean','fonts','pug','style','img','js'));

/* =====  End of BUILD  ====== */





/* =============================
=            WATCH             =
============================= */

gulp.task('watch', function() {
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/stylus/**/*.styl', gulp.series('style'));
  gulp.watch('src/img/**/*.*', gulp.series('img'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
});

/* =====  End of WATCH  ====== */





/* ===============================
=            DEFAULT             =
=============================== */

gulp.task('default', gulp.series('build', gulp.parallel('watch','server')));

/* =====  End of DEFAULT  ====== */


