const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient(
    {
        log: ['query'],
    }
);

module.exports = {
    getUser: async (req, res, next) => {
        try {
            const { id, email, name, role } = req.query;

            let filter = {};
            if (id) {
                filter.where = { id: Number(id) };
            }
            if (email) {
                filter.where = { ...filter.where, email };
            }
            if (name) {
                filter.where = { ...filter.where, name: { contains: name, mode: 'insensitive' } };
            }
            if (role) {
                switch (role) {
                    case 'admin':
                        filter.where = { ...filter.where, role: Role.ROLE_ADMIN };
                        break;
                    case 'lecturer':
                        filter.where = { ...filter.where, role: Role.ROLE_LECTURER };
                        break;
                    case 'student':
                        filter.where = { ...filter.where, role: Role.ROLE_STUDENT };
                        break;
                    default:
                        break;
                }
            }
            const users = await prisma.user.findMany(filter);

            res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }
};