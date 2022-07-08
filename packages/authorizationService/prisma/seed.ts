import mysql from "mysql2";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";

import { PrismaClient } from "../src/prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding Authorization Service Database");
	// We are running this as the root user. We want to create a lower-priviledge user,
	// that only has access to the Authorization DB.
	// To do that, we need to use the mysql driver directly
	const connectionString = process.env.AUTHORIZATION_DATABASE_URL || "ERROR";
	console.log(connectionString);
	const connection = mysql.createConnection(connectionString);

	connection.connect();

	new Promise((resolve, reject) => {
		connection.query(
			"CREATE USER 'authorization'@'%' IDENTIFIED WITH mysql_native_password BY 'authorization-password';",
			(err, res) => {
				if (err != null) {
					reject(err);
				}
				resolve(res);
			},
		);
	});

	await new Promise((resolve, reject) => {
		connection.query(
			"GRANT DELETE, INSERT, SELECT, UPDATE ON authorization.* TO 'authorization'@'%';",
			(err, res) => {
				if (err != null) {
					reject(err);
				}
				resolve(res);
			},
		);
	});
	console.log("Added user!");

	console.log("Seeded Authorization Data");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log("Complete!");
		process.exit(0);
	});
