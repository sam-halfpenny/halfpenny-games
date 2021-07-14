window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
balls=[]
class Handler{
    constructor(dodger) {
        document.addEventListener("keydown", event=> {
            switch (event.keyCode) {
                case 37:
                    rotationfactor++
                    break;
                case 39:
                    rotationfactor--
                    break;
                case 38:
                    tiltfactor++
                    break
                case 40:
                    tiltfactor--
                    break
                case 32:
                    kill=true
                    break
                case 65:
                    dodger.moveLeft()
                    break
                case 68:
                    dodger.moveRight()
                    break
                case 87:
                    dodger.moveFwd()
                    break
                case 83:
                    dodger.moveBwd()
                    break
                case 82:
                    dodger.moveup()
                    break
                case 67:
                    dodger.movedown()
                    break
            }
        });
    }
}
class ball{
    constructor(gamesize,speed){
        this.gamesize=gamesize
        this.position={x:0,y:0,z:0}
        this.size=10
        this.speed=speed
        this.relpoints=[
            {x:this.size/2,y:this.size/2,z:this.size/2},
            {x:-this.size/2,y:this.size/2,z:this.size/2},
            {x:this.size/2,y:-this.size/2,z:this.size/2},
            {x:-this.size/2,y:-this.size/2,z:this.size/2},
            {x:this.size/2,y:this.size/2,z:-this.size/2},
            {x:-this.size/2,y:this.size/2,z:-this.size/2},
            {x:this.size/2,y:-this.size/2,z:-this.size/2},
            {x:-this.size/2,y:-this.size/2,z:-this.size/2},
        ]
        this.faces=[
            [0,1,3,2],
            [4,5,7,6],
            [2,3,7,6],
            [1,3,7,5],
            [0,1,5,4],
            [0,2,6,4]
        ]
        this.points=[]
        var i
        for(i=0;i<this.relpoints.length;i++){
            this.points.push({x:this.position.x+this.relpoints[i].x,y:this.position.y+this.relpoints[i].y,z:this.position.z+this.relpoints[i].z})
        }
    }
    draw(ctx){
        Bdraw3D(this.points,this.faces)
    }
    update(deltaTime) {
        this.position.x+=this.speed.x
        this.position.y+=this.speed.y
        this.position.z+=this.speed.z
        for(i=0;i<this.points.length;i++){
            this.points[i]={x:this.position.x+this.relpoints[i].x,y:this.position.y+this.relpoints[i].y,z:this.position.z+this.relpoints[i].z}
        }
        if(this.position.x<this.size/2){
            this.position.x=this.size/2
            this.speed.x=-this.speed.x
        }
        if(this.position.y<this.size/2){
            this.position.y=this.size/2
            this.speed.y=-this.speed.y
        }
        if(this.position.z<this.size/2){
            this.position.z=this.size/2
            this.speed.z=-this.speed.z
        }
        if(this.position.x>this.gamesize-this.size/2){
            this.position.x=this.gamesize-this.size/2
            this.speed.x=-this.speed.x
        }
        if(this.position.y>this.gamesize-this.size/2){
            this.position.y=this.gamesize-this.size/2
            this.speed.y=-this.speed.y
        }
        if(this.position.z>this.gamesize-this.size/2){
            this.position.z=this.gamesize-this.size/2
            this.speed.z=-this.speed.z
        }
    }
}
class dodger{
    constructor(gamesize){
        this.gamesize=gamesize
        this.position={x:G,y:G,z:G}
        this.size=50
        this.relpoints=[
            {x:this.size/2,y:this.size/2,z:this.size/2},
            {x:-this.size/2,y:this.size/2,z:this.size/2},
            {x:this.size/2,y:-this.size/2,z:this.size/2},
            {x:-this.size/2,y:-this.size/2,z:this.size/2},
            {x:this.size/2,y:this.size/2,z:-this.size/2},
            {x:-this.size/2,y:this.size/2,z:-this.size/2},
            {x:this.size/2,y:-this.size/2,z:-this.size/2},
            {x:-this.size/2,y:-this.size/2,z:-this.size/2},
        ]
        this.faces=[
            [0,1,3,2],
            [4,5,7,6],
            [2,3,7,6],
            [1,3,7,5],
            [0,1,5,4],
            [0,2,6,4]
        ]
        this.points=[]
        var i
        for(i=0;i<this.relpoints.length;i++){
            this.points.push({x:this.position.x+this.relpoints[i].x,y:this.position.y+this.relpoints[i].y,z:this.position.z+this.relpoints[i].z})
        }
    }
    draw(ctx){
        Bdraw3D(this.points,this.faces)
    }
    moveLeft(){
        this.position.x-=5
    }
    moveRight(){
        this.position.x+=5
    }
    moveFwd(){
        this.position.y-=5
    }
    moveBwd(){
        this.position.y+=5
    }
    moveup(){
        this.position.z-=5
    }
    movedown(){
        this.position.z+=5
    }
    stopx(){
        this.speed.x=0;
    }
    stopy(){
        this.speed.y=0
    }
    update(deltaTime) {
        for(i=0;i<this.points.length;i++){
            this.points[i]={x:this.position.x+this.relpoints[i].x,y:this.position.y+this.relpoints[i].y,z:this.position.z+this.relpoints[i].z}
        }
        if(this.position.x<this.size/2){
            this.position.x=this.size/2
        }
        if(this.position.y<this.size/2){
            this.position.y=this.size/2
        }
        if(this.position.z<this.size/2){
            this.position.z=this.size/2
        }
        if(this.position.x>this.gamesize-this.size/2){
            this.position.x=this.gamesize-this.size/2
        }
        if(this.position.y>this.gamesize-this.size/2){
            this.position.y=this.gamesize-this.size/2
        }
        if(this.position.z>this.gamesize-this.size/2){
            this.position.z=this.gamesize-this.size/2
        }
        balls.forEach(ball=>{
            if(this.position.x-this.size/2<ball.position.x && ball.position.x<this.position.x+this.size/2){
                if(this.position.y-this.size/2<ball.position.y && ball.position.y<this.position.y+this.size/2){
                    if(this.position.z-this.size/2<ball.position.z && ball.position.z<this.position.z+this.size/2){
                        kill=true
                        console.log('hi')
                    }
                }
            }
        })
    }
}
let kill=false
let perspective=100
let scalefactor=Math.sqrt(3)
let rotationfactor=225
let tiltfactor=35
function iso_map(pos){
    let isopos
    let offset=G-pos.z
    let noffset=offset/scalefactor
    let pseudotiltfactor=tiltfactor*(Math.PI/180)
    let nepicenter={
        x:epicenter.x,
        y:epicenter.y-((noffset)*Math.cos(pseudotiltfactor))
    }
    let relpos=pndiff(pos,epicenter)
    isopos=scale_point(squash_point(rotate_point(relpos,rotationfactor),tiltfactor),scalefactor)
    let final={
        x:isopos.x+nepicenter.x,
        y:isopos.y+nepicenter.y
    }
    return final
}
function scale_point(point,scale){
    let Matrix=[
        [1/scale,0],
        [0,1/scale],
    ]
    let npoint={
        x:point.x*Matrix[0][0]+point.y*Matrix[0][1],
        y:point.x*Matrix[1][0]+point.y*Matrix[1][1]
    }
    return npoint
}
function rotate_point(point,ang){
    angle=ang*(Math.PI/180)
    let Matrix=[
        [Math.cos(angle),-Math.sin(angle)],
        [Math.sin(angle),Math.cos(angle)]
    ]
    let npoint={
        x:point.x*Matrix[0][0]+point.y*Matrix[0][1],
        y:point.x*Matrix[1][0]+point.y*Matrix[1][1]
    }
    return npoint
}
function squash_point(point,squash){
    let dsquash=squash*(Math.PI/180)
    let rotsquash=Math.sin(dsquash)
    let Matrix=[
        [1,0],
        [0,rotsquash]
    ]
    let npoint={
        x:point.x*Matrix[0][0]+point.y*Matrix[0][1],
        y:point.x*Matrix[1][0]+point.y*Matrix[1][1]
    }
    return npoint
}
function add_perspective(point,perspective){
    let z = GAME_SIZE-point.z
    let npoint={
        x:(point.x*perspective)/z,
        y:(point.y*perspective)/z,
        z:0
    }
    return npoint
}
function Bdraw(points){
    var i
    for(i=0;i<points.length-1;i++){
        JTD(points[i],points[i+1])
    }
    JTD(points[points.length-1],points[0])
}
function Bdraw3D(points,faces){
    var isopoints=[]
    var fpoints=[]
    for(var i=0;i<points.length;i++){
        isopoints.push(iso_map(points[i]))
    }
    for(i=0;i<faces.length;i++){
        fpoints=[]
        for(var j=0;j<faces[i].length;j++){
            fpoints.push(isopoints[faces[i][j]])
        }
        Bdraw(fpoints)
        
    }
}
function pndiff(p1,p2){
    dist={x:p1.x-p2.x,y:p1.y-p2.y}
    return dist
}
function pndiff3D(p1,p2){
    dist={x:p1.x-p2.x,y:p1.y-p2.y,z:p1.z-p2.z}
    return dist
}
function JTD(p1,p2){
    if(pndiff(p1,p2).x>=0){
        angle=pnanglefinder(p1,p2)+180
    }
    else{
        angle=pnanglefinder(p1,p2)
    }
    
    dist=Math.sqrt(Math.pow(diff(p1,p2).x,2)+Math.pow(diff(p1,p2).y,2))
    drawline(p1,angle,dist)
}
function angularmov(ang,speed){
    rang=ang*(Math.PI/180)
    xymot={
        x:0,
        y:0
    }
    xymot.y=speed*Math.sin(rang)
    xymot.x=speed*Math.cos(rang)
    return xymot
}
function pnanglefinder(p1,p2){
    dist=pndiff(p1,p2)
    rang=Math.atan(dist.y/dist.x)
    ang=rang/(Math.PI/180)
    return ang
}
function diff(p1,p2){
    dist={x:0,y:0}
    if(p1.x>p2.x){
        dist.x=p1.x-p2.x
    }
    else{
        dist.x=p2.x-p1.x
        // dist.sector+=10
    }
    if(p1.y>p2.y){
        dist.y=p1.y-p2.y
    }
    else{
        dist.y=p2.y-p1.y
        // dist.sector++
    }
    return dist

}
function drawline(origin,ang,length){
    for(i=0;i<length;i++){
        pos=angularmov(ang,i)
        ctx.fillRect(origin.x+pos.x,origin.y+pos.y,2,2)
    }
}
let canvas = document.getElementById("gamescreen")
let ctx = canvas.getContext('2d')


