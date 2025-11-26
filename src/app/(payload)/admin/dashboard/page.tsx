import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import './dashboard.css'

export default async function DashboardPage() {
  const payload = await getPayload({ config })

  // Fetch counts for quick stats
  const [articles, shows, playlists, polls, events, users] = await Promise.all([
    payload.count({ collection: 'articles' }),
    payload.count({ collection: 'shows' }),
    payload.count({ collection: 'playlists' }),
    payload.count({ collection: 'polls' }),
    payload.count({ collection: 'events' }),
    payload.count({ collection: 'users' }),
  ])

  // Recently added content
  const recentArticles = await payload.find({
    collection: 'articles',
    limit: 5,
    sort: '-createdAt',
  })

  const recentMedia = await payload.find({
    collection: 'media',
    limit: 5,
    sort: '-createdAt',
  })

  return (
    <div className="wn-dashboard">
      {/* HEADER */}
      <header className="wn-d-header">
        <div>
          <h1 className="wn-d-title">WaveNation CMS</h1>
          <p className="wn-d-sub">Your command center for the entire WaveNation ecosystem.</p>
        </div>
        <img src="/admin-assets/wn-logo.svg" className="wn-d-logo" />
      </header>

      {/* QUICK ACTIONS */}
      <section className="wn-d-quick">
        <a href="/admin/collections/articles/create" className="wn-q-action">
          ➕ New Article
        </a>
        <a href="/admin/collections/playlists/create" className="wn-q-action">
          🎧 New Playlist
        </a>
        <a href="/admin/collections/media/create" className="wn-q-action">
          📁 Upload Media
        </a>
        <a href="/admin/collections/events/create" className="wn-q-action">
          📅 Add Event
        </a>
        <a href="/admin/collections/polls/create" className="wn-q-action">
          📊 New Poll
        </a>
      </section>

      {/* METRICS */}
      <section className="wn-d-stats">
        <div className="wn-d-stat">
          <h3>{articles.totalDocs}</h3>
          <p>Articles Published</p>
        </div>

        <div className="wn-d-stat">
          <h3>{shows.totalDocs}</h3>
          <p>Radio Shows</p>
        </div>

        <div className="wn-d-stat">
          <h3>{playlists.totalDocs}</h3>
          <p>Playlists</p>
        </div>

        <div className="wn-d-stat">
          <h3>{polls.totalDocs}</h3>
          <p>Polls</p>
        </div>

        <div className="wn-d-stat">
          <h3>{events.totalDocs}</h3>
          <p>Events</p>
        </div>

        <div className="wn-d-stat">
          <h3>{users.totalDocs}</h3>
          <p>Users</p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="wn-d-main">
        {/* RECENT ARTICLES */}
        <div className="wn-d-card tall">
          <h2>📰 Recent Articles</h2>
          <ul className="wn-d-list">
            {recentArticles.docs.map((article) => (
              <li key={article.id}>
                <a href={`/admin/collections/articles/${article.id}`}>
                  <strong>{article.title}</strong>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* RECENT MEDIA */}
        <div className="wn-d-card tall">
          <h2>📁 Latest Uploads</h2>
          <ul className="wn-d-list media">
            {recentMedia.docs.map((media) => (
              <li key={media.id}>
                <a href={`/admin/collections/media/${media.id}`}>
                  <span>{media.filename}</span>
                  <span>{new Date(media.createdAt).toLocaleDateString()}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* TODAY SCHEDULE */}
        <div className="wn-d-card tall">
          <h2>🎙️ Today’s Schedule</h2>
          <p className="wn-sched-msg">Feature coming soon: auto-pull radio shows + events.</p>

          <ul className="wn-d-list">
            <li>
              <span>8:00 AM</span> Morning Vibes (FM)
            </li>
            <li>
              <span>12:00 PM</span> Midday Mix
            </li>
            <li>
              <span>3:00 PM</span> Drive Home Hype
            </li>
            <li>
              <span>7:00 PM</span> Southern Soul Hour
            </li>
          </ul>
        </div>

        {/* SYSTEM STATUS */}
        <div className="wn-d-card tall">
          <h2>⚙️ System Status</h2>

          <div className="wn-status-grid">
            <div className="wn-status-item ok">API: Online</div>
            <div className="wn-status-item ok">Database: Connected</div>
            <div className="wn-status-item ok">Storage: Active</div>
            <div className="wn-status-item warn">Media Queue: Normal</div>
          </div>
        </div>
      </section>
    </div>
  )
}
