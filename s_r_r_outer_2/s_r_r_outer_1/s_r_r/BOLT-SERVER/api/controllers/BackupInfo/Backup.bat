@echo off
cd dataBackup
for /f "tokens=1* delims=/ " %%a in ('date /T') do set datestr=%%a
for /f "tokens=1-4 delims=/ " %%d in ('time /T') do set timestr=%%d
set folderName=%datestr%-%timestr:~0,2%.%timestr:~3,2% 
@echo on
mkdir %folderName%
@echo off
cd %folderName%
mongodump --db SellaciousNewDB