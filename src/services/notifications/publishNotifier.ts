// src/services/notifications/publishNotifier.ts

export const notifyPublish = async (article: {
  id?: string
  title?: string
  publishedDate?: string
}) => {
  console.log('[PUBLISH ALERT]', article.title)
}
