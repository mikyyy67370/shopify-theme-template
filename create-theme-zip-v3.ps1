# Supprimer les fichiers temporaires
if (Test-Path theme.zip) { Remove-Item theme.zip -Force }
if (Test-Path temp_theme) { Remove-Item temp_theme -Recurse -Force }

# Créer un dossier temporaire
New-Item -ItemType Directory -Path temp_theme

# Copier les fichiers en préservant la structure
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
    if (Test-Path $folder) {
        Write-Host "Copie du dossier $folder..."
        Copy-Item -Path $folder -Destination "temp_theme/$folder" -Recurse
    }
}

# Vérifier que theme.liquid existe
$themeLiquidPath = "temp_theme/layout/theme.liquid"
if (-not (Test-Path $themeLiquidPath)) {
    Write-Host "ERREUR: theme.liquid n'existe pas dans le dossier layout!"
    exit 1
}

Write-Host "Contenu de theme.liquid :"
Get-Content $themeLiquidPath

# Créer le zip depuis le dossier temporaire
Write-Host "`nCréation du zip..."
Set-Location temp_theme
Compress-Archive -Path ".\*" -DestinationPath "..\theme.zip" -Force
Set-Location ..

# Afficher la structure
Write-Host "`nStructure du dossier temp_theme :"
Get-ChildItem -Path temp_theme -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\temp_theme\", "")
    Write-Host $relativePath
}

# Nettoyer
Remove-Item temp_theme -Recurse -Force
Write-Host "`nFichier theme.zip créé avec succès!"
