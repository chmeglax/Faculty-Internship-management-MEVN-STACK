<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <vb-headers-heading :data="{ title: 'Gérer vos PFE/PFA' }" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <vb-headers-card-header :data="{ title: 'Liste des proposition' }" />
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
                      Affécter a des enseignants<i class="fe fe-arrow-right ml-1" />
                    </a>
                    <a class="btn btn-sm btn-light" @click="rejectSujet(record)">
                      <small>
                        <i v-if="record.validated" class="fe fe-trash mr-2" />
                        <i v-else class="fe fe-check mr-2" />
                      </small>
                      {{ record.validated == true ? 'rejéter' : 'valider' }}
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
      <label> Sujet : {{ activeSujet.name }}</label>
      <a-transfer
        :titles="['. Non Affectés', '. Affectés']"
        v-model:target-keys="targetKeys"
        :data-source="teachersData"
        show-search
        :filter-option="filterOption"
        :render="renderItem"
        @change="handleChange"
      />
    </a-modal>
  </div>
</template>

<script>
import VbHeadersHeading from '@/@vb/widgets/Headers/Heading'
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

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
        title: 'status',
        dataIndex: 'validated',
        key: 'validated',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'validated',
        },
        onFilter: (value, record) =>
          record.validated.toString().toLowerCase().includes(value.toLowerCase()),
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

    //get organismes
    ApiClient.post('/student/sujet/filter', {
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
    const rejectSujet = (record) => {
      console.log(record)
      const updateData = { validated: !record.validated }

      ApiClient.patch('/student/sujet/' + record._id, { data: updateData })
        .then(() => {
          dataSource.value = dataSource.value.map((elem) =>
            elem._id == record._id ? { ...elem, validated: !record.validated } : elem,
          )
          message.success(`Sujet modifié`)
        })
        .catch((e) => {
          message.warning('Impossible de modifier le sujet pour cet utilisateur')
        })
    }

    //modal
    const visible = ref(false)
    const activeSujet = ref({})
    const showModal = (record) => {
      targetKeys.value = []
      ApiClient.post('/admin/validation/filter', {
        query: {
          sujet: record._id,
        },
        aggregation: [
          {
            $project: {
              teacher: 1,
            },
          },
        ],
      })
        .then((res) => {
          targetKeys.value = res.data.map((elem) => elem.teacher)
          activeSujet.value = record
          visible.value = true
        })
        .catch((e) => {
          message.warning('Impossible de récuperer la liste des enseignants déja affecté')
        })
    }

    const handleOk = (e) => {
      console.log(e)
      console.log('targetKeys', targetKeys.value)
      ApiClient.patch('/admin/validation/' + activeSujet.value._id, { teachers: targetKeys.value })
        .then(() => {
          message.success(`Enseignatn affecteés`)
        })
        .catch((e) => {
          message.warning("Impossible d'affecter des enseignants")
        })
        .finally(() => (visible.value = false))
    }
    //transfer component
    const teachersData = ref([])
    const targetKeys = ref([])
    ApiClient.post('/admin/teacher/', {
      query: {
        status: 'active',
      },
      aggregation: [
        {
          $lookup: {
            from: 'specialties',
            localField: 'specialites',
            foreignField: '_id',
            as: 'specialites',
          },
        },
        {
          $project: {
            _id: 1,
            specialites: 1,
            fName: 1,
            lName: 1,
          },
        },
      ],
    })
      .then((res) => {
        teachersData.value = res.data.map((elem) => ({
          ...elem,
          key: elem._id,
        }))
      })
      .catch((e) => {
        message.warning('Impossible de récuperer la liste des enseignants')
      })

    const filterOption = (inputValue, option) => {
      return option.description.indexOf(inputValue) > -1
    }
    const handleChange = (keys, direction, moveKeys) => {
      console.log(keys, direction, moveKeys)
    }
    const renderItem = (item) => {
      let fullName = item.lName + ' ' + item.fName
      const customLabel = <span class="custom-item">{fullName}</span>

      return {
        label: customLabel, // for displayed item
        value: fullName, // for title and filter matching
      }
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
      rejectSujet,
      visible,
      showModal,
      handleOk,
      activeSujet,
      //transfer
      renderItem,
      teachersData,
      targetKeys,
      filterOption,
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
