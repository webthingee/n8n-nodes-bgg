const gulp = require('gulp');

gulp.task('build:icons', (done) => {
	gulp.src('nodes/**/icon.svg')
		.pipe(gulp.dest('dist/nodes/'))
		.on('end', done);
}); 