'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const SAMPLE_LIMIT = 192
const ALPHA_THRESHOLD = 4
const SAFE_INSET = 0.075
const TARGET_COVERAGE = 1 - (SAFE_INSET * 2)
const MIN_SCALE = 0.82
const MAX_SCALE = 1.55
const boundsCache = new Map()

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function fullBounds() {
  return { left: 0, top: 0, right: 1, bottom: 1 }
}

function defaultBalance() {
  return { scale: 1, x: 0, y: 0 }
}

function readVisibleBounds(image) {
  const sourceKey = image.currentSrc || image.src
  if (boundsCache.has(sourceKey)) return boundsCache.get(sourceKey)

  const naturalWidth = image.naturalWidth
  const naturalHeight = image.naturalHeight
  if (!naturalWidth || !naturalHeight) return fullBounds()

  try {
    const sampleRatio = Math.min(1, SAMPLE_LIMIT / Math.max(naturalWidth, naturalHeight))
    const sampleWidth = Math.max(1, Math.round(naturalWidth * sampleRatio))
    const sampleHeight = Math.max(1, Math.round(naturalHeight * sampleRatio))
    const canvas = document.createElement('canvas')
    canvas.width = sampleWidth
    canvas.height = sampleHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return fullBounds()

    context.clearRect(0, 0, sampleWidth, sampleHeight)
    context.drawImage(image, 0, 0, sampleWidth, sampleHeight)
    const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data

    let minX = sampleWidth
    let minY = sampleHeight
    let maxX = -1
    let maxY = -1

    for (let y = 0; y < sampleHeight; y += 1) {
      for (let x = 0; x < sampleWidth; x += 1) {
        const alpha = pixels[(y * sampleWidth + x) * 4 + 3]
        if (alpha <= ALPHA_THRESHOLD) continue
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }

    const bounds = maxX < minX || maxY < minY
      ? fullBounds()
      : {
          left: minX / sampleWidth,
          top: minY / sampleHeight,
          right: (maxX + 1) / sampleWidth,
          bottom: (maxY + 1) / sampleHeight,
        }

    boundsCache.set(sourceKey, bounds)
    return bounds
  } catch {
    const bounds = fullBounds()
    boundsCache.set(sourceKey, bounds)
    return bounds
  }
}

function opticalBalance(image) {
  const host = image.parentElement
  const hostRect = host?.getBoundingClientRect()
  const naturalWidth = image.naturalWidth
  const naturalHeight = image.naturalHeight

  if (!hostRect?.width || !hostRect?.height || !naturalWidth || !naturalHeight) return defaultBalance()

  const bounds = readVisibleBounds(image)
  const containScale = Math.min(hostRect.width / naturalWidth, hostRect.height / naturalHeight)
  const renderedWidth = naturalWidth * containScale
  const renderedHeight = naturalHeight * containScale
  const renderedLeft = (hostRect.width - renderedWidth) / 2
  const renderedTop = (hostRect.height - renderedHeight) / 2

  const visibleLeft = renderedLeft + (bounds.left * renderedWidth)
  const visibleRight = renderedLeft + (bounds.right * renderedWidth)
  const visibleTop = renderedTop + (bounds.top * renderedHeight)
  const visibleBottom = renderedTop + (bounds.bottom * renderedHeight)
  const visibleWidth = Math.max(0.01, visibleRight - visibleLeft)
  const visibleHeight = Math.max(0.01, visibleBottom - visibleTop)

  const targetWidth = hostRect.width * TARGET_COVERAGE
  const targetHeight = hostRect.height * TARGET_COVERAGE
  const requestedScale = Math.min(targetWidth / visibleWidth, targetHeight / visibleHeight)
  const scale = clamp(requestedScale, MIN_SCALE, MAX_SCALE)

  if (!Number.isFinite(scale) || scale <= 0) return defaultBalance()

  const hostCenterX = hostRect.width / 2
  const hostCenterY = hostRect.height / 2
  const visibleCenterX = (visibleLeft + visibleRight) / 2
  const visibleCenterY = (visibleTop + visibleBottom) / 2

  return {
    scale,
    x: (hostCenterX - visibleCenterX) * scale,
    y: (hostCenterY - visibleCenterY) * scale,
  }
}

export default function BrotherhoodDirectoryCrestImage({
  src,
  alt,
  className = '',
  width = 82,
  height = 104,
  sizes = '(max-width: 620px) 60px, 82px',
  priority = false,
}) {
  const imageRef = useRef(null)
  const [balance, setBalance] = useState(defaultBalance)

  function recalculate(image = imageRef.current) {
    if (!image) return
    window.requestAnimationFrame(() => setBalance(opticalBalance(image)))
  }

  function handleLoad(event) {
    recalculate(event.currentTarget)
  }

  useEffect(() => {
    const image = imageRef.current
    const host = image?.parentElement
    if (!image || !host || typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(() => recalculate(image))
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <Image
      ref={imageRef}
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      crossOrigin="anonymous"
      onLoad={handleLoad}
      style={{
        '--crest-optical-scale': balance.scale,
        '--crest-optical-x': `${balance.x}px`,
        '--crest-optical-y': `${balance.y}px`,
      }}
      data-optically-balanced-crest
    />
  )
}
