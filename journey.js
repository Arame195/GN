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

        function openTaxi(lat, lon) {

          // Если координаты ещё не указаны
          if (!lat || !lon) {
            alert("Адрес ещё не настроен");
            return;
          }

          const appLink =
            `yandextaxi://route?end-lat=${lat}&end-lon=${lon}`;

          const webLink =
            `https://3.redirect.appmetrica.yandex.com/route?end-lat=${lat}&end-lon=${lon}`;

          // попытка открыть приложение
          window.location.href = appLink;

          // если приложение не открылось — открыть браузерную версию
          setTimeout(() => {
            window.location.href = webLink;
          }, 1500);
        }

        (function () {
"use strict";

const container = document.getElementById("loveCanvas");

if (!container) {
    console.error("Love animation: #loveCanvas not found");
    return;
}


// =========================
// SCENE
// =========================

const scene = new THREE.Scene();

const VIEW_SIZE = 2.2;

const camera = new THREE.OrthographicCamera(
    -1, 1,
    1, -1,
    0.1,
    100
);

camera.position.set(0, 0, 10);
camera.lookAt(0,0,0);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

container.appendChild(renderer.domElement);



function updateCameraFrustum(){

    const aspect =
        container.clientWidth /
        container.clientHeight;


    if(aspect >= 1){

        camera.left = -VIEW_SIZE * aspect;
        camera.right = VIEW_SIZE * aspect;
        camera.top = VIEW_SIZE;
        camera.bottom = -VIEW_SIZE;

    } else {

        camera.left = -VIEW_SIZE;
        camera.right = VIEW_SIZE;
        camera.top = VIEW_SIZE / aspect;
        camera.bottom = -VIEW_SIZE / aspect;

    }

    camera.updateProjectionMatrix();

}


updateCameraFrustum();



window.addEventListener(
    "resize",
    ()=>{

        updateCameraFrustum();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    }
);



// =========================
// LIGHT
// =========================


scene.add(
    new THREE.AmbientLight(
        0xffffff,
        0.9
    )
);


const dirLight =
    new THREE.DirectionalLight(
        0xffffff,
        0.6
    );

dirLight.position.set(
    2,
    3,
    5
);

scene.add(dirLight);



// =========================
// GROUP
// =========================


const rootGroup =
    new THREE.Group();

scene.add(rootGroup);



// =========================
// HELPERS
// =========================


function easeInOutCubic(t){

    return t < 0.5
        ? 4*t*t*t
        : 1 - Math.pow(-2*t+2,3)/2;

}




const RADIAL_SEGMENTS = 12;



function makeStroke(points, opts){

    const radius = opts.radius;
    const glowRadius = opts.glowRadius;

    const tubularSegments =
        opts.tubularSegments ||
        Math.min(
            500,
            Math.max(
                150,
                points.length * 12
            )
        );


    const curve =
        new THREE.CatmullRomCurve3(
            points,
            false,
            "centripetal"
        );



    const material =
        new THREE.MeshStandardMaterial({

            color: opts.color,

            roughness:0.35,

            metalness:0.15,

            emissive:opts.color,

            emissiveIntensity:0.25

        });



    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                opts.glowColor || opts.color,

            transparent:true,

            opacity:0.35,

            blending:
                THREE.AdditiveBlending,

            depthWrite:false

        });



    const geometry =
        new THREE.TubeGeometry(
            curve,
            tubularSegments,
            radius,
            RADIAL_SEGMENTS,
            false
        );


    const glowGeometry =
        new THREE.TubeGeometry(
            curve,
            tubularSegments,
            glowRadius,
            RADIAL_SEGMENTS,
            false
        );



    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    const glowMesh =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    mesh.visible=false;
    glowMesh.visible=false;


    opts.group.add(glowMesh);
    opts.group.add(mesh);



    const indicesPerSegment =
        RADIAL_SEGMENTS * 6;


    const totalIndices =
        tubularSegments *
        indicesPerSegment;



    return {


        setProgress(progress){

            const p =
                Math.max(
                    0,
                    Math.min(1,progress)
                );


            if(p<=0){

                mesh.visible=false;
                glowMesh.visible=false;

                return;
            }


            mesh.visible=true;
            glowMesh.visible=true;


            const revealed =
                Math.max(
                    1,
                    Math.round(
                        tubularSegments*p
                    )
                );


            const count =
                Math.min(
                    totalIndices,
                    revealed*indicesPerSegment
                );


            geometry.setDrawRange(
                0,
                count
            );


            glowGeometry.setDrawRange(
                0,
                count
            );

        }

    };

}

// =========================
// HEART SHAPE
// =========================


function buildHeartPoints(count, scale){

    const pts=[];


    for(let i=0;i<=count;i++){

        const t =
            (i/count) *
            Math.PI *
            2;


        const x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );


        const y =
            13*Math.cos(t)
            -5*Math.cos(2*t)
            -2*Math.cos(3*t)
            -Math.cos(4*t);



        pts.push(
            new THREE.Vector3(
                x*scale,
                y*scale,
                0
            )
        );

    }


    return pts;

}




