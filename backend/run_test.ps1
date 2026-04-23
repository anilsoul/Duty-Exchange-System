$env:JAVA_HOME = 'C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
& "C:\apache-maven-3.9.6\bin\mvn.cmd" -Dtest=PdfGenerationServiceTest test | Out-File -Encoding utf8 test_log.txt
