import fetch from 'node-fetch';
import * as fs from 'fs';
import wallpaper from 'wallpaper';
import { createLogger } from './logger';
import { NatGeoResponse } from './types/NatGeoResponse';
import { DateObject } from './types/DateObject';
import { Logger } from 'log4js';

let logger: Logger;

/**
 * Sets the wallpaper to natgeo pic of the day
 */
export async function setWallpaperOfTheDay() {
  const date = getDate();
  logger = createLogger(date);
  createFolders();
  const jsonUrl = getJsonPath(date);
  const fileDest = getFileDest(date);

  try {
    const json: NatGeoResponse | undefined = await getJson(jsonUrl);
    if (json) {
      const photoUrl = getPhotoUrl(json);
      await downloadImage(photoUrl, fileDest);
      await setWallpaper(fileDest);
    } else {
      logger.error('No json received');
    }
  } catch (err) {
    logger.error(err);
  }
}

/**
 * Get Current Date
 * @return {DateObject}
 */
function getDate(): DateObject {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth() + 1;
  const dayOfMonth = currentTime.getDate();
  return { year, month, dayOfMonth };
}

/**
 * Creates pics folder if it doesnt exists
 */
function createFolders() {
  const dirs = ['./pics', './logs'];

  dirs.map(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
}

/**
 * Gets wallpaperPath JSON with pics from current month
 * @param {Object} date Date Object
 * @return {String}
 */
function getJsonPath(date: DateObject): string {
  const jsonUrl = `https://www.nationalgeographic.com/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery.${
    date.year
  }-${date.month}.json`;
  console.log(jsonUrl);
  return jsonUrl;
}

/**
 * Gets Destiniation Path for downloaded pic
 * @param {Object} date Date Object
 * @return {String}
 */
function getFileDest(date: DateObject): string {
  return (
    './pics/' + date.year + '-' + date.month + '-' + date.dayOfMonth + '.png'
  );
}

/**
 * Fetches the JSON with pics from current month
 * @param {String} jsonUrl
 * @return {Promise<JSON>}
 */
async function getJson(jsonUrl: string): Promise<NatGeoResponse | undefined> {
  try {
    const response = await fetch(jsonUrl, {});
    return response.json();
  } catch (err) {
    const msg = 'Error in downloadJson err => ' + err;
    console.log(msg);
    logger.error(msg);
    return undefined;
  }
}

/**
 * Gets URL of Pic of the day from JSON with pics of the current month
 * @param {JSON} json
 * @return {String}
 */
function getPhotoUrl(json: NatGeoResponse): string {
  const photoUrl = json.items[0].originalUrl
    ? json.items[0].originalUrl
    : json.items[0].url;
  return photoUrl;
}

/**
 * Downloads the Pic of the day
 * @param {String} url
 * @param {String} fileDest
 */
async function downloadImage(url: string, fileDest: string) {
  fetch(url, {}).then(res => {
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
        logger.error('Error in downloadImage err => ' + err);
        reject(err);
      });
    });
  });
}

/**
 * Sets the Wallpaper
 * @param {String} fileDest
 */
async function setWallpaper(fileDest: string) {
  try {
    await wallpaper.set(fileDest);
    const fullWallpaperPath = await wallpaper.get();
    // Transform wallpaperPaths to only include the filenames
    const wallpaperPath = fullWallpaperPath.split('\\').pop();
    const file = fileDest.split('/').pop();
    if (wallpaperPath === file) {
      console.log('Wallpaper set => ' + fullWallpaperPath);
    } else {
      const msg =
        'Error in setWallpaper: wallpaperPath => ' +
        wallpaperPath +
        ' fullWallpaperPath => ' +
        fullWallpaperPath;
      console.log(msg);
      logger.error(msg);
    }
  } catch (err) {
    logger.error(err);
  }
}
