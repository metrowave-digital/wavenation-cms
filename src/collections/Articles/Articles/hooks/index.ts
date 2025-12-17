import { generateSlug } from './slug'
import { calculateReadingTime } from './readingTime'
import { enforceWorkflow } from './workflow'
import { requireEditorialNotes } from './workflowNotes'
import { autoSetPublishDate } from './publishDate'
import { autoLastUpdated } from './lastUpdated'
import { autoSchedulePublishing } from './publishSchedule'
import { enforceSponsored } from './enforceSponsored'

export const articleHooks = {
  beforeValidate: [generateSlug],

  beforeChange: [
    enforceWorkflow,
    requireEditorialNotes,
    enforceSponsored,
    autoSetPublishDate,
    autoLastUpdated,
    calculateReadingTime,
  ],

  afterChange: [autoSchedulePublishing],
}
