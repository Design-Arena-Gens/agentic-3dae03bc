'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ProcessedData } from '@/types'

interface GlobeVisualizationProps {
  data: ProcessedData
  onCountrySelect: (country: string) => void
}

function Globe({ data, onCountrySelect }: GlobeVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  const getColorIntensity = (cases: number) => {
    const maxCases = Math.max(...data.countries.map(c => c.totalCases))
    const intensity = cases / maxCases
    return new THREE.Color().setHSL(0, 1, 0.5 - intensity * 0.3)
  }

  return (
    <group>
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      <Sphere args={[2.01, 64, 64]}>
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {data.countries.map((country, index) => {
        const phi = (90 - country.latitude) * (Math.PI / 180)
        const theta = (country.longitude + 180) * (Math.PI / 180)
        const radius = 2.05

        const x = -(radius * Math.sin(phi) * Math.cos(theta))
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        const intensity = country.totalCases / Math.max(...data.countries.map(c => c.totalCases))
        const size = 0.05 + intensity * 0.15

        return (
          <group key={index} position={[x, y, z]}>
            <Sphere
              args={[size, 16, 16]}
              onClick={() => onCountrySelect(country.country)}
              onPointerOver={() => setHoveredCountry(country.country)}
              onPointerOut={() => setHoveredCountry(null)}
            >
              <meshStandardMaterial
                color={getColorIntensity(country.totalCases)}
                emissive={getColorIntensity(country.totalCases)}
                emissiveIntensity={hoveredCountry === country.country ? 1 : 0.5}
              />
            </Sphere>

            {hoveredCountry === country.country && (
              <Html distanceFactor={10}>
                <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap pointer-events-none">
                  <div className="font-bold">{country.country}</div>
                  <div className="text-gray-300">
                    Cases: {new Intl.NumberFormat().format(country.totalCases)}
                  </div>
                </div>
              </Html>
            )}
          </group>
        )
      })}

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  )
}

export default function GlobeVisualization({ data, onCountrySelect }: GlobeVisualizationProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Globe data={data} onCountrySelect={onCountrySelect} />
      </Canvas>
    </div>
  )
}
