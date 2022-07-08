import mysql from "mysql2";

import { PrismaClient } from "../ethereumChainBase/src/prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding rinkeby Service Database");
	// We are running this as the root user. We want to create a lower-priviledge user,
	// that only has access to the IdentityDoc DB (or ReferralLink, or Notifications...).
	// To do that, we need to use the mysql driver directly
	const connectionString = process.env.CHAIN_DATABASE_URL || "ERROR";
	console.log(connectionString);
	const connection = mysql.createConnection(connectionString);

	connection.connect();

	new Promise((resolve, reject) => {
		connection.query(
			"CREATE USER 'rinkeby'@'%' IDENTIFIED WITH mysql_native_password BY 'rinkeby-password';",
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
			"GRANT DELETE, INSERT, SELECT, UPDATE ON rinkeby.* TO 'rinkeby'@'%';",
			(err, res) => {
				if (err != null) {
					reject(err);
				}
				resolve(res);
			},
		);
	});
	// await query("FLUSH PRIVILEGES;");
	console.log("Added user!");
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
