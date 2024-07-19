import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Robot = () => {
  const mountRef = useRef(null)
  const modelPath = '/models/robot.gltf'

  useEffect(() => {
    const currentMount = mountRef.current
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    currentMount.appendChild(renderer.domElement)

    // Добавим свет
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
    scene.add(light)

    // Загрузка модели
    const loader = new GLTFLoader()
    let model
    loader.load(
      modelPath,
      gltf => {
        console.log('Model loaded successfully')
        model = gltf.scene
        model.scale.set(1.1, 1.1, 1.1)
        model.rotation.y = Math.PI / 0.5
        model.position.set(-4, 0, 0)
        scene.add(model)
      },
      undefined,
      error => {
        console.error('An error happened while loading the model', error)
      }
    )

    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    const handleScroll = () => {
      if (model) {
        const scrollY = window.scrollY
        const amplitude = 8

        if (scrollY < 2000) {
          model.position.x =
            ((scrollY % 2000) / 2000) * amplitude - amplitude / 2
        } else if (scrollY >= 2000 && scrollY < 4000) {
          model.position.x =
            amplitude / 2 - ((scrollY % 2000) / 2000) * amplitude
        } else if (scrollY >= 4000 && scrollY < 5400) {
          model.position.x =
            ((scrollY % 2000) / 2000) * amplitude - amplitude / 2
        }
        model.rotation.y = scrollY * 0.0031
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      currentMount.removeChild(renderer.domElement)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [modelPath])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default Robot
