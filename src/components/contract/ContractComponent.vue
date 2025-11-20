<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="isOpen = false">
      <div class="modal-content" @click.stop>

        <header class="modal-header">
          <h2>{{ actualTerm?.title || 'Termos de Uso e Privacidade' }}</h2>
        </header>

        <div class="terms-scroll-area">
          <section class="terms-content-section">
            <div class="version-info">
              <span class="version-text">Conteúdo dos Termos</span>
            </div>

            <div class="lgpd-text">
              <p>{{ actualTerm?.content }}</p>
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
                    <input type="checkbox" v-model="checkStates[item.checkId]" />
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

                <div v-if="index < actualTerm.checkList.length - 1" class="separator"></div>
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
          <button v-if="getSessionItem('newUser')" class="register-link-button" :disabled="!isFormValid" @click="submitTerms">
            Enviar link de cadastro
          </button>
          <button v-if="currentUrl.includes('config-screen')" class="register-link-button" :disabled="!isFormValid" @click="updateTerms">
            Atualizar termo
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, watch } from 'vue'
import type { NewUser } from '@/types/NewUser.ts'
import { getSessionItem } from '@/api/session/SessionManagement.ts'
import { signApi } from '@/api/SignApi.ts'
import { useToast } from 'primevue/usetoast'
import type { CheckInRegisterAndUpdate } from '@/types/ContractTypes/CheckList.ts'
import router from '@/router'
import { updateTermByUser } from '@/api/ContractApi.ts'

const toast = useToast()
const showError = (errorSum: string, errorMsg: string) => {
  toast.add({ severity: 'error', summary: errorSum, detail: errorMsg, life: 6000 })
}

const currentUrl = window.location.href;

const props = defineProps<{
  visible: boolean
  actualTerm?: any
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const newUser: Ref<NewUser> = ref<NewUser>(JSON.parse(<string>getSessionItem('newUser')))

const checkStates: Ref<Record<number, boolean>> = ref({})

const acceptedOptionalCount = computed(() => {
  if (!props.actualTerm || !props.actualTerm.checkList) return 0
  const optionalChecks = props.actualTerm.checkList.filter((item: any) => !item.required)
  return optionalChecks.filter((item: any) => checkStates.value[item.checkId] === true).length
})

const totalOptionalCount = computed(() => {
  if (!props.actualTerm || !props.actualTerm.checkList) return 0
  return props.actualTerm.checkList.filter((item: any) => !item.required).length
})

const isFormValid = computed(() => {
  if (!props.actualTerm || !props.actualTerm.checkList) return false
  const requiredItems = props.actualTerm.checkList.filter((item: any) => item.required)
  return requiredItems.every((item: any) => checkStates.value[item.checkId] === true)
})

const submitTerms = () => {
  if (isFormValid.value) {
    const formattedCheckList: CheckInRegisterAndUpdate[] = props.actualTerm.checkList.map(
      (item: any) => {
        return {
          checkId: item.checkId,
          label: item.label,
          check: checkStates.value[item.checkId],
        }
      },
    )

    const newUserWithTerms: NewUser = {
      name: newUser.value.name,
      email: newUser.value.email,
      phone: newUser.value.phone,
      password: newUser.value.password,
      termsId: props.actualTerm.termsId,
      termAccepted: true,
      checkList: formattedCheckList,
    }

    signApi(newUserWithTerms).then(() => {
      toast.add({
        severity: 'success',
        summary: 'Cadastro criado!',
        detail:
          'Seu cadastro será avaliado por um administrador. Um email será enviado quando o mesmo for validado.',
        life: 12000,
      })
      sessionStorage.removeItem('newUser')
      isOpen.value = false;
      router.push('/')
    })
  } else {
    console.log('Termos obrigatórios não aceitos.')
  }
}

const updateTerms = () => {
  if (isFormValid.value) {
    const formattedCheckList: CheckInRegisterAndUpdate[] = props.actualTerm.checkList.map(
      (item: any) => {
        return {
          checkId: item.checkId,
          label: item.label,
          check: checkStates.value[item.checkId],
        }
      },
    )

    const updatedTerm = {
      userId: getSessionItem('userId'),
      termsId: props.actualTerm.termsId,
      termAccepted: true,
      checkList: formattedCheckList
    }


    updateTermByUser(updatedTerm).then(() => {
      toast.add({
        severity: 'success',
        summary: 'Cláusulas atualizadas!',
        life: 3000,
      })
      isOpen.value = false;
    })
  } else {
    console.log('Termos obrigatórios não aceitos.')
  }
}

watch(
  () => props.actualTerm,
  (newTerm) => {
    console.log(newTerm)
    const initialStates: Record<number, boolean> = {}
    if (newTerm && newTerm.checkList) {
      newTerm.checkList.forEach((item: any) => {
        initialStates[item.checkId] = item.checked
      })
    }
    console.log(initialStates)
    checkStates.value = initialStates
  },
  { immediate: true }
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 950px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5em;
  font-weight: 600;
  color: #333;
}

.terms-scroll-area {
  padding: 24px;
  overflow-y: auto;
  flex-grow: 1;
}

.terms-content-section {
  padding-bottom: 20px;
  border: 1px solid #e4e4e4;
  border-radius: 15px;
  margin-bottom: 20px;
}

.version-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f7f7f7;
  border-radius: 16px 16px 0 0;
  font-size: 0.8em;
  border-bottom: 1px solid #e4e4e4;
}

.lgpd-text {
  padding: 15px;
}

.lgpd-text p {
  line-height: 1.5;
  font-size: 0.95em;
  margin: 0;
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
  margin-top: 4px;
  margin-right: 12px;
  flex-shrink: 0;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.text-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.term-main-line {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 5px;
}

.term-title {
  font-weight: 700;
  color: #333;
  white-space: nowrap;
}

.term-description {
  font-weight: 400;
  color: #555;
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
  background-color: #fff;
  border-radius: 0 0 8px 8px;
}

.optional-count {
  font-size: 0.9em;
  color: #6a6a6a;
}

.register-link-button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95em;
  transition: background-color 0.2s;
}

.register-link-button:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}
</style>
