@echo off
call curl --data "key=%CLOUDINARY_SECRET%" http://www.podcaddy.co.uk/maintenance-on
timeout 10
call curl --data "key=%CLOUDINARY_SECRET%" http://www.podcaddy.co.uk/api/getdb > backup/podcaddy_%date:~-4,4%%date:~-10,2%%date:~-7,2%.json
call curl --data "key=%CLOUDINARY_SECRET%" http://www.podcaddy.co.uk/maintenance-off
