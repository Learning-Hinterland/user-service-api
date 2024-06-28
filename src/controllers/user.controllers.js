const bcrypt = require('bcrypt');
const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient(
    {
        log: ['query'],
    }
);

async function getUsers(req, res, next) {
    try {
        const { email, name, role, search } = req.query;

        let filter = {};
        if (search) {
            filter.where = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            };
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

async function getUserById(req, res, next) {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'User not found',
                error: null,
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: 'OK',
            error: null,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const { name, email, role, password } = req.body;

        if (!name || !email || !role || !password) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields',
                error: null,
                data: null
            });
        }

        let userRole;
        switch (role) {
            case 'admin':
                userRole = Role.ROLE_ADMIN;
                break;
            case 'lecturer':
                userRole = Role.ROLE_LECTURER;
                break;
            case 'student':
                userRole = Role.ROLE_STUDENT;
                break;
            default:
                return res.status(400).json({
                    status: false,
                    message: 'Invalid role',
                    error: null,
                    data: null
                });
        }

        // check if user already exists
        const userExists = await prisma.user.findFirst({
            where: { email, role: userRole }
        });
        if (userExists) {
            return res.status(400).json({
                status: false,
                message: 'User already exists',
                error: null,
                data: null
            });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                role: userRole,
                password: await bcrypt.hash(password, 10)
            }
        });

        res.status(201).json({
            status: true,
            message: 'User created',
            error: null,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        if (!name || !email || !role || !password) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields',
                error: null,
                data: null
            });
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                role,
                password: await bcrypt.hash(password, 10)
            }
        });

        res.status(200).json({
            status: true,
            message: 'User updated',
            error: null,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getUsers, getUserById, createUser, updateUser };