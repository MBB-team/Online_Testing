<?php # Acess this with http://localhost/csv/csv_1oBGKTYAD5yEiD4QjHdkt9.php

basicAuth(); # Requires login
exportMysqlToCsv(); # Download CSV

/**
 * Main method to export a CSV.
 *
 * @return void
 */
function exportMysqlToCsv() {
    try {
        include('../database_config.php');
        $tableOrView = "$table"; # To export a sql query, create a sql view and enter its name here.
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);

        $csvFileName = generateCsvFileName($tableOrView); // "mbb.csv";
        $sqlCsvHeader = "SHOW COLUMNS FROM `$table`;";
        $sqlCsvBody = "SELECT * FROM `$table`;";
        $arrayHeader = fetchColumn($sqlCsvHeader, $conn);
        $arrayBody = fetchAll($sqlCsvBody, $conn);
        $arrayCsv = getArrayCsv($arrayHeader, $arrayBody);
        array_to_csv_download($arrayCsv, $csvFileName, ";");
    } catch(PDOException $e) {
        echo '{"success": false, "message": ' . $e->getMessage();
    }
}

/**
 * SQL to php array for select statements.
 *
 * @param [string] $sql A sql query.
 * @param [PDO] $conn A PDO connection.
 * @return array
 */
function fetchAll($sql, $conn) {
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll();
        $stmt->closeCursor();
    } catch(PDOException $e) {
        $res = [["success", "message"], ["false", $e->getMessage()]];
    }
    return $res;
}

/**
 * SQL to php array for fetchColumn statements.
 *
 * @param [string] $sql A sql query.
 * @param [PDO] $conn A PDO connection.
 * @return array
 */
function fetchColumn($sql, $conn) {
    $res = [];
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        while($row = $stmt->fetchColumn())
            $res[] = $row;
    } catch(PDOException $e) {
        $res = [$e->getMessage()];
    }
    return $res;
}

/**
 * Download a csv from a php array.
 *
 * @param [array] $array A php array. Ex: [["col1", "col2"], ["v1", "v2"]]
 * @param string $filename The CSV file name.
 * @param [string] $delimiter The csv delimiter.
 * @return void
 */
function array_to_csv_download($array, $filename = "export.csv", $delimiter=";") {
    header('Content-Type: application/csv');
    header('Content-Disposition: attachment; filename="'.$filename.'";');
    $f = fopen('php://output', 'w'); // open the "output" stream
    foreach ($array as $line)
        fputcsv($f, $line, $delimiter);
}

/**
 * Generate a csv file name from a table name.
 *
 * @param [string] $table The table name.
 * @return string
 */
function generateCsvFileName($table) {
    $date = date("G-i.D_d_M_Y");
    return $date . "." . $table . ".csv";
}

/**
 * Format array to be exportable.
 *
 * @param [array] $arrayHeader The header array.
 * @param [array] $arrayBody The body array.
 * @return string
 */
function getArrayCsv($arrayHeader, $arrayBody) {
    $res = [$arrayHeader];
    try {
        foreach ($arrayBody as $body) {
            $row = [];
            foreach ($arrayHeader as $header)
                $row[] = $body[$header];
            array_push($res, $row);
        }
    } catch(Exception $e) {
        $res = [[$e->getMessage()]];
    }
    return $res;
}

/**
 * Basic authentification.
 * @param [string] $sentUsername The username sent.
 * @param [string] $sentPassword The password sent.
 *
 * @return void
 */
function basicAuth() {
    if (!isset($_SERVER['PHP_AUTH_USER'])) {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo 'Authentification canceled.';
        exit;
    } else {
        $correctUsernameHash = '$2y$12$1AeDe3mR3d26MwPugSn67euzz9ZXdS.GKRZ5UE2pUCEUMt4.8leai'; // Generate a new (password / username) hash with $sentUsernameHash = password_hash($sentUsername, PASSWORD_DEFAULT, ['cost' => 12]);
        $correctPasswordHash = '$2y$12$ilBHqpwp9ntDaHswpyVxHO8Mr51Iqiba5ncidBh3/snDjLhpoQakO';
        $sentUsername = $_SERVER['PHP_AUTH_USER'];
        $sentPassword = $_SERVER['PHP_AUTH_PW'];
        $isUsernameCorrect = password_verify($sentUsername, $correctUsernameHash);
        $isPasswordCorrect = password_verify($sentPassword, $correctPasswordHash);
        $logout = false;
        if (!$isUsernameCorrect) {
            echo "<p>Bad userName ({$sentUsername}).</p>";
            $logout = true;
        } else if (!$isPasswordCorrect) {
            echo "<p>Correct userName ({$sentUsername}), but bad password ({$sentPassword}).</p>";
            $logout = true;
        }
        if ($logout) {
            echo "<p>Remove your browser cache to enter a new user / password.</p>";
            exit;
        }
    }
}

?>
