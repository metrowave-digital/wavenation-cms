import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // VSCode file jump link
  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="wn-home">
      {/* HERO SECTION */}
      <section className="wn-hero">
        <div className="wn-hero-inner">
          <Image
            alt="WaveNation Logo"
            height={80}
            width={80}
            src="/admin-assets/wn-icon.svg"
            className="wn-logo"
            priority
          />

          {!user ? (
            <h1 className="wn-title">
              Welcome to <span>WaveNation CMS</span>
            </h1>
          ) : (
            <h1 className="wn-title">
              Welcome back, <span>{user.email}</span>
            </h1>
          )}

          <p className="wn-subtitle">
            Manage articles, playlists, shows, polls, events, podcasts, and the entire WaveNation
            media ecosystem—all in one powerful dashboard.
          </p>

          <div className="wn-actions">
            <a
              className="wn-btn wn-btn-primary"
              href={payloadConfig.routes.admin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch Admin Panel
            </a>

            <a
              className="wn-btn wn-btn-secondary"
              href="https://wavenation.online"
              target="_blank"
              rel="noopener noreferrer"
            >
              WaveNation Website
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wn-footer">
        <p>Need to Sign-Up?</p>
        <a className="wn-file" href="https://wavenation.online/join">
          <code>Join the Wave</code>
        </a>
      </footer>
    </div>
  )
}
