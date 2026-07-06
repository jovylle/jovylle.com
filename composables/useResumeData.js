import { CONTENT_ASSET_BASE } from '~/utils/config'

export function useResumeData() {
  const { data: resume, pending: loading, error } = useAsyncData('resume-data', () =>
    $fetch(`${CONTENT_ASSET_BASE}/data/resume.json`),
  )

  return { resume, loading, error }
}
