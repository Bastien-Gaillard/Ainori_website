import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export default async function seed() {
  prisma.$connect();

  const userData: any = [];
  for (let i = 0; i < 10; i++) {
    userData.push({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role_id: faker.datatype.number({
        'min': 1,
        'max': 2
      })
    });
  }
  try {
    const result = await prisma.users.create({
      data: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role_id: faker.datatype.number({
          'min': 1,
          'max': 2
        }),
        status: true
      }
    });
    prisma.$disconnect();
  } catch (error) {
    console.error(error)
  }

}