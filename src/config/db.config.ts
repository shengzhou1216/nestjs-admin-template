export default interface DbConfig {
  postgres: PostgresConfig;
  mysql: MysqlConfig;
}

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface MysqlConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
