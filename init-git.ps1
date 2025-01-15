# Configurer Git si ce n'est pas déjà fait
git config --global core.autocrlf false

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit"

# Ajouter le remote
git remote add origin https://github.com/mikyyy67370/shopify-theme-template.git

# Pousser vers GitHub
git push -u origin master
