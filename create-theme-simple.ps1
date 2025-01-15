# Nettoyer les fichiers existants
if (Test-Path theme.zip) { Remove-Item theme.zip -Force }
if (Test-Path temp_theme) { Remove-Item temp_theme -Recurse -Force }

# Créer le dossier temporaire
New-Item -ItemType Directory -Path "temp_theme" | Out-Null
New-Item -ItemType Directory -Path "temp_theme/layout" | Out-Null

# Créer un theme.liquid minimal
@'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ page_title }}</title>
  {{ content_for_header }}
</head>
<body>
  {{ content_for_layout }}
</body>
</html>
'@ | Set-Content "temp_theme/layout/theme.liquid"

# Créer le zip
Set-Location temp_theme
Compress-Archive -Path "layout" -DestinationPath "../theme.zip" -Force
Set-Location ..

# Vérifier le contenu
Write-Host "Contenu du zip :"
Get-ChildItem -Path temp_theme -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\temp_theme\", "")
    Write-Host $relativePath
}

# Nettoyer
Remove-Item temp_theme -Recurse -Force
