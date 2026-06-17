<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Quản lý độc giả</h2>

      <v-spacer />

      <v-btn color="primary" variant="tonal" @click="loadReaders">
        Tải lại
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-4"
    >
      {{ message }}
    </v-alert>

    <v-card class="pa-4 mb-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="keyword"
            label="Tìm theo tên, email hoặc mã sinh viên"
            clearable
            @keyup.enter="loadReaders"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-btn color="primary" block @click="loadReaders">
            Tìm kiếm
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Mã SV</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Trạng thái tài khoản</th>
            <th>Số thẻ</th>
            <th>Hạn thẻ</th>
            <th>Trạng thái thẻ</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="reader in readers" :key="reader.userId">
            <td>{{ reader.fullName }}</td>
            <td>{{ reader.email }}</td>
            <td>{{ reader.studentCode || '-' }}</td>
            <td>{{ reader.phone || '-' }}</td>
            <td>{{ reader.address || '-' }}</td>

            <td>
              <v-chip
                :color="reader.userStatus === 'Active' ? 'green' : 'red'"
                size="small"
              >
                {{ reader.userStatus }}
              </v-chip>
            </td>

            <td>{{ reader.cardNumber || '-' }}</td>

            <td>
              {{ formatDate(reader.expiredDate) }}
            </td>

            <td>
              <v-chip
                :color="reader.cardStatus === 'Active' ? 'green' : 'red'"
                size="small"
              >
                {{ reader.cardStatus || '-' }}
              </v-chip>
            </td>

            <td>
              <div class="d-flex flex-wrap ga-2">
                <v-btn
                  color="info"
                  size="small"
                  variant="tonal"
                  @click="viewCard(reader)"
                >
                  Xem thẻ
                </v-btn>

                <v-btn
                  v-if="canManageCard"
                  color="primary"
                  size="small"
                  variant="tonal"
                  :loading="loadingId === reader.userId + '-renew'"
                  @click="renewCard(reader)"
                >
                  Gia hạn thẻ
                </v-btn>

                <v-btn
                  v-if="canManageCard && reader.cardStatus === 'Active'"
                  color="warning"
                  size="small"
                  variant="tonal"
                  :loading="loadingId === reader.userId + '-lock-card'"
                  @click="lockCard(reader)"
                >
                  Khóa thẻ
                </v-btn>

                <v-btn
                  v-if="canManageCard && reader.cardStatus === 'Locked'"
                  color="success"
                  size="small"
                  variant="tonal"
                  :loading="loadingId === reader.userId + '-unlock-card'"
                  @click="unlockCard(reader)"
                >
                  Mở thẻ
                </v-btn>

                <v-btn
                  v-if="canManageUser && reader.userStatus === 'Active'"
                  color="error"
                  size="small"
                  variant="tonal"
                  :loading="loadingId === reader.userId + '-lock-user'"
                  @click="lockUser(reader)"
                >
                  Khóa TK
                </v-btn>

                <v-btn
                  v-if="canManageUser && reader.userStatus === 'Locked'"
                  color="success"
                  size="small"
                  variant="tonal"
                  :loading="loadingId === reader.userId + '-unlock-user'"
                  @click="unlockUser(reader)"
                >
                  Mở TK
                </v-btn>
              </div>
            </td>
          </tr>

          <tr v-if="readers.length === 0">
            <td colspan="10" class="text-center pa-4">
              Không có độc giả
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="cardDialog" max-width="600">
      <v-card>
        <v-card-title>Thông tin thẻ thư viện</v-card-title>

        <v-card-text v-if="selectedCard">
          <v-list>
            <v-list-item>
              <v-list-item-title>Độc giả</v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedCard.fullName }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedCard.email }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Số thẻ</v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedCard.cardNumber }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Ngày cấp</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(selectedCard.issuedDate) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Ngày hết hạn</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(selectedCard.expiredDate) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Trạng thái</v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedCard.status }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="cardDialog = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { readerApi } from '../../api/readerApi'
import { userApi } from '../../api/userApi'
import { libraryCardApi } from '../../api/libraryCardApi'
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()

const readers = ref([])
const keyword = ref('')
const message = ref('')
const success = ref(true)
const loadingId = ref('')

const cardDialog = ref(false)
const selectedCard = ref(null)

const canManageUser = computed(() => auth.role === 'Admin')

const canManageCard = computed(() =>
  ['Admin', 'Librarian'].includes(auth.role)
)

async function loadReaders() {
  message.value = ''

  try {
    const params = {}

    if (keyword.value) {
      params.keyword = keyword.value
    }

    const res = await readerApi.getAll(params)
    readers.value = res.data
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách độc giả'
    console.error(err.response || err)
  }
}

async function viewCard(reader) {
  message.value = ''

  try {
    const res = await libraryCardApi.getCard(reader.userId)

    selectedCard.value = res.data
    cardDialog.value = true
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không xem được thẻ thư viện'
    console.error(err.response || err)
  }
}

async function renewCard(reader) {
  const confirmed = confirm(`Gia hạn thẻ thư viện cho "${reader.fullName}" thêm 1 năm?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-renew'
  message.value = ''

  try {
    const res = await libraryCardApi.renewCard(reader.userId)

    success.value = true
    message.value = res.data.message || 'Gia hạn thẻ thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Gia hạn thẻ thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function lockCard(reader) {
  const confirmed = confirm(`Khóa thẻ thư viện của "${reader.fullName}"?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-lock-card'
  message.value = ''

  try {
    const res = await libraryCardApi.lockCard(reader.userId)

    success.value = true
    message.value = res.data.message || 'Khóa thẻ thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Khóa thẻ thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function unlockCard(reader) {
  const confirmed = confirm(`Mở khóa thẻ thư viện của "${reader.fullName}"?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-unlock-card'
  message.value = ''

  try {
    const res = await libraryCardApi.unlockCard(reader.userId)

    success.value = true
    message.value = res.data.message || 'Mở khóa thẻ thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Mở khóa thẻ thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function lockUser(reader) {
  const confirmed = confirm(`Khóa tài khoản "${reader.fullName}"? Độc giả sẽ không thể mượn sách.`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-lock-user'
  message.value = ''

  try {
    const res = await userApi.lockUser(reader.userId)

    success.value = true
    message.value = res.data.message || 'Khóa tài khoản thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Khóa tài khoản thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function unlockUser(reader) {
  const confirmed = confirm(`Mở khóa tài khoản "${reader.fullName}"?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-unlock-user'
  message.value = ''

  try {
    const res = await userApi.unlockUser(reader.userId)

    success.value = true
    message.value = res.data.message || 'Mở khóa tài khoản thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Mở khóa tài khoản thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

function formatDate(value) {
  if (!value) return '-'

  return new Date(value).toLocaleString('vi-VN')
}

onMounted(loadReaders)
</script>