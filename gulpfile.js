"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const del = require("del");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");

const paths = {
    source: "./src",
    build: "./build"
};

function clean() {
    return del([`${paths.source}/css/*.css`]);
}

function serve() {
    browserSync.init({
        server: "./"
    });

    gulp.watch(`${paths.source}/css/*.scss`, css);
    gulp.watch(`${paths.source}/*.html`).on('change', browserSync.reload);
    gulp.watch(`${paths.source}/js/**/*.js`).on('change', browserSync.reload);
}



function css(cb) {
    return gulp.src(`${paths.source}/css/*.scss`)
        // The gulp-uglify plugin won't update the filename
        .pipe(sass())
        // So use gulp-rename to change the extension
        .pipe(gulp.dest(`${paths.source}/css`))
        .pipe(browserSync.stream());
}


function javascriptBuild() {
    // Start by calling browserify with our entry pointing to our main javascript file
    return (
        browserify({
            entries: [`${paths.source}/js/main.js`],
            // Pass babelify as a transform and set its preset to @babel/preset-env
            transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
        })
            // Bundle it all up!
            .bundle()
            // Source the bundle
            .pipe(source("bundle.js"))
            // The buffeeeeer
            .pipe(buffer())
            // And uglify
            .pipe(uglify())
            // Then write the resulting files to a folder
            .pipe(gulp.dest(`${paths.build}/js`))
    );
}

function htmlBuild() {
    return gulp
        .src(`index.html`)
        .pipe(htmlmin({
            removeComments: true,
            removeCommentsFromCDATA: false,
            removeCDATASectionsFromCDATA: false,
            collapseWhitespace: true,
            collapseBooleanAttributes: false,
            removeAttributeQuotes: false,
            removeRedundantAttributes: false,
            useShortDoctype: false,
            removeEmptyAttributes: false,
            removeOptionalTags: false,
            removeEmptyElements: false
        }))
        .pipe(gulp.dest(paths.build));
}

function cssBuild() {
    return gulp
        .src(`${paths.source}/css/**/*.css`)
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest(`${paths.build}/css`));
}

exports.default = gulp.series(clean, css, gulp.parallel(javascriptBuild, cssBuild, htmlBuild, serve)) 