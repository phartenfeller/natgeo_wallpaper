const request = require('request');
const fs = require('fs');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = {

  downloadPicture: function(url, filename) {
    console.log(url);

    try {
      request.head(url, function(err, res, body) {
        try {
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
        }
        catch (err) {
          console.log(err);
          if (i <= 50) {
            tasker(steps.downloadPic);
          }
        }

        let stream = request(url)
          .on('error', function(err) {
            console.log('Error in Download');
            tasker(steps.downloadPic);
          })
          .pipe(fs.createWriteStream(archivePath + filename));

        stream.on('finish', function() {
          tasker(steps.setWP);
        });

        console.log('Download completed');
      });
    }

    catch (err) {
      console.log('error in download err =>', err);
      tasker(steps.downloadPic);
    }
  },

  getJson: function(url) {
    try {
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', url, false); // false for synchronous request
      xmlHttp.send(null);

      json = JSON.parse(xmlHttp.responseText);

      tasker(steps.setPicUrl);
    }

    catch (err) {
      console.log('Error in downloadJson err =>', err);
      tasker(steps.downloadPic);
    }
  },
};
