/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    /// add more env variables...   
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}