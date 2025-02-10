#!/bin/bash

# Setze die Pfade
temp_dir="/home/temp"
repo_url="https://github.com/HansKnolle08/gameandmore.eu.git"
web_dir="/var/www/html"
update_dir="/var/www/temp"

# Alte Daten aus temp entfernen
rm -rf "$temp_dir/gameandmore.eu"

# Repository klonen
mkdir -p "$temp_dir"
git clone "$repo_url" "$temp_dir/gameandmore.eu"

# Update-Verzeichnis vorbereiten
rm -rf "$update_dir"
mkdir -p "$update_dir"

# Dateien und Ordner aus src in das Update-Verzeichnis verschieben
mv "$temp_dir/gameandmore.eu/LICENSE" "$update_dir/"
mv "$temp_dir/gameandmore.eu/src/index.html" "$update_dir/"
mv "$temp_dir/gameandmore.eu/src/res" "$update_dir/"

# Prüfen, ob sich die Dateien geändert haben
if diff -qr "$web_dir" "$update_dir" > /dev/null; then
    echo "Keine Änderungen gefunden. Bereinige Update-Verzeichnis."
    rm -rf "$update_dir"
else
    echo "Änderungen erkannt. Aktualisiere Webseite."
    rm -rf "$web_dir"
    mv "$update_dir" "$web_dir"
    chown -R www-data:www-data "$web_dir"
    chmod -R 755 "$web_dir"
fi

# Cleanup
echo "Update abgeschlossen."