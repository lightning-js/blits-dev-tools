// Simple type helpers for test files

declare global {
  // Helper types for VS Code API responses
  type VSCodeCompletionList = {
    items: Array<{
      label: string | { label: string; description?: string }
      kind?: number
      detail?: string
      documentation?: string
    }>
    isIncomplete?: boolean
  }

  type VSCodeHover = {
    contents: Array<{ value: string } | string>
    range?: any
  }

  type VSCodeSignatureHelp = {
    signatures: Array<{
      label: string
      documentation?: string
      parameters?: Array<{ label: string; documentation?: string }>
    }>
    activeSignature?: number
    activeParameter?: number
  }
}
