<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Lịch sử mượn của tôi</h2>

      <v-spacer />

      <v-btn color="primary" variant="tonal" @click="loadMyBorrows">
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

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Quá hạn</th>
            <th>Tiền phạt</th>
            <th>Trạng thái phạt</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in borrows" :key="item.id">
            <td>{{ item.bookTitle }}</td>
            <td>{{ formatDate(item.borrowDate) }}</td>
            <td>{{ formatDate(item.dueDate) }}</td>
            <td>{{ item.returnDate ? formatDate(item.returnDate) : '-' }}</td>

            <td>
              <v-chip
                :color="item.status === 'Borrowed' ? 'orange' : 'green'"
                size="small"
              >
                {{ item.status === 'Borrowed' ? 'Đang mượn' : 'Đã trả' }}
              </v-chip>
            </td>

            <td>
              <v-chip
                :color="item.isOverdue ? 'red' : 'green'"
                size="small"
              >
                {{ item.isOverdue ? 'Quá hạn' : 'Không' }}
              </v-chip>
            </td>

            <td>{{ formatMoney(item.fineAmount) }}</td>

            <td>
              <v-chip
                :color="item.isFinePaid ? 'green' : 'red'"
                size="small"
              >
                {{ item.isFinePaid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </v-chip>
            </td>
          </tr>

          <tr v-if="borrows.length === 0">
            <td colspan="8" class="text-center pa-4">
              Bạn chưa có lịch sử mượn sách
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

const borrows = ref([])
const message = ref('')
const success = ref(true)

async function loadMyBorrows() {
  message.value = ''

  try {
    const res = await borrowApi.getMyBorrows()
    borrows.value = res.data
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được lịch sử mượn'
    console.error(err.response || err)
  }
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN')
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

onMounted(loadMyBorrows)
</script>