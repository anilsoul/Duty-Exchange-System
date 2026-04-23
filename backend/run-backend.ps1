# Spring Boot Backend Runner Script
# This script sets up Java and Maven paths and runs the backend

Write-Host "=== Spring Boot Backend Setup ===" -ForegroundColor Cyan

# Set Java Home
$javaHome = 'C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot'
if (Test-Path $javaHome) {
    $env:JAVA_HOME = $javaHome
    $env:Path = "$javaHome\bin;$env:Path"
    Write-Host "Java 17 configured" -ForegroundColor Green
    & java -version
} else {
    Write-Host "Java not found at $javaHome" -ForegroundColor Red
    Write-Host "Please install Java 17 from: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# Check for Maven
$mavenFound = $false
$mavenPaths = @(
    "C:\Program Files\Maven\bin",
    "C:\Program Files\Apache\Maven\bin",
    "C:\apache-maven-3.9.6\bin",
    "C:\maven\bin"
)

foreach ($path in $mavenPaths) {
    $mvnCmd = Join-Path $path "mvn.cmd"
    if (Test-Path $mvnCmd) {
        $env:Path = "$path;$env:Path"
        $mavenFound = $true
        Write-Host "Maven found at $path" -ForegroundColor Green
        break
    }
}

if (-not $mavenFound) {
    Write-Host "Maven not found. Downloading Maven..." -ForegroundColor Yellow
    
    $mavenVersion = "3.9.6"
    $baseUrl = "https://dlcdn.apache.org/maven/maven-3"
    $fileName = "apache-maven-$mavenVersion-bin.zip"
    $mavenUrl = "$baseUrl/$mavenVersion/binaries/$fileName"
    $downloadPath = Join-Path $env:TEMP "maven.zip"
    $extractPath = "C:\apache-maven-$mavenVersion"
    
    try {
        Write-Host "Downloading Maven from $mavenUrl..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $mavenUrl -OutFile $downloadPath -UseBasicParsing
        
        Write-Host "Extracting Maven..." -ForegroundColor Yellow
        Expand-Archive -Path $downloadPath -DestinationPath "C:\" -Force
        
        $mavenBinPath = Join-Path $extractPath "bin"
        $env:Path = "$mavenBinPath;$env:Path"
        
        Write-Host "Maven installed successfully" -ForegroundColor Green
        
        # Clean up
        Remove-Item $downloadPath -Force
    } catch {
        Write-Host "Failed to download Maven: $_" -ForegroundColor Red
        Write-Host "Please download Maven manually from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "Verifying Maven..." -ForegroundColor Cyan
& mvn --version

Write-Host ""
Write-Host "=== Starting Spring Boot Application ===" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

# Run the Spring Boot application
& mvn spring-boot:run
