/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    openFiles: () => Promise<{ filePaths: string[]; canceled: boolean }>
  }
}
