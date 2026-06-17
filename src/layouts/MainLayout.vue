<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          title="Library System"
          subtitle="Microservices"
        />

        <v-divider />

        <!-- Admin / Librarian -->
        <v-list-item
          v-if="isAdminOrLibrarian"
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          to="/dashboard"
        />

        <!-- Dùng chung cho Admin / Librarian / Reader -->
        <v-list-item
          title="Sách"
          prepend-icon="mdi-book-open-page-variant"
          to="/books"
        />

        <!-- Reader -->
        <v-list-item
          v-if="isReader"
          title="Lịch sử mượn của tôi"
          prepend-icon="mdi-history"
          to="/my-borrows"
        />

        <v-list-item
          v-if="isReader"
          title="Thẻ thư viện của tôi"
          prepend-icon="mdi-card-account-details"
          to="/my-card"
        />

        <!-- Admin / Librarian -->
        <v-list-item
          v-if="isAdminOrLibrarian"
          title="Độc giả"
          prepend-icon="mdi-account-group"
          to="/readers"
        />

        <v-list-item
          v-if="isAdminOrLibrarian"
          title="Phiếu mượn"
          prepend-icon="mdi-clipboard-text"
          to="/borrows"
        />

        <v-list-item
          v-if="isAdminOrLibrarian"
          title="Tạo phiếu mượn"
          prepend-icon="mdi-plus-box"
          to="/borrow-create"
        />

        <v-list-item
          v-if="isAdminOrLibrarian"
          title="Sách quá hạn"
          prepend-icon="mdi-alert-circle"
          to="/overdue"
        />

        <v-list-item
          v-if="isAdminOrLibrarian"
          title="Công nợ phí phạt"
          prepend-icon="mdi-cash"
          to="/fines"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>
        Hệ thống quản lý thư viện số
      </v-app-bar-title>

      <v-spacer />

      <span class="mr-4">
        {{ auth.fullName }} - {{ displayRole }}
      </span>

      <v-btn color="red" variant="tonal" @click="logout">
        Đăng xuất
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const drawer = ref(true)
const router = useRouter()
const auth = useAuthStore()

const isAdminOrLibrarian = computed(() =>
  ['Admin', 'Librarian'].includes(auth.role)
)

const isReader = computed(() =>
  auth.role === 'Reader'
)

const displayRole = computed(() => {
  if (auth.role === 'Admin') return 'Quản trị viên'
  if (auth.role === 'Librarian') return 'Thủ thư'
  if (auth.role === 'Reader') return 'Độc giả'
  return auth.role
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>