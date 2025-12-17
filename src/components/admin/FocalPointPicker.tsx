'use client'

import React, { useCallback, useRef } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

type Point = {
  x: number
  y: number
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

const FocalPointPicker: React.FC<{
  path: string
  label?: string
}> = ({ path, label }) => {
  // -----------------------------------
  // FIELD STATE
  // -----------------------------------
  const { value, setValue } = useField<Point>({ path })

  // -----------------------------------
  // READ MEDIA URL (Payload v3 CORRECT)
  // -----------------------------------
  const mediaURL = useFormFields(([formState]) => (formState.values as { url?: string })?.url)

  const containerRef = useRef<HTMLDivElement>(null)

  // -----------------------------------
  // CLICK HANDLER
  // -----------------------------------
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()

      const x = clamp((e.clientX - rect.left) / rect.width)
      const y = clamp((e.clientY - rect.top) / rect.height)

      setValue({ x, y })
    },
    [setValue],
  )

  // -----------------------------------
  // EMPTY STATE
  // -----------------------------------
  if (!mediaURL) {
    return (
      <div style={{ opacity: 0.6, fontSize: 13 }}>
        Upload an image to enable focal point selection.
      </div>
    )
  }

  // -----------------------------------
  // RENDER
  // -----------------------------------
  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          {label}
        </label>
      )}

      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          aspectRatio: '16 / 9',
          cursor: 'crosshair',
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid var(--theme-border-color)',
        }}
      >
        <img
          src={mediaURL}
          alt="Select focal point"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* FOCAL POINT MARKER */}
        {value?.x !== undefined && value?.y !== undefined && (
          <div
            style={{
              position: 'absolute',
              left: `${value.x * 100}%`,
              top: `${value.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#00B3FF',
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 10px rgba(0,179,255,0.85)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* READOUT */}
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          opacity: 0.75,
        }}
      >
        {value
          ? `x: ${value.x.toFixed(2)}, y: ${value.y.toFixed(2)}`
          : 'Click the image to set the focal point'}
      </div>
    </div>
  )
}

export default FocalPointPicker
