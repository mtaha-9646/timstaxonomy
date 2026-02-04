@echo off
REM TIMS Taxonomy - Quick Start Script
echo ========================================
echo TIMS Taxonomy Flask Application
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Run the application
echo Starting TIMS Taxonomy application...
echo Application will be available at: http://localhost:5001
echo.
echo Press Ctrl+C to stop the server
echo.
python app.py
