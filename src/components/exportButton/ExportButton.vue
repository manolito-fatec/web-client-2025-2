<template>
  <div class="export-button-container">
    <Button
      type="button"
      label="Exportar"
      icon="pi pi-chevron-down"
      iconPos="right"
      @click="toggleMenu"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      class="p-button-outlined"
    />
    <Menu id="overlay_menu" ref="menu" :model="exportOptions" :popup="true" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import html2canvas from 'html2canvas'

import { exportCsv, exportPdf } from '@/api/ExportApi.ts'
import type { PdfExportRequest } from '@/types/InsightType/ExportType.ts'

const props = defineProps<{
  metricsSection: HTMLElement | null
  productChartSection: HTMLElement | null
  timeChartSection: HTMLElement | null
  otherSection?: HTMLElement | null
  setExporting: (value: boolean) => void
  getExportFilterOptions?: () => { reportTitle: string; clientId: number | undefined }
}>()

const menu = ref()

const toggleMenu = (event: any) => {
  menu.value.toggle(event)
}

const handleExportCsv = async () => {
  const filterOptions = props.getExportFilterOptions
    ? props.getExportFilterOptions()
    : { reportTitle: 'Relatório', clientId: undefined }

  const { clientId } = filterOptions

  try {
    await exportCsv(clientId)
  } catch (error) {
    console.error('Falha no download do CSV', error)
    alert('Falha na exportação do CSV.')
  }
}

const handleExportPdf = async () => {
  props.setExporting(true)
  try {
    const graphsBase64: string[] = []

    if (props.metricsSection) {
      const canvas = await html2canvas(props.metricsSection, { scale: 2, useCORS: true })
      graphsBase64.push(canvas.toDataURL('image/png'))
    }

    if (props.productChartSection) {
      const canvas = await html2canvas(props.productChartSection, { scale: 2, useCORS: true })
      graphsBase64.push(canvas.toDataURL('image/png'))
    }

    if (props.otherSection) {
      const canvas = await html2canvas(props.otherSection, { scale: 2, useCORS: true })
      graphsBase64.push(canvas.toDataURL('image/png'))
    }

    if (props.timeChartSection) {
      const canvas = await html2canvas(props.timeChartSection, { scale: 2, useCORS: true })
      graphsBase64.push(canvas.toDataURL('image/png'))
    }

    const filterOptions = props.getExportFilterOptions
      ? props.getExportFilterOptions()
      : { reportTitle: 'Relatório Dashboard', clientId: undefined }

    const requestBody: PdfExportRequest = {
      reportTitle: filterOptions.reportTitle,
      graphImagesBase64: graphsBase64,
      clientId: filterOptions.clientId,
    }

    await exportPdf(requestBody)
  } catch (error) {
    console.error('Falha ao gerar PDF', error)
    alert('Falha na exportação do PDF.')
  } finally {
    props.setExporting(false)
  }
}

const exportOptions = ref([
  {
    label: 'Exportar CSV',
    icon: 'pi pi-file-excel',
    command: () => handleExportCsv(),
  },
  {
    label: 'Exportar PDF',
    icon: 'pi pi-file-pdf',
    command: () => handleExportPdf(),
  },
])
</script>

<style scoped>
.export-button-container {
  display: flex;
}
</style>

