<?php

function connect(){
    $user = "root";
    $password = "";
    try {
        $dbh = new PDO('mysql:host=localhost;dbname=labyrinth', $user, $password);
        return $dbh;
    } catch(Exception $e){
        return $e;
    }
}

function sql_prepare ($sql) {
    $dbh = connect();
    $query = $dbh->prepare($sql);
    return $query;
}


function sql_execute ($sql, $array) {
    $query = sql_prepare($sql);
    $request = $query->execute($array);
    return $query;
}