import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import LoginView from '../views/auth/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import BookListView from '../views/books/BookListView.vue'
import BorrowListView from '../views/borrows/BorrowListView.vue'
import BorrowCreateView from '../views/borrows/BorrowCreateView.vue'
import MyBorrowHistoryView from '../views/reader/MyBorrowHistoryView.vue'
import MyLibraryCardView from '../views/reader/MyLibraryCardView.vue'
import ReaderListView from '../views/readers/ReaderListView.vue'
import FineListView from '../views/borrows/FineListView.vue'
import OverdueListView from '../views/borrows/OverdueListView.vue'

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/my-borrows',
    component: MyBorrowHistoryView,
    meta: { roles: ['Reader'] }
  },
  {
    path: '/my-card',
    component: MyLibraryCardView,
    meta: { roles: ['Reader'] }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/books'
      },
      {
        path: '/dashboard',
        component: DashboardView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: '/books',
        component: BookListView,
        meta: { roles: ['Admin', 'Librarian', 'Reader'] }
      },
      {
        path: '/readers',
        component: ReaderListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: '/borrows',
        component: BorrowListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: '/borrow-create',
        component: BorrowCreateView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: '/fines',
        component: FineListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: '/overdue',
        component: OverdueListView,
        meta: { roles: ['Admin', 'Librarian'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return '/login'
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return '/books'
  }
})

export default router