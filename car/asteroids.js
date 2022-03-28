const GAME_WIDTH=1500
const GAME_HEIGHT=600
let linearobs=[{p1:{x:0,y:0},p2:{x:0,y:GAME_HEIGHT}},{p1:{x:0,y:0},p2:{x:GAME_WIDTH,y:0}},{p1:{x:GAME_WIDTH,y:0},p2:{x:GAME_WIDTH,y:GAME_HEIGHT}},{p1:{x:0,y:GAME_HEIGHT},p2:{x:GAME_WIDTH,y:GAME_HEIGHT}}]
const cof=0.9
const cor=0.4
const rigidity=2
const dampening=0.3
let score=0
let power=0.5
let track=[]
let COMposition={x:0,y:0}
let offset=10
class wheel{
    constructor(gamewidth,gameheight){
        this.gameheight=gameheight
        this.gamewidth=gamewidth
        this.position={x:GAME_WIDTH/2,y:300}
        this.speed={x:0,y:0}
        this.rspeed=0
        this.size=10
        this.maxSpeed=2
        this.drive=0
    }
    draw(){
        DrawCircle(this.size,this.position,ctx,1)
    }
    update(deltaTime) {
        if(!deltaTime) return;
        // console.log(this.rotated)
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.speed.y+=0.3
        let cvector
        let lvector
        let dp
        let cdot
        for(var i=0;i<linearobs.length;i++){
            cvector=pndiff(this.position,linearobs[i].p1)
            lvector=pndiff(linearobs[i].p2,linearobs[i].p1)
            dp=(dot_product(unit_vector(lvector),unit_vector(cvector))*mag(cvector))/mag(lvector)
            cdot={x:linearobs[i].p1.x+(lvector.x*dp),y:linearobs[i].p1.y+(lvector.y*dp)}
            if(CircleDetect(this.position,this.size,cdot) && (dp>0 && dp<1)){
                let A=pndiff(this.position,cdot)
                this.position={x:cdot.x+unit_vector(A).x*this.size,y:cdot.y+unit_vector(A).y*this.size}
                let Ar={x:A.x,y:-A.y}
                let recspeed=recoordinate(this.speed,A)
                this.speed=recoordinate({x:-recspeed.x*cor,y:recspeed.y+this.drive},Ar)
            }
        }
        for(var i=0;i<linearobs.length;i++){
            if(CircleDetect(this.position,this.size,linearobs[i].p1)){
                let A=pndiff(this.position,linearobs[i].p1)
                let Ar={x:A.x,y:-A.y}
                let recspeed=recoordinate(this.speed,A)
                this.speed=recoordinate({x:-recspeed.x*cor,y:recspeed.y+this.drive},Ar)
            }
            else if(CircleDetect(this.position,this.size,linearobs[i].p2)){
                let A=pndiff(this.position,linearobs[i].p2)
                let Ar={x:A.x,y:-A.y}
                let recspeed=recoordinate(this.speed,A)
                this.speed=recoordinate({x:-recspeed.x*cor,y:recspeed.y+this.drive},Ar)
            }
        }
    }
}
function landscapemov(offset){
    let roffset=Math.floor(offset/3)
    // let extraoffset=Math.floor(offset)%3
    for(var i=4;i<linearobs.length;i++){
        linearobs[i]={p1:{x:i*gap,y:GAME_HEIGHT-track[i+roffset]*1.25},p2:{x:(i+1)*gap,y:GAME_HEIGHT-track[i+roffset+1]*1.25}}
    }
}
function accel_change(pos,accel,r){
    n=0
    if(50<pos && pos<150){
        //console.log("low")
        switch(r){
            case 0:
                n=accel+1
                break
            case 1:
                n=accel
                break
            case 2:
                n=accel-0.3
                break
        }
    }
    else if(250>pos && pos>150){
        //console.log("high")
        switch(r){
            case 0:
                n=accel-1
                break
            case 1:
                n=accel
                break
            case 2:
                n=accel+0.3
                break
        }
    }
    else if(pos>250){
        //console.log("VERY HIGH")
        switch(r){
            case 0:
                n=accel-1
                break
            case 1:
                n=accel
                break
            case 2:
                n=accel
                break
        }
    }
    else if(pos<50){
        //console.log("VERY LOW")
        switch(r){
            case 0:
                n=accel+1
                break
            case 1:
                n=accel
                break
            case 2:
                n=accel
                break
        }
    }
    else{
        //console.log("normal")
        switch(r){
            case 0:
                n=accel+1
                break
            case 1:
                n=accel
                break
            case 2:
                n=accel-1
                break
        }
    }
    if(n>8 || n<-8){
        n=n/2
    }
    return n
}
function random_map(){
    let levs=GAME_HEIGHT/3
    let reps=GAME_WIDTH*20
    track=[Math.floor(Math.random()*(levs/3))+levs/3]
    let accel=0
    let sped=0
    for(i=1;i<reps;i++){
        prev=track[i-1]
        r=Math.floor(Math.random()*3)
        sped=accel_change(prev,sped,r,levs)
        track.push(prev+sped/3)
    }
}
function com(){
    let wvector = pndiff(frontwheel.position,backwheel.position)
    COMposition={x:backwheel.position.x+wvector.x/2,y:backwheel.position.y+wvector.y/2}
    let fwdivvector=unit_vector(pndiff(frontwheel.position,COMposition))
    let bwdivvector=unit_vector(pndiff(backwheel.position,COMposition))
    let bwmag=mag(pndiff(backwheel.position,COMposition))-25
    let fwmag=mag(pndiff(frontwheel.position,COMposition))-25
    let bwacc=mag(pndiff(backwheel.position,COMposition))>25
    let fwacc=mag(pndiff(frontwheel.position,COMposition))>25
    if(bwacc){
        backwheel.speed={x:backwheel.speed.x-bwdivvector.x*rigidity,y:backwheel.speed.y-bwdivvector.y*rigidity}
    }
    else{
        backwheel.speed={x:backwheel.speed.x+bwdivvector.x*rigidity,y:backwheel.speed.y+bwdivvector.y*rigidity}
    }
    if(fwacc){
        frontwheel.speed={x:frontwheel.speed.x-fwdivvector.x*rigidity,y:frontwheel.speed.y-fwdivvector.y*rigidity}
    }
    else{
        frontwheel.speed={x:frontwheel.speed.x+fwdivvector.x*rigidity,y:frontwheel.speed.y+fwdivvector.y*rigidity}
    }
    let carspeed={x:(backwheel.speed.x+frontwheel.speed.x)/2,y:(backwheel.speed.y+frontwheel.speed.y)/2}
    let cfws=recoordinate(pndiff(frontwheel.speed,carspeed),fwdivvector)
    let cbws=recoordinate(pndiff(backwheel.speed,carspeed),bwdivvector)
    let fws=recoordinate({x:cfws.x*dampening,y:cfws.y},revert_vector(fwdivvector))
    let bws=recoordinate({x:cbws.x*dampening,y:cbws.y},revert_vector(bwdivvector))
    frontwheel.speed={x:fws.x+carspeed.x,y:fws.y+carspeed.y}
    backwheel.speed={x:bws.x+carspeed.x,y:bws.y+carspeed.y}
}
function revert_vector(A){
    return {x:A.x,y:-A.y}
}
function recoordinate(v,a){
    if(v.x==0 && v.y==0){
        return {x:0,y:0}
    }
    else{
        let A={
            hat:unit_vector(a),
            vector:a,
            perp:{x:0,y:0}
        }
        let V={
            mag:Math.sqrt(Math.pow(v.x,2)+Math.pow(v.y,2)),
            x_y:{
                hat:unit_vector(v),
                vector:v
            },
            a_ap:{
                hat:{a:0,ap:0},
                vector:{a:0,ap:0}
            }
        }
        A.perp={x:-A.hat.y,y:A.hat.x}
        V.a_ap.hat.a=dot_product(A.hat,V.x_y.hat)
        V.a_ap.hat.ap=dot_product(A.perp,V.x_y.hat)
        V.a_ap.vector={a:V.a_ap.hat.a*V.mag,ap:V.a_ap.hat.ap*V.mag}
        return {x:V.a_ap.vector.a,y:V.a_ap.vector.ap}
    } 
}
function CircleDetect(p1,r1,p2){
    let distvector=diff(p1,p2)
    let distscalar=Math.sqrt(Math.pow(distvector.x,2)+Math.pow(distvector.y,2))
    if(distscalar<=r1){
        return true
    }
    return false
}
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
//---------------------------------------start shape detection----------------------------------------------------------//
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
function detect2shapecollision(points1,points2){
    var i
    for(i=0;i<points1.length;i++){
        if(detect_rotated_shape(points2,points1[i])){
            return true
        }
    }
    for(i=0;i<points2.length;i++){
        if(detect_rotated_shape(points1,points2[i])){
            return true
        }
    }
    return false
}
function xyswitch(coord){
    let ncoord={
        x:coord.y,
        y:coord.x
    }
    return ncoord
}
function detect_rotated_shape(points,p){
    pointnum=points.length
    var i
    sidetruecount=0
    for(i=0;i<pointnum-1;i++){
        if(angleline_detection(points[i],points[i+1],p,true)){
            sidetruecount++
        }
    }
    if(angleline_detection(points[pointnum-1],points[0],p,true)){
        sidetruecount++
    }
    if(sidetruecount==pointnum){
        return true
    }
    else{
        return false
    }
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
function pndiff(p1,p2){
    dist={x:p1.x-p2.x,y:p1.y-p2.y}
    return dist
}
function anglefinder(p1,p2){
    dist=diff(p1,p2)
    rang=Math.atan(dist.y/dist.x)
    ang=rang/(Math.PI/180)
    switch(dist.sector){
        case 0:
            ang+=270
            break
        case 10:
            ang=360-ang
            break
        case 1:
            ang=180-ang
            break
        case 11:
            break

    }
    return ang
}
function pnanglefinder(p1,p2){
    dist=pndiff(p1,p2)
    rang=Math.atan(dist.y/dist.x)
    ang=rang/(Math.PI/180)
    return ang
}
function angleline_detection(lp1,lp2,p,inv){
    np={x:p.x-lp1.x,y:p.y-lp1.y}
    //y=mx+b
    let m=pndiff(lp1,lp2).y/pndiff(lp1,lp2).x
    if(np.x<0&&lp1.x<lp2.x){
        inv=!inv
    }
    if(np.x>=0&&lp1.x>=lp2.x){
        inv=!inv
    }
    if(np.y/np.x>m){
        if(!inv){
            return false
        }
        else{
            return true
        }
    }
    else{
        if(inv){
            return false
        }
        else{
            return true
        }
    }
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
function drawline(origin,ang,length){
    for(i=0;i<length;i++){
        pos=angularmov(ang,i)
        ctx.fillStyle='#000'
        ctx.fillRect(origin.x+pos.x,origin.y+pos.y,2,2)
    }
}
function DrawCircle(radius,position,ctx,resolution){
    for(var i=-radius;i<radius;i+=resolution){
        for(var j=-radius;j<radius;j+=resolution){
            if(Math.floor(Math.sqrt(Math.pow(j,2)+Math.pow(i,2)))<radius){
                ctx.fillRect(position.x+i,position.y+j,resolution,resolution)
            }
        }
    }
}
function dot_product(vector1,vector2){
    return vector1.x*vector2.x+vector1.y*vector2.y
}
function cross_product(a,b){
    let final={
        x:a.y*b.z-a.z*b.y,
        y:a.z*b.x-a.x*b.z,
        z:a.x*b.y-a.y*b.x
    }
    return final
}
function unit_vector(a){
    let a_mag=Math.sqrt(Math.pow(a.x,2)+Math.pow(a.y,2))
    let a_hat={
        x:a.x/a_mag,
        y:a.y/a_mag
    }
    return a_hat
}
function mag(a){
    let a_mag=Math.sqrt(Math.pow(a.x,2)+Math.pow(a.y,2))
    return a_mag
}
//------------------------------------------end shape detection code-------------------------------------------------//
class Handler{
    constructor(Paddle) {
        document.addEventListener("keydown", event=> {
            switch (event.keyCode) {
                case 37:
                    frontwheel.drive=-1
                    backwheel.drive=-1
                    //console.log("move left")
                    break;
                
                case 39:
                    frontwheel.drive=1
                    backwheel.drive=1
                    //console.log('move right')
                    break;
            

            }
        });

        document.addEventListener("keyup", event=> {
            switch (event.keyCode) {
                case 37:
                    frontwheel.drive=0
                    backwheel.drive=0
                    break;
                
                case 39:
                    frontwheel.drive=0
                    backwheel.drive=0
                    break;
                

            }
        });

    }
}
random_map()
debugger
let gap=3
for(var i=0;i<GAME_WIDTH/3-1;i++){
    linearobs.push({p1:{x:i*gap,y:GAME_HEIGHT-track[i]*1.25},p2:{x:(i+1)*gap,y:GAME_HEIGHT-track[i+1]*1.25}})
}
let kill = false
let canvas = document.getElementById("gamescreen")
let ctx = canvas.getContext('2d')
frontwheel = new wheel(GAME_WIDTH,GAME_HEIGHT)
backwheel = new wheel(GAME_WIDTH,GAME_HEIGHT)

frontwheel.position.x-=50
new Handler(frontwheel)
let lastTime = 0
let loop=0
function gameloop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    let start = Date.now()
    loop++
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    for(var i=0;i<linearobs.length;i++){
        JTD(linearobs[i].p1,linearobs[i].p2)
    }
    
    frontwheel.update(deltaTime);
    frontwheel.draw(ctx);
    backwheel.update(deltaTime);
    backwheel.draw(ctx);
    JTD(frontwheel.position,backwheel.position)
    com()
    // movement=COMposition.x-GAME_WIDTH/2
    // offset+=movement
    // backwheel.position.x-=movement
    // frontwheel.position.x-=movement
    // landscapemov(offset)
    if(!kill){
        while((Date.now()-start)<15){
        }
        requestAnimationFrame(gameloop)
    }
    
}
gameloop()