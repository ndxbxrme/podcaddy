@echo off
call curl --data "key=%CLOUDINARY_SECRET%" http://localhost:23232/maintenance-%1