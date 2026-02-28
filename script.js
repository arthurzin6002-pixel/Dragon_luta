<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
  margin:0;
  overflow:hidden;
  touch-action:none;
  background: url("arena.jpg"); /* sua imagem de fundo */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

canvas{
  display:block;
  background: transparent; /* transparente pra deixar fundo aparecer */
}

.controls{
  position:absolute;
  bottom:10px;
  width:100%;
  display:flex;
  justify-content:space-between;
  padding:10px;
}

button{
  width:55px;
  height:55px;
  font-size:18px;
  border-radius:12px;
  border:none;
}
</style>
</head>
<body>

<canvas id="game"></canvas>

<div class="controls">
  <div>
    <button onclick="moveLeft()">⬅</button>
    <button onclick="moveRight()">➡</button>
    <button onclick="jump()">⬆</button>
    <button onclick="block()">🛡</button>
  </div>
  <div>
    <button onclick="attack()">👊</button>
    <button id="specialBtn">🔥</button>
  </div>
</div>

<script>
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let gravity=0.8;
let beamActive=false;
let specialUnlocked=false;

let player={
  x:120,
  y:canvas.height-150,
  vy:0,
  color:"cyan",
  punching:false,
  blocking:false,
  life:100
};

let enemy={
  x:600,
  y:canvas.height-150,
  vy:0,
  color:"red",
  punching:false,
  blocking:false,
  life:100
};

function drawStickman(p){
  ctx.strokeStyle=p.blocking ? "gray" : p.color;
  ctx.lineWidth=4;

  ctx.beginPath();
  ctx.arc(p.x,p.y-40,15,0,Math.PI*2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p.x,p.y-25);
  ctx.lineTo(p.x,p.y+20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p.x,p.y-10);
  if(p.punching){
    ctx.lineTo(p.x+30,p.y-20);
  }else{
    ctx.lineTo(p.x+20,p.y);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p.x,p.y-10);
  ctx.lineTo(p.x-20,p.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p.x,p.y+20);
  ctx.lineTo(p.x+15,p.y+50);
  ctx.moveTo(p.x,p.y+20);
  ctx.lineTo(p.x-15,p.y+50);
  ctx.stroke();
}

function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // gravidade
  player.vy+=gravity;
  player.y+=player.vy;
  if(player.y>canvas.height-150){
    player.y=canvas.height-150;
    player.vy=0;
  }

  enemy.vy+=gravity;
  enemy.y+=enemy.vy;
  if(enemy.y>canvas.height-150){
    enemy.y=canvas.height-150;
    enemy.vy=0;
  }

  // IA movimento
  if(enemy.x>player.x+80) enemy.x-=2;
  if(enemy.x<player.x-80) enemy.x+=2;

  // IA ataque
  if(Math.abs(enemy.x-player.x)<60){
    enemy.punching=true;
    if(!player.blocking){
      player.life-=0.2;
    }
  }else{
    enemy.punching=false;
  }

  // desbloqueia Kamehameha após tirar 50 de vida
  if(enemy.life<=50){
    specialUnlocked=true;
  }

  // KAMEHAMEHA
  if(beamActive && specialUnlocked){
    ctx.strokeStyle="cyan";
    ctx.lineWidth=8;
    ctx.beginPath();
    ctx.moveTo(player.x+20,player.y-20);
    ctx.lineTo(player.x+250,player.y-20);
    ctx.stroke();

    if(Math.abs(enemy.x-player.x)<250 && !enemy.blocking){
      // não deixa morrer, sempre deixa pelo menos 5 de vida
      if(enemy.life>5){
        enemy.life-=0.6;
      }
    }
  }

  drawLifeBars();
  drawStickman(player);
  drawStickman(enemy);

  checkGameOver();
  requestAnimationFrame(update);
}

function drawLifeBars(){
  ctx.fillStyle="lime";
  ctx.fillRect(20,20,player.life*2,15);
  ctx.fillRect(canvas.width-220,20,enemy.life*2,15);
}

function moveLeft(){ player.x-=15; }
function moveRight(){ player.x+=15; }

function jump(){
  if(player.vy===0){
    player.vy=-15;
  }
}

function block(){
  player.blocking=true;
  setTimeout(()=>player.blocking=false,500);
}

function attack(){
  player.punching=true;
  setTimeout(()=>player.punching=false,200);

  if(Math.abs(player.x-enemy.x)<60){
    if(!enemy.blocking){
      enemy.life-=5;
    }
  }
}

// tocar botão do Kamehameha
document.getElementById("specialBtn").addEventListener("touchstart",()=>{
  if(specialUnlocked){
    beamActive=true;
  }
});
document.getElementById("specialBtn").addEventListener("touchend",()=>{
  beamActive=false;
});

function checkGameOver(){
  if(player.life<=0){
    alert("Você perdeu!");
    location.reload();
  }
  if(enemy.life<=0){
    alert("Você venceu!");
    location.reload();
  }
}

update();
</script>
</body>
</html>