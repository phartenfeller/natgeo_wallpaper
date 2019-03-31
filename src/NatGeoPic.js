const fetch = require('node-fetch');
const fs = require('fs');
const wallpaper = require('wallpaper');

class NatGeoPic {
  /**
   * Class constructor
   */
  constructor() {
    const currentTime = new Date();
    this.year = currentTime.getFullYear();
    this.month = currentTime.getMonth() + 1;
    this.dayOfMonth = currentTime.getDate();
  }

  /**
   * Main Procedure to get Pic of the Day
   */
  async getPic() {
    this.createFolder();
    const jsonUrl = this.getJsonPath();
    const json = await this.getJson(jsonUrl);
    const photoUrl = await this.getPhotoUrl(json);
    const fileDest = this.getFileDest();
    await this.downloadImage(photoUrl, fileDest);
    await this.setWallpaper(fileDest);
  }

  /**
   * Creates pics folder if it doesnt exists
   */
  createFolder() {
    const dir = './pics';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  /**
   * Gets path JSON with pics from current month
   * @return {String}
   */
  getJsonPath() {
    const jsonUrl = `https://www.nationalgeographic.com/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery.${
      this.year
    }-${this.month}.json`;
    console.log(jsonUrl);
    return jsonUrl;
  }

  /**
   * Fetches the JSON with pics from current month
   * @param {String} jsonUrl
   * @return {JSON}
   */
  async getJson(jsonUrl) {
    try {
      const response = await fetch(jsonUrl);
      const json = await response.json();
      return json;
    } catch (err) {
      console.log('Error in downloadJson err => ' + err);
    }
  }

  /**
   * Gets URL of Pic of the day from JSON with pics of the current month
   * @param {JSON} json
   * @return {String}
   */
  getPhotoUrl(json) {
    const photoUrl = json.items[0].originalUrl
      ? json.items[0].originalUrl
      : json.items[0].url;
    return photoUrl;
  }

  /**
   * Returns File Name
   * @return {String}
   */
  getFileName() {
    return this.year + '-' + this.month + '-' + this.dayOfMonth + '.png';
  }

  /**
   * Gets Destiniation Path for downloaded pic
   * @return {String}
   */
  getFileDest() {
    return './pics/' + this.getFileName();
  }

  /**
   * Downloads the Pic of the day
   * @param {String} url
   * @param {String} fileDest
   */
  async downloadImage(url, fileDest) {
    fetch(url).then(res => {
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

  /**
   * Sets the Wallpaper
   * @param {String} fileDest
   */
  async setWallpaper(fileDest) {
    console.log(fileDest);
    await wallpaper.set(fileDest);
    const path = await wallpaper.get();

    if (path.includes(fileDest.replace('.', ''))) {
      console.log('Wallpaper set => ' + path);
    } else {
      console.log('path =>', path);
      console.log('fileDest =>', fileDest);
      console.log('Error in setting Wallpaper');
    }
  }
}

module.exports = { NatGeoPic };
