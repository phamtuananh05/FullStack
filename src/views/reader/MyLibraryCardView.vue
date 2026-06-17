<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Thẻ thư viện của tôi</h2>

      <v-spacer />

      <v-btn color="primary" variant="tonal" @click="loadMyCard">
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

    <v-card v-if="card" class="pa-6" max-width="700">
      <v-row>
        <v-col cols="12">
          <div class="text-h5 mb-2">Thông tin thẻ thư viện</div>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2">Họ tên</div>
          <div class="text-body-1">{{ card.fullName }}</div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2">Email</div>
          <div class="text-body-1">{{ card.email }}</div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2">Số thẻ</div>
          <div class="text-body-1">{{ card.cardNumber }}</div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2">Trạng thái</div>
          <v-chip
            :color="card.status === 'Active' ? 'green' : 'red'"
            size="small"
          >
            {{ card.status }}
          </v-chip>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2">Ngày cấp</div>
          <div class="text-body-1">{{ formatDate(card.issuedDate) }}</div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-subtitle-2">Ngày hết hạn</div>
          <div class="text-body-1">{{ formatDate(card.expiredDate) }}</div>
        </v-col>
      </v-row>
    </v-card>

    <v-card v-else class="pa-6">
      Không tìm thấy thông tin thẻ thư viện
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { libraryCardApi } from '../../api/libraryCardApi'

const card = ref(null)
const message = ref('')
const success = ref(true)

async function loadMyCard() {
  message.value = ''

  try {
    const res = await libraryCardApi.getMyCard()
    card.value = res.data
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được thẻ thư viện'
    console.error(err.response || err)
  }
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN')
}

onMounted(loadMyCard)
</script>