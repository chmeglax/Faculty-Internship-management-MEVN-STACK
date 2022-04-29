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
            <vb-headers-card-header :data="{ title: 'Liste des sujet validés' }" />
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
                <template #validated="{ text }">
                  <a-tag v-if="!text" color="#f50">pas encore validé</a-tag>
                  <a-tag v-else color="#87d068">validé</a-tag>
                </template>
                <template #binome="{ text }">
                  <a-tag v-if="text" color="processing">binome</a-tag>
                  <a-tag v-else color="warning">monome</a-tag>
                </template>
                <template #filterIcon="filtered">
                  <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
                </template>
                <template #expandedRowRender="{ record }">
                  <p style="margin: 0">
                    {{ record.desc }}
                  </p>
                  <p v-if="record.files" style="margin: 0">
                    <a :href="apiUrl + record.files" target="_blank">Fichier associeé</a>
                  </p>
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
                      Planifier<i class="fe fe-arrow-right ml-1" />
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
      <a-form :model="formState" name="basic">
        <a-form-item label="Code" name="code">
          <a-input v-model:value="formState.code" />
        </a-form-item>
        <a-form-item label="Salle" name="salle">
          <a-input v-model:value="formState.salle" />
        </a-form-item>
        <a-form-item label="session" name="session">
          <a-select
            v-model:value="formState.session"
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
            v-model:value="formState.timestamp"
            format="DD-MM-YYYY HH:mm:ss"
            :disabled-date="disabledDate"
            :show-time="{ defaultValue: dayjs('8:30:00', 'HH:mm:ss') }"
          />
        </a-form-item>
        <a-form-item label="Président" name="president">
          <a-select
            v-model:value="formState.jury.president"
            show-search
            placeholder="Chosir le président du jury!"
            @change="handleChange"
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
        <a-form-item label="rapporteur" name="rapporteur">
          <a-select
            v-model:value="formState.jury.rapporteur"
            show-search
            placeholder="Chosir le rapporteur !"
            @change="handleChange"
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
            v-model:value="formState.jury.encadrant"
            show-search
            placeholder="Chosir l'encadrant !"
            @change="handleChange"
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
        title: 'Code',
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
        title: 'Titre sujet',
        dataIndex: 'name',
        key: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      {
        title: 'organisme',
        dataIndex: 'organisme',
        key: 'organisme',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.organisme.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      {
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.type.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        },
      },
      {
        title: 'binome',
        dataIndex: 'binome',
        key: 'binome',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'binome',
        },
        onFilter: (value, record) =>
          record.binome.toString().toLowerCase().includes(value.toLowerCase()),
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
    //get organismes
    ApiClient.post('/student/sujet/filter', {
      query: { validated: true, soutenance: false },
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
    const activeSujet = ref({})
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
      activeSujet.value = record
      console.log(record)
      visible.value = true
    }

    const handleOk = (e) => {
      formState.sujet = activeSujet.value._id
      console.log(formState)
      console.log('activeSujet', activeSujet.value)
      ApiClient.put('/admin/soutenance/', formState)
        .then(() => {
          message.success(`Soutenance plannifié avec succées`)
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
      activeSujet,
      formState,
      sessionsData,
      teachersData,
      disabledDate,
      dayjs,
      handleChange,
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
