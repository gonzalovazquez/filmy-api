var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
	return gulp.src('tests/app.spec.js', { read: false })
		.pipe(mocha({ reporter:'nyan' }))
		.once('error', function() {
			process.exit(1);
		});
});