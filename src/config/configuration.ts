import { readFileSync } from 'fs';
import { join } from 'path';

import Joi from 'joi';
import * as yaml from 'js-yaml';

const env = process.env.NODE_ENV || 'development';

const YAML_CONFIG_FILENAME =
  env === 'production' ? './config.prod.yaml' : './config.dev.yaml';

export const validationSchema = Joi.object().keys({
  system: Joi.object().keys({
    host: Joi.string().default('localhost').description('System host'),
    port: Joi.number().default(3000).description('System port'),
    initAdmin: Joi.object().keys({
      username: Joi.string().optional().default('admin').description('Admin username'),
      password: Joi.string().optional().default('admin').description('Admin password'),
    }),
  }),
  db: Joi.object().keys({
    postgres: Joi.object().keys({
      host: Joi.string().default('localhost').description('Postgres host'),
      port: Joi.number().default(5432).description('Postgres port'),
      username: Joi.string().required().description('Postgres username'),
      password: Joi.string().required().description('Postgres password'),
      database: Joi.string().required().description('Postgres database name'),
    }),
    mysql: Joi.object().keys({
      host: Joi.string().default('localhost').description('Mysql host'),
      port: Joi.number().default(3306).description('Mysql port'),
      username: Joi.string().required().description('Mysql username'),
      password: Joi.string().required().description('Mysql password'),
      database: Joi.string().required().description('Mysql database name'),
    }),
  }),
  jwt: Joi.object().keys({
    secret: Joi.string().required().description('JWT secret key'),
    accessExpiresIn: Joi.alternatives()
      .try(Joi.number().integer().min(0).required(), Joi.string().required())
      .description(
        'access token lifetime (example: 60, "2 days", "10h", "7d")',
      ),
    refreshExpiresIn: Joi.alternatives()
      .try(Joi.number().integer().min(0).required(), Joi.string().required())
      .description(
        'access token lifetime (example: 60, "2 days", "10h", "7d")',
      ),
    resetPasswordExpiresIn: Joi.alternatives()
      .try(Joi.number().integer().min(0).required(), Joi.string().required())
      .description(
        'access token lifetime (example: 60, "2 days", "10h", "7d")',
      ),
    verifyEmailExpiresIn: Joi.alternatives()
      .try(Joi.number().integer().min(0).required(), Joi.string().required())
      .description(
        'access token lifetime (example: 60, "2 days", "10h", "7d")',
      ),
  }),
  logger: Joi.object().keys({
    level: Joi.string().default('info').description('Logger level'),
    format: Joi.string()
      .default('YYYY/MM/DD HH:mm:ss')
      .description('Logger format'),
    file: Joi.string().default('logs/combined.log').description('Log file'),
  }),
});

export default () => {
  const fullPath = join(__dirname, YAML_CONFIG_FILENAME);
  console.log(`You are using ${fullPath} config file.`);
  const config = yaml.load(readFileSync(fullPath, 'utf8')) as Record<
    string,
    any
  >;
  // Merge with process.env
  Object.keys(config).forEach((key) => {
    if (process.env[key]) {
      config[key] = process.env[key];
    }
  });
  console.log('merged config >>>', config);
  return config;
};
