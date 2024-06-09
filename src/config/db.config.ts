export default interface DbConfig {
  postgres: PostgresConfig;
}

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
