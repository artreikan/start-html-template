const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const webpack = require('webpack-stream');

const reload = browserSync.reload;

const path = {
  src: {
    html: './index.html',
    scss: './src/scss/**/*.scss',
    images: './src/img/*',
    js: './src/js/index.js'
  },
  build: {
    root: './dist',
    css: './dist/css',
    images: './dist/img',
    svg: './dist/img/*.svg',
    js: './dist/js'
  }
};

const webpackModes = {
  dev: 'development',
  prod: 'production'
};

const webpackConfig = {
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: webpackModes.dev
};

gulp.task('html', () => {
  return gulp
    .src(path.src.html)
    .pipe(reload({ stream: true }));
});

gulp.task('styles', () => {
  return gulp
    .src(path.src.scss)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(
      $.autoprefixer({
        grid: true
      })
    )
    .pipe(
      $.cleanCss({
        level: 2
      })
    )
    .pipe(reload({ stream: true }))
    .pipe(gulp.dest(path.build.css));
});

gulp.task('scripts', () => {
  return gulp
    .src(path.src.js)
    .pipe(webpack(webpackConfig))
    .pipe(reload({ stream: true }))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('images', () => {
  return gulp
    .src(path.src.images)
    .pipe($.imagemin())
    .pipe(reload({ stream: true }))
    .pipe(gulp.dest(path.build.images));
});

gulp.task('svg-sprite', () => {
  return gulp
    .src(path.build.svg)
    .pipe(
      $.svgSprite({
        mode: {
          symbol: {
            sprite: 'sprite.svg'
          }
        }
      })
    )
    .pipe(reload({ stream: true }))
    .pipe(gulp.dest(`${ path.build.images }`));
});

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './'
    },
    port: 1337,
    open: true,
    notify: false
  });
});

gulp.task('watch', () => {
  gulp.watch(path.src.scss, gulp.series('styles'));
  gulp.watch(path.src.js, gulp.series('scripts'));
  gulp.watch(path.src.html, gulp.series('html'));
});

gulp.task(
  'build',
  gulp.parallel('styles', 'scripts', gulp.series('images', 'svg-sprite'))
);

gulp.task('default', gulp.parallel('browserSync', 'watch', 'styles', 'scripts'));