const GAME_SIZE=600
const G=GAME_SIZE/2
const epicenter={x:G,y:G}
const epicenter3D={x:G,y:G,z:G}
dodger1 = new dodger(GAME_SIZE)
for(var i=0;i<10;i++){
    let nball= new ball(GAME_SIZE,{x:Math.random()*10+5,y:Math.random()*10+5,z:Math.random()*10+5})
    balls.push(nball)
}
new Handler(dodger1);
let borderpoints=[
    {x:GAME_SIZE,y:GAME_SIZE,z:GAME_SIZE},
    {x:0,y:GAME_SIZE,z:GAME_SIZE},
    {x:GAME_SIZE,y:0,z:GAME_SIZE},
    {x:0,y:0,z:GAME_SIZE},
    {x:GAME_SIZE,y:GAME_SIZE,z:0},
    {x:0,y:GAME_SIZE,z:0},
    {x:GAME_SIZE,y:0,z:0},
    {x:0,y:0,z:0}
]
let faces = [
    [0,1,3,2],
    [4,5,7,6],
    [2,3,7,6],
    [1,3,7,5],
    [0,1,5,4],
    [0,2,6,4]
]
let lastTime = 0
let loop=0
function gameloop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    loop++
    if(kill){
        ctx.fillStyle='#f00'
    }
    ctx.clearRect(0,0,600,600);
    Bdraw3D(borderpoints,faces)
    dodger1.draw(ctx)
    if(!kill){
        document.getElementById('score').textContent=
            'score:'+loop;
        dodger1.update()
    }
    balls.forEach(ball=>{
        ball.draw(ctx)
        if(!kill){
            ball.update()
        }
    })
    requestAnimationFrame(gameloop)
}
requestAnimationFrame(gameloop)