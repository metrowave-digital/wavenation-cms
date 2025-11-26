type SanitizeContentArgs = {
  data: {
    body?: string
    [key: string]: any
  }
}

export const sanitizeContent = ({ data }: SanitizeContentArgs) => {
  if (!data.body) return data

  let body = data.body

  // 1️⃣ Remove <script> tags completely
  body = body.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')

  // 2️⃣ Remove javascript: URLs
  body = body.replace(/javascript:/gi, '')

  // 3️⃣ Remove inline event handlers (onclick, onload, etc.)
  body = body.replace(/on\w+="[^"]*"/gi, '')
  body = body.replace(/on\w+='[^']*'/gi, '')

  // 4️⃣ Remove dangerous <iframe> embeds
  body = body.replace(/<iframe[\s\S]*?<\/iframe>/gi, '')

  // 5️⃣ Remove <object>, <embed>, <applet>
  body = body.replace(/<(object|embed|applet)[\s\S]*?<\/\1>/gi, '')

  // 6️⃣ Remove SVG script vectors
  body = body.replace(/<svg[\s\S]*?>[\s\S]*?<\/svg>/gi, '')

  // 7️⃣ Remove base64-encoded scripts
  body = body.replace(/data:text\/html;base64,[A-Za-z0-9+\/=]+/gi, '')

  data.body = body

  return data
}
