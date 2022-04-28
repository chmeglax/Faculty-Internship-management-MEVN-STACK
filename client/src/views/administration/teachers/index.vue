<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <vb-headers-heading :data="{ title: 'Géerer les enseignant' }" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <vb-headers-card-header :data="{ title: 'Liste des enseignants' }" />
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
                    <a-button
                      size="small"
                      style="width: 90px"
                      @click="() => handleReset(clearFilters)"
                    >
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
                <template #specialites="{ text }">
                  <a-tag color="#87d068" v-for="s in text" :key="s._id">{{ s.name }}</a-tag>
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
      title="Ajouter un ensignant"
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
          <a-col :span="12">
            <a-form-item label="nom" name="lName">
              <a-input v-model:value="form.lName" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="prénom" name="fName">
              <a-input v-model:value="form.fName" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Cin" name="cin">
              <a-input v-model:value="form.cin" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Téléphone" name="phone">
              <a-input v-model:value="form.phone" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Email" name="email">
              <a-input v-model:value="form.email" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Mot de passe" name="password">
              <a-input-password
                v-model:value="form.password"
                placeholder="Please enter user name"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Spécialiés" name="specialites">
              <a-select
                v-model:value="form.specialites"
                mode="multiple"
                placeholder="Please select"
                style="width: 200px"
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
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button @click="onClose">Cancel</a-button>
          <a-button type="primary" @click="addT">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
    <!-- edit drawer -->
    <a-drawer
      title="Modifier un ensignant"
      :width="720"
      :visible="visibleEdit"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form :model="activeTeacher" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="nom" name="lName">
              <a-input v-model:value="activeTeacher.lName" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="prénom" name="fName">
              <a-input v-model:value="activeTeacher.fName" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Cin" name="cin">
              <a-input v-model:value="activeTeacher.cin" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Téléphone" name="phone">
              <a-input v-model:value="activeTeacher.phone" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Email" name="email">
              <a-input v-model:value="activeTeacher.email" placeholder="Please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Mot de passe" name="password">
              <a-input-password
                v-model:value="activeTeacher.password"
                placeholder="Please enter user name"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Spécialiés" name="specialites">
              <a-select
                v-model:value="activeTeacher.specialites"
                mode="multiple"
                placeholder="Please select"
                style="width: 200px"
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
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button @click="onClose">Cancel</a-button>
          <a-button type="primary" @click="saveT">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import VbHeadersHeading from '@/@vb/widgets/Headers/Heading'
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import { message } from 'ant-design-vue'

import { SearchOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref } from 'vue'
import ApiClient from '@/services/axios'
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
        title: 'Name',
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
        title: 'cin',
        dataIndex: 'cin',
        key: 'cin',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.cin.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        },
      },
      {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.email.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        },
      },
      {
        title: 'Téléphone',
        dataIndex: 'phone',
        key: 'phone',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.phone.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        },
      },
      {
        title: 'Spécialités',
        dataIndex: 'specialites',
        key: 'specialites',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'specialites',
        },
        onFilter: (value, record) =>
          record.specialites.toString().toLowerCase().includes(value.toLowerCase()),
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
    //get teachers
    ApiClient.post('/admin/teacher/', {
      query: {},
    })
      .then((res) => {
        dataSource.value = res.data.map((e) => ({
          ...e,
          name: e.fName + ' ' + e.lName,
        }))
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
      clearFilters(clearFilters)
      state.searchText = ''
      console.log(state.searchText)
    }

    const deleteT = (record) => {
      ApiClient.delete('/admin/teacher/' + record._id)
        .then((res) => {
          dataSource.value = dataSource.value.filter((e) => {
            return e._id !== record._id
          })
          message.success('Enseignant supprimé avec succées ! ')
        })
        .catch((e) => {
          message.success('veuillez réesseilez ! ')
        })
    }
    const addT = () => {
      ApiClient.put('/admin/teacher/', form)
        .then((res) => {
          res.data.name = res.data.fName + ' ' + res.data.lName
          dataSource.value.push(res.data)
          message.success('Enseignant ajouter avec succées ! ')
          visible.value = false
        })
        .catch((e) => {
          console.log(e.response.data.message)
          message.error(e.response.data.message)
        })
    }
    //drawer actions
    const form = reactive({
      fName: '',
      lName: '',
      phone: '',
      cin: '',
      email: '',
      password: '',
      specialites: [],
    })
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
    const activeTeacher = reactive({
      fName: '',
      lName: '',
      phone: '',
      cin: '',
      email: '',
      specialites: [],
    })
    const visibleEdit = ref(false)
    const editT = (record) => {
      activeTeacher.value = JSON.parse(JSON.stringify(record))
      activeTeacher.specialites = record.specialites.map((e) => e._id)
      activeTeacher.fName = record.fName
      activeTeacher.lName = record.lName
      activeTeacher.phone = record.phone
      activeTeacher.cin = record.cin
      activeTeacher.email = record.email
      visibleEdit.value = true
    }
    const saveT = () => {
      ApiClient.patch('/admin/teacher/' + activeTeacher.value._id, {
        data: activeTeacher,
      })
        .then((res) => {
          dataSource.value = dataSource.value.map((elem) =>
            elem._id == activeTeacher.value._id
              ? {
                  ...elem,
                  specialites: specialites.value.filter((e) =>
                    activeTeacher.specialites.includes(e._id),
                  ),
                  lName: activeTeacher.lName,
                  fName: activeTeacher.fName,
                  name: activeTeacher.lName + ' ' + activeTeacher.fName,
                  phone: activeTeacher.phone,
                  cin: activeTeacher.cin,
                  email: activeTeacher.email,
                }
              : elem,
          )
          //activeTeacher.value = res.data
          message.success('Enseignat modifié ! ')
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
      addT,
      specialites,
      activeTeacher,
      visibleEdit,
      saveT,
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
