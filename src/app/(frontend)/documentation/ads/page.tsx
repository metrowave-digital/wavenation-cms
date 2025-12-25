'use client'

import styles from './AdsPage.module.css'

export default function AdsDocumentationPage() {
  return (
    <div className={styles.container}>
      {/* =====================================================
          HERO
      ====================================================== */}
      <header className={styles.hero}>
        <h1 className={styles.title}>Ads & Monetization System</h1>
        <p className={styles.subtitle}>
          Secure, role-based advertising infrastructure with Admin + API access control
        </p>
      </header>

      {/* =====================================================
          OVERVIEW
      ====================================================== */}
      <section className={styles.section}>
        <h2>System Overview</h2>
        <p>
          The WaveNation Ads system is built as a multi-collection, enterprise-grade advertising
          platform. It supports internal campaign management, analytics, placements, and advertisers
          while securely exposing read-only access to frontend applications via API keys.
        </p>

        <ul className={styles.bullets}>
          <li>Admin UI access via authenticated users (cookies)</li>
          <li>
            Public API access via <code>x-api-key</code> + <code>x-fetch-code</code>
          </li>
          <li>Strict RBAC enforcement at collection and field level</li>
          <li>No accidental exposure of analytics or advertiser data</li>
        </ul>
      </section>

      {/* =====================================================
          COLLECTIONS
      ====================================================== */}
      <section className={styles.section}>
        <h2>Ads Collections</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Ads</h3>
            <p>Individual ad creatives tied to placements and advertisers.</p>
            <ul>
              <li>Create: Ads Manager+</li>
              <li>Update: Ads Manager+</li>
              <li>Delete: Ads Admin+</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Ad Placements</h3>
            <p>Defines where ads appear (radio, TV, web, app, events).</p>
            <ul>
              <li>Create: Ads Manager+</li>
              <li>Update: Ads Analyst+</li>
              <li>Delete: Ads Admin+</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Campaigns</h3>
            <p>Groups ads together with budgets, channels, and schedules.</p>
            <ul>
              <li>Create: Ads Manager / Editorial+</li>
              <li>Update: Ads Analyst+</li>
              <li>Delete: Ads Admin+</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Advertisers</h3>
            <p>Companies and brands funding advertising campaigns.</p>
            <ul>
              <li>Create: Ads Manager / Editorial+</li>
              <li>Update: Ads Manager+</li>
              <li>Delete: Ads Admin+</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Ad Analytics</h3>
            <p>Time-based metrics such as impressions, clicks, and conversions.</p>
            <ul>
              <li>Create: Ads Analyst+</li>
              <li>Update: Ads Manager+</li>
              <li>Delete: Ads Admin+</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCESS MODEL
      ====================================================== */}
      <section className={styles.section}>
        <h2>Access Model</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Context</th>
              <th>Auth Method</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admin UI</td>
              <td>Cookie (req.user)</td>
              <td>Allowed for Ads/Admin roles</td>
            </tr>
            <tr>
              <td>Frontend API</td>
              <td>x-api-key + x-fetch-code</td>
              <td>Read-only access</td>
            </tr>
            <tr>
              <td>Unauthenticated</td>
              <td>None</td>
              <td>404 / Not Found</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =====================================================
          SECURITY NOTES
      ====================================================== */}
      <section className={styles.section}>
        <h2>Security Guarantees</h2>

        <ul className={styles.bullets}>
          <li>Admin UI never relies on API keys</li>
          <li>Public API never exposes analytics or advertiser metadata</li>
          <li>Field-level access always returns boolean (Payload safe)</li>
          <li>Delete operations restricted to Ads Admin+</li>
          <li>
            Search indexing is explicitly gated via <code>_searchable</code>
          </li>
        </ul>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className={styles.footer}>
        <p>WaveNation CMS · Ads & Monetization Documentation</p>
      </footer>
    </div>
  )
}
