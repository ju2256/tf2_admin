<?php
	require __DIR__ . '/SourceQuery/bootstrap.php';
	use xPaw\SourceQuery\SourceQuery;
	// For the sake of this example
	Header( 'Content-Type: text/plain' );
	Header( 'X-Content-Type-Options: nosniff' );
    define( 'SQ_SERVER_ADDR', $_POST['ip'] );
    define( 'SQ_SERVER_PORT', $_POST['port'] );
	define( 'SQ_TIMEOUT',     1 );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );	
	$Query = new SourceQuery( );
    switch($_POST['action']){
        case 'getMaps' :
            $Query->Connect( SQ_SERVER_ADDR, SQ_SERVER_PORT, SQ_TIMEOUT, SQ_ENGINE );
            $Query->SetRconPassword( 'oufslan' );
            echo $Query->Rcon( 'maps *' );
        break;
        case 'changeMap' :
            $Query->Connect( SQ_SERVER_ADDR, SQ_SERVER_PORT, SQ_TIMEOUT, SQ_ENGINE );
            $Query->SetRconPassword( 'oufslan' );
            echo $Query->Rcon( 'changelevel ' . $_POST['data'] );
        break;
        case 'getInfo' :
            $Query->Connect( SQ_SERVER_ADDR, SQ_SERVER_PORT, SQ_TIMEOUT, SQ_ENGINE );
            echo json_encode( $Query->GetInfo( ) );
        break;
        case 'GetPlayers' :
            $Query->Connect( SQ_SERVER_ADDR, SQ_SERVER_PORT, SQ_TIMEOUT, SQ_ENGINE );
            echo json_encode( $Query->GetPlayers( ) );
            break;
        case 'getRules' :
            $Query->Connect( SQ_SERVER_ADDR, SQ_SERVER_PORT, SQ_TIMEOUT, SQ_ENGINE );
            echo json_encode( $Query->GetRules( ) );
        break;
        default:
            $Query->Connect( SQ_SERVER_ADDR, SQ_SERVER_PORT, SQ_TIMEOUT, SQ_ENGINE );
            $Query->SetRconPassword( 'oufslan' );
            echo $Query->Rcon( $_POST['action'] . " " . $_POST['value'] );
        break;   
    }
?>