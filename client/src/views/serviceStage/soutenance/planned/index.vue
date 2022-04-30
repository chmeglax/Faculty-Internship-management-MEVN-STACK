<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <vb-headers-heading :data="{ title: 'Planification des soutenances' }" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <vb-headers-card-header :data="{ title: 'Liste des soutenance plannifié' }" />
          </div>
          <div class="card-body">
            <div class="table-responsive text-nowrap pt-2">
              <a-table
                :data-source="dataSource"
                :columns="columns"
                :loading="tableLoading"
                row-key="_id"
              >
                <template
                  #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                >
                  <div style="padding: 8px">
                    <a-input
                      ref="searchInput"
                      :placeholder="`recherche ${column.dataIndex}`"
                      :value="selectedKeys[0]"
                      style="width: 188px; margin-bottom: 8px; display: block"
                      @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                      @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
                    />
                    <a-button
                      type="primary"
                      size="small"
                      style="width: 90px; margin-right: 8px"
                      @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
                    >
                      <template #icon><SearchOutlined /></template>
                      Search
                    </a-button>
                    <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
                      Reset
                    </a-button>
                  </div>
                </template>
                <template #dateRender="{ text }">
                  <div>
                    {{ moment(text).format('DD-MM-YYYY HH:mm') }}
                  </div>
                </template>
                <template #jury="{ text }">
                  <a-space direction="vertical">
                    <a-tag color="#f50"
                      >Président :{{ text.president.lName + ' ' + text.president.fName }}</a-tag
                    >
                    <a-tag color="#87d068"
                      >Rapporteur :{{ text.rapporteur.lName + ' ' + text.rapporteur.fName }}</a-tag
                    >
                    <a-tag color="#87d008"
                      >Encadrant :{{ text.encadrant.lName + ' ' + text.encadrant.fName }}</a-tag
                    >
                  </a-space>
                </template>
                <template #sujet="{ text }">
                  <span>{{ text.code }}</span>
                </template>
                <template #filterIcon="filtered">
                  <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
                </template>
                <template #expandedRowRender="{ record }">
                  <a-descriptions title="Détails du sujet" bordered>
                    <a-descriptions-item label="sujet" :span="2">{{
                      record.sujet.name
                    }}</a-descriptions-item>
                    <a-descriptions-item label="Type" :span="2">{{
                      record.sujet.type
                    }}</a-descriptions-item>

                    <a-descriptions-item label="Etudiant" :span="2">
                      {{
                        record.sujet.students[0].lName + ' ' + record.sujet.students[0].fName
                      }}</a-descriptions-item
                    >
                    <a-descriptions-item
                      label="Etudiant 2"
                      v-if="record.sujet.students[1]"
                      :span="2"
                      >{{
                        record.sujet.students[1].lName + ' ' + record.sujet.students[1].fName
                      }}</a-descriptions-item
                    >
                  </a-descriptions>
                </template>
                <template #customRender="{ text, column }">
                  <span v-if="searchText && searchedColumn === column.dataIndex">
                    <template
                      v-for="(fragment, i) in text
                        .toString()
                        .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                    >
                      <mark
                        v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                        :key="i"
                        class="highlight"
                      >
                        {{ fragment }}
                      </mark>
                      <template v-else>{{ fragment }}</template>
                    </template>
                  </span>
                  <template v-else>
                    {{ text }}
                  </template>
                </template>
                <template #action="{ record }">
                  <span>
                    <a class="btn btn-sm btn-light mr-2" @click="showModal(record)">
                      modifier<i class="fe fe-arrow-right ml-1" />
                    </a>
                  </span>
                  <span>
                    <a class="btn btn-sm btn-light mr-2" @click="suppS(record)">
                      annuler<i class="fe fe-trash ml-1" />
                    </a>
                  </span>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      title="Affecter des enseignants pour valider un sujet"
      @ok="handleOk"
    >
      <a-form :model="activeSoutenance" name="basic">
        <a-form-item label="Code" name="code">
          <a-input v-model:value="activeSoutenance.code" />
        </a-form-item>
        <a-form-item label="Salle" name="salle">
          <a-input v-model:value="activeSoutenance.salle" />
        </a-form-item>
        <a-form-item label="session" name="session">
          <a-select
            v-model:value="activeSoutenance.session._id"
            show-search
            placeholder="Chosir les spécialités du sujet !"
          >
            <a-select-option
              v-for="session in sessionsData"
              :key="session._id"
              :value="session._id"
            >
              {{ session.code }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="date de soutenance" name="timestamp">
          <a-date-picker
            v-model:value="activeSoutenance.timestamp"
            format="DD-MM-YYYY HH:mm:ss"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: dayjs('8:30:00', 'HH:mm:ss') }"
          />
        </a-form-item>
        <a-form-item label="Président" name="president">
          <a-select
            v-model:value="activeSoutenance.jury.president._id"
            show-search
            placeholder="Chosir le président du jury!"
          >
            <a-select-option v-for="t in teachersData" :key="t._id" :value="t._id">
              {{ t.lName + ' ' + t.fName }}
            </a-select-option></a-select
          >
        </a-form-item>
        <a-form-item label="rapporteur" name="rapporteur">
          <a-select
            v-model:value="activeSoutenance.jury.rapporteur._id"
            show-search
            placeholder="Chosir le rapporteur !"
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
        <a-form-item label="encadrant" name="encadrant">
          <a-select
            v-model:value="activeSoutenance.jury.encadrant._id"
            show-search
            placeholder="Chosir l'encadrant !"
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
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import VbHeadersHeading from '@/@vb/widgets/Headers/Heading'
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import moment from 'moment'

import { SearchOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, computed } from 'vue'
import ApiClient from '@/services/axios'
export default defineComponent({
  components: {
    VbHeadersHeading,
    VbHeadersCardHeader,
    SearchOutlined,
  },
  setup() {
    const apiUrl = process.env.VUE_APP_API_URL

    const router = useRouter()
    const store = useStore()

    const user = computed(() => store.getters['user/user'])

    const searchInput = ref()
    const columns = [
      {
        title: 'Code soutenance',
        dataIndex: 'code',
        key: 'code',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.code.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      {
        title: 'salle',
        dataIndex: 'salle',
        key: 'salle',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.salle.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      {
        title: 'code sujet',
        dataIndex: 'sujet',
        key: 'sujet',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sujet',
        },
        onFilter: (value, record) =>
          record.sujet.code.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      /* {
        title: 'Section',
        dataIndex: 'section',
        key: 'section',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sujet',
        },
        onFilter: (value, record) =>
          record.sujet.code.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },*/
      {
        title: 'date',
        dataIndex: 'timestamp',
        key: 'date',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dateRender',
        },
        onFilter: (value, record) =>
          moment(record.timestamp)
            .format('DD-MM-YYYY HH:mm')
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        },
      },
      {
        title: 'jury',
        dataIndex: 'jury',
        key: 'jury',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'jury',
        },
        onFilter: (value, record) =>
          record.jury.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        },
      },

      {
        title: 'Action',
        slots: { customRender: 'action' },
      },
    ]
    const state = reactive({
      searchText: '',
      searchedColumn: '',
    })
    const tableLoading = ref(true)
    const dataSource = ref([])
    const sessionsData = ref([])
    const teachersData = ref([])

    const getSelectData = () => {
      ApiClient.post('/admin/session/filter', {
        query: {},
      })
        .then((res) => {
          sessionsData.value = res.data
        })
        .catch((e) => {
          message.error('Veuillez refraichir la page ! ')
        })
      ApiClient.post('/admin/teacher', {
        query: {},
      })
        .then((res) => {
          teachersData.value = res.data
        })
        .catch((e) => {
          message.error('Veuillez refraichir la page ! ')
        })
    }
    getSelectData()
    //get souteannce
    const getSoutenance = () => {
      tableLoading.value = true
      ApiClient.post('/admin/soutenance/filter', {
        query: {},
      })
        .then((res) => {
          dataSource.value = res.data
        })
        .catch((e) => {
          message.error('Veuillez refraichir la page ! ')
        })
        .finally(() => {
          tableLoading.value = false
        })
    }
    getSoutenance()

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm()
      console.log(selectedKeys[0])
      state.searchText = selectedKeys[0]
      state.searchedColumn = dataIndex
    }

    const handleReset = (clearFilters) => {
      clearFilters()
      state.searchText = ''
    }

    //modal
    const visible = ref(false)
    const activeSoutenance = ref({})
    const formState = reactive({
      code: '',
      session: '',
      salle: '',
      sujet: '',
      timestamp: '',
      jury: {
        rapporteur: '',
        president: '',
        encadrant: '',
      },
    })
    const showModal = (record) => {
      activeSoutenance.value = JSON.parse(JSON.stringify(record))
      activeSoutenance.value.timestamp = dayjs(record.timestamp)

      visible.value = true
    }

    const handleOk = (e) => {
      formState.timestamp = dayjs(activeSoutenance.value.timestamp)
      formState.sujet = activeSoutenance.value.sujet._id
      formState.code = activeSoutenance.value.code
      formState.salle = activeSoutenance.value.salle
      formState.session = activeSoutenance.value.session._id
      formState.jury.rapporteur = activeSoutenance.value.jury.rapporteur._id
      formState.jury.president = activeSoutenance.value.jury.president._id

      formState.jury.encadrant = activeSoutenance.value.jury.encadrant._id

      console.log('activeSoutenance', activeSoutenance.value)
      ApiClient.patch('/admin/soutenance/' + activeSoutenance.value._id, { data: formState })
        .then(() => {
          message.success(`Soutenance modifié avec succées`)
          getSoutenance()
        })
        .catch((e) => {
          console.log(e.response.data.message)
          message.error(e.response.data.message)
        })
        .finally(() => (visible.value = false))
    }
    const handleChange = (selected) => {
      console.log(selected)
      teachersData.value = teachersData.value.map((elem) => {
        if (elem._id === selected) elem.disabled = true

        return elem
      })
      console.log('elem', teachersData.value)
    }
    //datepicker
    const disabledDate = (current) => {
      // Can not select days before today and today
      return current && current < dayjs().endOf('day')
    }
    //delete
    const suppS = (record) => {
      ApiClient.delete('/admin/soutenance/' + record._id)
        .then((res) => {
          ApiClient.patch('/student/sujet/' + record.sujet._id, { data: { soutenance: false } })
            .then(() => {
              message.success("Sujet revient a l'état non plannifié ! ")
            })
            .catch((e) => {
              message.error('état du sujet non initialisé !')
            })
          dataSource.value = dataSource.value.filter((e) => {
            return e._id !== record._id
          })
          message.success('soutenance supprimé avec succées ! ')
        })
        .catch((e) => {
          message.success('veuillez réesseilez ! ')
        })
    }
    return {
      apiUrl,
      columns,
      handleSearch,
      handleReset,
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      dataSource,
      tableLoading,
      router,
      visible,
      showModal,
      handleOk,
      activeSoutenance,
      formState,
      sessionsData,
      teachersData,
      disabledDate,
      dayjs,
      moment,
      handleChange,
      suppS,
    }
  },
})
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
a:link {
  color: rgb(46, 91, 181);
  background-color: transparent;
  text-decoration: underline;
}

a:visited {
  color: rgb(1, 113, 46);
  background-color: transparent;
  text-decoration: underline;
}

a:hover {
  color: rgb(49, 181, 179);
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  color: yellow;
  background-color: transparent;
  text-decoration: underline;
}
</style>
