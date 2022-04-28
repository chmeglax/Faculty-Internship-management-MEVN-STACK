<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <vb-headers-heading :data="{ title: 'Planifier les sessions de soutenance' }" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <vb-headers-card-header :data="{ title: 'Liste des sessions' }" />
          </div>
          <div class="card-body">
            <a-button type="primary" shape="round" :size="size" @click="showDrawer">
              <template #icon>
                <UserAddOutlined />
              </template>
              Ajouter
            </a-button>
            <div class="table-responsive text-nowrap pt-2">
              <a-table :data-source="dataSource" :columns="columns" :loading="tableLoading">
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
                <template #filterIcon="filtered">
                  <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
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
                <template #dateRender="{ text }">
                  <div>
                    {{ moment(text).format('DD-MM-YYYY') }}
                  </div>
                </template>
                <template #action="{ record }">
                  <span>
                    <a class="btn btn-sm btn-light mr-2" @click="editT(record)">
                      <i class="fe fe-edit mr-2" />
                      Modifier
                    </a>
                    <a class="btn btn-sm btn-light mr-2" @click="deleteT(record)">
                      <i class="fe fe-edit mr-2" />
                      Supprimer
                    </a>
                  </span>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- add drawer -->
    <a-drawer
      title="Plannifier une session de soutenance"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Code" name="code">
              <a-input v-model:value="form.code" placeholder="Saisir le nom" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Type" name="type">
              <a-select v-model:value="form.type" placeholder="Chosir le type du sujet !">
                <a-select-option key="PFE" value="PFE"> PFE </a-select-option>
                <a-select-option key="PFA" value="PFA"> PFA </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Date sessions" name="dates">
              <a-range-picker v-model:value="form.dates" :locale="locale" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button @click="onClose">Cancel</a-button>
          <a-button type="primary" @click="addS">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
    <!-- edit drawer -->

    <a-drawer
      title="Modifier une session"
      :width="720"
      :visible="visibleEdit"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form :model="activeSession" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Code" name="code">
              <a-input v-model:value="activeSession.code" placeholder="Saisir le nom" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Type" name="type">
              <a-select v-model:value="activeSession.type" placeholder="Chosir le type du sujet !">
                <a-select-option key="PFE" value="PFE"> PFE </a-select-option>
                <a-select-option key="PFA" value="PFA"> PFA </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Date sessions" name="dates">
              <a-range-picker
                v-model:value="activeSession.dates"
                :locale="locale"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button @click="onClose">Cancel</a-button>
          <a-button type="primary" @click="saveS">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import VbHeadersHeading from '@/@vb/widgets/Headers/Heading'
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import { message } from 'ant-design-vue'
import locale from 'ant-design-vue/es/date-picker/locale/fr_FR'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref } from 'vue'
import ApiClient from '@/services/axios'
import moment from 'moment'
import dayjs from 'dayjs'
export default defineComponent({
  components: {
    VbHeadersHeading,
    VbHeadersCardHeader,
    UserAddOutlined,
    SearchOutlined,
  },
  setup() {
    const searchInput = ref()
    const columns = [
      {
        title: 'code',
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
            }, 0)
          }
        },
      },
      {
        title: 'Date début',
        dataIndex: 'start',
        key: 'start',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dateRender',
        },
        onFilter: (value, record) =>
          record.start.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      {
        title: 'Date de fin',
        dataIndex: 'end',
        key: 'end',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dateRender',
        },
        onFilter: (value, record) =>
          record.end.toString().toLowerCase().includes(value.toLowerCase()),
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

    //get sessions
    ApiClient.post('/admin/session/filter', {
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

    const deleteT = (record) => {
      ApiClient.delete('/admin/session/' + record._id)
        .then((res) => {
          dataSource.value = dataSource.value.filter((e) => {
            return e._id !== record._id
          })
          message.success('session supprimé avec succées ! ')
        })
        .catch((e) => {
          message.success('veuillez réesseilez ! ')
        })
    }
    const addS = () => {
      console.log('start', form.dates[0])
      console.log('end', form.dates[1])
      ApiClient.put('/admin/session/', {
        data: {
          code: form.code,
          type: form.type,
          start: form.dates[0],
          end: form.dates[1],
        },
      })
        .then((res) => {
          dataSource.value.push(res.data)
          message.success('session plannifié avec succées ! ')
          visible.value = false
        })
        .catch((e) => {
          console.log(e.response.data.message)
          message.error(e.response.data.message)
        })
    }
    //drawer actions
    const form = reactive({
      dates: '',
      type: 'PFE',
      code: '',
    })
    const rules = {
      dates: [
        {
          required: true,
          message: 'champ obligatoire !',
        },
      ],
      end: [
        {
          required: true,
          message: 'champ obligatoire !',
        },
      ],
      type: [
        {
          required: true,
          message: 'champ obligatoire !',
        },
      ],
      code: [
        {
          required: true,
          message: 'champ obligatoire !',
        },
      ],
    }
    const visible = ref(false)

    const showDrawer = () => {
      visible.value = true
    }

    const onClose = () => {
      visible.value = false
      visibleEdit.value = false
    }
    const onFinish = (values) => {
      console.log('Success:', values)
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo)
    }
    //edit drawer
    const activeSession = reactive({
      type: 'PFE',
      dates: '',
      code: '',
    })
    const visibleEdit = ref(false)
    const editT = (record) => {
      activeSession.value = JSON.parse(JSON.stringify(record))
      activeSession.type = record.type
      activeSession.code = record.code
      activeSession.dates = [dayjs(record.start), dayjs(record.end)]
      visibleEdit.value = true
    }
    const saveS = () => {
      ApiClient.patch('/admin/session/' + activeSession.value._id, {
        data: {
          type: activeSession.type,
          code: activeSession.code,
          start: activeSession.dates[0],
          end: activeSession.dates[1],
        },
      })
        .then((res) => {
          console.log('dates : ', activeSession.dates)
          dataSource.value = dataSource.value.map((elem) =>
            elem._id == activeSession.value._id
              ? {
                  ...elem,
                  start: dayjs(activeSession.dates[0]).format(),
                  end: dayjs(activeSession.dates[1]).format(),
                  code: activeSession.code,
                }
              : elem,
          )
          console.log(dataSource.value)
          //activeSession.value = res.data
          message.success('Session modifié ! ')
        })
        .catch((e) => {
          console.log(e)
          message.error('Veuillez refraichir la page ! ')
        })
        .finally(() => {
          visibleEdit.value = false
        })
    }

    return {
      columns,
      handleSearch,
      handleReset,
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      dataSource,
      tableLoading,
      deleteT,
      editT,
      form,
      rules,
      visible,
      showDrawer,
      onClose,
      addS,
      activeSession,
      visibleEdit,
      saveS,
      locale,
      moment,
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
