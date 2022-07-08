import mysql from "mysql2";
import * as uuidBuffer from "uuid-buffer";

import { PrismaClient } from "../src/prisma/client";

const prisma = new PrismaClient();

// This uploadLocation is guaranteed to exist in the test data
const knownUploadLocationId = "6847ab2e-3234-4886-9c42-2aab72ec7d6a";

async function main() {
	console.log("Seeding IPFS Service Database");
	// We are running this as the root user. We want to create a lower-priviledge user,
	// that only has access to the IdentityDoc DB (or ReferralLink, or Notifications...).
	// To do that, we need to use the mysql driver directly
	const connectionString = process.env.IPFS_DATABASE_URL || "ERROR";
	console.log(connectionString);
	const connection = mysql.createConnection(connectionString);

	connection.connect();

	new Promise((resolve, reject) => {
		connection.query(
			"CREATE USER 'ipfs'@'%' IDENTIFIED WITH mysql_native_password BY 'ipfs-password';",
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
			"GRANT DELETE, INSERT, SELECT, UPDATE ON ipfs.* TO 'ipfs'@'%';",
			(err, res) => {
				if (err != null) {
					reject(err);
				}
				resolve(res);
			},
		);
	});
	console.log("Added user!");

	console.log("Seeding data");

	await prisma.uploadLocationEntity.create({
		data: {
			id: uuidBuffer.toBuffer(knownUploadLocationId),
			location_identifier: `Corporate-campaign`,
			google_bucket_name: `google_bucket_name`,
			deleted: false,
		},
	});
	console.log("Seeded data");
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
