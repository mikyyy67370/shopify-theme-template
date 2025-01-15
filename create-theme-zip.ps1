# Nettoyer les fichiers existants
if (Test-Path theme.zip) {
    Remove-Item theme.zip -Force
}
if (Test-Path temp_theme) {
    Remove-Item temp_theme -Recurse -Force
}

# Créer le dossier temporaire à la racine
New-Item -ItemType Directory -Path temp_theme

# Créer les dossiers requis
$folders = @(
    "layout",
    "assets",
    "config",
    "locales",
    "sections",
    "snippets",
    "templates",
    "templates/customers"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path "temp_theme/$folder" -Force
}

# Copier le fichier theme.liquid
Write-Host "Copie de theme.liquid..."
Copy-Item "layout/theme.liquid" "temp_theme/layout/theme.liquid" -Force
Get-Content "temp_theme/layout/theme.liquid" | Out-Host

# Copier les autres fichiers
Write-Host "Copie des autres fichiers..."
Copy-Item "assets/*" "temp_theme/assets/" -Force
Copy-Item "config/*" "temp_theme/config/" -Force
Copy-Item "layout/checkout.liquid" "temp_theme/layout/" -Force
Copy-Item "locales/*" "temp_theme/locales/" -Force
Copy-Item "sections/*" "temp_theme/sections/" -Force
Copy-Item "snippets/*" "temp_theme/snippets/" -Force
Copy-Item "templates/*.liquid" "temp_theme/templates/" -Force
Copy-Item "templates/customers/*" "temp_theme/templates/customers/" -Force

# Vérifier que theme.liquid existe
if (-not (Test-Path "temp_theme/layout/theme.liquid")) {
    Write-Host "ERREUR : theme.liquid n'existe pas dans le dossier layout!"
    exit 1
}

# Créer le zip depuis le contenu du dossier temp_theme
Write-Host "Création du zip..."
Push-Location temp_theme
Compress-Archive -Path "*" -DestinationPath "../theme.zip" -Force
Pop-Location

# Afficher la structure du zip
Write-Host "`nContenu du dossier temp_theme :"
Get-ChildItem -Path temp_theme -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\temp_theme\", "")
    Write-Host $relativePath
}

# Nettoyer
Remove-Item temp_theme -Recurse -Force

Write-Host "`nFichier theme.zip créé avec succès!"
