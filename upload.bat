@echo off
call curl --data "key=%CLOUDINARY_SECRET%" http://www.podcaddy.co.uk/maintenance-on
timeout 10
call curl --form "podcaddyDatabase=@%1" --form "key=%CLOUDINARY_SECRET%" http://www.podcaddy.co.uk/api/upload/database