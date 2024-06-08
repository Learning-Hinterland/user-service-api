const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    const users = await prisma.user.createMany({
        data: [
            {
                name: 'Admin Test',
                email: 'admin@mail.com',
                password: await bcrypt.hash('password', 10),
                role: Role.ROLE_ADMIN
            },
            {
                name: 'Lecturer Test',
                email: 'lecturer@mail.com',
                password: await bcrypt.hash('password', 10),
                role: Role.ROLE_LECTURER,
                lecturer_id: Math.floor(1000000000 + Math.random() * 9000000000).toString()
            },
            {
                name: 'User Test',
                email: 'student@mail.com',
                password: await bcrypt.hash('password', 10),
                role: Role.ROLE_STUDENT,
                student_id: Math.floor(1000000000 + Math.random() * 9000000000).toString()
            }
        ],
        skipDuplicates: true,
    });
    console.log(users);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });