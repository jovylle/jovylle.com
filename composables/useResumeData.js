export function useResumeData() {
  const { data: resume, pending: loading, error } = useFetch('/data/resume.json', {
    key: 'resume-data',
  })

  return { resume, loading, error }
}
