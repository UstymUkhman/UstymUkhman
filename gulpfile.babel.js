import gulp       from 'gulp';
import sass       from 'gulp-sass';
import gutil      from 'gulp-util';
import concat     from 'gulp-concat';
import buffer     from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import source     from 'vinyl-source-stream';
import minify     from 'gulp-minify-css';
import assign     from 'object-assign';
import plumber    from 'gulp-plumber';
import bourbon    from 'node-bourbon';
import browserify from 'browserify';
import watchify   from 'watchify';
import babelify   from 'babelify';
import del        from 'del';


let bundle = (b) => {
  return b.bundle().on('error', (e) => {
      console.error(e);
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public'));
};

gulp.task('copy', () => {
  return gulp.src('src/**/*.html').pipe(gulp.dest('public'));
});

gulp.task('sass', () => {
  return gulp.src('src/styles.scss')
    .pipe(plumber())
    .pipe(sass({ includePaths: [bourbon.includePaths, 'node_modules/breakpoint-sass/stylesheets'] }))
    .pipe(sass.sync().on('error', (error) => {
      console.log(error.toString());
      this.emit('end');
    }))
    .pipe(concat('index.css'))
    .pipe(minify())
    .pipe(gulp.dest('public'));
});

gulp.task('watch', () => {
  const b = browserify('src/scripts.js', assign({ debug: true }, watchify.args)).transform(babelify),
        w = watchify(b).on('update', () => bundle(w)).on('log', gutil.log);

  gulp.watch('src/**/*.scss', ['sass']);
  return bundle(w);
});

gulp.task('build', ['copy'], () => {
  return bundle(browserify('src/scripts.js', { debug: true }).transform(babelify));
});

gulp.task('default', ['copy', 'sass', 'watch']);
gulp.task('clean', () => { return del('public'); });
