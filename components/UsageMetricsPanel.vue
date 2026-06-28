<script setup>
import {
  formatDailyVisitors,
  formatMonthlyUniques,
  formatUpdatedAt,
  displayDailyAvg,
} from '~/utils/usageMetrics'

const props = defineProps({
  sites: { type: Array, default: () => [] },
  updatedAt: { type: String, default: null },
  windowDays: { type: Number, default: 30 },
  showSource: { type: Boolean, default: true },
})

const formattedDate = computed(() => formatUpdatedAt(props.updatedAt))
</script>

<template>
  <section v-if="sites.length" class="usage-panel">
    <header class="usage-panel__head">
      <div>
        <p class="usage-panel__eyebrow">Live usage</p>
        <h2 class="usage-panel__title">Tools with real traffic</h2>
        <p class="usage-panel__lead">
          Unique visitors from Cloudflare zone analytics. Only products above a daily threshold appear here — low-traffic experiments stay hidden automatically.
        </p>
      </div>
      <p v-if="formattedDate" class="usage-panel__updated">
        Updated {{ formattedDate }}
      </p>
    </header>

    <ul class="usage-panel__grid">
      <li v-for="site in sites" :key="site.id" class="usage-card">
        <div class="usage-card__top">
          <a
            :href="site.url"
            target="_blank"
            rel="noopener noreferrer"
            class="usage-card__label"
          >
            {{ site.label }}
            <i class="bx bx-link-external text-sm opacity-70" aria-hidden="true" />
          </a>
          <UsageMetricBadge :site="site" :window-days="windowDays" compact />
        </div>
        <dl class="usage-card__stats">
          <div>
            <dt>Daily visits</dt>
            <dd>{{ formatDailyVisitors(displayDailyAvg(site)) || '—' }}</dd>
          </div>
          <div>
            <dt>{{ windowDays }}-day visits</dt>
            <dd>{{ site.visits_30d ? site.visits_30d.toLocaleString() : '—' }}</dd>
          </div>
          <div v-if="site.unique_visitors_30d && !site.grouped">
            <dt>{{ windowDays }}-day uniques</dt>
            <dd>{{ formatMonthlyUniques(site.unique_visitors_30d) || '—' }}</dd>
          </div>
        </dl>
        <p v-if="site.grouped && site.hostname_breakdown?.length > 1" class="usage-card__aliases">
          {{ site.hostnames.length }} domains → same app
          <span class="usage-card__alias-list">
            ({{ site.hostnames.join(', ') }})
          </span>
        </p>
        <p v-if="site.note" class="usage-card__note">{{ site.note }}</p>
      </li>
    </ul>

    <p v-if="showSource" class="usage-panel__foot">
      Source: Cloudflare Analytics · {{ windowDays }}-day rolling window · synced daily
    </p>
  </section>
</template>

<style scoped>
.usage-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.usage-panel__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
}

.usage-panel__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(5 150 105);
}

.usage-panel__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.usage-panel__lead {
  margin: 0;
  max-width: 42rem;
  color: rgb(75 85 99);
  line-height: 1.6;
}

:global(.dark) .usage-panel__lead {
  color: rgb(156 163 175);
}

.usage-panel__updated {
  margin: 0;
  align-self: flex-start;
  font-size: 0.8125rem;
  color: rgb(107 114 128);
}

.usage-panel__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.usage-card {
  border: 1px solid rgb(229 231 235);
  border-radius: 0.875rem;
  padding: 1rem 1.125rem;
  background: white;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.06);
}

:global(.dark) .usage-card {
  background: rgb(17 24 39);
  border-color: rgb(55 65 81);
}

.usage-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.usage-card__label {
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.usage-card__label:hover {
  text-decoration: underline;
}

.usage-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.usage-card__stats dt {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(107 114 128);
  margin-bottom: 0.125rem;
}

.usage-card__stats dd {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.usage-card__aliases {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: rgb(107 114 128);
  line-height: 1.5;
}

.usage-card__alias-list {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.6875rem;
  opacity: 0.85;
}

.usage-card__note {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: rgb(107 114 128);
  font-style: italic;
}

.usage-panel__foot {
  margin: 0;
  font-size: 0.75rem;
  color: rgb(107 114 128);
}
</style>
