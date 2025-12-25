/* ============================================================
   IMPORTS
============================================================ */

// --- Validation / Normalization
import { generateSlug } from './slug'
import { normalizeScheduledPublishDate } from './normalizeScheduledPublishDate'

// --- Content & Metrics
import { calculateReadingTime } from './readingTime'
import { autoLastUpdated } from './lastUpdated'

// --- Workflow & Governance
import { enforceWorkflow } from './workflow'
import { requireEditorialNotes } from './workflowNotes'
import { rollbackFromVersion } from './rollbackFromVersion'
import { republishGuard } from './republishGuard'
import { prePublishChecklist } from './prePublishChecklist'

// --- Publishing
import { autoSetPublishDate } from './publishDate'
import { publishingHook } from './publishing'
import { autoSchedulePublishing } from './publishSchedule'

// --- Compliance / Commercial
import { enforceSponsored } from './enforceSponsored'

// --- Moderation
import { moderationHook } from './moderation'
import { enqueueModerationJobHook } from './enqueueModerationJob'

// --- Search / Read Models
import { searchIndexHook } from './searchIndex'

/* ============================================================
   ARTICLE HOOKS (ORDER MATTERS)
============================================================ */

export const articleHooks = {
  /* ----------------------------------------------------------
     BEFORE VALIDATE
     - No DB writes
     - Normalize user input
  ---------------------------------------------------------- */
  beforeValidate: [
    generateSlug,
    normalizeScheduledPublishDate, // timezone-safe scheduling
  ],

  /* ----------------------------------------------------------
     BEFORE CHANGE
     - Content mutation
     - Workflow enforcement
     - Validation gates
  ---------------------------------------------------------- */
  beforeChange: [
    autoLastUpdated, // timestamps first
    rollbackFromVersion, // restore content from versions
    calculateReadingTime, // derived metric
    enforceSponsored, // legal/commercial enforcement
    enforceWorkflow, // state machine + role gates
    requireEditorialNotes, // accountability
    prePublishChecklist, // publish readiness gate
    republishGuard, // republish semantics
    autoSetPublishDate, // publish timestamp
    moderationHook, // auto-flag → needs-correction
    searchIndexHook, // read-model sync
  ],

  /* ----------------------------------------------------------
     AFTER CHANGE
     - Side effects only
     - Safe background actions
  ---------------------------------------------------------- */
  afterChange: [
    enqueueModerationJobHook, // background AI moderation
    autoSchedulePublishing, // scheduled → published
  ],
}
