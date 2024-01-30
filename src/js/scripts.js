import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const druid = new URL('../assets/lepszydruid.glb', import.meta.url);
const komnaty = new URL('../assets/mlecznekomnaty.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const assetLoader = new GLTFLoader();

mixer = [];
druidModel = [];

druidIdleAction = [];
druidStartGoAction = [];
druidGoAction = [];

loaded = false;



assetLoader.load(druid.href, function(gltf){
    druidModel = gltf.scene;
    
    scene.add(druidModel);
    mixer = new THREE.AnimationMixer(druidModel);
    const clips = gltf.animations;

    const clip = THREE.AnimationClip.findByName(clips, "Idle");
    druidIdleAction = mixer.clipAction(clip);
    druidIdleAction.play();

    const goAction = THREE.AnimationClip.findByName(clips, "Walk");
    druidGoAction = mixer.clipAction(goAction);

    const startGoAction = THREE.AnimationClip.findByName(clips, "StartWalk");
    startGoAction.timeScale = 4;
    druidStartGoAction = mixer.clipAction(startGoAction);
    druidStartGoAction.time = 0.1;

    loaded = true;

}, undefined, function(error) { console.error(error); });

const world = new THREE.Object3D();
world.name = "World";
scene.add(world);
world.layers.enable(1);

assetLoader.load(komnaty.href, function(gltf){
    const model = gltf.scene;
    console.log(gltf.scene);
    makeWorld(model,world);

    world.children.forEach(c=>{
        c.children.forEach(z=>{
            z.layers.enable(1);
        });

        c.layers.enable(1);
    });

}, undefined, function(error) { console.error(error); });

// const gui = new dat.GUI();

// const options = {
//     sphereColor: '#5555ff',
// };





// gui.addColor(options, "sphereColor").onChange(function(e){
//     light.color.set(e);
// });

const lightColor = 0xccccff;

const light = new THREE.PointLight( lightColor, 20, 100 );
scene.add( light );
const light2 = new THREE.PointLight( lightColor, 5, 100 );
scene.add( light2 );

camera.position.z=5;

const colliderSize = 0.5;

const sphere1 = new THREE.Object3D();

scene.add(sphere1);

const clock = new THREE.Clock();

druidVector = {x: 0.0, y: 0.0};
druidSpeed= -0.04;
rotationSpeed = 0.03;

orbit.maxDistance = 2;
orbit.maxPolarAngle = Math.PI / 1.2;
orbit.autoRotate = false;

wasGoing = false;
wasGoingFrame = 0;

druidStartGoAction.timeScale = 8.0;

const raycaster = new THREE.Raycaster();

druidLastSavePosition = new THREE.Vector3(0,0,0);

collides = false;

const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
const material = new THREE.MeshBasicMaterial( { color: 0x33cc33 } ); 
const endSphere = new THREE.Mesh( geometry, material ); scene.add( endSphere );

//endSphere.position.set(80,0,80);
endSphere.position.set(-3,0,0);
endSphere.layers.enable(2);

function animate() {
    if(mixer.update && loaded && druidGoAction.stop){
        mixer.update(clock.getDelta());
        orbit.target.set(druidModel.position.x, druidModel.position.y+2, druidModel.position.z);
        collides = false;

        
        druidModel.rotateY(druidVector.y * rotationSpeed);
        light.position.set(druidModel.position.x+1, druidModel.position.y+1, druidModel.position.z);
        light2.position.set(druidModel.position.x-1, druidModel.position.y+1, druidModel.position.z);

        sphere1.position.set(druidModel.position.x, druidModel.position.y+0.5, druidModel.position.z);
        sphere1.rotation.set(druidModel.rotation.x, druidModel.rotation.y, druidModel.rotation.z);

        sphere1.translateX(druidVector.x * druidSpeed);

        const directions = [
            new THREE.Vector3(1.0,0,0),
            new THREE.Vector3(1.0,0,1.0),
            new THREE.Vector3(0.0,0,1.0),
            new THREE.Vector3(-1.0,0,1.0),
            new THREE.Vector3(-1.0,0,0.0),
            new THREE.Vector3(-1.0,0,-1.0),
            new THREE.Vector3(0.0,0,-1.0),
            new THREE.Vector3(1.0,0,-1.0),
        ]
        directions.forEach((direction) =>{
            if(collides) return;
            raycaster.set(new THREE.Vector3(sphere1.position.x, sphere1.position.y, sphere1.position.z), direction);
            raycaster.far = 0.5;
            raycaster.layers.set(1);
            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects( scene.children, true);

            e: for ( let i = 0; i < intersects.length; i++ ) {
                collides = true;
                break e;
            }
        });

        if(!collides) {
            druidModel.translateX(druidVector.x * druidSpeed);
        }

        if(druidVector.x > 0.5 && !collides){
            if(wasGoing == false){
                wasGoingFrame = clock.oldTime;
                druidGoAction.stop();
                druidIdleAction.stop();
                druidStartGoAction.timeScale=3.0;
                druidStartGoAction.loop=0;
                druidStartGoAction.play();
                wasGoing=true;
            }
            else{
                if(clock.oldTime - wasGoingFrame > 120){
                    druidGoAction.play();
                    druidIdleAction.stop();
                    druidStartGoAction.loop=0;
                    druidStartGoAction.stop();
                }
            }
        }
        else{
            if(wasGoing == true){
                wasGoing=false;
                druidGoAction.stop();
                druidIdleAction.stop();
                druidStartGoAction.timeScale=-2.0;
                druidStartGoAction.loop=0;
                druidStartGoAction.play();
                wasGoingFrame = clock.oldTime;
            }
            else{
                druidGoAction.stop();
                    druidStartGoAction.stop();
                    druidIdleAction.play();
            }
        }

        checkIfEnd();
    }

    
    
    orbit.minDistance=1;
    orbit.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) { //Klawisz "W"
        druidVector.x = 1;
    } else if (keyCode == 65) { //Klawisz "A"
        druidVector.y = 1;
    } else if (keyCode == 68) { //Klawisz "D"
        druidVector.y = -1;
    }
};

