<?php
session_start();
ob_start();


$logFile = '/var/log/apache2/access.log';


if (!file_exists($logFile)) {
    echo "Error: Log file not found at $logFile.";
    exit;
}

$lines = file($logFile);
$uniqueIps = [];

foreach ($lines as $line) {
    preg_match('/^(\S+)/', $line, $matches);
    if (isset($matches[1])) {
        $uniqueIps[$matches[1]] = true;
    }
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
