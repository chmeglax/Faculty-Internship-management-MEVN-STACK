<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <vb-headers-heading :data="{ title: 'Détails de votre soutenance' }" />
          </div>
        </div>
      </div>
    </div>
    <a-skeleton active v-if="loading" />
    <div v-else-if="soutenanceData">
      <div class="row">
        <div class="col-lg-4 col-md-12">
          <div class="card">
            <vb-widgets-charts-11
              :name="
                soutenanceData.jury.president.lName + ' ' + soutenanceData.jury.president.fName ||
                '--'
              "
              post="président"
            />
          </div>
        </div>
        <div class="col-lg-4 col-md-12">
          <div class="card">
            <vb-widgets-charts-11
              :name="
                soutenanceData.jury.rapporteur.lName + ' ' + soutenanceData.jury.rapporteur.fName ||
                '--'
              "
              post="rapporteur"
            />
          </div>
        </div>
        <div class="col-lg-4 col-md-12">
          <div class="card">
            <vb-widgets-charts-11
              :name="
                soutenanceData.jury.encadrant.lName + ' ' + soutenanceData.jury.encadrant.fName ||
                '--'
              "
              post="encadrant"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <a-descriptions bordered>
                <a-descriptions-item label="Code soutenance" :span="2">{{
                  soutenanceData.code || '--'
                }}</a-descriptions-item>
                <a-descriptions-item label="Code session" :span="2">{{
                  soutenanceData.session.code || '--'
                }}</a-descriptions-item>
                <a-descriptions-item label="Salle" :span="2">{{
                  soutenanceData.salle || '--'
                }}</a-descriptions-item>
                <a-descriptions-item label="Date" :span="2">{{
                  moment(soutenanceData.timestamp).format('DD-MM-YYYY HH:mm') || '--'
                }}</a-descriptions-item>
                <a-descriptions-item label="Status" :span="4">
                  <a-badge
                    status="processing"
                    :text="moment(soutenanceData.timestamp).locale('fr').fromNow() || '--'"
                  />
                </a-descriptions-item>
                <a-descriptions-item label="Note">
                  {{ note }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-alert
      v-else
      message="Soutenance introuvable"
      description="Vous n'avez pas des soutenances plannifiés merci de contacter l'administration"
      type="info"
      show-icon
    />
  </div>
</template>

<script>
import VbHeadersHeading from '@/@vb/widgets/Headers/Heading'
import VbWidgetsCharts11 from '@/@vb/widgets/WidgetsCharts/11'

import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import moment from 'moment'

import { SearchOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, computed } from 'vue'
import ApiClient from '@/services/axios'

export default {
  name: 'VbDashboardAlpha',
  components: {
    VbHeadersHeading,
    VbWidgetsCharts11,
  },
  setup() {
    const soutenanceData = ref(undefined)
    const note = ref('--')
    const store = useStore()
    const user = computed(() => store.getters['user/user'])
    const loading = ref(true)
    ApiClient.get('/student/soutenance/' + user.value._id)
      .then((res) => {
        soutenanceData.value = res.data
        ApiClient.get('/student/soutenance/note/' + soutenanceData.value._id).then((res) => {
          console.log(res.data)
          if (res.data.length > 0) {
            let _note = 0
            res.data.forEach((element) => {
              _note += element.note
            })
            note.value = _note / res.data.length
            note.value = note.value.toFixed(2)
          }
        })
      })
      .catch((e) => {
        message.error('Veuillez refraichir la page ! ')
      })
      .finally(() => (loading.value = false))

    return {
      soutenanceData,
      moment,
      loading,
      note,
    }
  },
}
</script>
