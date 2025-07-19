<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$logFile = '/var/log/apache2/access.log';

if (!is_readable($logFile)) {
    echo "Error: Cannot read log file at $logFile.";
    exit;
}

$handle = fopen($logFile, 'r');
$uniqueIps = [];

if ($handle) {
    while (($line = fgets($handle)) !== false) {
        preg_match('/^(\d{1,3}(?:\.\d{1,3}){3})/', $line, $matches);
        if (isset($matches[1])) {
            $uniqueIps[$matches[1]] = true;
        }
    }
    fclose($handle);
}

$totalUniqueVisitors = count($uniqueIps);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Apache Admin Dashboard</title>
</head>
<body>
    <h1>Apache Admin Dashboard</h1>
    <p><strong>Total Unique Visitors (by IP):</strong> <?php echo $totalUniqueVisitors; ?></p>
</body>
</html>
