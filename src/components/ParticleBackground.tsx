import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  life: number
  maxLife: number
}

interface ParticleBackgroundProps {
  particleCount?: number
  isMusicPlaying?: boolean
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 150,
  isMusicPlaying = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Initialize particles
  const initParticles = useCallback(() => {
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 200, // Blue to purple range
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50
      })
    }
  }, [dimensions.width, dimensions.height, particleCount])

  // Update canvas dimensions
  const updateDimensions = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      setDimensions({
        width: rect.width,
        height: rect.height
      })
    }
  }

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update particle position
      particle.x += particle.vx
      particle.y += particle.vy

      // Music influence on particles
      if (isMusicPlaying) {
        // Add subtle wave motion when music is playing
        particle.vx += Math.sin(Date.now() * 0.001 + index) * 0.01
        particle.vy += Math.cos(Date.now() * 0.001 + index) * 0.01

        // Increase opacity and size slightly
        particle.opacity = Math.min(0.8, particle.opacity + 0.002)
        particle.size = Math.min(5, particle.size + 0.001)
      } else {
        // Slowly return to normal
        particle.opacity = Math.max(0.2, particle.opacity - 0.001)
        particle.size = Math.max(1, particle.size - 0.001)
      }

      // Wrap around edges
      if (particle.x < 0) particle.x = dimensions.width
      if (particle.x > dimensions.width) particle.x = 0
      if (particle.y < 0) particle.y = dimensions.height
      if (particle.y > dimensions.height) particle.y = 0

      // Update life
      particle.life--
      if (particle.life <= 0) {
        // Respawn particle
        particle.x = Math.random() * dimensions.width
        particle.y = Math.random() * dimensions.height
        particle.life = particle.maxLife
        particle.opacity = Math.random() * 0.5 + 0.2
      }

      // Draw particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      )

      gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`)
      gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Add glow effect for music playing
      if (isMusicPlaying && particle.opacity > 0.5) {
        ctx.shadowBlur = 20
        ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`
        ctx.fill()
        ctx.shadowBlur = 0
      }
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [dimensions.width, dimensions.height, isMusicPlaying])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateDimensions()
      initParticles()
    }

    window.addEventListener('resize', handleResize)
    updateDimensions()
    initParticles()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [initParticles])

  // Start/stop animation based on dimensions
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, isMusicPlaying, animate])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="particle-canvas"
        width={dimensions.width}
        height={dimensions.height}
      />
      <style jsx>{`
        .particle-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: -1;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
        }

        .content-overlay {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default ParticleBackground
