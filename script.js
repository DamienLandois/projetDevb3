


var canvas = document.getElementById('leCanvas');
var ctx = canvas.getContext('2d');

var type = 'empty';
var ecart = 50; //largeur d'un côté des cases
var grid = new Array(12);
for(let ii=0; ii < grid.length; ii++){
    grid[ii] = new Array(12);
    console.log(ii)
}
function setUpCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //lignes
    for(var h = ecart ; h < canvas.height ; h += ecart) {
    ctx.moveTo(0, h);
    ctx.lineTo(canvas.width, h);
    }
    //colonnes
    for(var w = ecart ; w < canvas.width ; w += ecart) {
    ctx.moveTo(w, 0);
    ctx.lineTo(w, canvas.height);
    }
    ctx.stroke();
}

var handleCanvasClick = function (canvas, nb_x, nb_y, fct) {
 
    // Calcule les coordonnées d'un événement par rapport à un élément
    var offset = function (el, event) {
        var ox = -el.offsetLeft,
            oy = -el.offsetTop;
        while (el = el.offsetParent) {
                ox += el.scrollLeft - el.offsetLeft;
                oy += el.scrollTop - el.offsetTop;
            }
        return [event.clientX + ox, event.clientY + oy];
    };
     
    // Au clic sur le canvas
    canvas.onclick = function (e) {
        // On récupère les coordonnées relatives au canvas
        var coords = offset(canvas, e),
            x = Math.floor(coords[0] / canvas.width * nb_x), // et on convertit en "coordonnées de case"
            y = Math.floor(coords[1] / canvas.height * nb_y);
        // On appelle la fonction en lui passant les coordonnées
        fct(x, y);
    };
};

window.onload = function () {
    setUpCanvas()
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
        console.log(obj)
        ctx.fillStyle= obj.color;
        ctx.fillRect((x*50)+1, (y*50)+1, 48, 48);
        grid[x][y] = obj;
    });
};

function setType (type_selected) {
    type = type_selected;
}

var start = {
    name: 'start',
    set: false,
    x: undefined,
    y: undefined,
    color: 'yellow'
}

var end = {
    name: 'end',
    set: false,
    x: undefined,
    y: undefined,
    color: 'green'
}

var empty = {
    name: 'empty',
    color: 'white',
    speed: 1,
    through: true
}

var wall = {
    name: 'wall',
    color: 'black',
    speed: 0,
    through: false
};

var mud = {
    name: 'mud',
    color: 'brown',
    speed: 0.5,
    through: true
};

var trap = {
    name: 'trap',
    color: 'red',
    speed: 0.1,
    through: true
}

function reload(sauvegarde){
    setUpCanvas();
    grid = sauvegarde;
    for(x in grid){
        for(y in grid[x]){
            ctx.fillStyle= grid[x][y].color;
            ctx.fillRect((x*50)+1, (y*50)+1, 48, 48);
        }
    }
}

function save() {
    let json = grid.map(item => JSON.stringify(item))
    console.log(json);

}

var test = new Array(12);
for(let ii=0; ii < test.length; ii++){
    test[ii] = new Array(12);
    test[ii][5] = wall; 
    console.log(ii)
}