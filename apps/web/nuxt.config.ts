import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@primevue/nuxt-module'],

  eslint: {
    config: {
      standalone: false,
    },
  },

  // API 프록시 설정 - JSON Server와 연결
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },

  // 앱 기본 설정
  app: {
    head: {
      title: '이상현 미션',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '이상현 미션' },
      ],
    },
  },
})
