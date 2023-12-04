export function dirtyCache() {
    isCacheDirty = true
}

export function cleanCache() {
    isCacheDirty = false
}

export let isCacheDirty = true