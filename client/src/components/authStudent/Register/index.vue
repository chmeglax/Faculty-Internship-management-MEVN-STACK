<template>
  <div class="mt-5 pt-2 box">
    <div class="card" :class="$style.container">
      <div class="text-dark font-size-32 mb-3">Creé un compte</div>
      <div class="mb-4">
        <p>Ce compte vous permet do postuler vos proposition de PFE/PFA.</p>
      </div>

      <a-form
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="nom" name="lName">
              <a-input v-model:value="form.lName" placeholder="Saisir votre nom" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="prénom" name="fName">
              <a-input v-model:value="form.fName" placeholder="Saisir votre prénom" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Cin" name="cin">
              <a-input v-model:value="form.cin" placeholder="Saisir votre CIN/num passport" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Téléphone" name="phone">
              <a-input v-model:value="form.phone" placeholder="Saisir votre numéro de téléphone" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Adresse" name="adresse">
              <a-input v-model:value="form.adresse" placeholder="Saisir votre adresse" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Section" name="section">
              <a-input v-model:value="form.section" placeholder="Saisir votre section" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Email" name="email">
              <a-input v-model:value="form.email" placeholder="Saisir votre email" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Mot de passe" name="password">
              <a-input-password
                v-model:value="form.password"
                placeholder="Saisir votre mot de passe"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
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
                Support for a single or bulk upload. Strictly prohibit from uploading company data
                or other band files
              </p>
            </a-upload-dragger>
          </a-col>
        </a-row>

        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-button type="primary" html-type="submit">S'inscrire</a-button>
        </a-form-item>
      </a-form>
      <!--<div>
        <span class="mr-1">By signing up, you agree to the</span>
        <a href="javascript: void(0);" class="vb__utils__link">Terms of Service</a>
        and
        <a href="javascript: void(0);" class="vb__utils__link">Privacy Policy</a>
      </div>-->
    </div>
    <div class="text-center pt-2 mb-auto">
      <span class="mr-2">Vous avez déjà un compte ?</span>
      <router-link to="/authstudent/login" class="vb__utils__link"> S'identifier </router-link>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import ApiClient from '@/services/axios'
import router from '@/router'

export default {
  name: 'VbRegister',
  setup() {
    const store = useStore()
    const settings = computed(() => store.getters.settings)
    const loading = computed(() => store.getters['user/user'].loading)
    const rules = {
      fName: [
        {
          required: true,
          message: 'Please enter user name',
        },
      ],
      lName: [
        {
          required: true,
          message: 'please enter url',
        },
      ],
      phone: [
        {
          required: false,
          message: 'Please select an owner',
        },
      ],
      cin: [
        {
          required: true,
          message: 'Please choose the type',
        },
      ],
      email: [
        {
          required: true,
          message: 'Please choose the type',
        },
      ],
      password: [
        {
          required: true,
          message: 'Please choose the type',
        },
      ],
    }
    const form = reactive({
      fName: '',
      lName: '',
      phone: '',
      cin: '',
      email: '',
      password: '',
      section: '',
      adresse: '',
    })

    const handleFinish = (values) => {
      let formData = new FormData()
      for (let key in values) {
        console.log(key, values[key])
        if (values[key]) formData.append(key, values[key])
      }
      formData.append('files', studentPhoto.value)
      ApiClient({
        method: 'put',
        url: '/student',
        data: formData,
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      })
        .then((res) => {
          console.log(res.data)
          message.success('Inscription avec succées.')
          router.push({ name: 'loginStudent' })
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
    const studentPhoto = ref()
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
        studentPhoto.value = file
      }
      return isJpgOrPng && isLt2M
    }
    const addTofileList = () => {
      fileList.value = [studentPhoto.value]
      console.log(fileList.value)
      console.log(studentPhoto.value)
    }
    return {
      beforeUpload,
      addTofileList,
      fileList,
      settings,
      loading,
      rules,
      form,
      handleFinish,
      handleFinishFailed,
    }
  },
}
</script>
<style lang="scss" module>
@import '@/components/authStudent/style.module.scss';
</style>
<style scoped>
.box {
  width: 100% !important;
  text-align: center;
}
</style>
