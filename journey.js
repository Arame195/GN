const timeline =
document.querySelector("#timeline");


if(timeline){


const canvas =
document.querySelector("#timelineCanvas");


const ctx =
canvas.getContext("2d");


const marker =
document.querySelector("#marker");



function bezier(t,p0,p1,p2,p3){

return {

x:
(1-t)**3*p0.x+
3*(1-t)**2*t*p1.x+
3*(1-t)*t*t*p2.x+
t**3*p3.x,


y:
(1-t)**3*p0.y+
3*(1-t)**2*t*p1.y+
3*(1-t)*t*t*p2.y+
t**3*p3.y

};

}




const segments=[

[
{x:210,y:40},
{x:80,y:180},
{x:340,y:300},
{x:210,y:450}
],

[
{x:210,y:450},
{x:80,y:600},
{x:340,y:720},
{x:210,y:850}
],

[
{x:210,y:850},
{x:150,y:950},
{x:260,y:1020},
{x:210,y:1060}
]

];



const points=[];



segments.forEach(seg=>{

for(let i=0;i<80;i++){

points.push(
bezier(
i/80,
seg[0],
seg[1],
seg[2],
seg[3]
)
);

}

});





// рисуем линию

ctx.beginPath();

ctx.strokeStyle="white";

ctx.lineWidth=5;

ctx.setLineDash([8,12]);



points.forEach((p,i)=>{

if(i===0)

ctx.moveTo(p.x,p.y);

else

ctx.lineTo(p.x,p.y);

});


ctx.stroke();







// карточки


document.querySelectorAll(".event")
.forEach(card=>{


let pos =
Number(card.dataset.pos);


let p =
points[
Math.floor(
pos*(points.length-1)
)
];


card.style.top=p.y+"px";


});







let target=0;

let current=0;

let active=false;



window.addEventListener(
"scroll",
()=>{


const rect =
timeline.getBoundingClientRect();



target =
(
window.innerHeight/2 -
rect.top
)
/
timeline.offsetHeight;



target =
Math.max(
0,
Math.min(1,target)
);



if(!active){

active=true;

requestAnimationFrame(animate);

}


},
{
passive:true
}

);







function animate(){


if(
Math.abs(target-current)>0.001
){


const diff =
target-current;


current +=
diff * 0.22;

const pos =
current*(points.length-1);



const i =
Math.floor(pos);



const mix =
pos-i;



const p1 =
points[i];


const p2 =
points[
Math.min(i+1,points.length-1)
];



const x =
p1.x+(p2.x-p1.x)*mix;


const y =
p1.y+(p2.y-p1.y)*mix;



marker.style.transform =
`
translate3d(
${x-18}px,
${y-36}px,
0
)
`;



requestAnimationFrame(animate);



}

else{


active=false;

}



}



}