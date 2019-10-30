import fetch from 'node-fetch';
import * as fs from 'fs';
import wallpaper from 'wallpaper';
import { createLogger } from './logger';
import { NatGeoResponse } from './types/NatGeoResponse';
import { DateObject } from './types/DateObject';
import { Logger } from 'log4js';
import * as isOnline from 'is-online';

let logger: Logger;

/**
 * Sets the wallpaper to natgeo pic of the day
 */
export async function setWallpaperOfTheDay() {
  const date = getDate();
  logger = createLogger(date);
  logger.info('Starting execution');
  createFolders();
  deleteOldLogs(date);
  const con = await isOnline();

  if (!con) {
    logger.error('No connection to the internet possible!');
    return;
  }

  const jsonUrl = getJsonPath(date);
  const fileDest = getFileDest(date);

  if (await checkCurrentWallpaper(fileDest)) {
    logger.info('Wallpaper already set. Cancel execution.');
    return;
  }

  try {
    const json: NatGeoResponse | undefined = await getJson(jsonUrl);
    if (json) {
      const photoUrl = getPhotoUrl(json);
      await downloadImage(photoUrl, fileDest);
      if (fs.existsSync(fileDest)) {
        await setWallpaper(fileDest);
      } else {
        logger.info(`File is not at destination: ${fileDest}, wait 10 seconds`);
        setTimeout(setWallpaper, 10000, fileDest);
      }
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
 * Delete Logs from last month and older
 * @param {DateObject} date
 */
function deleteOldLogs(date: DateObject) {
  fs.readdir('./logs', (err: Error, files: string[]) => {
    if (err) {
      logger.error('Error in deleteOldLogs =>' + err);
    }

    files.map(file => {
      const month = parseInt(file.split('-')[1], 10);
      const year = parseInt(file.split('-')[0], 10);

      if (month < date.month || year < date.year) {
        fs.unlink(`./logs/${file}`, (error: Error) => {
          if (error) {
            logger.error(
              'Error while deleting file ' + file + '. err =>' + error
            );
          }
          logger.info(file + ' was deleted.');
        });
      }
    });
  });
}

/**
 * Gets wallpaperPath JSON with pics from current month
 * @param {Object} date Date Object
 * @return {String}
 */
function getJsonPath(date: DateObject): string {
  const jsonUrl = `https://www.nationalgeographic.com/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery.${date.year}-${date.month}.json`;
  logger.info('JSON Url => ' + jsonUrl);
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
  const lastImageObject = json.items[0];
  return lastImageObject.image.uri;
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
    if (await checkCurrentWallpaper(fileDest)) {
      logger.info('Wallpaper set => ' + fileDest);
    } else {
      const msg = 'Error in setWallpaper: fileDest => ' + fileDest;
      logger.error(msg);
    }
  } catch (err) {
    logger.error(err);
  }
}

async function checkCurrentWallpaper(fileName: string): Promise<boolean> {
  let localFilename: string | undefined = fileName;
  const fullWallpaperPath = await wallpaper.get();
  // Transform wallpaperPaths to only include the filenames
  const wallpaperPath = fullWallpaperPath.split('/').pop();

  if (localFilename.includes('/')) {
    localFilename = fileName.split('/').pop();
  }

  if (wallpaperPath === localFilename) {
    return true;
  } else {
    if (!localFilename) {
      logger.error(`Could not shorten fileName: ${fileName}`);
    }
    return false;
  }
}
