const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function generateUser() {
    try {
        let users = require('./data/users.json');

        users = users.map(u => {
            switch (u.role) {
                case 'admin':
                    u.role = Role.ROLE_ADMIN;
                    break;
                case 'lecturer':
                    u.role = Role.ROLE_LECTURER;
                    u.lecturer_id = Math.floor(1000000000 + Math.random() * 9000000000).toString();
                    break;
                case 'student':
                    u.role = Role.ROLE_STUDENT;
                    u.student_id = Math.floor(1000000000 + Math.random() * 9000000000).toString();
                    break;
            }


            return {
                name: u.name,
                email: u.email,
                password: bcrypt.hashSync('password', 10),
                role: u.role,
                student_id: u.student_id,
                lecturer_id: u.lecturer_id
            };
        });

        await prisma.user.createMany({
            data: users
        });

        console.log("Data seeding completed successfully.");
    } catch (error) {
        console.error("Error seeding data:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

generateUser()
    .catch((e) => {
        console.error("generateUser function error:", e);
        process.exit(1);
    });
