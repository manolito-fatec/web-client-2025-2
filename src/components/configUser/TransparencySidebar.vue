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
          dpo@suaempresa.com
        </div>
        <div class="contact-item">
          <Globe class="icon-sm" />
          privacidade.suaempresa.com
        </div>
      </div>
    </div>

    <Dialog v-model:visible="termsOpen" modal :style="{ width: '50rem' }" :dismissableMask="true">
      <template #header>
        <div class="dialog-header">
          <h2 class="dialog-title">Termo de Uso da Plataforma</h2>
          <p class="dialog-description">
            Condições de uso do serviço; vínculo contratual entre empresa cliente e controladora.
          </p>
        </div>
      </template>

      <div class="dialog-content">
        <div class="terms-content">
          <p class="terms-item">
            <strong>Objeto:</strong> acesso e utilização da aplicação para visualização de insights operacionais.
          </p>
          <p class="terms-item">
            <strong>Contas:</strong> credenciais individuais; proibição de compartilhamento de senhas; obrigação de manter informações atualizadas.
          </p>
          <p class="terms-item">
            <strong>Responsabilidades:</strong> uso conforme políticas internas da empresa cliente; não violar confidencialidade ou direitos de terceiros.
          </p>
          <p class="terms-item">
            <strong>Privacidade:</strong> tratamento de dados pessoais conforme LGPD; canais de exercício de direitos.
          </p>
          <p class="terms-item">
            <strong>Segurança:</strong> reporte de incidentes; medidas técnicas adotadas pela plataforma.
          </p>
          <p class="terms-item">
            <strong>Retenção e Encerramento:</strong> regras de retenção e eliminação após término do contrato ou solicitação do titular, respeitando bases legais.
          </p>
          <p class="terms-item">
            <strong>Foro e Vigência:</strong> disposições contratuais padrão para solução de conflitos e prazo de vigência.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button class="btn-accept" @click="acceptTerms">
            <CheckCircle2 class="icon-sm" />
            Aceitar termos de uso
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { BookOpen, Eye, Mail, Globe, CheckCircle2 } from 'lucide-vue-next'

const termsOpen = ref(false)
const termsAcceptedAt = ref(null)
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
    life: 3000
  })
}
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