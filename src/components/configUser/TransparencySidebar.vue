<template>
  <Toast />

  <div class="transparency-card">
    <div class="card-header">
      <div class="card-title">
        <BookOpen class="icon" />
        Transparência
      </div>
      <div class="card-description">
        Acesso facilitado: finalidade, base, retenção, DPO, direitos.
      </div>
    </div>

    <div class="card-content">
      <div class="terms-section">
        <div class="terms-row">
          <div class="terms-info">
            <span class="terms-label">Termo de Uso</span>
            <div v-if="termsAcceptedAt" class="terms-accepted">
              Aceito em: {{ termsAcceptedAt }}
            </div>
          </div>
          <button class="btn-outline" @click="termsOpen = true">
            <Eye class="icon-sm" />
            Ver
          </button>
        </div>
      </div>

      <div class="separator"></div>

      <div class="contacts-section">
        <p class="section-label">DPO & Contatos</p>
        <div class="contact-item">
          <Mail class="icon-sm" />
          manolito.pardal@gmail.com
        </div>
      </div>
    </div>

    <ContractComponent v-model:visible="termsOpen" :actualTerm="actualTerm" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { BookOpen, Eye, Mail } from 'lucide-vue-next'
import ContractComponent from '@/components/contract/ContractComponent.vue'
import { getActualTermByUser } from '@/api/ContractApi.ts'
import { getSessionItem } from '@/api/session/SessionManagement.ts'

const termsOpen = ref(false)
const termsAcceptedAt = ref<string | null>(null)
const actualTerm = ref()
const toast = useToast()

function nowStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function acceptTerms() {
  termsAcceptedAt.value = nowStr()
  termsOpen.value = false
  toast.add({
    severity: 'success',
    summary: 'Termos Aceitos',
    detail: 'Você aceitou os termos de uso com sucesso.',
    life: 3000,
  })
}

onMounted(() => {
  const userId = getSessionItem('userId');

  if (userId) {
    getActualTermByUser(userId as string).then((response) => {

      const tempChecks: any[] = [];

      response.checks.forEach((check: any) => {
        const checkData = {
          checkId: check.checkId,
          label: check.label,
          required: check.required!,
          checked: check.check
        };

        tempChecks.push(checkData);
      });

      console.log(response);

      actualTerm.value = {
        termsId: response.term.termsId,
        title: response.term.title,
        content: response.term.content,
        checkList: tempChecks
      };

    });
  }
});
</script>

<style scoped>
.transparency-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-header {
  padding: 2.5rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.card-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.card-content {
  padding: 2.5rem;
}

.terms-section {
  margin-bottom: 1rem;
}

.terms-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.terms-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.terms-label {
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
}

.terms-accepted {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-accept {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: #1e293b;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept:hover {
  background: #0f172a;
}

.separator {
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.contacts-section {
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.dialog-header {
  padding-bottom: 1rem;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.dialog-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.dialog-content {
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 1rem;
}

.terms-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.terms-item {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #334155;
  margin: 0;
}

.terms-item strong {
  font-weight: 700;
  color: #0f172a;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 0 0;
  margin: 1rem -1.5rem -1rem -1.5rem;
  padding: 1rem 1.5rem;
}

.dialog-content::-webkit-scrollbar {
  width: 8px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
