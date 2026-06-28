<template>
  <div class="resume-root">
    <div v-if="loading" class="status">Loading resume timeline…</div>
    <div v-else-if="error" class="status error">Failed to load resume data: {{ errorMessage }}</div>
    <div v-else-if="!hasResume" class="status">No resume data available yet.</div>
    <div v-else class="resume-content">
      <header class="resume-header">
        <div>
          <p class="eyebrow">Structured resume</p>
          <h1>
            <span class="public-name">{{ personal.name }}</span>
            <span class="print-name">{{ fullNameForPrint }}</span>
          </h1>
          <p class="tagline">
            {{ personal.title }}
            <span>·</span>
            {{ personal.location }}
          </p>
          <div class="summary">
            <p v-for="line in summaryLines" :key="line">{{ line }}</p>
          </div>
          <div v-if="publicLinks.length" class="public-links">
            <a
              v-for="link in publicLinks"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener"
            >{{ formatLinkText(link.url) }}</a>
          </div>
        </div>
        <div class="header-actions">
          <button type="button" class="secondary" @click="togglePrivateForm">
            {{ showPrivateForm ? 'Hide' : 'Add' }} private info
          </button>
          <button type="button" class="primary" @click="exportResume">Export PDF</button>
        </div>
      </header>

      <section ref="privatePanelRef" class="private-panel">
        <div class="panel-header">
          <h3>Private contact details</h3>
          <p>These values stay in this browser session and are only used at export time.</p>
        </div>
        <form v-if="showPrivateForm" class="private-form" @submit.prevent="submitPrivateDetails">
          <div class="form-fields">
            <label v-for="(field, idx) in contactFields" :key="field?.key || idx">
              <span>{{ field.label }}</span>
              <input
                v-model="privateInfo[field?.key]"
                :placeholder="field.placeholder"
                type="text"
                :name="field.key"
              />
            </label>
          </div>
          <div class="form-actions">
            <button class="primary" type="submit" :disabled="!hasPrivateInfo">Save & Print</button>
            <button class="ghost" type="button" @click="closePrivateForm">Cancel</button>
          </div>
          <p class="form-note">
            The data remains in the current tab only. Close the tab to clear all private values.
          </p>
        </form>
        <div v-else class="panel-foot">
          <p>Click “Export PDF” and the page will ask for private info before printing.</p>
        </div>
      </section>

      <section v-if="hasPrivateInfo" class="contact-preview screen-only">
        <template v-for="(field, idx) in contactFields" :key="field?.key || idx">
          <div v-if="field && privateInfo[field.key]" class="contact-row">
            <span class="contact-label">{{ field.label }}:</span>
            <span class="contact-value">{{ privateInfo[field.key] }}</span>
          </div>
        </template>
      </section>

      <section v-if="hasPrivateInfo" class="contact-preview contact-preview-print">
        <template v-for="(field, idx) in contactFields" :key="field?.key || idx">
          <div v-if="field && field.key !== 'fullName' && privateInfo[field.key]" class="contact-row">
            <span class="contact-label">{{ field.label }}:</span>
            <span class="contact-value">{{ privateInfo[field.key] }}</span>
          </div>
        </template>
      </section>

      <section v-if="skillGroups.length" class="skill-grid">
        <article v-for="group in skillGroups" :key="group.category">
          <h3>{{ group.label }}</h3>
          <p>{{ group.items.join(', ') }}</p>
        </article>
      </section>

      <section v-if="timeline.length" class="timeline">
        <article v-for="entry in timeline" :key="entry.id || entry.range" class="timeline-card">
          <header class="timeline-head">
            <div>
              <p class="timeline-role">{{ entry.role }}</p>
              <p class="timeline-company">
                {{ entry.company }}<span v-if="entry.location"> · {{ entry.location }}</span>
              </p>
            </div>
            <p class="timeline-range">{{ entry.range }}</p>
          </header>
          <p class="timeline-short">{{ entry.short_description }}</p>
          <div
            v-if="entry.long_description"
            class="timeline-long"
            v-html="renderMarkdown(entry.long_description)"
          />
          <div v-if="entry.technologies?.length" class="tech-tags">
            <span v-for="tech in entry.technologies" :key="tech">{{ tech }}</span>
          </div>
          <ul v-if="entry.highlights?.length" class="highlights">
            <li v-for="highlight in entry.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </article>
      </section>

      <section v-if="hasLiveUsage" class="live-usage-section screen-only">
        <div class="live-usage-head">
          <h2>Selected projects — live usage</h2>
          <NuxtLink to="/impact" class="live-usage-link">Full metrics →</NuxtLink>
        </div>
        <ul class="live-usage-list">
          <li v-for="site in usageSites" :key="site.id">
            <a :href="site.url" target="_blank" rel="noopener">{{ site.label }}</a>
            <span>{{ formatDailyVisitors(displayDailyAvg(site)) }} ({{ windowDays }}d)</span>
          </li>
        </ul>
        <p v-if="usageUpdatedLabel" class="live-usage-note">Cloudflare Analytics · updated {{ usageUpdatedLabel }}</p>
      </section>

      <NuxtLink to="/" class="back-link">← Back to portfolio</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { formatDailyVisitors, formatUpdatedAt, displayDailyAvg } from '~/utils/usageMetrics'

