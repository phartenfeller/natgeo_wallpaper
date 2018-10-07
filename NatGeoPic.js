const fetch = require('node-fetch');
const fs = require('fs');
const wallpaper = require('wallpaper');

module.exports = class NatGeoPic {
  constructor() {
    const currentTime = new Date();
    this.year = currentTime.getFullYear();
    this.month = currentTime.getMonth() + 1;
    this.dayOfMonth = currentTime.getDate();
  }

  async getPic() {
    let jsonUrl = await this.getJsonPath();
    let json = await this.getJson(jsonUrl);
    let photoUrl = await this.getPhotoUrl(json);
    let fileDest = await this.getFileDest();
    await this.downloadImage(photoUrl, fileDest);
    await this.setWallpaper(fileDest);
  }

  getJsonPath() {
    let jsonUrl = `https://www.nationalgeographic.com/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery.${this.year}-${this.month}.json`
    console.log(jsonUrl);
    return jsonUrl;
  }

  getJson(jsonUrl) {
    try {
      return fetch(jsonUrl)
        .then((res) => res.json());
    }
    catch (err) {
      console.log('Error in downloadJson err => ' + err);
    }
  }

  getPhotoUrl(json) {
    let photoUrl = json.items[0].originalUrl ? json.items[0].originalUrl : json.items[0].url;
    return photoUrl;
  }

  getFileName() {
    return this.year + '-' + this.month + '-' + this.dayOfMonth + '.png';
  }

  getFileDest() {
    return '.\\pics\\' + this.getFileName();
  }

  downloadImage(url, fileDest) {
    fetch(url)
      .then(res => {
        return new Promise((resolve, reject) => {
          const dest = fs.createWriteStream(fileDest);
          res.body.pipe(dest);
  
          res.body.on('error', err => {
            reject(err);
          });

          dest.on('finish', _ => {
            resolve();
          });

          dest.on('error', err => {
            reject(err);
          });
        });
      });
  }

  setWallpaper(fileDest) {
    console.log(fileDest);
    wallpaper.set(fileDest)
      .then( _ => {
        wallpaper.get()
          .then(res => {
            fileDest = fileDest.substring(1);
            if (res.includes(fileDest)) {
              console.log('Wallpaper set => ' + res);
            }
            else {
              console.log('res =>', res);
              console.log('fileDest =>', fileDest);
              console.log('Error in setting Wallpaper');
            }
          });
      });
  }
};
