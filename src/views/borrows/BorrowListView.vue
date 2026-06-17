<template>
  <div>
    <h2 class="mb-4">Danh sách phiếu mượn</h2>

    <v-alert
      v-if="message"
      type="success"
      variant="tonal"
      class="mb-4"
    >
      {{ message }}
    </v-alert>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Tiền phạt</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="borrow in borrows" :key="borrow.id">
            <td>{{ borrow.readerName }}</td>
            <td>{{ borrow.bookTitle }}</td>
            <td>{{ formatDate(borrow.borrowDate) }}</td>
            <td>{{ formatDate(borrow.dueDate) }}</td>
            <td>{{ borrow.returnDate ? formatDate(borrow.returnDate) : '-' }}</td>
            <td>
              <v-chip :color="borrow.status === 'Borrowed' ? 'orange' : 'green'" size="small">
                {{ borrow.status }}
              </v-chip>
            </td>
            <td>{{ borrow.fineAmount }}</td>
            <td>
              <v-btn
                v-if="borrow.status === 'Borrowed'"
                color="primary"
                size="small"
                @click="returnBook(borrow.id)"
              >
                Trả sách
              </v-btn>

              <v-btn
                v-if="borrow.fineAmount > 0 && !borrow.isFinePaid"
                color="success"
                size="small"
                class="ml-2"
                @click="payFine(borrow.id)"
              >
                Thu phạt
              </v-btn>
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

async function loadBorrows() {
  const res = await borrowApi.getAll()
  borrows.value = res.data
}

async function returnBook(id) {
  const res = await borrowApi.returnBook(id, {
    returnDate: new Date().toISOString()
  })

  message.value = res.data.message
  await loadBorrows()
}

async function payFine(id) {
  const res = await borrowApi.payFine(id)
  message.value = res.data.message
  await loadBorrows()
}

function formatDate(value) {
  return new Date(value).toLocaleString('vi-VN')
}

onMounted(loadBorrows)
</script>