definePageMeta({ layout: 'resume' })

useHead({
  title: 'Resume — Jovylle Bermudez',
  meta: [
    {
      name: 'description',
      content: 'Print-ready structured resume for Jovylle Bermudez. Export to PDF with optional private contact details.',
    },
    { name: 'robots', content: 'noindex' },
  ],
})

const { resume, loading, error } = useResumeData()
const { sites: usageSites, hasSites: hasLiveUsage, updatedAt, windowDays } = useUsageMetrics()

const usageUpdatedLabel = computed(() => formatUpdatedAt(updatedAt.value))

const privatePanelRef = ref(null)
const hasResume = computed(() => Boolean(resume.value?.personal?.name))
const timeline = computed(() => resume.value?.timeline ?? [])
const skillCategoryLabels = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  databases_and_apis: 'Databases & APIs',
  web_and_cloud: 'Web & Cloud',
  devops_and_version_control: 'DevOps & Version Control',
  other: 'Other',
}
const skillGroups = computed(() => {
  const skills = resume.value?.skills
  if (!skills || Array.isArray(skills)) return skills ?? []
  return Object.entries(skills).map(([category, items]) => ({
    category,
    label: skillCategoryLabels[category] ?? category.replace(/_/g, ' '),
    items,
  }))
})
const personal = computed(() => resume.value?.personal ?? {})
const summary = computed(() => resume.value?.summary ?? [])
const summaryLines = computed(() => {
  if (Array.isArray(summary.value)) return summary.value
  return summary.value ? [summary.value] : []
})

const errorMessage = computed(() => {
  const err = error.value
  if (!err) return ''
  return err.message ?? String(err)
})

const privateInfo = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
})

const contactFields = [
  { key: 'fullName', label: 'Full name (PDF only)', placeholder: 'Your full name' },
  { key: 'phone', label: 'Phone', placeholder: '+63 9xx xxx xxxx' },
  { key: 'email', label: 'Email', placeholder: 'me@jovylle.com' },
  { key: 'address', label: 'Address', placeholder: 'Cebu, Philippines' },
]

const showPrivateForm = ref(false)
const defaultPdfTitle = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `resume-${year}-${month}-${day}.pdf`
})

const hasPrivateInfo = computed(() =>
  Object.values(privateInfo.value).some((value) => value && value.trim().length > 0)
)

const publicLinks = computed(() => {
  const links = []
  if (personal.value.website) links.push({ label: 'Portfolio', url: personal.value.website })
  if (personal.value.projectsArchive) {
    links.push({ label: 'Projects archive', url: personal.value.projectsArchive })
  }
  if (personal.value.linkedin) links.push({ label: 'LinkedIn', url: personal.value.linkedin })
  return links
})

const fullNameForPrint = computed(() => privateInfo.value.fullName?.trim() || personal.value.name)

const formatLinkText = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.host + parsed.pathname
  } catch {
    return url
  }
}

