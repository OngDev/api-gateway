import dotEnvWithDefaults from 'dotenv-defaults';

dotEnvWithDefaults.config();

const { UAA_HOST, UAA_PORT } = process.env;
const UAA_AUTH_ROUTE = `http://${UAA_HOST}:${UAA_PORT}/api/auth`;

export const REGISTER_ROUTE = `${UAA_AUTH_ROUTE}/register`;

export const LOGIN_ROUTE = `${UAA_AUTH_ROUTE}/login`;
