<?php
include 'bdd.php';

if($_GET['crud']){
    $crud = $_GET['crud'];
}
if($_GET['type']){
    $type = $_GET['type'];
}


switch($crud){
    case 'c':
        switch($type){
            case 'map':
                if($_POST['name']){
                    $name = $_POST['name'];
                }
                if($_POST['creator']){
                    $creator = $_POST['creator'];
                }
                if($_POST['data']){
                    $data = $_POST['data'];
                }

                $sql = '
                    INSERT INTO cartes
                    (Nom, Createur, Composition)
                    VALUES
                    (?, ?, ?)
                ';

                $query = sql_execute($sql, array($name, $creator, $data));

                echo json_encode($query);

            break;
        }
    break;

    case 'r':
        switch($type){
            case 'all':
                $sql = '
                    SELECT * FROM cartes
                ';

                $query = sql_execute($sql, array());
                $json = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($json);

            break;

            case 'one':
                $sql = '
                    SELECT * FROM cartes
                    WHERE ID = ?
                ';

                $query = sql_execute($sql, array());

                $query = $query->fetchAll();
                echo json_encode($query);

            break;
        }
    break;

}








?>