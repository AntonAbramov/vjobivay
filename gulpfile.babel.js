'use strict';

  const gulp = require('gulp');
  const uglify = require('gulp-uglify'); // minify js
  const jshint = require('gulp-jshint'); // linting
  const sass = require('gulp-sass'); // Scss, sass
  const autoprefixer = require('gulp-autoprefixer'); // add prefixes on specific css rules
  const minifycss = require('gulp-minify-css'); // minify css
  const nodemon = require('gulp-nodemon');
  const plumber = require('gulp-plumber'); // if any error gulp is not break
  const sourcemaps = require('gulp-sourcemaps');
  const babel = require('gulp-babel');
  const concat = require('gulp-concat');
  const gulpIf = require('gulp-if');
  const del = require('del');
  const debug = require('gulp-debug');
  const newer = require('gulp-newer');
  const remember = require('gulp-remember');
  const path = require('path');
  const notify = require('gulp-notify');
  const webpackStream = require('webpack-stream');
  const webpack = webpackStream.webpack;
  const isDevelopment = !process.env.NODE_ENV || process.evn.NODE_ENV == 'development';

gulp.task('js', function() {
  return gulp.src('frontend/js/main.js')
      .pipe(webpackStream(require('./webpack.config.js')));
});

gulp.task('webpack', function (callback) {
  return webpack(require('./webpack.config.js'), function (err, stats) {
    if (err) {
      console.log(err);
    }

    callback();
  });
});

gulp.task('sass', function () {
  return gulp.src('./frontend/scss/style.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .on('error', notify.onError(function (err){
      return {
        title: 'SASS',
        message: err.message
      }
    }))
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    }))
    .pipe(remember('sass'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('assets', function () {
  return gulp.src('./frontend/assets/**/**', {since: gulp.lastRun('assets')})
      .pipe(newer('public'))
      .pipe(gulp.dest('public'));
});

//watchers
gulp.task('watch', function () {
  gulp.watch('./frontend/scss/**/*.scss', gulp.series('sass')).on('unlink', function (filepath) {
    remember.forget('styles', path.resolve(filepath))
  });
  gulp.watch('./frontend/js/**/*.js', gulp.series('js'));
});

gulp.task('clean', function () {
  return del('public')
});

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'webpack', 'assets')));

gulp.task('dev', gulp.series('build', 'watch'));



