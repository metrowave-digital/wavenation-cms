// src/types/external-modules.d.ts

declare module 'fluent-ffmpeg' {
  // We keep this minimal to avoid type headaches.
  // If you want stronger typing later, you can install @types/fluent-ffmpeg
  // and remove this declaration.
  const ffmpeg: any
  export default ffmpeg
}
