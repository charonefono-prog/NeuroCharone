import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Helmet3DProps {
  selectedPoints?: string[]
  onPointSelect?: (point: string) => void
}

export function Helmet3D({ selectedPoints = [], onPointSelect }: Helmet3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const helmetRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf3f4f6)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create helmet group
    const helmet = new THREE.Group()
    helmetRef.current = helmet
    scene.add(helmet)

    // Create helmet shape (simplified)
    const headGeometry = new THREE.IcosahedronGeometry(1.5, 4)
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xe8f0fe, wireframe: false })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    helmet.add(head)

    // Add 10-20 system points
    const points10_20 = [
      { name: 'Cz', pos: [0, 1.5, 0] },
      { name: 'C3', pos: [-1.3, 0.5, 0] },
      { name: 'C4', pos: [1.3, 0.5, 0] },
      { name: 'T3', pos: [-1.5, 0, 0] },
      { name: 'T4', pos: [1.5, 0, 0] },
      { name: 'Oz', pos: [0, -1.5, 0] },
      { name: 'Fz', pos: [0, 1.2, 1] },
      { name: 'Pz', pos: [0, -1.2, 1] },
    ]

    points10_20.forEach(point => {
      const geometry = new THREE.SphereGeometry(0.15, 16, 16)
      const material = new THREE.MeshPhongMaterial({
        color: selectedPoints.includes(point.name) ? 0xff6b6b : 0x0066cc,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(...(point.pos as [number, number, number]))
      sphere.userData.pointName = point.name
      helmet.add(sphere)
    })

    // Mouse interaction
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    })

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && helmet) {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y
        helmet.rotation.y += deltaX * 0.01
        helmet.rotation.x += deltaY * 0.01
      }
      previousMousePosition = { x: e.clientX, y: e.clientY }
    })

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false
    })

    // Zoom with scroll
    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault()
      camera.position.z += e.deltaY * 0.001
      camera.position.z = Math.max(1, Math.min(10, camera.position.z))
    })

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousedown', () => {})
      renderer.domElement.removeEventListener('mousemove', () => {})
      renderer.domElement.removeEventListener('mouseup', () => {})
      renderer.domElement.removeEventListener('wheel', () => {})
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [selectedPoints])

  return <div ref={containerRef} className="w-full h-full" />
}
