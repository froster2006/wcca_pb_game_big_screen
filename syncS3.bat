@echo off
title WCCA update Loop

:loop

echo [%date% %time%] Running jobs...

aws s3 cp .\matches.json s3://wcca-pickleball-club --profile sls
aws s3 cp .\ranking.json s3://wcca-pickleball-club --profile sls

echo [%date% %time%] Done. Waiting 60 seconds...
timeout /t 60 /nobreak >nul

goto loop