function pv(arr){

    return arr.map(
        p =>
        new THREE.Vector3(
            p[0],
            p[1],
            0
        )
    );

}



// =========================
// COLORS
// =========================


const HEART_COLOR = 0xff0000;
const HEART_GLOW  = 0xff2e63;

const LETTER_COLOR = 0xffd27a;
const LETTER_GLOW  = 0xffb84d;



// =========================
// HEART
// =========================


const heartGroup =
    new THREE.Group();


rootGroup.add(
    heartGroup
);



const heartStroke =
    makeStroke(

        buildHeartPoints(
            220,
            0.1
        ),

        {

            group:heartGroup,

            radius:0.045,

            glowRadius:0.1,

            color:HEART_COLOR,

            glowColor:HEART_GLOW

        }

    );




// =========================
// LETTERS
// =========================


const lettersGroup =
    new THREE.Group();


lettersGroup.position.set(
    0,
    -0.18,
    0.1
);


rootGroup.add(
    lettersGroup
);



const letterScale = 0.5;



// Буква G
const letterM = pv([

    [0.35, 0.55],
    [0.05, 0.65],
    [-0.25, 0.55],
    [-0.4, 0.25],
    [-0.35, -0.25],
    [-0.05, -0.6],
    [0.35, -0.45],
    [0.35, -0.05],
    [0.05, -0.05]

]);



// Буква N
const letterS = pv([

    [-0.4, -0.62],
    [-0.4, 0.62],
    [0.4, -0.62],
    [0.4, 0.62]

]);

// LEFT LETTER


const letter1Group =
    new THREE.Group();


letter1Group.position.set(
    -0.44,
    0,
    0
);


letter1Group.scale.setScalar(
    letterScale
);


lettersGroup.add(
    letter1Group
);




// RIGHT LETTER


const letter2Group =
    new THREE.Group();


letter2Group.position.set(
    0.44,
    0,
    0
);


letter2Group.scale.setScalar(
    letterScale
);


lettersGroup.add(
    letter2Group
);





const stroke1 =
    makeStroke(

        letterM,

        {

            group:letter1Group,

            radius:0.028,

            glowRadius:0.06,

            color:LETTER_COLOR,

            glowColor:LETTER_GLOW

        }

    );





const stroke2 =
    makeStroke(

        letterS,

        {

            group:letter2Group,

            radius:0.028,

            glowRadius:0.06,

            color:LETTER_COLOR,

            glowColor:LETTER_GLOW

        }

    );



// =========================
// ANIMATION
// =========================


const TIMELINE = [

    {
        start:0,
        duration:2.4,
        run:p =>
            heartStroke.setProgress(p)
    },


    {
        start:2.7,
        duration:1.1,
        run:p =>
            stroke1.setProgress(p)
    },


    {
        start:4.1,
        duration:1.1,
        run:p =>
            stroke2.setProgress(p)
    }

];



const TOTAL_DURATION = 5.4;



let elapsed = 0;

let playing = false;

let started = false;

let idleT = 0;




function resetAnimation(){

    heartStroke.setProgress(0);

    stroke1.setProgress(0);

    stroke2.setProgress(0);


    heartGroup.scale.setScalar(1);


    elapsed=0;

    idleT=0;

}




function startAnimation(){

    resetAnimation();

    playing=true;

}
// =========================
// START WHEN VISIBLE
// =========================


const observer =
    new IntersectionObserver(

        (entries)=>{


            entries.forEach(entry=>{


                if(
                    entry.isIntersecting &&
                    !started
                ){

                    started = true;

                    startAnimation();

                }


            });


        },

        {

            threshold:0.4

        }

    );



observer.observe(
    document.getElementById(
        "love-animation"
    )
);




// =========================
// RENDER LOOP
// =========================


const clock =
    new THREE.Clock();



function animate(){

    requestAnimationFrame(
        animate
    );


    const dt =
        clock.getDelta();



    if(playing){


        elapsed += dt;



        TIMELINE.forEach(
            seg=>{


                const local =
                    (elapsed - seg.start)
                    /
                    seg.duration;



                const progress =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            local
                        )
                    );



                seg.run(
                    easeInOutCubic(
                        progress
                    )
                );


            }
        );



        if(
            elapsed >= TOTAL_DURATION
        ){

            playing=false;

        }


    } else if(started){


        // мягкое сердцебиение после рисования

        idleT += dt;


        const beat =
            1 +
            0.045 *
            Math.max(
                0,
                Math.sin(
                    idleT * 3.2
                )
            )
            *
            Math.exp(
                -(
                    (idleT % 1.9)
                    *
                    1.4
                )
            );



        heartGroup.scale.setScalar(
            beat
        );


    }



    renderer.render(
        scene,
        camera
    );

}



animate();



})();