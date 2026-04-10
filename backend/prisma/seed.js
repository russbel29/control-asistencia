require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear áreas
  const areas = await Promise.all([
    prisma.area.upsert({ where: { nombre: 'Barrido' }, update: {}, create: { nombre: 'Barrido' } }),
    prisma.area.upsert({ where: { nombre: 'Lavado de Calles' }, update: {}, create: { nombre: 'Lavado de Calles' } }),
    prisma.area.upsert({ where: { nombre: 'Recolección' }, update: {}, create: { nombre: 'Recolección' } }),
    prisma.area.upsert({ where: { nombre: 'Áreas Verdes' }, update: {}, create: { nombre: 'Áreas Verdes' } }),
  ])

  console.log(`✅ ${areas.length} áreas creadas`)

  // Crear fiscales de prueba (uno por área)
  const password = await bcrypt.hash('fiscal123', 10)

  const fiscales = await Promise.all([
    prisma.fiscal.upsert({
      where: { usuario: 'fiscal.barrido' },
      update: {},
      create: { nombre: 'Fiscal Barrido', usuario: 'fiscal.barrido', password, areaId: areas[0].id }
    }),
    prisma.fiscal.upsert({
      where: { usuario: 'fiscal.lavado' },
      update: {},
      create: { nombre: 'Fiscal Lavado', usuario: 'fiscal.lavado', password, areaId: areas[1].id }
    }),
    prisma.fiscal.upsert({
      where: { usuario: 'fiscal.recoleccion' },
      update: {},
      create: { nombre: 'Fiscal Recolección', usuario: 'fiscal.recoleccion', password, areaId: areas[2].id }
    }),
    prisma.fiscal.upsert({
      where: { usuario: 'fiscal.verdes' },
      update: {},
      create: { nombre: 'Fiscal Áreas Verdes', usuario: 'fiscal.verdes', password, areaId: areas[3].id }
    }),
  ])

  console.log(`✅ ${fiscales.length} fiscales creados`)
  console.log('👤 Usuarios de prueba:')
  console.log('   fiscal.barrido / fiscal123')
  console.log('   fiscal.lavado / fiscal123')
  console.log('   fiscal.recoleccion / fiscal123')
  console.log('   fiscal.verdes / fiscal123')
  console.log('⚠️  Cambiá las contraseñas en producción!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
