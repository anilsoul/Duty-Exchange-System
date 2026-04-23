@echo off
echo === Spring Boot Backend Setup ===

REM Set Java Home
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;C:\apache-maven-3.9.6\bin;%PATH%

echo.
echo Verifying Java...
java -version

echo.
echo Verifying Maven...
mvn --version

echo.
echo === Starting Spring Boot Application ===
echo Press Ctrl+C to stop the application
echo.

REM Run the Spring Boot application
mvn spring-boot:run
