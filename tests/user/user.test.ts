import { generateRandomLinkToken } from "../../src/helpers/authHelper";
import app from "../../src/index";
import request from 'supertest';

const z = generateRandomLinkToken()
let authToken: string;


describe('User Routes', () => {
    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                username: 'your_username',
                password: 'your_password',
            });

        authToken = response.body.token;
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/user/register')
            .send({
                password: "123456",
                email: `test_${z}@gmail.com`
            });
        expect(response.statusCode).toBe(200);
    })

    it('should login the user', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                password: "123456",
                email: `test_${z}@gmail.com`
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token')
    });

    it('send verification code', async () => {
        const response = await request(app)
            .post('/user/reset')
            .send({ email: 'valid@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            'if a user with this email exists they will receive an email.'
        );
    })
    it('mock user history', async () => {
        jest.mock('prisma', () => ({
            parkingHistory: {
                findMany: jest.fn().mockResolvedValue([
                    {
                        id: 1,
                        startTime: '2023-09-25 03:34:49',
                        vehicle: {
                            licensePlate: 'ab-123-cd',
                        },
                        parkingZone: {
                            address: 'random',
                        },
                    },
                ]),
            },
        }));

        const response = await request(app)
            .get('/user/history')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
    })
})