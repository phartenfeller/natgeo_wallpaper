# Natgeo Wallpaper

## What this does
It downloads the [National Geographic Photo of the day](https://www.nationalgeographic.com/photography/photo-of-the-day), saves it in a pics folder and sets it as the wallpaper.

I it on Windows and MacOS but it should also work for Linux.

## How to run it
`node index.js`

I copied the `wallpaper.bat` file in my autostart folder (Win + R -> `shell:startup`) on windows to run the script on startup.
On Mac I used automator to run the `index.js` on startup.

## Roadmap
- [ ] Add a better way to execute it on startup
- [ ] Cleanup old Pics
- [x] Cleanup old Logs
- [ ] Settings for cleanup
- [x] Better Logging
- [ ] Check if connected to Internet

## Issues
The Package used to set the Wallpaper doesn't support multiple Screens on Windows: [Github Issue](https://github.com/sindresorhus/wallpaper/issues/5)