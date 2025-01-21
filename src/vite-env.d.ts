/// <reference types="vite/client" />
//
interface ImportMetaEnv {
  readonly VITE_LAST_FM_API_KEY: string
  readonly VITE_LAST_FM_SHARED_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
