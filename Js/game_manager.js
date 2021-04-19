document.addEventListener('keydown', onKeyEvent);
var finish_building_game = false;
let last_pacman_movement = 'up';
let before_last_pacman_movement = ' up';
let pac_velocity = 5;
let other_velocity = 5;
let game;
let rect_size;
let ctx;
let score;
let pac_color;
let start_time;
let time_elapsed;
let interval;
let empty_cell_lst;
let border_color_hex = '#0037d4';
const x_axis_size = 20;
const y_axis_size = 23;
const wall_matrix = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
  [-1,-1,-1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,-1,-1,-1],
  [-1,-1,-1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,-1,-1,-1],
  [1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1],
  [2,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,2],
  [1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1],
  [-1,-1,-1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,-1,-1,-1],
  [-1,-1,-1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,-1,-1,-1],
  [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

$(document).ready(function() {
  ctx = canvas.getContext("2d");
  let width = window.innerWidth/1.02;
  let height = window.innerHeight/1.2;
  let rect_width = width / x_axis_size;
  let rect_height = height / y_axis_size;
  rect_size = Math.min(rect_width,rect_height);
  canvas.width = width;
  canvas.height = height;
  game = new Game(wall_matrix,'./../assets/img/charry.png','./../assets/img/pacman.gif','./../assets/img/monsters/');
  game.start();
  finish_building_game = true;
  drawGame();
  startGame();
});


function startGame(){
  setInterval(()=>{
    if(game.canMovePacman(before_last_pacman_movement)){
      game.movePacman(before_last_pacman_movement);
    }
    else if(game.canMovePacman(last_pacman_movement)){
      game.movePacman(last_pacman_movement);
    }
    game.moveCharry();
    drawGame();
  },200);
}


function onKeyEvent(e) {
  let value, new_move;
  if(finish_building_game){
    switch(e.code){
      case 'ArrowLeft': value = game.canMovePacman('left');
        new_move = 'left';
        break;
      case 'ArrowRight': value = game.canMovePacman('right');
        new_move = 'right';
        break;
      case 'ArrowUp': value = game.canMovePacman('up');
        new_move = 'up';
        break;
      case 'ArrowDown': value = game.canMovePacman('down');
        new_move = 'down';
        break;
      case 'KeyA': value = game.canMovePacman('left');
        new_move = 'left';
        break;
      case 'KeyD': value = game.canMovePacman('right');
        new_move = 'right';
        break;
      case 'KeyW': value = game.canMovePacman('up');
        new_move = 'up';
        break;
      case 'KeyS': value = game.canMovePacman('down');
        new_move = 'down';
        break;
      default: break;
    }
    if(value){
      last_pacman_movement = new_move;
    }
    before_last_pacman_movement= new_move;
    drawGame();
  }
}

function clearDrawing() {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fill()
}

function drawGame() {
  clearDrawing();
  /* Draw Walls */
  drawWalls();
  /* Draw all regular point on board */
  drawRegularPoint();
  /* Draw Charry Character */
  drawCharry();
  /* Draw Main Character */
  drawPacman();
  /* Draw monster Character */
  drawMonsters();
}

function drawWalls(){
  let x_padding,y_padding;
  const spacing = 0;
  ctx.strokeStyle = border_color_hex;// set draw color
  ctx.lineWidth = 2;
  ctx.beginPath();
  game.wall_list.forEach(position => {
    let [y_index, x_index] = position;
    x_padding = rect_size*x_index;
    y_padding = rect_size*y_index;
    ctx.rect(x_padding, y_padding,rect_size-spacing,rect_size-spacing);
  });
  ctx.stroke();
}

function drawPacman(){
  const spacing = 0;
  let img = new Image();
 let [y_index, x_index] = game.getPacmanPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size;  img.src = game.getPacmanImgPath();
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}

function drawRegularPoint(){
  game.getRegularPoints().forEach(([score,position])=>{
    let [y_index,x_index] = position;
    let x_padding,y_padding;
    x_padding = x_index * rect_size + rect_size/2;
    y_padding = y_index * rect_size + rect_size/2;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x_padding,y_padding,rect_size/8,0,2 * Math.PI);
    ctx.fill();
  });
}

function drawMonsters(){
  const spacing = 0;
  let monsters = game.getMonstersPosition();
  let path = game.getMonsterFolderPath();
  let index = 0;
  monsters.forEach(monster_position=>{
    let [y_position,x_position] = monster_position;
    let x_padding,y_padding;
    let img = new Image();
    img.src = path + `${index}.png`;
    x_padding = x_position * rect_size;
    y_padding = y_position * rect_size;
    ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
    index++;
  });
 
}

function drawCharry(){
  const spacing = 0;
  let img = new Image();
  let [y_index, x_index] = game.getCharryPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size;
  if(!game.isCharryActivated()) return;
  img.src = game.getCharryImgPath();
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}

function Start() {
	board = new Array();// Create Board as Matrix
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date(); // set Start time
}

