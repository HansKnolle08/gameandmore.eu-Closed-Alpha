#!/bin/bash

# Setze den temporären Pfad und das Zielverzeichnis
temp_dir="/home/temp"
target_dir="/var/www/html"
repo_url="https://github.com/HansKnolle08/gameandmore.eu.git"

# Alte Daten aus temp entfernen
rm -rf "$temp_dir/gameandmore.eu"

# Repository klonen
mkdir -p "$temp_dir"
git clone "$repo_url" "$temp_dir/gameandmore.eu"

# Altes Webverzeichnis entfernen und neu erstellen
rm -rf "$target_dir"
mkdir -p "$target_dir"

# Dateien und Ordner aus src verschieben
mv "$temp_dir/gameandmore.eu/LICENSE" "$target_dir/"
mv "$temp_dir/gameandmore.eu/src/index.html" "$target_dir/"
mv "$temp_dir/gameandmore.eu/src/res" "$target_dir/"

# Berechtigungen setzen
chown -R www-data:www-data "$target_dir"
chmod -R 755 "$target_dir"

# Skript selbst nach / kopieren
cp "$0" /

# Cleanup
echo "Deployment abgeschlossen."