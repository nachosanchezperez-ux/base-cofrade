import 'server-only'

import { AsyncLocalStorage } from 'node:async_hooks'

const publicReadStorage = new AsyncLocalStorage()

export function runWithPublicSupabaseRead(callback) {
  return publicReadStorage.run(true, callback)
}

export function isPublicSupabaseRead() {
  return publicReadStorage.getStore() === true
}
