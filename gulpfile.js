const { dest, series, src, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const browsersync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");

function html() {
  return src("src/html/*.html")
    .pipe(
      include({
        indent: true,
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function scss() {
  return src("src/scss/*.scss")
    .pipe(
      sass({
        sourceMap: true,
      })
    )
    .pipe(autoprefixer())
    .pipe(concat("index.css"))
    .pipe(csso())
    .pipe(dest("dist"));
}

function typescript() {
  return src("src/js/*.ts")
    .pipe(
      ts({
        noImplicitAny: true,
        outFile: "index.js",
      })
    )
    .pipe(uglify())
    .pipe(dest("dist"));
}

function clear() {
  return src("dist/*", { read: false, allowEmpty: true }).pipe(clean({}));
}

function serve() {
  browsersync.init({
    server: {
      baseDir: "./dist",
    },
  });

  watch("src/assets/*", minimizeAssets).on("change", browsersync.reload);
  watch("src/**/*.html", html).on("change", browsersync.reload);
  watch("src/**/*.scss", scss).on("change", browsersync.reload);
  watch("src/**/*.ts", typescript).on("change", browsersync.reload);
}

function minimizeAssets() {
  return src("src/assets/*").pipe(imagemin()).pipe(dest("dist/assets"));
}

exports.build = series(clear, html, scss, typescript, minimizeAssets);
exports.serve = series(this.build, serve);
exports.clean = clear;
