import api from './axios'

export const borrowApi = {
  getAll(params) {
    return api.get('/api/circulation/borrows', { params })
  },

  getMyBorrows() {
    return api.get('/api/circulation/borrows/me')
  },

  create(data) {
    return api.post('/api/circulation/borrows', data)
  },

  returnBook(id, data) {
    return api.put(`/api/circulation/borrows/${id}/return`, data)
  },

  getOverdue() {
    return api.get('/api/circulation/borrows/overdue')
  },

  getFines() {
    return api.get('/api/circulation/borrows/fines')
  },

  payFine(id) {
    return api.put(`/api/circulation/borrows/${id}/pay-fine`)
  }
}