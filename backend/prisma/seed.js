require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// ─── Trabajadores de Recolección ───────────────────────────────────────────
// Fuente: planilla Excel área Recolección
// Formato dni: código de trabajador. Sin código → "PENDING-<apellido_inicial>"
const TRABAJADORES_RECOLECCION = [
  // ── Modalidad 728 ──
  { dni: '249915', nombre: 'Raul',              apellido: 'Altamirano Quispe',  modalidad: 'MOD_728' },
  { dni: '250050', nombre: 'Agustin Moises',    apellido: 'Ayala Vergaray',     modalidad: 'MOD_728' },
  { dni: '250079', nombre: 'Richard Alexander', apellido: 'Cadillo Carranza',   modalidad: 'MOD_728' },
  { dni: '250191', nombre: 'Pedro Justino',     apellido: 'Diaz Lopez',         modalidad: 'MOD_728' },
  { dni: '249744', nombre: 'Franco',            apellido: 'Flores Poma',        modalidad: 'MOD_728' },
  { dni: '249799', nombre: 'Alfredo Luis',      apellido: 'Huaman Cuya',        modalidad: 'MOD_728' },
  { dni: '249836', nombre: 'Rosendo',           apellido: 'Huiza Camacho',      modalidad: 'MOD_728' },
  { dni: '249948', nombre: 'Elmer',             apellido: 'Mamani Supo',        modalidad: 'MOD_728' },
  { dni: '249856', nombre: 'Ysmael Antero',     apellido: 'Maza Maximo',        modalidad: 'MOD_728' },
  { dni: '249859', nombre: 'German',            apellido: 'Mejia Espinoza',     modalidad: 'MOD_728' },
  { dni: '249869', nombre: 'Albino',            apellido: 'Munarez Ccoicca',    modalidad: 'MOD_728' },
  { dni: 'PENDING-OREHINOSTROZA', nombre: 'Juan Carlos', apellido: 'Ore Hinostroza', modalidad: 'MOD_728' },

  // ── Modalidad CAS ──
  { dni: '255499', nombre: 'Cesar Augusto',     apellido: 'Acho Tarqui',              modalidad: 'CAS' },
  { dni: '255520', nombre: 'Luis Angel',        apellido: 'Aguilar Cancho',           modalidad: 'CAS' },
  { dni: '255521', nombre: 'Yimi Maicol',       apellido: 'Aguilar Cancho',           modalidad: 'CAS' },
  { dni: 'PENDING-ALCALAPALOMO',  nombre: 'Yoandri Enniel',   apellido: 'Alcala Palomo',     modalidad: 'CAS' },
  { dni: '255523', nombre: 'Abraham Eduardo',   apellido: 'Amanqui Duran',            modalidad: 'CAS' },
  { dni: 'PENDING-AMAROMUNAYLLA', nombre: 'Jesus',            apellido: 'Amaro Munaylla',    modalidad: 'CAS' },
  { dni: '255501', nombre: 'Eduard Miguel',     apellido: 'Arevalo Llanos',           modalidad: 'CAS' },
  { dni: '255448', nombre: 'Roselma Esther',    apellido: 'Barahona Eguavil',         modalidad: 'CAS' },
  { dni: '255452', nombre: 'Arieff Rastenr',    apellido: 'Bravo Naupari',            modalidad: 'CAS' },
  { dni: 'PENDING-BUSTILLOSBERNARDO', nombre: 'Carlos',       apellido: 'Bustillos Bernardo', modalidad: 'CAS' },
  { dni: '255527', nombre: 'Jose',              apellido: 'Canayo Huayta',            modalidad: 'CAS' },
  { dni: 'PENDING-CARDENASMEZA',  nombre: 'Felix Esteban',    apellido: 'Cardenas Meza',     modalidad: 'CAS' },
  { dni: '255427', nombre: 'Derly William',     apellido: 'Carhuapoma Mallqui',       modalidad: 'CAS' },
  { dni: '255458', nombre: 'Russbel Salome',    apellido: 'Celis Celestino',          modalidad: 'CAS' },
  { dni: '255459', nombre: 'Orlando Amadeo',    apellido: 'Chavez Valenzuela',        modalidad: 'CAS' },
  { dni: '255486', nombre: 'Luz Giovana',       apellido: 'Chiquillan Huaman',        modalidad: 'CAS' },
  { dni: '255461', nombre: 'Alex Honorio',      apellido: 'Choque Pauro',             modalidad: 'CAS' },
  { dni: 'PENDING-CONTRERASOTINIANO', nombre: 'Miguel',       apellido: 'Contreras Otiniano', modalidad: 'CAS' },
  { dni: 'PENDING-DELROSARIOAVALOS', nombre: 'Pablo',         apellido: 'Del Rosario Avalos', modalidad: 'CAS' },
  { dni: '255462', nombre: 'Juan Jairo',        apellido: 'Dominguez Rojas',          modalidad: 'CAS' },
  { dni: 'PENDING-ESPINOORE',     nombre: 'Clever',           apellido: 'Espino Ore',        modalidad: 'CAS' },
  { dni: '255467', nombre: 'Javier Armando',    apellido: 'Fernandez Morales',        modalidad: 'CAS' },
  { dni: '255430', nombre: 'Yasmin',            apellido: 'Fernandez Ruiz',           modalidad: 'CAS' },
  { dni: 'PENDING-GALLARDOAYALA', nombre: 'Kevin',            apellido: 'Gallardo Ayala',    modalidad: 'CAS' },
  { dni: 'PENDING-GOMEZCHAVEZ',   nombre: 'Yeraldine',        apellido: 'Gomez Chavez',      modalidad: 'CAS' },
  { dni: '255505', nombre: 'Beatriz',           apellido: 'Gutierrez Aquise',         modalidad: 'CAS' },
  { dni: '255509', nombre: 'Alexander Raul',    apellido: 'Huallpa Salcedo',          modalidad: 'CAS' },
  { dni: '255473', nombre: 'Fredy',             apellido: 'Huaman Mandortupa',        modalidad: 'CAS' },
  { dni: '255492', nombre: 'Raul',              apellido: 'Huari Llanterhuay',        modalidad: 'CAS' },
  { dni: 'PENDING-LANASCASORIANO', nombre: 'Cirilo Esteban',  apellido: 'Lanasca Soriano',   modalidad: 'CAS' },
  { dni: 'PENDING-LOZANOLLANOS',  nombre: 'Rosario',          apellido: 'Lozano Llanos',     modalidad: 'CAS' },
  { dni: 'PENDING-MAMANIPAMPA',   nombre: 'Hector',           apellido: 'Mamani Pampa',      modalidad: 'CAS' },
  { dni: 'PENDING-MENDOZAEVARISTO', nombre: 'Christofer',     apellido: 'Mendoza Evaristo',  modalidad: 'CAS' },
  { dni: '255478', nombre: 'Maria Yolanda',     apellido: 'Mina Atalaya',             modalidad: 'CAS' },
  { dni: '255417', nombre: 'Wilfer',            apellido: 'Moran Barradas',           modalidad: 'CAS' },
  { dni: '255409', nombre: 'Najar Huamalias',   apellido: 'Moreno Morales',           modalidad: 'CAS' },
  { dni: '255410', nombre: 'Johan',             apellido: 'Munoz Saavedra',           modalidad: 'CAS' },
  { dni: '255434', nombre: 'Miguel Angel',      apellido: 'Nieves Nicolas',           modalidad: 'CAS' },
  { dni: '255435', nombre: 'Carlos Cesar',      apellido: 'Oblitas Benites',          modalidad: 'CAS' },
  { dni: '255476', nombre: 'Elia',              apellido: 'Ochavano Fernandez',       modalidad: 'CAS' },
  { dni: '255411', nombre: 'Jonathan Edwar',    apellido: 'Pasaca Callata',           modalidad: 'CAS' },
  { dni: '255418', nombre: 'Abundino',          apellido: 'Perez Teodoro',            modalidad: 'CAS' },
  { dni: 'PENDING-PUENTEDELAVEGA', nombre: 'Milagros',        apellido: 'Puente De La Vega Carbajal', modalidad: 'CAS' },
  { dni: 'PENDING-QUISPECHAMBI',  nombre: 'Angel Diego',      apellido: 'Quispe Chambi',     modalidad: 'CAS' },
  { dni: '255438', nombre: 'Clara',             apellido: 'Quispe Huari',             modalidad: 'CAS' },
  { dni: '255440', nombre: 'Lizbeth Tatiana',   apellido: 'Quispe Ysasi',             modalidad: 'CAS' },
  { dni: '255423', nombre: 'Nilton Joel',       apellido: 'Ramirez Loayza',           modalidad: 'CAS' },
  { dni: '255406', nombre: 'Norma Estela',      apellido: 'Raygada Del Aguila',       modalidad: 'CAS' },
  { dni: '255424', nombre: 'Vilma',             apellido: 'Rivera Higuera',           modalidad: 'CAS' },
  { dni: '255441', nombre: 'Evaristo Jesus',    apellido: 'Salas Queralez',           modalidad: 'CAS' },
  { dni: '255525', nombre: 'Nancy',             apellido: 'Segundo Reategui',         modalidad: 'CAS' },
  { dni: 'PENDING-SOTORUIZ',      nombre: 'Julio Humberto',   apellido: 'Soto Ruiz',         modalidad: 'CAS' },
  { dni: 'PENDING-SULLCAUNOCC',   nombre: 'Miki',             apellido: 'Sullca Unocc',      modalidad: 'CAS' },
  { dni: '255484', nombre: 'Jose Carlos',       apellido: 'Tacuri Quispe',            modalidad: 'CAS' },
  { dni: '255481', nombre: 'David Romulo',      apellido: 'Tello Chochocca',          modalidad: 'CAS' },
  { dni: 'PENDING-TIBURCIORAMIREZ', nombre: 'Rony',           apellido: 'Tiburcio Ramirez',  modalidad: 'CAS' },
  { dni: 'PENDING-TORRESADRIANO', nombre: 'Obed',             apellido: 'Torres Adriano',    modalidad: 'CAS' },
  { dni: '255442', nombre: 'Maria Del Carmen',  apellido: 'Torres Zavala',            modalidad: 'CAS' },
  { dni: 'PENDING-UCHARIMA',      nombre: 'Juan Carlos',      apellido: 'Ucharima Sulca',    modalidad: 'CAS' },
  { dni: 'PENDING-VALLADARES',    nombre: 'Rosalinda',        apellido: 'Valladares Hilario', modalidad: 'CAS' },

  // ── Locador / CAS adicional ──
  { dni: 'PENDING-ARICAOLAYA',    nombre: 'Cesar',            apellido: 'Arica Olaya',       modalidad: 'CAS' },
  { dni: 'PENDING-GONZALESMENDOZA', nombre: 'Ricardo',        apellido: 'Gonzales Mendoza',  modalidad: 'CAS' },
]

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Áreas ──────────────────────────────────────────────────────────────────
  const areas = await Promise.all([
    prisma.area.upsert({ where: { nombre: 'Barrido' },          update: {}, create: { nombre: 'Barrido' } }),
    prisma.area.upsert({ where: { nombre: 'Lavado de Calles' }, update: {}, create: { nombre: 'Lavado de Calles' } }),
    prisma.area.upsert({ where: { nombre: 'Recolección' },      update: {}, create: { nombre: 'Recolección' } }),
    prisma.area.upsert({ where: { nombre: 'Áreas Verdes' },     update: {}, create: { nombre: 'Áreas Verdes' } }),
  ])
  console.log(`✅ ${areas.length} áreas`)

  const areaRecoleccion = areas[2] // índice 2 = Recolección

  // ── Fiscales ───────────────────────────────────────────────────────────────
  const password = await bcrypt.hash('fiscal123', 10)

  const fiscales = await Promise.all([
    prisma.fiscal.upsert({ where: { usuario: 'fiscal.barrido' },     update: {}, create: { nombre: 'Fiscal Barrido',       usuario: 'fiscal.barrido',     password, areaId: areas[0].id } }),
    prisma.fiscal.upsert({ where: { usuario: 'fiscal.lavado' },      update: {}, create: { nombre: 'Fiscal Lavado',        usuario: 'fiscal.lavado',      password, areaId: areas[1].id } }),
    prisma.fiscal.upsert({ where: { usuario: 'fiscal.recoleccion' }, update: {}, create: { nombre: 'Fiscal Recolección',   usuario: 'fiscal.recoleccion', password, areaId: areas[2].id } }),
    prisma.fiscal.upsert({ where: { usuario: 'fiscal.verdes' },      update: {}, create: { nombre: 'Fiscal Áreas Verdes',  usuario: 'fiscal.verdes',      password, areaId: areas[3].id } }),
  ])
  console.log(`✅ ${fiscales.length} fiscales`)

  // ── Trabajadores de Recolección ────────────────────────────────────────────
  let creados = 0
  let actualizados = 0

  for (const t of TRABAJADORES_RECOLECCION) {
    const result = await prisma.trabajador.upsert({
      where:  { dni: t.dni },
      update: { nombre: t.nombre, apellido: t.apellido, areaId: areaRecoleccion.id, modalidad: t.modalidad },
      create: { nombre: t.nombre, apellido: t.apellido, dni: t.dni, areaId: areaRecoleccion.id, modalidad: t.modalidad },
    })
    // Si creadoEn == actualizadoEn (con margen de 1s), es nuevo
    const esNuevo = Math.abs(result.creadoEn - (result.actualizadoEn ?? result.creadoEn)) < 1000
    if (esNuevo) creados++; else actualizados++
  }

  console.log(`✅ Trabajadores Recolección: ${creados} creados, ${actualizados} actualizados`)
  console.log(`   Total en planilla: ${TRABAJADORES_RECOLECCION.length}`)

  const sinCodigo = TRABAJADORES_RECOLECCION.filter(t => t.dni.startsWith('PENDING-'))
  if (sinCodigo.length > 0) {
    console.log(`⚠️  ${sinCodigo.length} trabajadores sin código (PENDING):`)
    sinCodigo.forEach(t => console.log(`   - ${t.apellido}, ${t.nombre}`))
  }

  console.log('')
  console.log('👤 Credenciales de acceso:')
  console.log('   fiscal.barrido     / fiscal123')
  console.log('   fiscal.lavado      / fiscal123')
  console.log('   fiscal.recoleccion / fiscal123')
  console.log('   fiscal.verdes      / fiscal123')
  console.log('⚠️  Cambiá las contraseñas en producción!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
