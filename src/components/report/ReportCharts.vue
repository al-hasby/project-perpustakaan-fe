<template>
  <div class="charts-grid">
    <!-- Donut Chart: Borrow Status -->
    <div class="chart-card">
      <h3 class="chart-title">Status Peminjaman</h3>
      <div class="donut-section">
        <div class="donut-wrap">
          <svg viewBox="0 0 120 120" class="donut-svg">
            <circle
              v-for="(seg, i) in donutSegments"
              :key="i"
              class="donut-segment"
              :class="'seg-' + seg.type"
              cx="60" cy="60" r="50"
              fill="none"
              :stroke="seg.color"
              stroke-width="18"
              :stroke-dasharray="seg.dasharray"
              :stroke-dashoffset="seg.offset"
              :style="{ animationDelay: (i * 0.15) + 's' }"
            />
            <circle cx="60" cy="60" r="41" fill="var(--color-surface)" />
            <text x="60" y="57" text-anchor="middle" class="donut-total">{{ totalBorrows }}</text>
            <text x="60" y="70" text-anchor="middle" class="donut-label">Total</text>
          </svg>
        </div>
        <div class="donut-legend">
          <div v-for="item in legendItems" :key="item.label" class="legend-item">
            <span class="legend-dot" :style="{ background: item.color }"></span>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bar Chart: Books by Category -->
    <div class="chart-card">
      <h3 class="chart-title">Buku per Kategori</h3>
      <div class="bar-chart">
        <div v-for="(cat, i) in categoryBars" :key="cat.name" class="bar-row">
          <span class="bar-label">{{ cat.name }}</span>
          <div class="bar-track">
            <div
              class="bar-fill"
              :class="'bar-color-' + (i % 5)"
              :style="{ width: cat.pct + '%', animationDelay: (i * 0.08) + 's' }"
            ></div>
          </div>
          <span class="bar-count">{{ cat.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getData } from '@/data/store.js'

const data = computed(() => getData())

const totalBorrows = computed(() => data.value.borrows?.length || 0)

const statusCounts = computed(() => {
  const borrows = data.value.borrows || []
  return {
    returned: borrows.filter(b => b.status === 'dikembalikan').length,
    borrowed: borrows.filter(b => b.status === 'dipinjam').length,
    pending: borrows.filter(b => b.status === 'menunggu').length,
    rejected: borrows.filter(b => b.status === 'ditolak').length,
  }
})

const CIRCUMFERENCE = 2 * Math.PI * 50

const donutSegments = computed(() => {
  const total = totalBorrows.value
  if (!total) return []

  const colors = {
    borrowed: '#3B82F6',
    returned: '#22C55E',
    pending: '#F59E0B',
    rejected: '#EF4444',
  }

  const items = [
    { type: 'borrowed', count: statusCounts.value.borrowed, color: colors.borrowed },
    { type: 'returned', count: statusCounts.value.returned, color: colors.returned },
    { type: 'pending', count: statusCounts.value.pending, color: colors.pending },
    { type: 'rejected', count: statusCounts.value.rejected, color: colors.rejected },
  ].filter(s => s.count > 0)

  let cumulativeOffset = 0
  return items.map(item => {
    const pct = item.count / total
    const length = pct * CIRCUMFERENCE
    const gap = items.length > 1 ? 4 : 0
    const seg = {
      type: item.type,
      color: item.color,
      dasharray: `${Math.max(length - gap, 1)} ${CIRCUMFERENCE}`,
      offset: -cumulativeOffset + CIRCUMFERENCE * 0.25,
    }
    cumulativeOffset += length
    return seg
  })
})

const legendItems = computed(() => {
  const colors = {
    borrowed: '#3B82F6',
    returned: '#22C55E',
    pending: '#F59E0B',
    rejected: '#EF4444',
  }
  const labels = {
    borrowed: 'Dipinjam',
    returned: 'Dikembalikan',
    pending: 'Menunggu',
    rejected: 'Ditolak',
  }
  return Object.entries(statusCounts.value)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      label: labels[key],
      count,
      color: colors[key],
    }))
})

const categoryBars = computed(() => {
  const books = data.value.books || []
  const counts = {}
  books.forEach(b => {
    const cat = b.kategori || 'Lainnya'
    counts[cat] = (counts[cat] || 0) + 1
  })
  const sorted = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  const max = sorted.length ? sorted[0].count : 1
  return sorted.map(c => ({
    ...c,
    pct: Math.round((c.count / max) * 100),
  }))
})
</script>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  padding: 24px;
  transition: box-shadow 0.2s;
}

.chart-card:hover {
  box-shadow: var(--shadow-md);
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 20px;
}

/* ── Donut ── */
.donut-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-wrap {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-segment {
  stroke-linecap: round;
  animation: donutDraw 0.8s ease forwards;
  opacity: 0;
}

@keyframes donutDraw {
  from {
    opacity: 0;
    stroke-dasharray: 0 314.16;
  }
  to {
    opacity: 1;
  }
}

.donut-total {
  font-size: 22px;
  font-weight: 700;
  fill: var(--color-text);
  transform: rotate(90deg);
  transform-origin: center;
}

.donut-label {
  font-size: 9px;
  font-weight: 500;
  fill: var(--color-text-muted);
  transform: rotate(90deg);
  transform-origin: center;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 13px;
  color: var(--color-text-muted);
  flex: 1;
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

/* ── Bar Chart ── */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  width: 90px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  text-align: right;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-track {
  flex: 1;
  height: 22px;
  background: var(--color-bg);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  animation: barGrow 0.6s ease forwards;
  transform-origin: left;
  min-width: 4px;
}

@keyframes barGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.bar-color-0 { background: #3B82F6; }
.bar-color-1 { background: #8B5CF6; }
.bar-color-2 { background: #22C55E; }
.bar-color-3 { background: #F59E0B; }
.bar-color-4 { background: #EF4444; }

.bar-count {
  width: 24px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  text-align: right;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .donut-section {
    flex-direction: column;
    align-items: center;
  }

  .bar-label {
    width: 70px;
    font-size: 11px;
  }
}
</style>
