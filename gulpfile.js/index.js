const gulp = require('gulp');
const del = require('del');

const docker_volume_html_seo = '../4prop-backend/web/volumes/html/seo'

const build_path = 'build'
const blog_path = `${docker_volume_html_seo}/agentab_blog`

function clean_folder() {
    return del([ `${blog_path}/**/*` ], { force:true })
}

function move_files() {
    return gulp.src([
            `${build_path}/static*/**/*`, // `static*` includes parent folder
            `${build_path}/asset-manifest.json`
        ])
        .pipe(gulp.dest(blog_path))
}


exports.default = gulp.series(
    clean_folder,
    move_files
)