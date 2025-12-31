import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Specialties
  const specialties = await Promise.all([
    prisma.specialty.upsert({
      where: { name: 'General Physician' },
      update: {},
      create: {
        name: 'General Physician',
        description: 'Primary care and general health consultations',
        iconName: 'stethoscope'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Cardiologist' },
      update: {},
      create: {
        name: 'Cardiologist',
        description: 'Heart and cardiovascular system specialist',
        iconName: 'heart'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Dermatologist' },
      update: {},
      create: {
        name: 'Dermatologist',
        description: 'Skin, hair, and nail specialist',
        iconName: 'user'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Neurologist' },
      update: {},
      create: {
        name: 'Neurologist',
        description: 'Brain and nervous system specialist',
        iconName: 'brain'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Orthopedic' },
      update: {},
      create: {
        name: 'Orthopedic',
        description: 'Bones, joints, and muscles specialist',
        iconName: 'bone'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'ENT Specialist' },
      update: {},
      create: {
        name: 'ENT Specialist',
        description: 'Ear, nose, and throat specialist',
        iconName: 'ear'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Gastroenterologist' },
      update: {},
      create: {
        name: 'Gastroenterologist',
        description: 'Digestive system specialist',
        iconName: 'stomach'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Psychiatrist' },
      update: {},
      create: {
        name: 'Psychiatrist',
        description: 'Mental health specialist',
        iconName: 'brain'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Pulmonologist' },
      update: {},
      create: {
        name: 'Pulmonologist',
        description: 'Respiratory system specialist',
        iconName: 'lungs'
      }
    }),
    prisma.specialty.upsert({
      where: { name: 'Ophthalmologist' },
      update: {},
      create: {
        name: 'Ophthalmologist',
        description: 'Eye specialist',
        iconName: 'eye'
      }
    })
  ])

  console.log(`✅ Created ${specialties.length} specialties`)

  // Create Symptoms
  const symptoms = await Promise.all([
    // Common symptoms
    prisma.symptom.upsert({ where: { name: 'Fever' }, update: {}, create: { name: 'Fever', description: 'Elevated body temperature', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Headache' }, update: {}, create: { name: 'Headache', description: 'Pain in the head region', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Cough' }, update: {}, create: { name: 'Cough', description: 'Sudden expulsion of air from lungs', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Fatigue' }, update: {}, create: { name: 'Fatigue', description: 'Extreme tiredness', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Nausea' }, update: {}, create: { name: 'Nausea', description: 'Feeling of sickness', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Vomiting' }, update: {}, create: { name: 'Vomiting', description: 'Forceful emptying of stomach', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Diarrhea' }, update: {}, create: { name: 'Diarrhea', description: 'Loose watery stools', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Chest Pain' }, update: {}, create: { name: 'Chest Pain', description: 'Pain in chest area', severity: 4 } }),
    prisma.symptom.upsert({ where: { name: 'Shortness of Breath' }, update: {}, create: { name: 'Shortness of Breath', description: 'Difficulty breathing', severity: 4 } }),
    prisma.symptom.upsert({ where: { name: 'Dizziness' }, update: {}, create: { name: 'Dizziness', description: 'Feeling lightheaded', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Joint Pain' }, update: {}, create: { name: 'Joint Pain', description: 'Pain in joints', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Muscle Pain' }, update: {}, create: { name: 'Muscle Pain', description: 'Pain in muscles', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Sore Throat' }, update: {}, create: { name: 'Sore Throat', description: 'Pain in throat', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Runny Nose' }, update: {}, create: { name: 'Runny Nose', description: 'Nasal discharge', severity: 1 } }),
    prisma.symptom.upsert({ where: { name: 'Skin Rash' }, update: {}, create: { name: 'Skin Rash', description: 'Skin irritation or discoloration', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Abdominal Pain' }, update: {}, create: { name: 'Abdominal Pain', description: 'Pain in stomach area', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Loss of Appetite' }, update: {}, create: { name: 'Loss of Appetite', description: 'Reduced desire to eat', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Weight Loss' }, update: {}, create: { name: 'Weight Loss', description: 'Unintentional weight reduction', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Blurred Vision' }, update: {}, create: { name: 'Blurred Vision', description: 'Unclear vision', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Anxiety' }, update: {}, create: { name: 'Anxiety', description: 'Feeling of worry or fear', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Depression' }, update: {}, create: { name: 'Depression', description: 'Persistent sadness', severity: 4 } }),
    prisma.symptom.upsert({ where: { name: 'Insomnia' }, update: {}, create: { name: 'Insomnia', description: 'Difficulty sleeping', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Back Pain' }, update: {}, create: { name: 'Back Pain', description: 'Pain in back region', severity: 3 } }),
    prisma.symptom.upsert({ where: { name: 'Swelling' }, update: {}, create: { name: 'Swelling', description: 'Abnormal enlargement', severity: 2 } }),
    prisma.symptom.upsert({ where: { name: 'Itching' }, update: {}, create: { name: 'Itching', description: 'Skin irritation causing urge to scratch', severity: 2 } }),
  ])

  console.log(`✅ Created ${symptoms.length} symptoms`)

  // Create Diseases
  const generalPhysician = specialties.find(s => s.name === 'General Physician')!
  const cardiologist = specialties.find(s => s.name === 'Cardiologist')!
  const dermatologist = specialties.find(s => s.name === 'Dermatologist')!
  const neurologist = specialties.find(s => s.name === 'Neurologist')!
  const gastro = specialties.find(s => s.name === 'Gastroenterologist')!
  const pulmonologist = specialties.find(s => s.name === 'Pulmonologist')!
  const psychiatrist = specialties.find(s => s.name === 'Psychiatrist')!

  const diseases = await Promise.all([
    prisma.disease.upsert({
      where: { name: 'Common Cold' },
      update: {},
      create: {
        name: 'Common Cold',
        description: 'A viral infection of the upper respiratory tract',
        precautions: ['Rest well', 'Stay hydrated', 'Use over-the-counter cold remedies', 'Avoid close contact with others'],
        recommendedSpecialtyId: generalPhysician.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Influenza (Flu)' },
      update: {},
      create: {
        name: 'Influenza (Flu)',
        description: 'A contagious respiratory illness caused by influenza viruses',
        precautions: ['Get plenty of rest', 'Drink fluids', 'Take antiviral medications if prescribed', 'Stay home to prevent spreading'],
        recommendedSpecialtyId: generalPhysician.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Migraine' },
      update: {},
      create: {
        name: 'Migraine',
        description: 'A type of headache with severe throbbing pain',
        precautions: ['Avoid triggers', 'Rest in a dark quiet room', 'Apply cold compress', 'Take prescribed medications'],
        recommendedSpecialtyId: neurologist.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Hypertension' },
      update: {},
      create: {
        name: 'Hypertension',
        description: 'High blood pressure condition',
        precautions: ['Reduce salt intake', 'Exercise regularly', 'Maintain healthy weight', 'Take medications as prescribed'],
        recommendedSpecialtyId: cardiologist.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Gastritis' },
      update: {},
      create: {
        name: 'Gastritis',
        description: 'Inflammation of the stomach lining',
        precautions: ['Avoid spicy foods', 'Eat smaller meals', 'Avoid alcohol', 'Take antacids if needed'],
        recommendedSpecialtyId: gastro.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Eczema' },
      update: {},
      create: {
        name: 'Eczema',
        description: 'Skin condition causing itchy, inflamed skin',
        precautions: ['Moisturize regularly', 'Avoid harsh soaps', 'Wear soft fabrics', 'Use prescribed creams'],
        recommendedSpecialtyId: dermatologist.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Asthma' },
      update: {},
      create: {
        name: 'Asthma',
        description: 'Chronic respiratory condition affecting airways',
        precautions: ['Avoid triggers', 'Use inhalers as prescribed', 'Monitor breathing', 'Have an action plan'],
        recommendedSpecialtyId: pulmonologist.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Anxiety Disorder' },
      update: {},
      create: {
        name: 'Anxiety Disorder',
        description: 'Mental health condition with excessive worry',
        precautions: ['Practice relaxation techniques', 'Exercise regularly', 'Limit caffeine', 'Seek therapy'],
        recommendedSpecialtyId: psychiatrist.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Diabetes Type 2' },
      update: {},
      create: {
        name: 'Diabetes Type 2',
        description: 'Metabolic disorder affecting blood sugar levels',
        precautions: ['Monitor blood sugar', 'Follow diet plan', 'Exercise regularly', 'Take medications as prescribed'],
        recommendedSpecialtyId: generalPhysician.id
      }
    }),
    prisma.disease.upsert({
      where: { name: 'Bronchitis' },
      update: {},
      create: {
        name: 'Bronchitis',
        description: 'Inflammation of the bronchial tubes',
        precautions: ['Rest well', 'Stay hydrated', 'Use humidifier', 'Avoid smoking'],
        recommendedSpecialtyId: pulmonologist.id
      }
    }),
  ])

  console.log(`✅ Created ${diseases.length} diseases`)

  // Create sample doctors
  const hashedPassword = await bcrypt.hash('password123', 10)

  const doctorUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'dr.ahmed@mediassist.com' },
      update: {},
      create: {
        email: 'dr.ahmed@mediassist.com',
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            firstName: 'Ahmed',
            lastName: 'Khan',
            specialtyId: generalPhysician.id,
            phone: '+92 321 1234567',
            address: 'Medical Complex, GT Road',
            city: 'Taxila',
            latitude: 33.7665,
            longitude: 72.8329,
            qualifications: 'MBBS, FCPS',
            experience: 10,
            rating: 4.8,
            reviewCount: 156,
            consultationFee: 1500,
            availableFrom: '09:00',
            availableTo: '17:00',
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            isActive: true,
            isVerified: true
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'dr.fatima@mediassist.com' },
      update: {},
      create: {
        email: 'dr.fatima@mediassist.com',
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            firstName: 'Fatima',
            lastName: 'Ali',
            specialtyId: cardiologist.id,
            phone: '+92 333 9876543',
            address: 'Heart Care Center, Main Boulevard',
            city: 'Rawalpindi',
            latitude: 33.5651,
            longitude: 73.0169,
            qualifications: 'MBBS, MRCP, FCPS Cardiology',
            experience: 15,
            rating: 4.9,
            reviewCount: 243,
            consultationFee: 2500,
            availableFrom: '10:00',
            availableTo: '18:00',
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
            isActive: true,
            isVerified: true
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'dr.hassan@mediassist.com' },
      update: {},
      create: {
        email: 'dr.hassan@mediassist.com',
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            firstName: 'Hassan',
            lastName: 'Malik',
            specialtyId: dermatologist.id,
            phone: '+92 345 5556666',
            address: 'Skin Care Clinic, University Road',
            city: 'Taxila',
            latitude: 33.7445,
            longitude: 72.7867,
            qualifications: 'MBBS, FCPS Dermatology',
            experience: 8,
            rating: 4.7,
            reviewCount: 98,
            consultationFee: 2000,
            availableFrom: '11:00',
            availableTo: '19:00',
            workingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
            isActive: true,
            isVerified: true
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'dr.ayesha@mediassist.com' },
      update: {},
      create: {
        email: 'dr.ayesha@mediassist.com',
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            firstName: 'Ayesha',
            lastName: 'Siddiqui',
            specialtyId: neurologist.id,
            phone: '+92 300 7778888',
            address: 'Neuro Care Hospital, Saddar',
            city: 'Rawalpindi',
            latitude: 33.5973,
            longitude: 73.0479,
            qualifications: 'MBBS, FCPS Neurology, Fellowship UK',
            experience: 12,
            rating: 4.9,
            reviewCount: 187,
            consultationFee: 3000,
            availableFrom: '09:00',
            availableTo: '15:00',
            workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            isActive: true,
            isVerified: true
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'dr.usman@mediassist.com' },
      update: {},
      create: {
        email: 'dr.usman@mediassist.com',
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            firstName: 'Usman',
            lastName: 'Tariq',
            specialtyId: gastro.id,
            phone: '+92 311 2223333',
            address: 'Digestive Health Center, Wah Cantt',
            city: 'Wah Cantt',
            latitude: 33.7780,
            longitude: 72.7511,
            qualifications: 'MBBS, FCPS Gastroenterology',
            experience: 9,
            rating: 4.6,
            reviewCount: 112,
            consultationFee: 2000,
            availableFrom: '10:00',
            availableTo: '18:00',
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            isActive: true,
            isVerified: true
          }
        }
      }
    }),
  ])

  console.log(`✅ Created ${doctorUsers.length} doctors`)

  // Create a sample patient
  await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      password: hashedPassword,
      role: 'PATIENT',
      patient: {
        create: {
          firstName: 'Ali',
          lastName: 'Raza',
          phone: '+92 300 1112222',
          city: 'Taxila',
          gender: 'MALE'
        }
      }
    }
  })

  console.log('✅ Created sample patient')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

