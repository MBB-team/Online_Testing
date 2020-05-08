<?php

exportMysqlToCsv();

/**
 * Main method to export a CSV.
 *
 * @return void
 */
function exportMysqlToCsv() {
    try {
        include('database_config.php');
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
 * @param [type] $sql A sql query.
 * @param [type] $conn A PDO connection.
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
 * @param [type] $sql A sql query.
 * @param [type] $conn A PDO connection.
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
 * @param [type] $array A php array. Ex: [["col1", "col2"], ["v1", "v2"]]
 * @param string $filename The CSV file name.
 * @param [type] $delimiter The csv delimiter.
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
 * @param [type] $table The table name.
 * @return string
 */
function generateCsvFileName($table) {
    $date = date("G-i.D_d_M_Y");
    return $date . "." . $table . ".csv";
}

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

?>
