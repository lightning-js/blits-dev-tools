/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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
