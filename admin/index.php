<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$logFile = '/var/log/apache2/access.log';

if (!is_readable($logFile)) {
    die("Error: Cannot read $logFile.");
}

$handle = fopen($logFile, 'r');
$uniqueIps = [];
$linesRead = 0;
$matchedIps = 0;

if ($handle) {
    while (($line = fgets($handle)) !== false) {
        $linesRead++;
        if (preg_match('/^(\d{1,3}(?:\.\d{1,3}){3})/', $line, $matches)) {
            $matchedIps++;
            $uniqueIps[$matches[1]] = true;
        }
    }
    fclose($handle);
}

echo "<pre>";
echo "Lines read: $linesRead\n";
echo "IPs matched: $matchedIps\n";
echo "Unique IPs: " . count($uniqueIps) . "\n";
echo "</pre>";
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
