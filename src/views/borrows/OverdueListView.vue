<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Danh sách sách quá hạn</h2>

      <v-spacer />

      <v-btn color="primary" variant="tonal" @click="loadOverdue">
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

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-subtitle-2">Số phiếu đang quá hạn</div>
          <div class="text-h4">{{ overdueBorrows.length }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Số ngày quá hạn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in overdueBorrows" :key="item.id">
            <td>{{ item.readerName }}</td>
            <td>{{ item.bookTitle }}</td>
            <td>{{ formatDate(item.borrowDate) }}</td>
            <td>{{ formatDate(item.dueDate) }}</td>
            <td>
              <v-chip color="red" size="small">
                {{ getLateDays(item.dueDate) }} ngày
              </v-chip>
            </td>
            <td>
              <v-chip color="orange" size="small">
                {{ item.status }}
              </v-chip>
            </td>
          </tr>

          <tr v-if="overdueBorrows.length === 0">
            <td colspan="6" class="text-center pa-4">
              Không có sách quá hạn
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { borrowApi } from '../../api/borrowApi'

const overdueBorrows = ref([])
const message = ref('')
const success = ref(true)

async function loadOverdue() {
  message.value = ''

  try {
    const res = await borrowApi.getOverdue()
    overdueBorrows.value = res.data
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách sách quá hạn'
    console.error(err.response || err)
  }
}

function getLateDays(dueDate) {
  if (!dueDate) return 0

  const due = new Date(dueDate)
  const now = new Date()

  const diff = now.getTime() - due.getTime()

  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN')
}

onMounted(loadOverdue)
</script>