<template>
  <div class="resume-layout min-h-screen bg-white text-slate-900">
    <slot />
  </div>
</template>

<style>
@media print {
  @page {
    margin: 10mm;
  }

  html,
  body {
    background: #fff !important;
  }

  .resume-layout {
    min-height: auto !important;
  }
}
</style>
