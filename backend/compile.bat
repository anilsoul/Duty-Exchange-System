@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;C:\apache-maven-3.9.6\bin;%PATH%
mvn clean compile > compile_log.txt 2>&1
echo Done.
