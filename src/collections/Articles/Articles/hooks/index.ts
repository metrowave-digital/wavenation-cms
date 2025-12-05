import { generateSlug } from './slug'
import { calculateReadingTime } from './readingTime'
import { enforceWorkflow } from './workflow'
import { requireEditorialNotes } from './workflowNotes'
import { autoSetPublishDate } from './publishDate'
import { autoLastUpdated } from './lastUpdated'
import { autoSchedulePublishing } from './publishSchedule'

export const articleHooks = {
  beforeValidate: [generateSlug],
  beforeChange: [
    enforceWorkflow,
    requireEditorialNotes,
    autoSetPublishDate,
    autoLastUpdated,
    calculateReadingTime,
  ],
  afterChange: [autoSchedulePublishing],
}
