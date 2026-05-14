import { Router } from 'express'
import { TEMPLATES } from '../data/templates.js'

const router = Router()

router.get('/', (_req, res) => {
  res.json({ templates: TEMPLATES })
})

export default router
