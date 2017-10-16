'use strict';

const gulp = require('gulp');
const del = require('del');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const cssSlam = require('css-slam').gulp;
const htmlMinifier = require('gulp-html-minifier');
const gutil = require('gulp-util');
const path = require('path');
const minimist = require('minimist');
const size = require('gulp-size');
const rename = require('gulp-rename');
var spawn = require('child_process').spawn;
const firebase = require('firebase');

const currentWorkingDirectory = process.cwd();
var polymerProjectConfig = require('./polymer.json');

const config = require('./config');
const options = minimist(process.argv.slice(2));

if (!options.env) {
    gutil.log("No environnement defined, setting 'default' by default")
    options.env = 'default'
}



gulp.task('loadFirebaseData', function (cb) {

    var url = config.deploy.firebase.env[options.env].url;
    const fire = firebase.initializeApp({
        databaseURL: url
    });

    var update = {};

    var fireDeployConfig = config.deploy.firebase.env[options.env].config;
    fireDeployConfig = Object.assign(fireDeployConfig, config.deploy.firebase.global.config)

    for (var path in fireDeployConfig) {
        if (path.indexOf("[") != -1) {
            var basePath = path.substring(0, path.indexOf("["));
            var alternatePath = path.substring(path.indexOf("[") + 1, path.indexOf("]")).split(",");
            var endPath = path.substring(path.indexOf("]") + 1);
            for (var ap of alternatePath) {
                update[basePath + ap + endPath] = require(fireDeployConfig[path])
            }
        } else {
            update[path] = require(fireDeployConfig[path])
        }
    }

    firebase.database().ref('/').update(update).then(function () {
        gutil.log("Firebase datas deployed successfully");
        firebase.database().goOffline()
        cb();
    }).catch(function (err) {
        gutil.error("Firebase datas not deployed : ", err);
        firebase.database().goOffline()
        cb(err);
    });
});

var exec = require('child_process').exec;

gulp.task('deploy', ['build'], function (cb) {

    var command = 'firebase deploy --token 1/hxoor46p8eMe-Wnm6lVV5rdx3T8vLSWA8-9uCakgPHQ --project ' + options.env;

    exec(command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('pol-build', function (cb) {

    var command = 'polymer build';

    exec(command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('build', ['pol-build'], function (cb) {

    var command = 'workbox generate:sw';

    exec(command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('serve', ['build'], function (cb) {

    var command = 'polymer serve build/default';

    exec(command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

