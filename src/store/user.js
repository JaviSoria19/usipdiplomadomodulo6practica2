import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email,
          password
        })

        this.token = response.data.accessToken
        this.user = response.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        return true
      } catch (error) {
        return false
      }
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
