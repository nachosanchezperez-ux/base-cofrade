'use client'

import Image from 'next/image'
import { useState } from 'react'

const SAMPLE_LIMIT = 128
const ALPHA_THRESHOLD = 12
const TARGET_COVERAGE = 0.88
const MIN_SCALE = 0.9
const MAX_SCALE = 1.55
const boundsCache = new Map()

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function fullBounds() {
  return { left: 0, top: 0, right: 1, bottom: 1 }
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

function opticalScale(image) {
  const host = image.parentElement
  const hostRect = host?.getBoundingClientRect()
  const naturalWidth = image.naturalWidth
  const naturalHeight = image.naturalHeight

  if (!hostRect?.width || !hostRect?.height || !naturalWidth || !naturalHeight) return 1

  const bounds = readVisibleBounds(image)
  const visibleWidth = naturalWidth * Math.max(0.01, bounds.right - bounds.left)
  const visibleHeight = naturalHeight * Math.max(0.01, bounds.bottom - bounds.top)
  const containScale = Math.min(hostRect.width / naturalWidth, hostRect.height / naturalHeight)
  const coverage = Math.max(
    (visibleWidth * containScale) / hostRect.width,
    (visibleHeight * containScale) / hostRect.height
  )

  if (!Number.isFinite(coverage) || coverage <= 0) return 1
  return clamp(TARGET_COVERAGE / coverage, MIN_SCALE, MAX_SCALE)
}

export default function BrotherhoodDirectoryCrestImage({ src, alt, className = '' }) {
  const [scale, setScale] = useState(1)

  function handleLoad(event) {
    const image = event.currentTarget
    window.requestAnimationFrame(() => setScale(opticalScale(image)))
  }

  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={82}
      height={104}
      sizes="(max-width: 620px) 60px, 82px"
      crossOrigin="anonymous"
      onLoad={handleLoad}
      style={{ '--crest-optical-scale': scale }}
      data-optically-balanced-crest
    />
  )
}
