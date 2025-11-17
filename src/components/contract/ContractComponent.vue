<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ actualTerm?.title || 'Termos de Uso e Privacidade' }}</h2>
        <button class="close-button" @click="$emit('close')">
        </button>
      </header>

      <div class="terms-scroll-area">
        <section class="terms-content-section">
          <div class="version-info">
            <span class="version-text">Conteúdo dos Termos</span>
          </div>

          <div class="lgpd-text">
            <p>{{actualTerm?.content}}</p>
          </div>
        </section>

        <section class="terms-checkboxes-section">
          <template v-if="actualTerm && actualTerm.checkList">
            <div
              v-for="(item, index) in actualTerm.checkList"
              :key="item.checkId"
              class="dynamic-term-container"
            >
              <div class="term-item" :class="item.required ? 'required' : 'optional'">
                <label class="term-label">
                  <input
                    type="checkbox"
                    v-model="checkStates[item.checkId]"
                  />
                  <div class="text-group">
                    <span class="term-main-line">
                      <span class="term-title">
                        {{ item.required ? 'Cláusula obrigatória:' : 'Cláusula opcional:' }}
                      </span>
                      <span class="term-description">
                        {{ item.label }}
                      </span>
                    </span>
                  </div>
                </label>
              </div>

              <div
                v-if="index < actualTerm.checkList.length - 1"
                class="separator"
              ></div>
            </div>
          </template>

          <div v-else>
            <p>Carregando termos...</p>
          </div>
        </section>
      </div>

      <footer class="modal-footer">
        <span class="optional-count"
        >Opcionais aceitos: {{ acceptedOptionalCount }}/{{ totalOptionalCount }}</span
        >
        <button class="register-link-button" :disabled="!isFormValid" @click="submitTerms">
          Enviar link de cadastro
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, onMounted } from 'vue'
import type { NewUser } from '@/types/NewUser.ts'
import { getSessionItem } from '@/api/session/SessionManagement.ts'
import { signApi } from '@/api/SignApi.ts'
import { useToast } from 'primevue/usetoast'
import { getActualTerm } from '@/api/ContractApi.ts'

const toast = useToast()
const showError = (errorSum: string, errorMsg: string) => {
  toast.add({ severity: 'error', summary: errorSum, detail: errorMsg, life: 6000 })
}

const newUser: Ref<NewUser> = ref<NewUser>(JSON.parse(<string>getSessionItem('newUser')))

const actualTerm: Ref<any> = ref(null)
const checkStates: Ref<Record<number, boolean>> = ref({})

const acceptedOptionalCount = computed(() => {
  if (!actualTerm.value || !actualTerm.value.checkList) return 0

  const optionalChecks = actualTerm.value.checkList.filter((item: any) => !item.required)
  return optionalChecks.filter((item: any) => checkStates.value[item.checkId] === true).length
})

const totalOptionalCount = computed(() => {
  if (!actualTerm.value || !actualTerm.value.checkList) return 0
  return actualTerm.value.checkList.filter((item: any) => !item.required).length
})

const isFormValid = computed(() => {
  if (!actualTerm.value || !actualTerm.value.checkList) return false

  const requiredItems = actualTerm.value.checkList.filter((item: any) => item.required)
  return requiredItems.every((item: any) => checkStates.value[item.checkId] === true)
})

const submitTerms = () => {
  if (isFormValid.value) {
    const acceptedCheckIds = Object.keys(checkStates.value)
      .filter((key) => checkStates.value[Number(key)] === true)
      .map((key) => Number(key))

    console.log('Termo ID:', actualTerm.value.termsId)
    console.log('IDs aceitos:', acceptedCheckIds)

    console.log(newUser.value);

    const newUserWithTerms: Ref<NewUser> = ref<NewUser>({
      name: newUser.value.name,
      email: newUser.value.email,
      phone: newUser.value.phone,
      password: newUser.value.password,
      termsId: actualTerm.value,
      checkList: actualTerm.value.checkList
    })
    signApi(newUserWithTerms.value).then((response) => {
      switch (response.status) {
        case 200:
          toast.add({
            severity: 'success',
            summary: 'Cadastro criado!',
            life: 3000,
          })
          break
        case 0:
        default:
          showError(
            'Erro no servidor',
            'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
          )
          break;
      }
    })
  } else {
    console.log('Termos obrigatórios não aceitos.')
  }
}

onMounted(() => {
  getActualTerm().then((response) => {
    actualTerm.value = response

    const initialStates: Record<number, boolean> = {}
    if (response && response.checkList) {
      response.checkList.forEach((item: any) => {
        initialStates[item.checkId] = false
      })
    }
    checkStates.value = initialStates
  })
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5vh;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 950px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 24px;
  position: relative;
}

.modal-header h2 {
  margin: 0 0 4px 0;
  font-size: 1.5em;
  font-weight: 600;
}

.subtitle {
  font-size: 0.9em;
  color: #6a6a6a;
  margin: 0;
}

.close-button {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #8a8a8a;
  padding: 0;
}

.terms-scroll-area {
  padding: 0 24px;
  overflow-y: auto;
  flex-grow: 1;
}

.terms-content-section {
  padding-bottom: 20px;
  border: 1px solid #e4e4e4;
  border-radius: 15px;
}

.version-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f7f7f7;
  border-radius: 16px;
  font-size: 0.8em;
  margin-bottom: 20px;
}

.version-text {
  font-weight: 600;
}

.hash-example {
  color: #999;
}

.lgpd-text p {
  line-height: 1.5;
  font-size: 0.95em;
  padding-left: 10px;
}

.lgpd-text ul {
  list-style-type: disc;
  margin: 10px 0 15px 20px;
  padding-left: 10px;
}

.lgpd-text li {
  margin-bottom: 5px;
}

.term-item {
  margin-bottom: 15px;
  padding: 10px 0;
}

.term-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  margin-bottom: 5px;
}

.term-label input[type='checkbox'] {
  margin-top: 2px;
  margin-right: 10px;
  flex-shrink: 0;
  cursor: pointer;
}

.text-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.term-main-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.term-title {
  font-weight: bold;
  color: #333;
  margin-right: 5px;
  line-height: 1.4;
}

.term-description {
  font-weight: normal;
  color: #333;
  line-height: 1.4;
  flex-grow: 1;
}

.term-version {
  font-size: 0.8em;
  color: #999;
  font-weight: normal;
  margin-left: 10px;
  white-space: nowrap;
}

.term-details {
  font-size: 0.85em;
  color: #6a6a6a;
  margin: 0 0 0 26px;
  line-height: 1.4;
}

.separator {
  border-bottom: 1px solid #eee;
  margin: 10px 0;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.optional-count {
  font-size: 0.9em;
  color: #6a6a6a;
}

.register-link-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.register-link-button:disabled {
  background-color: #f0f0f0;
  color: #a0a0a0;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
