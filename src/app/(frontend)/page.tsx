import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const quickActions = [
    { label: 'Create Post', href: `${payloadConfig.routes.admin}/collections/posts`, icon: '📝' },
    { label: 'Upload Media', href: `${payloadConfig.routes.admin}/media`, icon: '📁' },
    { label: 'Manage Shows', href: `${payloadConfig.routes.admin}/collections/shows`, icon: '🎙️' },
    { label: 'Creator Hub', href: `/creator`, icon: '🚀' },
  ]

  return (
    <div className="wn-dashboard fade-in">
      {/* HERO */}
      <section className="wn-hero slide-up">
        <div className="wn-floating-waves"></div>
        <div className="wn-floating-waves-2"></div>

        <div className="wn-hero-content">
          <Image
            src="/wavenation-logo.svg"
            alt="WaveNation Logo"
            width={90}
            height={90}
            className="wn-logo glow-pulse"
          />

          <h1 className="wn-title glow-pulse">
            {user ? `Welcome back, ${user.email}` : 'Welcome to WaveNation'}
          </h1>

          <p className="wn-subtitle">The future of urban media. Your creator command center.</p>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="wn-section slide-up">
        <h2 className="wn-section-title">Quick Actions</h2>

        <div className="wn-actions-grid">
          {quickActions.map((a, idx) => (
            <a href={a.href} key={idx} className="wn-action-card electric-hover">
              <span className="wn-action-icon">{a.icon}</span>
              <span className="wn-action-text">{a.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* CORE TOOLS */}
      <section className="wn-section slide-up">
        <h2 className="wn-section-title">Core Tools</h2>

        <div className="wn-grid">
          <a
            href={payloadConfig.routes.admin}
            className="wn-card electric-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Admin Panel</h3>
            <p>Manage collections, users, media & system content.</p>
            <span className="wn-card-link">Open Admin →</span>
          </a>

          <a
            href="https://payloadcms.com/docs"
            className="wn-card electric-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Documentation</h3>
            <p>Learn Payload fields, hooks & advanced features.</p>
            <span className="wn-card-link">Open Docs →</span>
          </a>

          <a
            href={`${payloadConfig.routes.api}/graphql`}
            className="wn-card electric-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>GraphQL API</h3>
            <p>Query your CMS with the built-in GraphQL Explorer.</p>
            <span className="wn-card-link">Open GraphQL →</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wn-footer slide-up">
        WaveNation CMS • Built for Creators • Powered by MetroWave Digital
      </footer>
    </div>
  )
}
