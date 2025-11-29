'use client'

import React from 'react'
import '../components/custom-login.css'

export default function CustomLoginPage() {
  return (
    <div className="wn-login-container">
      <div className="wn-bg-overlay" />
      <img src="/waveform-bg.svg" className="wn-waveform" />

      <div className="wn-login-card">
        <div className="wn-logo">
          <h1>WaveNation CMS</h1>
          <p>Creator & Content Management Portal</p>
        </div>

        <a href="/admin/login?redirect=/admin" className="wn-login-btn">
          Continue to Login
        </a>
      </div>
    </div>
  )
}
