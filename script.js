var easystar = new EasyStar.js();


var start = {
    name: 'start',
    set: false,
    x: undefined,
    y: undefined,
    color: 'yellow',
    value: 0,
}

var end = {
    name: 'end',
    set: false,
    x: undefined,
    y: undefined,
    color: 'green',
    value: 0,
}

var empty = {
    name: 'empty',
    color: 'white',
    value: 0,
    through: true
}

var wall = {
    name: 'wall',
    color: 'black',
    value: 1,
    through: false
};

var mud = {
    name: 'mud',
    color: 'brown',
    value: 0.5,
    through: true
};

var trap = {
    name: 'trap',
    color: 'red',
    value: 0.9,
    through: true
}
var path = {
    name: 'path',
    color: 'plum2',
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
        grid[ii][jj] = empty;
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

function reload(sauvegarde){

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
            console.log(response)
            response = JSON.parse(response);
            for(el of response){
                let div = document.createElement('div');
                let span = document.createElement('span');
                span.innerHTML = el.Nom+" créée par "+el.Createur;
                let button = document.createElement('button');
                button.onclick = function(event){reload(el.Composition);}
                var texte = document.createTextNode("Charger");

                button.appendChild(texte);
                div.appendChild(span);
                div.appendChild(button);
                document.getElementById('liste').appendChild(div);

            }
        }
    })

}

function save() {
    let json_grid = JSON.stringify(grid);

    console.log("save");
    $.ajax({
        type: 'POST',
        url: "crud.php?crud=c&type=map",
        data: {
            name: document.getElementById("name").value,
            creator: document.getElementById("creator").value,
            data: json_grid,
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
                if(start.set == true){
                    if(grid[start.x][start.y] == start){
                        ctx.fillStyle= empty.color;
                        ctx.fillRect((start.x*50)+1, (start.y*50)+1, 48, 48);
                        grid[start.x][start.y] = empty;
                    }
                } else {
                    start.set = true;
                }
                start.x = x;
                start.y = y;
                obj = start;
                break;
            case 'end':
                if(end.set == true){
                    if(grid[end.x][end.y] == end){
                        ctx.fillStyle= empty.color;
                        ctx.fillRect((end.x*50)+1, (end.y*50)+1, 48, 48);
                        grid[end.x][end.y] = empty;
                    }
                } else {
                    end.set = true;
                }
                end.x = x;
                end.y = y;
                obj = end;
                break;
            case 'empty':
                obj = empty;
                break;
            case 'wall':
                obj = wall;
                break;
            case 'mud':
                obj = mud;
                break;
            case 'trap':
                obj = trap;
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
            grid_pathfinding[ii][jj] =  grid[ii][jj].value;
        }
    }
    console.log(start.x);
    console.log(start.y);
    easystar.setGrid(grid_pathfinding);
    console.log(grid_pathfinding);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(start.x, start.y, end.x, end.y, function(path){
        console.log(path);
        if(path == null){
            easystar.setAcceptableTiles([0,0.5]);
            easystar.findPath(start.x, start.y, end.x, end.y, function(path){
                if(path == null){
                    easystar.setAcceptableTiles([0, 0.5, 0.9]);
                    easystar.findPath(start.x, start.y, end.x, end.y, function(path){
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
                ctx.fillStyle = path.color;
                ctx.fillRect((el.x*50)+1, (el.y*50)+1, 48, 48);
            }

            alert("Path was found. The first Point is " + path[0].x + " " + path[0].y);
        }
    } )
    easystar.setIterationsPerCalculation(1000);
    easystar.calculate();
}














var test = new Array(12);
for(let ii=0; ii < test.length; ii++){
    test[ii] = new Array(12);
    test[ii][5] = wall; 
    console.log(ii)
}