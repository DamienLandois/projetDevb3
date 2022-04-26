var easystar = new EasyStar.js();

var g_start = {
    name: 'start',
    set: false,
    x: undefined,
    y: undefined,
    color: 'yellow',
    value: 0,
    through: true
}

var g_end = {
    name: 'end',
    set: false,
    x: undefined,
    y: undefined,
    color: 'green',
    value: 0,
    through: true
}

var g_empty = {
    name: 'empty',
    color: 'white',
    value: 0,
    through: true
}

var g_wall = {
    name: 'wall',
    color: 'black',
    value: 1,
    through: false
};

var g_mud = {
    name: 'mud',
    color: 'brown',
    value: 0.5,
    through: true
};

var g_trap = {
    name: 'trap',
    color: 'red',
    value: 0.9,
    through: true
}
var g_path = {
    name: 'path',
    color: 'purple',
    value: 0,
    through: true
}
var type = 'empty';

var canvas = document.getElementById('leCanvas');
var ctx = canvas.getContext('2d');

var grid = new Array(12);
for(let ii=0; ii < grid.length; ii++){
    grid[ii] = new Array(12);
    for(let jj=0; jj < grid[ii].length; jj++){
        grid[ii][jj] = g_empty;
    }
}

var handleCanvasClick = function (canvas, nb_x, nb_y, fct) {
    var offset = function (el, event) {
        var ox = -el.offsetLeft;
        var oy = -el.offsetTop;
        while (el = el.offsetParent) {
            ox += el.scrollLeft - el.offsetLeft;
            oy += el.scrollTop - el.offsetTop;
        }
        return [event.clientX + ox, event.clientY + oy];
    };
     
    canvas.onclick = function (e) {
        var coords = offset(canvas, e);
        var x = Math.floor(coords[0] / canvas.width * nb_x);
        var y = Math.floor(coords[1] / canvas.height * nb_y);
        fct(x, y);
    };
};

function setUpCanvas() {
    var ecart = 50;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    for(var h = ecart ; h < canvas.height ; h += ecart) {
    ctx.moveTo(0, h);
    ctx.lineTo(canvas.width, h);
    }

    for(var w = ecart ; w < canvas.width ; w += ecart) {
    ctx.moveTo(w, 0);
    ctx.lineTo(w, canvas.height);
    }
    ctx.stroke();
};

function setType (type_selected) {
    type = type_selected;
};

function reload(sauvegarde, start, end){
    console.log(start)
    start = JSON.parse(start);
    if(typeof start.x !== 'undefined'){
        g_start.set = true
        g_start.x = start.x;
        g_start.y = start.y;
    }

    end = JSON.parse(end);
    if(typeof end.x !== 'undefined'){
        g_end.set = true;
        g_end.x = end.x;
        g_end.y = end.y;
    }

    setUpCanvas();
    grid = JSON.parse(sauvegarde);
    for(x in grid){
        for(y in grid[x]){
            ctx.fillStyle = grid[x][y].color;
            ctx.fillRect((x*50)+1, (y*50)+1, 48, 48);
        }
    }


};

function load_list(){
    $.ajax({
        type: 'POST',
        url: "crud.php?crud=r&type=all",
        data: {
        },
        success: function(response) {
            //console.log(response)
            response = JSON.parse(response);
            for(let el of response){
                console.log(el)

                let div = document.createElement('div');
                let span = document.createElement('span');
                span.innerHTML = el.Nom+" créée par "+el.Createur;
                let newButton = document.createElement('button');
                newButton.setAttribute('id', el.ID);
                var texte = document.createTextNode("Charger");

                newButton.appendChild(texte);
                div.appendChild(span);
                div.appendChild(newButton);
                document.getElementById('liste').appendChild(div);


                console.log(document.getElementById(el.ID))

                document.getElementById(el.ID).addEventListener('click', function(event){reload(el.Composition, el.start, el.end);})


            }
        }
    })

}

function save() {
    let json_grid = JSON.stringify(grid);
    let json_start = JSON.stringify({x: g_start.x, y: g_start.y});
    let json_end = JSON.stringify({x: g_end.x, y: g_end.y});

    console.log("save");
    $.ajax({
        type: 'POST',
        url: "crud.php?crud=c&type=map",
        data: {
            name: document.getElementById("name").value,
            creator: document.getElementById("creator").value,
            data: json_grid,
            start: json_start,
            end: json_end
        },
        success: function(response){
            if(response == false){
                alert("Une erreure s'est produite");
            }
        }
    })
}

window.onload = function () {
    setUpCanvas();
    handleCanvasClick(canvas, 12, 12, function (x, y) {
        console.log(x + '|' + y);
        var obj;
        console.log(type)
        switch(type){
            case 'start':
                if(g_start.set == true){
                    if(grid[g_start.x][g_start.y] == g_start){
                        ctx.fillStyle= g_empty.color;
                        ctx.fillRect((g_start.x*50)+1, (g_start.y*50)+1, 48, 48);
                        grid[g_start.x][g_start.y] = g_empty;
                    }
                } else {
                    g_start.set = true;
                }
                g_start.x = x;
                g_start.y = y;
                obj = g_start;
                break;
            case 'end':
                if(g_end.set == true){
                    if(grid[g_end.x][g_end.y] == g_end){
                        ctx.fillStyle= g_empty.color;
                        ctx.fillRect((g_end.x*50)+1, (g_end.y*50)+1, 48, 48);
                        grid[g_end.x][g_end.y] = g_empty;
                    }
                } else {
                    g_end.set = true;
                }
                g_end.x = x;
                g_end.y = y;
                obj = g_end;
                break;
            case 'empty':
                obj = g_empty;
                break;
            case 'wall':
                obj = g_wall;
                break;
            case 'mud':
                obj = g_mud;
                break;
            case 'trap':
                obj = g_trap;
                break;                                          
        }

        ctx.fillStyle = obj.color;
        ctx.fillRect((x*50)+1, (y*50)+1, 48, 48);
        grid[x][y] = obj;
    });

    load_list();
};




function startSearchPath(){
    var grid_pathfinding = new Array(12);
    for(let ii=0; ii < grid_pathfinding.length; ii++){
        grid_pathfinding[ii] = new Array(12);
        for(let jj=0; jj < grid_pathfinding[ii].length; jj++){
            grid_pathfinding[ii][jj] = grid[jj][ii].value;
        }
    }
    easystar.setGrid(grid_pathfinding);
    console.log(grid_pathfinding);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(g_start.x, g_start.y, g_end.x, g_end.y, function(path){
        console.log(path);
        if(path == null){
            easystar.setAcceptableTiles([0,0.5]);
            easystar.findPath(g_start.x, g_start.y, g_end.x, g_end.y, function(path){
                if(path == null){
                    easystar.setAcceptableTiles([0, 0.5, 0.9]);
                    easystar.findPath(g_start.x, g_start.y, g_end.x, g_end.y, function(path){
                        if(path == null){
                            alert("Path was not found.");
                        }
                    })
                }
            })
        }
        else {
            let colored_path = path;
            colored_path.shift();
            colored_path.pop();
            for(el of colored_path){
                ctx.fillStyle = g_path.color;
                ctx.fillRect((el.x*50)+1, (el.y*50)+1, 48, 48);
            }

            alert("Path was found. The first Point is " + path[0].x + " " + path[0].y);
        }
    } )
    easystar.setIterationsPerCalculation(1000);
    easystar.calculate();
}






