@echo off
cd /d %~dp0
start "" http://localhost:3080
npm run dev
