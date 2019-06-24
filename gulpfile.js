const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

const path = {
  src: {
    html: "./index.html",
    scss: "./src/scss/**/*.scss",
    images: "./src/img/*",
    js: ["./src/js/jquery.min.js", "./src/js/script.js"]
  },
  build: {
    root: "./dist",
    css: "./dist/css",
    images: "./dist/img",
    svg: "./dist/img/*.svg",
    js: "./dist/js"
  }
};

gulp.task("styles", () => {
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
    .pipe(gulp.dest(path.build.css));
});

gulp.task("scripts", () => {
  return gulp
    .src(path.src.js)
    .pipe($.concat("main.js"))
    .pipe(
      $.babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(
      $.uglify({
        toplevel: true
      })
    )
    .pipe(gulp.dest(path.build.js));
});

gulp.task("images", () => {
  return gulp
    .src(path.src.images)
    .pipe($.imagemin())
    .pipe(gulp.dest(path.build.images));
});

gulp.task("svg-sprite", () => {
  return gulp
    .src(path.build.svg)
    .pipe(
      $.svgSprite({
        mode: {
          symbol: {
            sprite: "sprite.svg"
          }
        }
      })
    )
    .pipe(gulp.dest(`${path.build.images}`));
});

gulp.task("watch", () => {
  gulp.watch(path.src.scss, gulp.series("styles"));
  gulp.watch(path.src.js, gulp.series("scripts"));
});

gulp.task(
  "build",
  gulp.parallel("styles", "scripts", gulp.series("images", "svg-sprite"))
);

gulp.task("default", gulp.parallel("watch", "styles", "scripts"));
