cd C:\Users\phart\Documents\Code\national_geographic_photo
PowerShell -Command "Set-ExecutionPolicy Unrestricted CurrentUser" >> "logs\log.log" 2>&1 
PowerShell C:\Users\phart\Documents\Code\national_geographic_photo\run.ps1 >> "logs\log.log" 2>&1