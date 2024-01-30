rows = 5;
cols = 5;
//Labirynth single entry is an string that says where you can go from it U-up R-right D-down L-left
//special are S-start and E-end
labirynth = new Array(rows);
function createLabirynth() {
    for(var i1 = 0; i1 < rows; i1++)labirynth[i1] = new Array(cols);
    for(i1 = 0; i1 < rows; i1++)for(j = 0; j < cols; j++)labirynth[i1][j] = {
        up: false,
        down: false,
        left: false,
        right: false,
        special: false,
        start: false,
        exit: false,
        hall: false
    };
    labirynth[0][0].start = true;
    labirynth[0][0].down = true;
    labirynth[0][0].special = true;
    labirynth[rows - 1][cols - 1].exit = true;
    labirynth[rows - 1][cols - 1].left = true;
    labirynth[rows - 1][cols - 1].special = true;
    pointer = {
        x: 0,
        y: 0
    };
    labirynth[1][0].down = true;
    labirynth[1][0].up = true;
    labirynth[2][0].right = true;
    labirynth[2][0].up = true;
    labirynth[2][1].left = true;
    labirynth[2][1].up = true;
    labirynth[2][1].down = true;
    labirynth[3][1].left = true;
    labirynth[3][1].up = true;
    labirynth[3][4].up = true;
    labirynth[3][0].right = true;
    labirynth[3][0].down = true;
    labirynth[4][0].hall = true;
    labirynth[4][0].right = true;
    labirynth[4][0].up = true;
    labirynth[4][0].special = true;
    labirynth[4][1].left = true;
    labirynth[4][1].right = true;
    labirynth[4][2].hall = true;
    labirynth[4][2].left = true;
    labirynth[4][2].special = true;
    labirynth[1][1].down = true;
    labirynth[1][1].right = true;
    labirynth[1][2].hall = true;
    labirynth[1][2].left = true;
    labirynth[1][2].up = true;
    labirynth[1][2].special = true;
    labirynth[0][2].down = true;
    labirynth[0][2].left = true;
    labirynth[0][2].right = true;
    labirynth[0][1].right = true;
    labirynth[0][3].left = true;
    labirynth[0][3].right = true;
    labirynth[0][4].left = true;
    labirynth[0][4].down = true;
    labirynth[1][4].up = true;
    labirynth[1][4].down = true;
    labirynth[2][4].up = true;
    labirynth[2][4].down = true;
    labirynth[2][4].left = true;
    labirynth[2][3].right = true;
    labirynth[2][3].up = true;
    labirynth[2][3].down = true;
    labirynth[1][3].down = true;
    labirynth[1][3].up = false;
    labirynth[3][3].hall = true;
    labirynth[3][3].up = true;
    labirynth[3][3].down = true;
    labirynth[3][3].special = true;
    labirynth[4][3].up = true;
    labirynth[4][3].right = true;
}
function printLabirynth() {
    string = "";
    for(i = 0; i < rows; i++)for(b = 0; b < 3; b++){
        for(j = 0; j < cols; j++){
            let tile = labirynth[i][j];
            if (b == 0) {
                if (!tile.special) {
                    if (tile.up) string += "# #";
                    else string += "###";
                }
                if (tile.special) string += "   ";
            } else if (b == 1) {
                if (!tile.special) {
                    if (tile.left) string += "  ";
                    else if (!tile.right && !tile.down && !tile.right) string += "##";
                    else string += "# ";
                }
                if (!tile.special) {
                    if (tile.right) string += " ";
                    else string += "#";
                }
                if (tile.start) string += " S ";
                if (tile.exit) string += " E ";
                if (tile.hall) string += "   ";
            } else {
                if (!tile.special) {
                    if (tile.down) string += "# #";
                    else string += "###";
                }
                if (tile.special) string += "   ";
            }
        }
        string += "\n";
    }
    console.log(string);
}
function makeWorld(comnats, scene) {
    createLabirynth();
    printLabirynth();
    for(i = 0; i < rows; i++)for(j = 0; j < cols; j++){
        let cell = labirynth[i][j];
        if (cell.hall || cell.start || cell.exit) comnats.children.forEach((c)=>{
            if (c.name == "Hall") {
                let newHall = c.clone();
                scene.add(newHall);
                newHall.position.x = i * 20;
                newHall.position.z = j * 20;
                if (cell.right) newHall.children[8].translateY(500);
                if (cell.up) newHall.children[9].translateY(500);
                if (cell.left) newHall.children[10].translateY(500);
                if (cell.down) newHall.children[11].translateY(500);
            }
        });
        if (cell.up && cell.down && !cell.right && !cell.left && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "IShape") {
                let newIshape = c.clone();
                scene.add(newIshape);
                newIshape.position.x = i * 20;
                newIshape.position.z = j * 20;
            }
        });
        if (!cell.up && !cell.down && cell.right && cell.left && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "IShape") {
                let newIshape = c.clone();
                scene.add(newIshape);
                newIshape.position.x = i * 20;
                newIshape.position.z = j * 20;
                newIshape.rotateY(Math.PI / 2);
            }
        });
        if (cell.up && cell.right && !cell.down && !cell.left && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "LShape") {
                let newLshape = c.clone();
                scene.add(newLshape);
                newLshape.position.x = i * 20;
                newLshape.position.z = j * 20;
            }
        });
        if (cell.up && cell.left && !cell.down && !cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "LShape") {
                let newLshape = c.clone();
                scene.add(newLshape);
                newLshape.position.x = i * 20;
                newLshape.position.z = j * 20;
                newLshape.rotateZ(Math.PI / 2);
            }
        });
        if (!cell.up && cell.left && cell.down && !cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "LShape") {
                let newLshape = c.clone();
                scene.add(newLshape);
                newLshape.position.x = i * 20;
                newLshape.position.z = j * 20;
                newLshape.rotateZ(Math.PI);
            }
        });
        if (cell.right && cell.down && !cell.left && !cell.up && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "LShape") {
                let newLshape = c.clone();
                scene.add(newLshape);
                newLshape.position.x = i * 20;
                newLshape.position.z = j * 20;
                newLshape.rotateZ(Math.PI / 2 * 3);
            }
        });
        if (cell.left && cell.up && cell.down && !cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "TShape") {
                let newTshape = c.clone();
                scene.add(newTshape);
                newTshape.position.x = i * 20;
                newTshape.position.z = j * 20;
                newTshape.rotateZ(Math.PI);
            }
        });
        if (cell.left && !cell.up && cell.down && cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "TShape") {
                let newTshape = c.clone();
                scene.add(newTshape);
                newTshape.position.x = i * 20;
                newTshape.position.z = j * 20;
                newTshape.rotateZ(Math.PI / 2 * 3);
            }
        });
        if (!cell.left && cell.up && cell.down && cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "TShape") {
                let newTshape = c.clone();
                scene.add(newTshape);
                newTshape.position.x = i * 20;
                newTshape.position.z = j * 20;
            }
        });
        if (!cell.left && !cell.up && !cell.down && cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "End") {
                let newEndshape = c.clone();
                scene.add(newEndshape);
                newEndshape.position.x = i * 20;
                newEndshape.position.z = j * 20;
                newEndshape.rotateY(Math.PI / 2);
            }
        });
        if (!cell.left && cell.up && !cell.down && !cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "End") {
                let newEndshape = c.clone();
                scene.add(newEndshape);
                newEndshape.position.x = i * 20;
                newEndshape.position.z = j * 20;
            }
        });
        if (!cell.left && !cell.up && cell.down && !cell.right && !cell.special) comnats.children.forEach((c)=>{
            if (c.name == "End") {
                let newEndshape = c.clone();
                scene.add(newEndshape);
                newEndshape.position.x = i * 20;
                newEndshape.position.z = j * 20;
                newEndshape.rotateY(Math.PI);
            }
        });
    }
}

//# sourceMappingURL=index.cf0bb904.js.map
