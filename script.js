//canvas 1
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//canvas2
const canvasbg = document.getElementById('canvasbg');
const ctxbg = canvasbg.getContext('2d');
canvasbg.width = window.innerWidth;
canvasbg.height = window.innerHeight;



let bubbles = [];
let bgbubbles = [];

function addBubble() {
    bubbles.push(new Bubble('rgb(185,224,254)',2.05));
}
function addBgBubble() {
    bgbubbles.push(new Bubble('rgb(156,221,255)',2.0));
}

class Bubble{
    constructor(color,ySpeed){
        this.radius = (Math.random()*150) + 30;
        this.life = true;
        this.x = (Math.random()*window.innerWidth);
        this.y = (Math.random()*20)+window.innerHeight+this.radius;
        this.vy = (Math.random()*0.002+0.001)+ySpeed;
        this.vr = 0;
        this.color = color;
        this.vx = (Math.random()*4)-2;
    }
    update(){
        this.vy += 0.00001;
        this.vr += 0.02;
        this.y -= this.vy;
        this.x += this.vx;
        if (this.radius > 1) {
            this.radius -= this.vr;
        }
        if (this.radius <= 1) {
            this.life = false;
        }
    }
    draw(currentCanvas){
        currentCanvas.beginPath();
        currentCanvas.arc(this.x,this.y,this.radius,0,Math.PI*2);
        currentCanvas.fillStyle = this.color;
        currentCanvas.fill();

    }
}

function handleBubbles() {
    for (let i = bubbles.length-1; i >= 0 ; i--) {
       bubbles[i].update();
       if (!bubbles[i].life) {
           bubbles.splice(i,1);
       }
    }
    for (let i = bgbubbles.length-1; i >= 0 ; i--) {
        bgbubbles[i].update();
        if (!bgbubbles[i].life) {
            bgbubbles.splice(i,1);
        }
     }
     if (bubbles.length < (window.innerWidth/4)) {
         addBubble();
     }
     if (bgbubbles.length < (window.innerWidth/12)) {
        addBgBubble();
    }
}

window.addEventListener('resize',function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasbg.width = window.innerWidth;
    canvasbg.height = window.innerHeight;
    bubbles = [];
    bgbubbles = [];
    init();
    Cir();


});

function ground() {
    ctxbg.beginPath();
    ctxbg.fillStyle = 'rgb(109, 70, 50)';
    ctxbg.arc(window.innerWidth,window.innerHeight,150,0,Math.PI*2);
    ctxbg.arc(window.innerWidth-140,window.innerHeight,50,0,Math.PI*2);
    ctxbg.fill();
    ctxbg.beginPath();   
}
function drawTree(startX,startY,len,angle,branchWidth,color1,color2) {
    
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = color2;
    ctx.strokeStyle = color1;  
    ctx.shadowBlur=10;
    ctx.shadowColor='rgba(255,255,255,0.5)' ; 
    ctx.lineWidth = branchWidth;
    ctx.translate(startX,startY);
    ctx.rotate(angle*Math.PI/180);
    ctx.moveTo(0,0);
    
    if (angle > 0) {
        ctx.bezierCurveTo(10,-len/2,10,-len/2,0,-len);  
    }else{
        ctx.bezierCurveTo(10,-len/2,-10,-len/2,0,-len);
    }
    ctx.stroke();
    if (len < 10) {
        ctx.beginPath();
        ctx.arc(0,-len,10,0,Math.PI/2);
        ctx.fill();
        ctx.restore();
        return;
    }
    drawTree(0,-len,len*0.75,angle+4,branchWidth*0.6);
    drawTree(0,-len,len*0.75,angle-15,branchWidth*0.6);
    ctx.restore(); 
}
class Particle{
    constructor(moveRadius,step,position,size){
        this.moveRadius = moveRadius;
        this.size = size;
        this.step = step;
        this.position = position;
    }
    draw(){

        let x = Math.cos(this.position)*this.moveRadius+canvas.width/2;
        let y = Math.sin(this.position)*this.moveRadius*0.5+100;
        drawStar(x,y,5,this.size,this.size/2);
        ctxbg.fillStyle = 'white';
        ctxbg.fill();
        
    }
    update(){
        this.position += this.step;
        this.draw();
    }
}


function drawStar(positionX,positionY,spikes,outerRadius,innerRadius) {
    let rotation = Math.PI/2 * 3;
    let x = positionX;
    let y = positionY;
    let step = Math.PI / spikes;

    ctxbg.beginPath();
    ctxbg.moveTo(positionX,positionY-outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = positionX + Math.cos(rotation) * outerRadius;
        y = positionY + Math.sin(rotation) * outerRadius;
        ctxbg.lineTo(x,y);
        rotation += step;

        x = positionX + Math.cos(rotation) * innerRadius;
        y = positionY + Math.sin(rotation) * innerRadius;
        ctxbg.lineTo(x,y);
        rotation += step;
    }
    ctxbg.closePath();
}

let particleArray = [];
function init() {
    particleArray = [];
    for (let i = 0; i < 20; i++) {
       let moveRadius = Math.random()*canvas.width;
       let step = (Math.random()*0.002+0.0002);
       let position = Math.random()*(Math.PI*2);
       let size  = (Math.random()*4)+2;
       particleArray.push(new Particle(moveRadius,step,position,size));
       
    }
}
init();

class circle{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = Math.random()*0.5 + 2;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
let cir = [];
function Cir() {
    for (let i = 0; i < 26; i++) {
       cir.push(new circle( Math.random()*canvas.width, Math.random()*canvas.height-250));
    }
}
Cir();
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctxbg.clearRect(0,0,canvasbg.width,canvasbg.height);
    
    handleBubbles();
    for (let i = bubbles.length-1; i >= 0 ; i--) {
        bubbles[i].draw(ctx);
     }
     for (let i = bgbubbles.length-1; i >= 0 ; i--) {
         bgbubbles[i].draw(ctxbg);
      }
      requestAnimationFrame(animate);
      ground();
      drawTree(canvas.width-80,canvas.height-80,80,0,15,'brown','green');
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();   
        particleArray[i].update();  
    }
    for (let i = 0; i < cir.length; i++) {
        cir[i].draw();
        
    }
}

//window.addEventListener('load',animate);
window.onload=function () {
    
    const btn1 = document.getElementById("btn");
    btn1.addEventListener("click",function () {
    document.getElementById('moon').style.display = 'block';
    document.getElementById('foot').style.display = 'none';
    document.body.style.background = 'linear-gradient(to bottom,black 0%,rgb(47, 47, 47) 100%)'
    animate();
    })
}
