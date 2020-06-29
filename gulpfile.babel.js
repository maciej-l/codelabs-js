import { src, dest, series, watch } from 'gulp';
import yargs from 'yargs';
import browserSync from 'browser-sync';
import gulpIf from 'gulp-if';
import del from 'del';
import sourceMaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import { dir } from 'console';

const PRODUCTION = yargs.argv.prod;

/**
 * Global project dirs
 */
const dirs = {
    dev: '.',
    prod: './prod'
};

// js paths
const jsPaths = {
    dev: `${dirs.dev}/js/**/*.js`,
    prod: `${dirs.prod}/assets/js`
}

const imgPaths = {
    prod: `${dirs.prod}/assets/img`
}

// Paths to del
const toDel = {
    del: `${dirs.prod}/**`,
    notDel: `!${dirs.prod}`
}

// Clear production folder
export const clear = (done) => {
    return del.sync([toDel.del, toDel.notDel], 
        done());
}

/**
 * Copy project dependences
 */

// Project dependences
const dependences = [
    './index.html',
    './node_modules/jquery/dist/jquery.min.js',
    './js/app.js',
    './img/*.*'
];

// Copy dependences
export const projectDependences = () => {
    return src(dependences)
        .pipe(gulpIf('+(*.svg|*.jpg|*.png)', dest(imgPaths.prod)))
        .pipe(gulpIf('*.html', dest(dirs.prod)))
        .pipe(gulpIf('*.js', dest(jsPaths.prod)));
}

/**
 * Browsersync
 */
const server = browserSync.create();

export const serve = (done) => {
    server.init({
        server: {
            baseDir: "./prod"
        }
    });
    done();
}

export const reload = (done) => {
    server.reload();
    done();
}

/**
 * SASS task
 */

// SCSS paths
const sassPaths = {
    dev: `${dirs.dev}/scss/**/*.scss`,
    prod: `${dirs.prod}/assets/css/`
}

// SCSS to CSS
export const scssToCss = () => {
    return src(sassPaths.dev)
        .pipe(gulpIf(!PRODUCTION, sourceMaps.init()))
        .pipe(gulpIf(!PRODUCTION, sass().on('error', sass.logError)))
        .pipe(gulpIf(!PRODUCTION, sourceMaps.write()))
        .pipe(gulpIf(PRODUCTION, sass({
            outputStyle: 'compressed'
        })))
        .pipe(autoprefixer())
        .pipe(gulpIf(!PRODUCTION, sourceMaps.write()))
        .pipe(dest(sassPaths.prod))
        .pipe(server.stream());
}

/**
 * JS
 */
export const js = () => {
    return src(jsPaths.dev)
        .pipe(babel())
        .pipe(gulpIf(PRODUCTION, uglify()))
        .pipe(dest(jsPaths.prod))
        .pipe(server.stream());
}
/**
 * Watch changes
 */
export const copyHtml = () => {
    return src('./index.html')
        .pipe(dest(dirs.prod));
}

export const watchForChanges = () => {
    watch(sassPaths.dev, scssToCss);
    watch('*.html', series(copyHtml, reload));
    watch(jsPaths.dev, js);
}


/**
 * Gulp develop task
 */
export const develop = series(clear, projectDependences, scssToCss, serve, watchForChanges);

/**
 * Gulp prod task
 */
// export const buildForproduction = series(clear, projectDependences, copyPhp, scssToCss);

/**
 * Gulp default task
 */
export default develop;
