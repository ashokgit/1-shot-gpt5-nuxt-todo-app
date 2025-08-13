import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    typescript: { strict: true },
    app: {
        head: {
            title: 'Nuxt Todo Demo',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'A simple Nuxt 3 Todo app demo with localStorage.' }
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
            ]
        }
    },
    devtools: { enabled: true }
})
