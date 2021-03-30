import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextGeometry } from 'three'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//---------------------------------------------------------- Objects

//---------------------------- Cubes
// Group
const cubesGroup = new THREE.Group()
scene.add(cubesGroup)

// Cube 1
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(.4, .4, .4),
    new THREE.MeshBasicMaterial({color : 0xff0000})
)
cube.position.y = -1
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
    '/fonts/Helvetica.json',
    (font) =>
    {   
        // Group
        const textGroup = new THREE.Group()
        scene.add(textGroup)

        // Word
        const wordGeometry = new THREE.TextGeometry(
            'Pretorium',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            } 
        )
        wordGeometry.center()
        const wordMaterial = new THREE.MeshBasicMaterial()
        const word = new THREE.Mesh(wordGeometry, wordMaterial)
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

//---------------------------- Lights
// Group
const lightsGroup = new THREE.Group()
scene.add(lightsGroup)

// Light 1
const light = new THREE.DirectionalLight(0xff0000, 0.5)
light.position.set(1, 0.25, 0)
scene.add(light)

// Debug
const lights = gui.addFolder("Lights", lightsGroup)
const lightsColor = {
    color: 0xff0000 
}
lights.addColor(lightsColor, 'color').onChange(() => {
    light.color.set(lightsColor.color)
})
lights.add(light, 'intensity').min(0).max(1).step(0.01)
lights.add(light.position, 'y').min(-3).max(3).step(0.01)
lights.add(light, 'visible')

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//---------------------------------------------------------- Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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