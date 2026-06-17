<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Danh sách sách</h2>

      <v-spacer />

      <v-btn
        v-if="canManageBook"
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        Thêm sách
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
        <v-col cols="12" md="4">
          <v-text-field
            v-model="keyword"
            label="Tìm theo tên / tác giả / ISBN"
            clearable
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="category"
            label="Thể loại"
            clearable
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="publishingYear"
            label="Năm xuất bản"
            type="number"
            clearable
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-btn color="primary" block @click="loadBooks">
            Tìm kiếm
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>NXB</th>
            <th>Thể loại</th>
            <th>Năm XB</th>
            <th>Tổng</th>
            <th>Còn</th>
            <th>Trạng thái</th>
            <th v-if="canManageBook">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.isbn }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.publisher }}</td>
            <td>{{ book.category }}</td>
            <td>{{ book.publishingYear }}</td>
            <td>{{ book.totalCopies }}</td>
            <td>{{ book.availableCopies }}</td>
            <td>
              <v-chip
                :color="book.isAvailable ? 'green' : 'red'"
                size="small"
              >
                {{ book.isAvailable ? 'Có thể mượn' : 'Hết sách' }}
              </v-chip>
            </td>

            <td v-if="canManageBook">
              <v-btn
                color="warning"
                size="small"
                variant="tonal"
                class="mr-2"
                @click="openEditDialog(book)"
              >
                Sửa
              </v-btn>

              <v-btn
                color="error"
                size="small"
                variant="tonal"
                @click="deleteBook(book)"
              >
                Xóa
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-title>
          {{ isEditMode ? 'Sửa thông tin sách' : 'Thêm sách mới' }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.isbn" label="ISBN" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.title" label="Tên sách" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.author" label="Tác giả" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.publisher" label="Nhà xuất bản" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.category" label="Thể loại" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.publishingYear"
                label="Năm xuất bản"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.totalCopies"
                label="Tổng số bản"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="6" v-if="isEditMode">
              <v-text-field
                v-model.number="form.availableCopies"
                label="Số bản còn lại"
                type="number"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.coverImageUrl"
                label="Link ảnh bìa"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="dialog = false">
            Hủy
          </v-btn>

          <v-btn color="primary" :loading="saving" @click="saveBook">
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { bookApi } from '../../api/bookApi'
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()

const books = ref([])
const keyword = ref('')
const category = ref('')
const publishingYear = ref('')

const dialog = ref(false)
const saving = ref(false)
const isEditMode = ref(false)
const selectedBookId = ref(null)

const message = ref('')
const success = ref(true)

const form = ref({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  publishingYear: new Date().getFullYear(),
  category: '',
  coverImageUrl: '',
  totalCopies: 1,
  availableCopies: 1
})

const canManageBook = computed(() =>
  ['Admin', 'Librarian'].includes(auth.role)
)

async function loadBooks() {
  message.value = ''

  const params = {}

  if (keyword.value) params.keyword = keyword.value
  if (category.value) params.category = category.value
  if (publishingYear.value) params.publishingYear = publishingYear.value

  try {
    const res = await bookApi.getAll(params)
    books.value = res.data
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách sách'
    console.error(err.response || err)
  }
}

function resetForm() {
  form.value = {
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishingYear: new Date().getFullYear(),
    category: '',
    coverImageUrl: '',
    totalCopies: 1,
    availableCopies: 1
  }
}

function openCreateDialog() {
  isEditMode.value = false
  selectedBookId.value = null
  resetForm()
  dialog.value = true
}

function openEditDialog(book) {
  isEditMode.value = true
  selectedBookId.value = book.id

  form.value = {
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publishingYear: book.publishingYear,
    category: book.category,
    coverImageUrl: book.coverImageUrl,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies
  }

  dialog.value = true
}

function validateForm() {
  if (!form.value.isbn) return 'ISBN không được để trống'
  if (!form.value.title) return 'Tên sách không được để trống'
  if (!form.value.author) return 'Tác giả không được để trống'
  if (!form.value.publishingYear || form.value.publishingYear <= 0) return 'Năm xuất bản không hợp lệ'
  if (!form.value.totalCopies || form.value.totalCopies <= 0) return 'Tổng số bản phải lớn hơn 0'

  if (isEditMode.value) {
    if (form.value.availableCopies < 0) return 'Số bản còn lại không được âm'
    if (form.value.availableCopies > form.value.totalCopies) {
      return 'Số bản còn lại không được lớn hơn tổng số bản'
    }
  }

  return ''
}

async function saveBook() {
  const error = validateForm()

  if (error) {
    success.value = false
    message.value = error
    return
  }

  saving.value = true
  message.value = ''

  try {
    if (isEditMode.value) {
      await bookApi.update(selectedBookId.value, {
        isbn: form.value.isbn,
        title: form.value.title,
        author: form.value.author,
        publisher: form.value.publisher,
        publishingYear: form.value.publishingYear,
        category: form.value.category,
        coverImageUrl: form.value.coverImageUrl,
        totalCopies: form.value.totalCopies,
        availableCopies: form.value.availableCopies
      })

      success.value = true
      message.value = 'Cập nhật sách thành công'
    } else {
      await bookApi.create({
        isbn: form.value.isbn,
        title: form.value.title,
        author: form.value.author,
        publisher: form.value.publisher,
        publishingYear: form.value.publishingYear,
        category: form.value.category,
        coverImageUrl: form.value.coverImageUrl,
        totalCopies: form.value.totalCopies
      })

      success.value = true
      message.value = 'Thêm sách thành công'
    }

    dialog.value = false
    await loadBooks()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Lưu sách thất bại'
    console.error(err.response || err)
  } finally {
    saving.value = false
  }
}

async function deleteBook(book) {
  const confirmed = confirm(`Bạn có chắc muốn xóa sách "${book.title}" không?`)

  if (!confirmed) return

  try {
    await bookApi.remove(book.id)

    success.value = true
    message.value = 'Xóa sách thành công'

    await loadBooks()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Xóa sách thất bại'
    console.error(err.response || err)
  }
}

onMounted(loadBooks)
</script>