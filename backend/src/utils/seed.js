import prisma from './db.js'
import { faker } from '@faker-js/faker'
import { logger } from './logger.js'

async function seed() {
  try {
    logger.info('🌱 Starting database seed...')

    // Clear existing data
    await prisma.task.deleteMany({})
    await prisma.userStory.deleteMany({})
    await prisma.project.deleteMany({})

    // Create projects
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'Mobile App Redesign',
          description: 'Redesign the mobile app for better UX',
        },
      }),
      prisma.project.create({
        data: {
          name: 'Backend API Enhancement',
          description: 'Improve API performance and add new endpoints',
        },
      }),
      prisma.project.create({
        data: {
          name: 'DevOps Infrastructure',
          description: 'Set up CI/CD pipeline and monitoring',
        },
      }),
    ])

    logger.info(`✅ Created ${projects.length} projects`)

    // Create user stories for each project
    for (const project of projects) {
      const stories = await Promise.all([
        prisma.userStory.create({
          data: {
            projectId: project.id,
            title: 'Design homepage mockups',
            description: 'Create initial designs for homepage',
            status: 'In Progress',
            priority: 'High',
          },
        }),
        prisma.userStory.create({
          data: {
            projectId: project.id,
            title: 'Implement user authentication',
            description: 'Add login/signup functionality',
            status: 'Todo',
            priority: 'High',
          },
        }),
        prisma.userStory.create({
          data: {
            projectId: project.id,
            title: 'Add search functionality',
            description: 'Implement global search',
            status: 'Done',
            priority: 'Medium',
          },
        }),
      ])

      logger.info(`✅ Created ${stories.length} user stories for project: ${project.name}`)

      // Create tasks for each story
      for (const story of stories) {
        const tasks = await Promise.all([
          prisma.task.create({
            data: {
              userStoryId: story.id,
              title: `Task 1 for: ${story.title}`,
              description: faker.lorem.sentence(),
              status: 'Todo',
              priority: 'High',
              assignedTo: 'John Doe',
              dueDate: faker.date.future(),
            },
          }),
          prisma.task.create({
            data: {
              userStoryId: story.id,
              title: `Task 2 for: ${story.title}`,
              description: faker.lorem.sentence(),
              status: 'In Progress',
              priority: 'Medium',
              assignedTo: 'Jane Smith',
              dueDate: faker.date.future(),
            },
          }),
          prisma.task.create({
            data: {
              userStoryId: story.id,
              title: `Task 3 for: ${story.title}`,
              description: faker.lorem.sentence(),
              status: 'Done',
              priority: 'Low',
              assignedTo: 'Bob Johnson',
              dueDate: faker.date.past(),
            },
          }),
        ])

        logger.info(`✅ Created ${tasks.length} tasks for story: ${story.title}`)
      }
    }

    logger.info('🎉 Database seed completed successfully!')
  } catch (error) {
    logger.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