const scrollToPanel = () => {
  nextTick(() => {
    privatePanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const togglePrivateForm = () => {
  showPrivateForm.value = !showPrivateForm.value
  if (showPrivateForm.value) scrollToPanel()
}

const closePrivateForm = () => {
  showPrivateForm.value = false
}

const submitPrivateDetails = () => {
  if (!hasPrivateInfo.value) return
  showPrivateForm.value = false
  triggerPrint()
}

const exportResume = () => {
  if (!hasPrivateInfo.value) {
    showPrivateForm.value = true
    scrollToPanel()
    return
  }
  triggerPrint()
}

const renderMarkdown = (value) => {
  if (!value) return ''
  return marked.parse(value)
}

const withPdfTitle = (callback) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    callback()
    return
  }

  const previousTitle = document.title
  document.title = defaultPdfTitle.value

  const restoreTitle = () => {
    document.title = previousTitle
    window.removeEventListener('afterprint', restoreTitle)
  }

  window.addEventListener('afterprint', restoreTitle, { once: true })
  callback()

  window.setTimeout(() => {
    if (document.title === defaultPdfTitle.value) restoreTitle()
  }, 1000)
}

const triggerPrint = () => {
  if (typeof window === 'undefined') return
  withPdfTitle(() => window.print())
}
</script>

<style scoped>
.resume-root {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status {
  background: #fff3cd;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid #ffeeba;
  color: #856404;
  font-weight: 500;
}

.status.error {
  background: #ffe3e3;
  border-color: #ffb4b4;
  color: #b12a2a;
}

.resume-header {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.25rem;
}

.tagline {
  margin: 0.25rem 0;
  color: #475569;
  font-size: 1rem;
}

.summary {
  margin: 0.5rem 0 0;
  color: #334155;
  max-width: 68ch;
  line-height: 1.5;
}

.summary p {
  margin: 0.15rem 0;
}

.public-links {
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.public-links a {
  color: #1d4ed8;
  font-weight: 600;
}

.public-name {
  display: inline;
}

.print-name {
  display: none;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

button {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.65rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
}

.primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.35);
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.secondary {
  background: white;
  border-color: #cbd5f5;
  color: #1d1b85;
}

.ghost {
  background: transparent;
  border-color: #e5e7eb;
  color: #4b5563;
}

.contact-preview {
  padding: 1rem 1.25rem;
  background: #f8fafc;
  color: #0f172a;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.screen-only {
  display: grid;
}

.contact-preview-print {
  display: none;
}

.contact-row {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.contact-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.75;
}

.contact-value {
  font-weight: 600;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.skill-grid article {
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  min-height: 120px;
}

.skill-grid h3 {
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.skill-grid p {
  margin: 0;
  font-size: 0.95rem;
  color: #1f2937;
  line-height: 1.5;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timeline-card {
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  background: white;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.timeline-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.timeline-role {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
}

.timeline-company {
  margin: 0.25rem 0 0;
  color: #475569;
  font-size: 0.9rem;
}

.timeline-range {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.timeline-short {
  margin: 1rem 0 0.5rem;
  color: #1f2937;
}

.timeline-long {
  margin-bottom: 0.75rem;
  color: #1e293b;
  line-height: 1.6;
}

.timeline-long :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.timeline-long :deep(ul) {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  color: #334155;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tech-tags span {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.82rem;
  border: 1px solid #c7d2fe;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.highlights {
  margin: 0;
  padding-left: 1.25rem;
  color: #0f172a;
  list-style: disc;
  line-height: 1.5;
}

.private-panel {
  background: white;
  border-radius: 20px;
  border: 1px dashed #cbd5f5;
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.panel-header p {
  margin: 0.35rem 0 0;
  color: #475569;
  font-size: 0.9rem;
}

.private-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.form-fields label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #475569;
}

.form-fields input {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.form-note {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #1d4ed8;
  font-weight: 600;
}

.live-usage-section {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
}

.live-usage-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.live-usage-head h2 {
  margin: 0;
  font-size: 1.05rem;
}

.live-usage-link {
  font-size: 0.875rem;
  color: #059669;
  text-decoration: none;
}

.live-usage-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.live-usage-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9375rem;
}

.live-usage-list a {
  color: #111827;
  font-weight: 600;
  text-decoration: none;
}

.live-usage-list span {
  color: #047857;
  white-space: nowrap;
}

.live-usage-note {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.panel-foot {
  margin-top: 1rem;
  color: #475569;
}


@media (max-width: 768px) {
  .resume-header {
    flex-direction: column;
  }

  .panel-header h3 {
    font-size: 1rem;
  }
}
</style>

<style>
@media print {
  @page {
    margin: 10mm;
  }

  html,
  body {
    background: #fff !important;
    color: #111 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Hide site nav, footer, widget — print resume content only */
  body * {
    visibility: hidden;
  }

  .resume-root,
  .resume-root * {
    visibility: visible;
  }

  .resume-root {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  .back-link,
  .header-actions,
  .private-panel,
  .eyebrow,
  .screen-only {
    display: none !important;
    visibility: hidden !important;
  }

  .resume-header {
    display: block;
    box-shadow: none;
  }

  .resume-header > div {
    width: 100%;
  }

  .summary {
    max-width: 42ch;
  }

  .tech-tags span {
    background: #eef2ff !important;
    border-color: #c7d2fe !important;
    color: #3730a3 !important;
  }

  .contact-preview-print {
    display: grid !important;
    background: transparent;
    color: #111;
    border: none;
    box-shadow: none;
  }

  .public-name {
    display: none !important;
  }

  .print-name {
    display: inline !important;
  }
}
</style>
