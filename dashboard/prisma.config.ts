/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { defineConfig } from '@prisma/config'

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL,
    },
})
