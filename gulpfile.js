/**
 *
 *  WPK Child
 *
 */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('./src/js/main.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// minimaliseer de js
gulp.task('jsmin', function() {
  gulp.src(['./src/js/*.js'])
    .pipe(gulp.dest('./build/js'));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('./src/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('./build/img'))
    .pipe($.size({title: 'img'}));
});

// Copy All Files At The Root Level (src)
gulp.task('copy', function () {
  return gulp.src([
    './src/**/*',
    '!src/html/',
    '!src/html/**',
    '!src/scss/',
    '!src/scss/**',
    '!src/js/',
    '!src/js/**',
    '!src/fonts/',
    '!src/fonts/**',
    '!src/.DS_Store',
    '!src/**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest('./build'))
    .pipe($.size({title: 'copy'}));
});

// Copy Web Fonts To build
gulp.task('fonts', function () {
  return gulp.src(['./src/fonts/**'])
    .pipe(gulp.dest('./build/fonts'))
    .pipe($.size({title: 'fonts'}));
});

gulp.task('styles', function () {
  return gulp.src([
    './src/scss/main.scss'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('cssmin', function () {
  return gulp.src([
    './src/scss/critical.scss',
    './src/scss/main.scss'
  ])
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'CSSMIN error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.csso())
    .pipe($.cssmin())
    .pipe(gulp.dest('./build/css'))
    .pipe($.size({title: 'cssmin'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  // var assets = $.useref.assets({searchPath: '{.tmp,src}'});

  return gulp.src('./src/html/*.html')
    // .pipe(assets)
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    .pipe($.if('*.css', $.csso()))
    // .pipe(assets.restore())
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'html'}));
});

// Scan Your PHP For Assets & Optimize Them
gulp.task('php', function () {
  var opts = {
    conditionals: true,
    spare: true,
    quote: true,
    loos: true
  };

  return gulp.src('./src/**/*.php')
    .pipe(gulp.dest('./build'))
    .pipe($.size({title: 'php'}));
});

gulp.task('html', function () {
  var opts = {
    conditionals: true,
    spare: true,
    quote: true,
    loos: true
  };

  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./build'))
    .pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', './build']));

// Watch Files For Changes & Reload
gulp.task('serve', ['html', 'styles'], function () {
  browserSync({
    notify: true,
    logPrefix: 'WPK',
    server: ['.tmp', './src']
  });

  gulp.watch(['./src/html/*.html'], ['html', reload]);
  gulp.watch(['./src/scss/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['./src/js/**/*.js'], ['jshint']);
  // gulp.watch(['./src/img/**/*'], reload);
});

// Build and serve the output from the build build
gulp.task('build', ['default'], function () {
  return gulp.src('./build/**/*')
  .pipe($.size({title: './build'}));
});

// Watch Files For Changes & Reload
gulp.task('dev', ['develop'], function () {
  browserSync({
    notify: false,
    proxy: 'postbydate.dev',
    host: 'localhost',
    // server: ['./build']
  });
  gulp.watch(['./src/**/*.php'], ['php', 'copy', reload]);
  gulp.watch(['./src/**/*.html'], ['html', 'copy', reload]);
  gulp.watch(['./src/scss/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['./src/js/**/*.js'], ['jsmin', reload]);
  // gulp.watch(['./src/img/**/*'], ['images', reload]);
});

gulp.task('develop', ['clean'], function (cb) {
  runSequence('styles', ['jsmin', 'php', 'html', 'fonts', 'copy'], cb);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('cssmin', ['jsmin', 'php', 'html', 'fonts', 'copy'], cb);
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
