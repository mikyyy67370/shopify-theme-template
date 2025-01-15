# Vérifier si 7-Zip est installé
$7zipPath = "C:\Program Files\7-Zip\7z.exe"

if (-not (Test-Path -Path $7zipPath)) {
    Write-Host "7-Zip n'est pas installé. Installation en cours..."
    # Installer 7-Zip via winget
    winget install 7zip.7zip
}

# Supprimer l'ancien zip s'il existe
if (Test-Path theme.zip) {
    Remove-Item theme.zip -Force
}

# Créer un dossier temporaire
$tempDir = "temp_theme"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir

# Copier les fichiers
$folders = @(
    "layout",
    "assets",
    "config",
    "locales",
    "sections",
    "snippets",
    "templates"
)

foreach ($folder in $folders) {
    Write-Host "Copie du dossier $folder..."
    Copy-Item -Path $folder -Destination "$tempDir/$folder" -Recurse -Force
}

# Vérifier le contenu de theme.liquid
Write-Host "`nContenu de theme.liquid :"
Get-Content "$tempDir/layout/theme.liquid"

# Créer le zip avec 7-Zip
Write-Host "`nCréation du zip avec 7-Zip..."
Set-Location $tempDir
& $7zipPath a -tzip "..\theme.zip" ".\*" -r

# Retourner au dossier principal
Set-Location ..

# Afficher la structure
Write-Host "`nStructure du dossier temp_theme :"
Get-ChildItem -Path $tempDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\$tempDir\", "")
    Write-Host $relativePath
}

# Nettoyer
Remove-Item $tempDir -Recurse -Force
Write-Host "`nFichier theme.zip créé avec succès!"
