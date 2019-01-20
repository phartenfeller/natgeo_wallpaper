cd >>Your_Path<<\natgeo_wallpaper
mkdir logs
mkdir pics
PowerShell -Command "Set-ExecutionPolicy Unrestricted CurrentUser" >> "logs\log.log" 2>&1 
PowerShell >>Your_Path<<\natgeo_wallpaper\run.ps1 >> "logs\log.log" 2>&1
