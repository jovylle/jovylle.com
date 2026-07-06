import { CONTENT_ASSET_BASE } from '~/utils/config'

export function useCms(path, options = {}) {
  const url = `${CONTENT_ASSET_BASE}/data/${path.replace(/^\//, '')}`

  const { data, pending, error } = useAsyncData(
    options.key ?? `cms:${path}`,
    () => $fetch(url),
    options,
  )

  return { data, loading: pending, error }
}

export function useCmsClient(path, options = {}) {
  const url = `${CONTENT_ASSET_BASE}/data/${path.replace(/^\//, '')}`

  const { data, pending, error } = useFetch(url, {
    server: false,
    ...options,
  })

  return { data, loading: pending, error }
}
