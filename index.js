const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const jsonQuery = require('json-query');
const request = require('request');
const fs = require('fs');
const path = require('path');
const wallpaper = require('wallpaper');

const baseUrl = 'https://www.nationalgeographic.com';
const jsonPath = '/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery.#year#-#month#.json';
const picsPath = 'pics\\';

const currentTime = new Date();
const year = currentTime.getFullYear();
const month = currentTime.getMonth() + 1;
const dayOfMonth = currentTime.getDate();
const limit = 30;

let currentJsonUrl = baseUrl + jsonPath;
let currentStep = 0;

const steps = {
  jsonUrl: 1,
  downloadJson: 2,
  setPicUrl: 3,
  setFN: 4,
  downloadPic: 5,
  setWP: 6,
  emptyGB: 7,
  done: 100,
};

let json;
let photoUrl;
let filename;

let i = 0;

function downloadPicture(url, filename) {
  clg('Url: ' + url);

  try {
    request.head(url, function(err, res, body) {
      try {
        clg('content-type: ' + res.headers['content-type']);
        clg('content-length: ' + res.headers['content-length']);
      }
      catch (err) {
        clg('Error in downloadPicture: ' + err);
        tasker(steps.downloadPic);
      }

      let stream = request(url).on('error', function(err) {
        clg('Error in Download: ' + err);
        tasker(steps.downloadPic);
      }).pipe(fs.createWriteStream(picsPath + filename));

      stream.on('finish', function() {
        tasker(steps.setWP);
      });

      clg('Download completed');
    });
  }

  catch (err) {
    clg('error in download err =>', err);
    tasker(steps.downloadPic);
  }
};

function emptyGarbage() {
  let directory = __dirname;

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file.startsWith('.node-xmlhttprequest-sync-')) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    }

    tasker(steps.done);
  });
}

function getJson(url) {
  clg('url =>' + url);

  try {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);

    json = JSON.parse(xmlHttp.responseText);

    tasker(steps.setPicUrl);
  }

  catch (err) {
    clg('Error in downloadJson err => ' + err);
    tasker(steps.jsonUrl);
  }
}

async function setWallpaper(path) {
  clg('Image Path => ' + path);
  try {
    await wallpaper.set(path);
    const imagePath = await wallpaper.get();
    
    if (imagePath.includes(path)) {
      clg('Wallpaper set => ' + imagePath);
      tasker(steps.emptyGB);
        }
    else {
      clg('Error in setting Wallpaper');
      tasker(steps.setWP);
    }
    
  }
  catch (err) {
    clg('Error while setting Wallpaper => ' + err);
    tasker(steps.setWP);
  }
}

function setPhotoUrl(json) {
  let photoUrlPath = jsonQuery('items[0].originalUrl', (
    {
      data: json,
    }));

  // photoUrl = photoBaseUrl + photoUrlPath.value;
  photoUrl = photoUrlPath.value;

  if (photoUrl === undefined) {
    clg('url undefined');
    tasker(steps.jsonUrl);
  }

  clg('photoUrl => ' + photoUrl);

  tasker(steps.setFN);
}

function setFilename() {
  filename = year + '-' + month + '-' + dayOfMonth + '.png';

  tasker(steps.downloadPic);
}

function setJsonUrl(jsonUrl) {
  clg('jsonUrl => ' + jsonUrl);
  jsonUrl = jsonUrl.replace('#year#', year);
  currentJsonUrl = jsonUrl.replace('#month#', month);

  clg(currentJsonUrl);

  tasker(steps.downloadJson);
}

function checkInternet() {
  require('dns').resolve('www.google.com', function(err) {
    if (err) {
       clg('No connection');
       return false;
    } else {
       return true;
       i++;
    }
  });
}

function start() {
  let currentdate = new Date();
  let datetimeString = 'Starting execution: ' + currentdate.getDate() + '/'
                     + (currentdate.getMonth() + 1) + '/'
                     + currentdate.getFullYear() + ' @ '
                     + currentdate.getHours() + ':'
                     + currentdate.getMinutes() + ':'
                     + currentdate.getSeconds();
  console.log(datetimeString);

  if (checkInternet) {
    tasker(steps.jsonUrl);
  }
  else {
    if (i <= limit) {
      setInterval(start, 15*1000);
    }
  }
}

function clg(message) {
  console.log('[' + currentStep + '] ' + message);
}

function tasker(step) {
  i++;

  if (i >= limit) {
    clg('Too many iterations => ' + i);
    step = 0;
    return;
  }

  console.log('Step =>', step);
  currentStep = step;

  switch (step) {
    case steps.jsonUrl:
      setJsonUrl(currentJsonUrl);
      break;

    case steps.downloadJson:
      getJson(currentJsonUrl);
      break;

    case steps.setPicUrl:
      setPhotoUrl(json);
      break;

    case steps.setFN:
      setFilename();
      break;

   case steps.downloadPic:
     downloadPicture(photoUrl, filename);
     break;

    case steps.setWP:
      setWallpaper(picsPath + filename);
      break;

    case steps.emptyGB:
      emptyGarbage();
      break;

    case steps.done:
      clg('Finished execution');
      console.log();
      break;

    case 0:
      return;
    }
  }

start();
