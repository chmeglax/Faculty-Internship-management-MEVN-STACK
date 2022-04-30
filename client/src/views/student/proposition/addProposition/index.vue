<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <a-page-header
              style="border: 1px solid rgb(235, 237, 240)"
              title="Proposition"
              sub-title="Ajouter une proposition de sujet"
              @back="() => router.push('/student/proposition/')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <vb-headers-card-header :data="{ title: 'Ajouter une proposition' }" />
          </div>
          <div class="card-body">
            <a-form
              :model="form"
              :rules="rules"
              layout="vertical"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed"
              ><a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Par binome ?" name="binome">
                    <a-switch
                      v-model:checked="binome"
                      checked-children="par binome"
                      un-checked-children="par monome"
                  /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="CIN du binome" name="cinBinome">
                    <a-input
                      v-model:value="form.cinBinome"
                      placeholder="Saisir le cin du binome"
                      :disabled="!binome"
                      @Change="loadBinome()"
                    />
                    <a-tag color="#87d068" v-if="form.cinBinome.length > 0 && binome">{{
                      binomeFullName
                    }}</a-tag>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Section" name="section">
                    <a-input
                      v-model:value="form.section"
                      placeholder="Saisir la section du sujet"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Type" name="type">
                    <a-select v-model:value="form.type" placeholder="Chosir le type du sujet !">
                      <a-select-option key="PFE" value="PFE"> PFE </a-select-option>
                      <a-select-option key="PFA" value="PFA"> PFA </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-divider>A propos du sujet</a-divider>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Nom du sujet" name="name">
                    <a-input v-model:value="form.name" placeholder="Saisir le nom du sujet" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Spécialiés" name="specialites">
                    <a-select
                      v-model:value="form.specialites"
                      mode="multiple"
                      show-search
                      placeholder="Chosir les spécialités du sujet !"
                    >
                      <a-select-option
                        v-for="speciality in specialites"
                        :key="speciality._id"
                        :value="speciality._id"
                      >
                        {{ speciality.name }}
                      </a-select-option></a-select
                    >
                  </a-form-item>
                </a-col> </a-row
              ><a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="Encadrant pédagogique" name="encadrantP">
                    <a-select
                      v-model:value="form.encadrantP"
                      show-search
                      placeholder="Chosir l'encadrant pédagogique !"
                    >
                      <a-select-option
                        v-for="t in teachersData"
                        :key="t._id"
                        :value="t._id"
                        :disabled="t.disabled"
                      >
                        {{ t.lName + ' ' + t.fName }}
                      </a-select-option></a-select
                    >
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="Déscription du sujet" name="desc">
                    <a-textarea
                      v-model:value="form.desc"
                      placeholder="Saisir la déscription du sujet"
                      :rows="4"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-divider>Societé</a-divider>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="Organisme" name="organisme">
                    <a-input
                      v-model:value="form.organisme"
                      placeholder="Saisir le nom complet de  la societé"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item
                    label="Nom complet de l'encadrant de la societé"
                    name="encadrantS.name"
                  >
                    <a-input
                      v-model:value="form.encadrantS.name"
                      placeholder="Saisir le nom complet de l'encadrant de la societé"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Fonction de l'encadrant de la societé" name="encadrantS.name">
                    <a-input
                      v-model:value="form.encadrantS.job"
                      placeholder="Saisir la fonction de l'encadrant"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="Document optionel">
                    <a-upload-dragger
                      name="file"
                      :multiple="true"
                      :before-upload="beforeUpload"
                      :file-list="fileList"
                      :custom-request="addTofileList"
                    >
                      <p class="ant-upload-drag-icon">
                        <inbox-outlined></inbox-outlined>
                      </p>
                      <p class="ant-upload-text">Click or drag file to this area to upload</p>
                      <p class="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading
                        company data or other band files
                      </p>
                    </a-upload-dragger>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item class="p-5">
                    <a-button
                      type="primary"
                      html-type="submit"
                      :style="{
                        width: '100%',
                      }"
                      >Postuler</a-button
                    >
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { defineComponent, reactive, ref, computed } from 'vue'
import ApiClient from '@/services/axios'
export default defineComponent({
  components: {
    VbHeadersCardHeader,
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.getters['user/user'])
    const binome = ref(false)
    const router = useRouter()
    const organismes = ref([])
    const rules = {
      name: [
        {
          required: true,
          message: 'Champ obligatoire',
        },
      ],
      organisme: [
        {
          required: true,
          message: 'Champ obligatoire',
        },
      ],
      specialites: [
        {
          required: false,
          message: 'Champ obligatoire',
        },
      ],
      desc: [
        {
          required: true,
          message: 'Champ obligatoire',
        },
      ],
      section: [
        {
          required: true,
          message: 'Champ obligatoire',
        },
      ],
      type: [
        {
          required: true,
          message: 'Champ obligatoire',
        },
      ],
      encadrantS: {
        name: [
          {
            required: true,
            message: 'Champ obligatoire',
          },
        ],
        job: [
          {
            required: true,
            message: 'Champ obligatoire',
          },
        ],
      },

      specialites: [
        {
          required: true,
          message: 'Champ obligatoire',
        },
      ],
    }
    const form = reactive({
      name: '',
      specialites: [],
      organisme: '',
      desc: '',
      cinBinome: '',
      section: '',
      binome: false,
      type: 'PFE',
      encadrantP: '',
      encadrantS: {
        name: '',
        job: '',
      },
      students: [],
    })
    //get specialites
    const specialites = ref([])
    ApiClient.post('/admin/specialty/filter', {
      query: {},
    })
      .then((res) => {
        specialites.value = res.data
      })
      .catch((e) => {
        console.log(e)
      })
    //get organismes
    ApiClient.post('/admin/organisme/filter', {
      query: {},
    })
      .then((res) => {
        organismes.value = res.data
      })
      .catch((e) => {
        message.error('Veuillez refraichir la page ! ')
      })
    //get list encadrant
    const teachersData = ref([])
    ApiClient.post('/admin/teacher', {
      query: {},
    })
      .then((res) => {
        teachersData.value = res.data
      })
      .catch((e) => {
        message.error('Veuillez refraichir la page ! ')
      })
    const handleFinish = (values) => {
      console.log(binome.value)
      if (binome.value && !binomeData.value._id) {
        message.error('Le binome doit étre inscit dans la plateforme !')
        return
      }
      form.students[0] = user.value._id
      let formData = new FormData()
      if (binomeData.value._id) {
        form.binome = true
        form.students[1] = binomeData.value._id
      }
      console.log('form : ', form)
      for (let key in form) {
        Array.isArray(form[key])
          ? form[key].forEach((value) => formData.append(key + '[]', value))
          : formData.append(key, form[key])
      }
      formData.delete('cinBinome')
      formData.delete('encadrantS')
      formData.append('encadrantS', JSON.stringify(form.encadrantS))
      if (sujetDoc.value) {
        formData.append('files', sujetDoc.value)
        console.log('sujetDoc.value', sujetDoc.value)
      }

      // Display the key/value pairs
      for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      ApiClient({
        method: 'put',
        url: '/student/sujet',
        data: formData,
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      })
        .then((res) => {
          console.log(res.data)
          router.push('/student/proposition/')
          message.success('Inscription avec succées.')
        })
        .catch((e) => {
          console.log(e.response.data.message)
          message.error(e.response.data.message)
        })
    }
    const handleFinishFailed = (errors) => {
      console.log(errors)
    }
    //upload
    const fileList = ref()
    const sujetDoc = ref()
    const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('Vous ne pouvez télécharger que des fichiers JPG, JPEG ou PNG!')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        message.error("L'image doit être inférieure à 5 Mo!")
      }
      if (isJpgOrPng && isLt2M) {
        message.success(`${file.name} fichier téléchargé avec succès..`)
        sujetDoc.value = file
      }
      return isJpgOrPng && isLt2M
    }
    const addTofileList = () => {
      fileList.value = [sujetDoc.value]
      console.log(fileList.value)
      console.log(sujetDoc.value)
    }
    //load binome
    const binomeData = ref('--')
    const loadBinome = (e) => {
      if (form.cinBinome.length == 8)
        ApiClient.post('/student/', {
          query: { cin: form.cinBinome },
          /*aggregation: [
            {
              $project: {
                _id: 1,
                fName: 1,
                lName: 1,
              },
            },
          ],*/
        })
          .then((res) => {
            binomeData.value = res.data[0]
            console.log(binomeData.value)
          })
          .catch((e) => {
            message.error('Veuillez refraichir la page ! ')
          })
      else binomeData.value = "binome n'est pas inscrit"
    }
    const binomeFullName = computed(() =>
      binomeData.value._id
        ? binomeData.value.lName + ' ' + binomeData.value.fName
        : "binome n'est pas inscrit",
    )
    return {
      binomeFullName,
      beforeUpload,
      addTofileList,
      fileList,
      rules,
      form,
      handleFinish,
      handleFinishFailed,
      organismes,
      router,
      user,
      specialites,
      binome,
      loadBinome,
      binomeData,
      teachersData,
    }
  },
})
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
