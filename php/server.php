<?php
    /* CONFIGURATION DE LA BASE */ 
	$host 		= 	"inscription";
	$user 		= 	"root";
	$password   = 	"root";
	$database 	= 	"tf2";
	$table 		= 	"server";

    ///////////////////////////////////////////////// NE PAS MODIFIER
    $dsn        =   "mysql:dbname=" .$database. ";host=" . $host;
    $pdo = new PDO($dsn, $user, $password);
    switch($_POST['action']){
        case 'getServer':
            $sql  = "SELECT id, ip, port FROM server"; 
            $statement=$pdo->prepare($sql);
            $statement->execute();
            $results=$statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($results);
        break;
        case 'addServer':
            $sql  = "INSERT INTO server (ip, port) VALUES ('" . $_POST['ip'] . "', " . $_POST['port'] . ")";
            $statement=$pdo->prepare($sql);
            $statement->execute();
            echo json_encode(["done"]);
        break;
        case 'deleteServer':
            $sql  = "DELETE FROM server WHERE id =" . $_POST['id'];
            $statement=$pdo->prepare($sql);
            $statement->execute();
            echo json_encode(["done"]);
        break;
    }
?>