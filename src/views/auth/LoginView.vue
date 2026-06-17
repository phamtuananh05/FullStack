<template>
  <v-app>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-6" elevation="8">
            <v-card-title class="text-h5 text-center">
              Đăng nhập thư viện
            </v-card-title>

            <v-card-subtitle class="text-center mb-4">
              Hệ thống quản lý thư viện số Microservices
            </v-card-subtitle>

            <v-card-text>
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                autocomplete="email"
              />

              <v-text-field
                v-model="password"
                label="Mật khẩu"
                type="password"
                prepend-inner-icon="mdi-lock"
                autocomplete="current-password"
                @keyup.enter="handleLogin"
              />

              <v-btn
                block
                color="primary"
                :loading="loading"
                @click="handleLogin"
              >
                Đăng nhập
              </v-btn>

              <v-divider class="my-4" />

              <div class="text-caption">
                <div><b>Admin:</b> admin@library.com / 123456</div>
                <div><b>Thủ thư:</b> librarian@library.com / 123456</div>
                <div><b>Độc giả:</b> reader@library.com / 123456</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const email = ref('librarian@library.com')
const password = ref('123456')
const loading = ref(false)
const error = ref('')

const router = useRouter()
const auth = useAuthStore()

async function handleLogin() {
  error.value = ''

  if (!email.value) {
    error.value = 'Vui lòng nhập email'
    return
  }

  if (!password.value) {
    error.value = 'Vui lòng nhập mật khẩu'
    return
  }

  loading.value = true

  try {
    const user = await auth.login(email.value, password.value)

    if (['Admin', 'Librarian'].includes(user.role)) {
      router.push('/dashboard')
    } else if (user.role === 'Reader') {
      router.push('/books')
    } else {
      router.push('/books')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>