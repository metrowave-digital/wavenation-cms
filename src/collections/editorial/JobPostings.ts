import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const JobPostings: CollectionConfig = {
  slug: 'job-postings',
  labels: {
    singular: 'Job Posting',
    plural: 'Job Postings',
  },

  access: {
    read: () => true,
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  admin: {
    useAsTitle: 'title',
    group: 'HR & Recruiting',
    defaultColumns: ['title', 'department', 'status', 'location', 'createdAt'],
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'department',
      type: 'select',
      options: [
        { label: 'Radio', value: 'radio' },
        { label: 'Television', value: 'tv' },
        { label: 'Digital Media', value: 'digital' },
        { label: 'Programming', value: 'programming' },
        { label: 'Sales', value: 'sales' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Production', value: 'production' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'On-Air Talent', value: 'talent' },
        { label: 'Internship', value: 'internship' },
      ],
    },

    {
      name: 'employmentType',
      type: 'select',
      options: [
        { label: 'Full-Time', value: 'full-time' },
        { label: 'Part-Time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Temporary', value: 'temporary' },
        { label: 'Internship', value: 'internship' },
      ],
    },

    { name: 'location', type: 'text' },
    { name: 'remote', type: 'checkbox', defaultValue: false },

    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Paused', value: 'paused' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'open',
    },

    { name: 'salaryRange', type: 'text' },
    { name: 'description', type: 'richText', required: true },
    { name: 'applyUrl', type: 'text', admin: { placeholder: 'Link to application page' } },

    // SEO
    SEOFields,
  ],
}
