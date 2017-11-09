var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    run = require('gulp-run'),
    tsconfig = require('./tsconfig.json');



nodemon({
    script: 'build/onride.js',
    ext: 'js'
}).on('restart', function () { })

gulp.task('compile', () => {
    gulp.src("./src/**/*.ts")
        .pipe(run('tsc'))
});
gulp.task('start-compiler', () => {
    return run('tsc --watch').exec()
});
gulp.task('run', callback => {
})
gulp.task('watch', () => {
    //gulp.watch("./src/**/*.ts", ['compile']);
    //gulp.watch("./build/**/*.js", ['run']);
})
gulp.task('default', ['start-compiler']);