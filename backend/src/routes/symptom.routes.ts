import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// Get all symptoms
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query

    const where: any = {}
    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' }
    }

    const symptoms = await prisma.symptom.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    res.json(symptoms)
  } catch (error) {
    console.error('Get symptoms error:', error)
    res.status(500).json({ error: 'Failed to fetch symptoms' })
  }
})

// Get symptom by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const symptom = await prisma.symptom.findUnique({
      where: { id },
      include: {
        diseases: {
          include: {
            disease: {
              include: {
                recommendedSpecialty: true
              }
            }
          }
        }
      }
    })

    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' })
    }

    res.json({
      ...symptom,
      relatedDiseases: symptom.diseases.map(ds => ({
        id: ds.disease.id,
        name: ds.disease.name,
        description: ds.disease.description,
        recommendedSpecialty: ds.disease.recommendedSpecialty?.name,
        weight: ds.weight
      }))
    })
  } catch (error) {
    console.error('Get symptom error:', error)
    res.status(500).json({ error: 'Failed to fetch symptom' })
  }
})

// Get all diseases
router.get('/diseases/all', async (req: Request, res: Response) => {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        recommendedSpecialty: true,
        symptoms: {
          include: {
            symptom: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    res.json(diseases.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      precautions: d.precautions,
      recommendedSpecialty: d.recommendedSpecialty?.name,
      symptoms: d.symptoms.map(ds => ds.symptom.name)
    })))
  } catch (error) {
    console.error('Get diseases error:', error)
    res.status(500).json({ error: 'Failed to fetch diseases' })
  }
})

// Get disease by ID
router.get('/diseases/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const disease = await prisma.disease.findUnique({
      where: { id },
      include: {
        recommendedSpecialty: true,
        symptoms: {
          include: {
            symptom: true
          }
        }
      }
    })

    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' })
    }

    res.json({
      id: disease.id,
      name: disease.name,
      description: disease.description,
      precautions: disease.precautions,
      recommendedSpecialty: disease.recommendedSpecialty?.name,
      symptoms: disease.symptoms.map(ds => ({
        id: ds.symptom.id,
        name: ds.symptom.name,
        severity: ds.symptom.severity,
        weight: ds.weight
      }))
    })
  } catch (error) {
    console.error('Get disease error:', error)
    res.status(500).json({ error: 'Failed to fetch disease' })
  }
})

// Search diseases by symptoms
router.post('/diseases/search', async (req: Request, res: Response) => {
  try {
    const { symptoms } = req.body

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array is required' })
    }

    // Find diseases that have any of the provided symptoms
    const diseases = await prisma.disease.findMany({
      where: {
        symptoms: {
          some: {
            symptom: {
              name: {
                in: symptoms.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
              }
            }
          }
        }
      },
      include: {
        recommendedSpecialty: true,
        symptoms: {
          include: {
            symptom: true
          }
        }
      }
    })

    // Calculate match score for each disease
    const scoredDiseases = diseases.map(disease => {
      const diseaseSymptoms = disease.symptoms.map(ds => ds.symptom.name.toLowerCase())
      const matchingSymptoms = symptoms.filter((s: string) => 
        diseaseSymptoms.includes(s.toLowerCase())
      )
      const matchScore = (matchingSymptoms.length / diseaseSymptoms.length) * 100

      return {
        id: disease.id,
        name: disease.name,
        description: disease.description,
        precautions: disease.precautions,
        recommendedSpecialty: disease.recommendedSpecialty?.name,
        matchingSymptoms,
        totalSymptoms: diseaseSymptoms,
        matchScore: Math.round(matchScore)
      }
    })

    // Sort by match score
    scoredDiseases.sort((a, b) => b.matchScore - a.matchScore)

    res.json(scoredDiseases)
  } catch (error) {
    console.error('Search diseases error:', error)
    res.status(500).json({ error: 'Failed to search diseases' })
  }
})

export default router

