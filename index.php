<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <title>Pathfinder</title>
</head>
<body>
    <canvas id="leCanvas" width="600" height="600">

    </canvas>

    <div>        
        <button onclick="setType('start')">Départ</button>        
        <button onclick="setType('end')">Arrivé</button>
        <br><br>
        <button onclick="setType('wall')">mur</button>
        <button onclick="setType('mud')">boue</button>
        <button onclick="setType('trap')">piège</button>
        <button onclick="setType('empty')">vider</button>
        <br><br>
        <button onclick="startSearchPath()">Lancer le Test</button>
    </div>
    <br><br>
    <div>
        <p>Sauvegarde</p>
        <label>Nom:</label><input type="text" id="name">
        <label>Créateur:</label><input type="text" id="creator">
        <button onclick="save()">Valider</button>

    </div>
    <br>
    <div id="liste">
        <p>Liste des Maps :</p>
    </div>
    <script src="easystar.js"></script>
    <script src="script.js"></script>
</body>
</html>