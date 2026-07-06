import resumeData from '~/public/data/resume.json'

export function useResumeData() {
  const { data: resume, pending: loading, error } = useAsyncData('resume-data', () => resumeData)

  return { resume, loading, error }
}
