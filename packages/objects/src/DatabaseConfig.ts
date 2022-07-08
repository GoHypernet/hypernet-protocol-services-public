export class DatabaseConfig {
	constructor(
		public type: string,
		public username: string,
		public password: string,
		public host: string,
		public port: number,
		public schema: string,
	) {}

	public get connectionString(): string {
		return `${this.type}://${this.username}:${this.password}@${this.host}:${this.port}/${this.schema}`;
	}
}
