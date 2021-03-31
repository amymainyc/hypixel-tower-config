import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextGeometry } from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//---------------------------------------------------------- Objects
const material = new THREE.MeshLambertMaterial()

//---------------------------- Cubes
// Group
const cubesGroup = new THREE.Group()
scene.add(cubesGroup)

// Cube 1
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(.4, .4, .4),
    material
)
cube.position.set(0, .2, -1)
scene.add(cube)

// Debug
const cubes = gui.addFolder("Cubes", cubesGroup)
const cubesColor = {
    color: 0xff0000 
}
cubes.addColor(cubesColor, 'color').onChange(() => {
    cube.material.color.set(cubesColor.color)
})
cubes.add(cube.position, 'y').min(-3).max(3).step(0.01)
cubes.add(cube.material, 'wireframe')
cubes.add(cube, 'visible')

//---------------------------- Text
// Font Loader
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/Oswald.json',
    (font) =>
    {   
        // Group
        const textGroup = new THREE.Group()
        scene.add(textGroup)

        // Word
        const wordGeometry = new THREE.TextGeometry(
            'P R E T O R I U M',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 0
            } 
        )
        wordGeometry.center()
        const word = new THREE.Mesh(wordGeometry, material)
        word.position.y = .3
        word.castShadow = true
        scene.add(word)

        // Debug
        const text = gui.addFolder("Text", textGroup)
        const textColor = {
            color: 0xff0000 
        }
        text.addColor(textColor, 'color').onChange(() => {
            word.material.color.set(textColor.color)
        })
        text.add(word.position, 'y').min(-3).max(3).step(0.01)
        text.add(word.material, 'wireframe')
        text.add(word, 'visible')
    }
)

//---------------------------- Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = 0
plane.receiveShadow = true
scene.add(plane)

//---------------------------- Lights

// Ambient light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 1, 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 5

scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

//---------------------------------------------------------- Viewport
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Resize viewport
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Fullscreen
// const viewSrcButton = document.getElementById('fullScreenButton');
// viewSrcButton.onclick = function () {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

//     if(!fullscreenElement)
//     {
//         if(canvas.requestFullscreen)
//         {
//             canvas.requestFullscreen()
//         }
//         else if(canvas.webkitRequestFullscreen)
//         {
//             canvas.webkitRequestFullscreen()
//         }
//     }
//     else
//     {
//         if(document.exitFullscreen)
//         {
//             document.exitFullscreen()
//         }
//         else if(document.webkitExitFullscreen)
//         {
//             document.webkitExitFullscreen()
//         }
//     }
// }

//---------------------------------------------------------- Camera
// Base camera
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
camera.position.set(0, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.4

//---------------------------------------------------------- Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

//---------------------------------------------------------- Animate
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    cube.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()