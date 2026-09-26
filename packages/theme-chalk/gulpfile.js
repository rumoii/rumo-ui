'use strict';

// Node 22+ 移除了 util.is* 旧 API，clean-css 仍依赖，补齐以兼容新 Node
const util = require('util');
if (typeof util.isRegExp !== 'function') {
  util.isRegExp = (v) => Object.prototype.toString.call(v) === '[object RegExp]';
}
if (typeof util.isArray !== 'function') {
  util.isArray = Array.isArray;
}
if (typeof util.isString !== 'function') {
  util.isString = (v) => typeof v === 'string';
}
if (typeof util.isObject !== 'function') {
  util.isObject = (v) => v !== null && typeof v === 'object';
}
if (typeof util.isFunction !== 'function') {
  util.isFunction = (v) => typeof v === 'function';
}

const { series, src, dest } = require('gulp');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(dest('./lib'));
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
