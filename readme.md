# Natgeo Wallpaper

## What this does

It downloads the [National Geographic Photo of the day](https://www.nationalgeographic.com/photography/photo-of-the-day), saves it in a pics folder and sets it as the wallpaper.

I use it daily on Windows and MacOS but it should also work for Linux.

## How to run it

Install dependencies:

```sh
yarn install or node install
```

Start:

```sh
yarn start or node start
```

I copied the `wallpaper.bat` file in my autostart folder (Win + R -> `shell:startup`) on windows to run the script on startup.
On Mac I used automator to run the `ts-node index.ts` on startup.

## Roadmap

- [ ] Cleanup old Pics
- [x] Cleanup old Logs
- [ ] Settings for cleanup
- [x] Better Logging
- [x] Check if connected to Internet
- [x] Check if current pic is already set as wallpaper
