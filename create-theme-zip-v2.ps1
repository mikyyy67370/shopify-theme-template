# Supprimer l'ancien zip s'il existe
if (Test-Path theme.zip) {
    Remove-Item theme.zip -Force
}

# Créer un zip vide
Compress-Archive -Path "layout/theme.liquid" -DestinationPath "theme.zip" -Force

# Ajouter les autres fichiers au zip existant
$folders = @(
    "assets",
    "config",
    "layout",
    "locales",
    "sections",
    "snippets",
    "templates"
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "Ajout du dossier $folder..."
        Get-ChildItem -Path $folder -File -Recurse | ForEach-Object {
            Compress-Archive -Path $_.FullName -Update -DestinationPath "theme.zip"
        }
    }
}

Write-Host "Fichier theme.zip créé avec succès!"

# Afficher le contenu du zip
Write-Host "`nContenu du zip :"
Expand-Archive -Path theme.zip -DestinationPath temp_extract -Force
Get-ChildItem -Path temp_extract -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\temp_extract\", "")
    Write-Host $relativePath
}
Remove-Item temp_extract -Recurse -Force