document.addEventListener("keyup", onDocumentKeyDownUP, false);
function onDocumentKeyDownUP(event) {
    var keyCode = event.which;

    if (keyCode == 87) { //Klawisz "W"
        druidVector.x = 0;
    } else if (keyCode == 65) { //Klawisz "A"
        druidVector.y = 0;
    } else if (keyCode == 68) { //Klawisz "D"
        druidVector.y = 0;
    }
};

function checkCollision(x,y,z,far, layer){
    var coll = false;

    const directions = [
        new THREE.Vector3(1.0,0,0),
        new THREE.Vector3(1.0,0,1.0),
        new THREE.Vector3(0.0,0,1.0),
        new THREE.Vector3(-1.0,0,1.0),
        new THREE.Vector3(-1.0,0,0.0),
        new THREE.Vector3(-1.0,0,-1.0),
        new THREE.Vector3(0.0,0,-1.0),
        new THREE.Vector3(1.0,0,-1.0),
    ]
    directions.forEach((direction) =>{
        if(collides) return;
        raycaster.set(new THREE.Vector3(x, y, z), direction);
        raycaster.far = far;
        raycaster.layers.set(2);
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( scene.children, true);

        e: for ( let i = 0; i < intersects.length; i++ ) {
            coll = true;
            break e;
        }
    });

    return coll;
}

function checkIfEnd(){
    let isPlayerOnFinish = checkCollision(druidModel.position.x,druidModel.position.y,druidModel.position.z,0.5, 2);

    if(isPlayerOnFinish){
        let s = confirm("Brawo! Czy chcesz zagrać jeszcze raz?");

        console.log(s);
        
        if(s == true){
            window.location.reload();
        }
        else{
            alert("Żegnaj ;-;");
            window.location.href = "https://google.com";
        }
    }
}