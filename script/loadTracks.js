const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

firebase = require('firebase')
console.dir("called with ", argv);
require('../src/static-scripts/fbinit.js')

var gcs = require('@google-cloud/storage')({
    projectId: 'audiostream-89853',
    keyFilename: './audiostream-e8eb49e2953c.json'
  });
   
  // Reference an existing bucket. 
  var bucket = gcs.bucket('audiostream-89853.appspot.com');

let files = fs.readdirSync(argv.p);
for(let file of files){
    console.log(argv.p+"/"+file)
    if(file.indexOf('mp3') !== -1){
        let track = {

        }

        let filename = file.split('.')[0]
        track.title = filename.split('-')[1]
        track.artiste = filename.split('-')[0]

        bucket.upload(argv.p+"/"+file).then(function(data) {
            var bucketUrl = data[0].metadata.selfLink.split('/')[8];
            var url = "https://firebasestorage.googleapis.com/v0/b/audiostream-89853.appspot.com/o/"+ bucketUrl.split("8") + "?alt=media";
            track.src = url;
            var listRef = firebase.database().ref('/tracks');
            var newTrackRef = listRef.push();
            newTrackRef.set(track);
          })
    }
}