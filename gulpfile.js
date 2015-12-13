'use strict';
var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function () {
    return gulp.src(['manifest.webapp', 'index.html', '**/*.js', '**/*.css', '**/*.png',
            '!node_modules', '!node_modules/**'])
        .pipe(zip('managerdashboard.owa.zip'))
        .pipe(gulp.dest('dist'));
});