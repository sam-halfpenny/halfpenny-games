const GAME_WIDTH=1500
const GAME_HEIGHT=600
document.getElementById('player').volume=0.6
let linearobs=[{p1:{x:0,y:0},p2:{x:0,y:GAME_HEIGHT}},{p1:{x:GAME_WIDTH,y:0},p2:{x:GAME_WIDTH,y:GAME_HEIGHT}},{p1:{x:0,y:GAME_HEIGHT},p2:{x:GAME_WIDTH,y:GAME_HEIGHT}}]
const cof=0.9
const cor=0
let carspeed={x:0,y:0}
const rigidity=4
const dampening=0.3
let head
let score=0
let prev
let maplen=2
let power=0.5
let move={left:false,right:false}
let track=[]
let COMposition={x:0,y:0}
let offset=10
track.push(GAME_HEIGHT)
track.push(Math.floor(Math.random()*(GAME_HEIGHT/9))+GAME_HEIGHT/9)
function WORLDBOOM(){
    let image = document.getElementById("boom")
    ctx.drawImage(image,GAME_WIDTH/2-150,100,300,100)
}
function jump(){
    let image = document.getElementById("jump")
    ctx.drawImage(image,100,200,200,100)
}
function inverted(){
    let image = document.getElementById("inverted")
    ctx.drawImage(image,GAME_WIDTH-350,200,200,100)
}
class wheel{
    constructor(gamewidth,gameheight,size,pos){
        this.gameheight=gameheight
        this.gamewidth=gamewidth
        this.position=pos
        this.speed={x:0,y:0}
        this.rspeed=0
        this.size=size
        this.maxSpeed=2
        this.drive=0
        this.rotlim=1.5
        this.airtime=0
    }
    draw(){
        DrawCircle(this.size,this.position,ctx,1)
    }
    update(deltaTime) {
        if(!deltaTime) return;
        if(this.size==10){
            let COMvector=pndiff(COMposition,this.position)
            let respeed=recoordinate(pndiff(this.speed,carspeed),COMvector)
            if(this.drive>0){
                if(respeed.y<this.rotlim){
                    respeed={x:respeed.x,y:respeed.y+this.drive/4}
                }
            }
            else if(this.drive<0){
                if(respeed.y>-this.rotlim){
                    respeed={x:respeed.x,y:respeed.y+this.drive/4}
                }
            }
            
            let newspeed=recoordinate(respeed,revert_vector(COMvector))
            this.speed={x:newspeed.x+carspeed.x,y:newspeed.y+carspeed.y}
        }
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
                if(A.y>0){
                    A={x:-A.x,y:-A.y}
                }
                this.position={x:cdot.x+unit_vector(A).x*this.size,y:cdot.y+unit_vector(A).y*this.size}
                let Ar={x:A.x,y:-A.y}
                let recspeed=recoordinate(this.speed,A)
                this.speed=recoordinate({x:-recspeed.x*cor,y:recspeed.y+this.drive},Ar)
                if(i==2){
                    this.position.y=300
                }
                this.airtime=0
            }
        }
        for(var i=0;i<linearobs.length;i++){
            if(CircleDetect(this.position,this.size,linearobs[i].p1)){
                let A=pndiff(this.position,linearobs[i].p1)
                let Ar={x:A.x,y:-A.y}
                let recspeed=recoordinate(this.speed,A)
                this.speed=recoordinate({x:-recspeed.x*cor,y:recspeed.y+this.drive},Ar)
                this.airtime=0
            }
            else if(CircleDetect(this.position,this.size,linearobs[i].p2)){
                let A=pndiff(this.position,linearobs[i].p2)
                let Ar={x:A.x,y:-A.y}
                let recspeed=recoordinate(this.speed,A)
                this.speed=recoordinate({x:-recspeed.x*cor,y:recspeed.y+this.drive},Ar)
                this.airtime=0
            }
        }
        this.airtime++
    }

}
class body{
    constructor(){
        this.relpoints=[
            {x:0,y:0},
            {x:0,y:20},
            {x:0,y:0},
            {x:-10,y:10},
            {x:-20,y:0},
            {x:0,y:0},
            {x:-7,y:12},
            {x:-14,y:0}
        ]
        this.relhead={x:0,y:20}
        this.head={x:COMposition.x+this.relhead.x,y:COMposition.y+this.relhead.y}
        this.points=[]
        for(i=0;i<this.relpoints.length;i++){
            this.points.push({x:COMposition.x+this.relpoints[i].x,y:COMposition.y+this.relpoints[i].y})
        }
    }
    draw(){
        Bdraw(this.points)
        if(!kill){
            DrawCircle(5,this.head,ctx,1)
        }
    }
    update(){
        for(i=0;i<this.points.length;i++){
            let rotpoint=recoordinate(this.relpoints[i],revert_vector(pndiff(frontwheel.position,COMposition)))
            this.points[i]={x:COMposition.x+rotpoint.x,y:COMposition.y+rotpoint.y}
        }
        let rotpoint=recoordinate(this.relhead,revert_vector(pndiff(frontwheel.position,COMposition)))
        this.head={x:COMposition.x+rotpoint.x,y:COMposition.y+rotpoint.y}
        console.log(dot_product(unit_vector(pndiff(this.head,COMposition)),{x:0,y:-1}))
        if(dot_product(unit_vector(pndiff(this.head,COMposition)),{x:0,y:-1})<-0.7 && payday2>30 && !kill){
            payday2=0
            score+=200
        }
        let cvector
        let lvector
        let dp
        let cdot
        if(!kill){
            for(var i=0;i<linearobs.length;i++){
                cvector=pndiff(this.head,linearobs[i].p1)
                lvector=pndiff(linearobs[i].p2,linearobs[i].p1)
                dp=(dot_product(unit_vector(lvector),unit_vector(cvector))*mag(cvector))/mag(lvector)
                cdot={x:linearobs[i].p1.x+(lvector.x*dp),y:linearobs[i].p1.y+(lvector.y*dp)}
                if(CircleDetect(this.head,5,cdot) && (dp>0 && dp<1)){
                    kill=true
                    document.getElementById('player').play()
                    head=new wheel(GAME_WIDTH,GAME_HEIGHT,5,this.head)
                    frontwheel.drive=0
                    backwheel.drive=0
                }
            }
        }
    }
}
function landscapemov(offset){
    let roffset=Math.floor(offset/3)
    // let extraoffset=Math.floor(offset)%3
    for(var i=3;i<linearobs.length;i++){
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
    let accel=0
    let sped=0
    for(i=maplen;i<maplen+reps;i++){
        prev=track[i-1]
        r=Math.floor(Math.random()*3)
        sped=accel_change(prev,sped,r,levs)
        track.push(prev+sped/3)
    }
    maplen+=reps
}
function com(){
    let wvector = pndiff(frontwheel.position,backwheel.position)
    COMposition={x:backwheel.position.x+wvector.x/2,y:backwheel.position.y+wvector.y/2}
    let fwdivvector=unit_vector(pndiff(frontwheel.position,COMposition))
    let bwdivvector=unit_vector(pndiff(backwheel.position,COMposition))
    let bwmag=mag(pndiff(backwheel.position,COMposition))-30
    let fwmag=mag(pndiff(frontwheel.position,COMposition))-30
    let bwacc=mag(pndiff(backwheel.position,COMposition))>30
    let fwacc=mag(pndiff(frontwheel.position,COMposition))>30
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
    carspeed={x:(backwheel.speed.x+frontwheel.speed.x)/2,y:(backwheel.speed.y+frontwheel.speed.y)/2}
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
    angle=ang
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
function BDrawCircle(radius,position,ctx,resolution){
    for(var i=-radius;i<radius;i+=resolution){
        for(var j=-radius;j<radius;j+=resolution){
            let value=Math.floor(Math.sqrt(Math.pow(j,2)+Math.pow(i,2)))
            if(value<radius && value>radius-1){
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
function Bdraw(points){
    var i
    for(i=0;i<points.length-1;i++){
        JTD(points[i],points[i+1])
    }
    JTD(points[points.length-1],points[0])
}
//------------------------------------------end shape detection code-------------------------------------------------//
class Handler{
    constructor(Paddle) {
        document.addEventListener("keydown", event=> {
            switch (event.keyCode) {
                case 37:
                    if(!kill){
                        frontwheel.drive=-1
                        backwheel.drive=-1
                        move.left=true
                        //console.log("move left")
                    }
                    
                    break;
                
                case 39:
                    if(!kill){
                        frontwheel.drive=1
                        backwheel.drive=1
                        move.right=true
                        //console.log('move right')
                    }
                    break;
            

            }
        });

        document.addEventListener("keyup", event=> {
            switch (event.keyCode) {
                case 37:
                    if(!kill){
                        if(move.right==false){
                            frontwheel.drive=0
                            backwheel.drive=0
                        }
                        else{
                            frontwheel.drive=1
                            backwheel.drive=1
                        }
                        move.left=false
                    }
                    break;
                
                case 39:
                    if(!kill){
                        if(move.left==false){
                            frontwheel.drive=0
                            backwheel.drive=0
                        }
                        else{
                            frontwheel.drive=-1
                            backwheel.drive=-1
                        }
                        move.right=false
                    }
                    break;
                

            }
        });

    }
}
random_map()
let gap=3
for(var i=0;i<GAME_WIDTH/3-1;i++){
    linearobs.push({p1:{x:i*gap,y:GAME_HEIGHT-track[i]*1.25},p2:{x:(i+1)*gap,y:GAME_HEIGHT-track[i+1]*1.25}})
}
let kill = false
let canvas = document.getElementById("gamescreen")
let ctx = canvas.getContext('2d')
frontwheel = new wheel(GAME_WIDTH,GAME_HEIGHT,10,{x:GAME_WIDTH/2,y:GAME_HEIGHT/2})
backwheel = new wheel(GAME_WIDTH,GAME_HEIGHT,10,{x:GAME_WIDTH/2,y:GAME_HEIGHT/2})
car = new body()
let limit=GAME_WIDTH*28
frontwheel.position.x-=60
new Handler(frontwheel)
let lastTime = 0
let loop=0
let payday=60
let payday2=60
function gameloop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    let start = Date.now()
    loop++
    payday++
    payday2++
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
    car.update()
    car.draw()
    if(frontwheel.airtime>50 && backwheel.airtime>50 && payday>30){
        payday=0
        score+=50
    }
    if(payday<40){
        jump()
    }
    if(payday2<40){
        inverted()
    }
    document.getElementById('score').textContent='score:'+(score+Math.floor(offset/200))
    movement=COMposition.x-GAME_WIDTH/2
    offset+=movement
    backwheel.position.x-=movement
    frontwheel.position.x-=movement
    landscapemov(offset)
    if(offset>limit){
        random_map()
        limit+=limit
    }
    if(kill){
        head.position.x-Math.floor(movement/3)*3
        head.draw()
        head.update(deltaTime)
        if(loop%100<80){
            WORLDBOOM()
        }
    }
    while((Date.now()-start)<15){
    }
    requestAnimationFrame(gameloop)
    
}
gameloop()