@echo off
setlocal

echo ==========================================
echo   Deploying ABTF to server
echo ==========================================

bash scripts/deploy.sh
if errorlevel 1 (
	echo Deployment failed.
	exit /b 1
)

echo Deployment finished successfully.

exit /b 0
