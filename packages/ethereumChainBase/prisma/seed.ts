import mysql from "mysql2";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";

import { PrismaClient } from "../src/prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding Corporate Service Database");
	// We are running this as the root user. We want to create a lower-priviledge user,
	// that only has access to the Corporate DB.
	// To do that, we need to use the mysql driver directly
	const connectionString = process.env.CORPORATE_DATABASE_URL || "ERROR";
	console.log(connectionString);
	const connection = mysql.createConnection(connectionString);

	connection.connect();

	new Promise((resolve, reject) => {
		connection.query(
			"CREATE USER 'corporate'@'%' IDENTIFIED WITH mysql_native_password BY 'corporate-password';",
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
			"GRANT DELETE, INSERT, SELECT, UPDATE ON corporate.* TO 'corporate'@'%';",
			(err, res) => {
				if (err != null) {
					reject(err);
				}
				resolve(res);
			},
		);
	});
	console.log("Added user!");

	const categoryTagTypeId = uuidBuffer.toBuffer(v4());

	await prisma.tagTypeEntity.create({
		data: {
			id: categoryTagTypeId,
			name: `Corporate Category`,
			description: `Corporate Category Description`,
			deleted: false,
			timestamp: new Date(),
		},
	});

	//create third party link type entities
	const thirdPartyLinkTypes = [
		"Telegram",
		"Discord",
		"Twitter",
		"Documentation",
	];
	const insertedThirdPartyLinkTypeIds: Buffer[] = [];
	for await (const thirdPartyLinkType of thirdPartyLinkTypes) {
		const thirdPartyLinkTypeId = uuidBuffer.toBuffer(v4());
		await prisma.thirdPartyLinkTypeEntity.create({
			data: {
				id: thirdPartyLinkTypeId,
				name: `${thirdPartyLinkType}`,
				description: `${thirdPartyLinkType} Description`,
				deleted: false,
				created_timestamp: new Date(),
				updated_timestamp: new Date(),
			},
		});

		insertedThirdPartyLinkTypeIds.push(thirdPartyLinkTypeId);
	}

	// Now we can use prisma to create our initial entities.
	try {
		for await (const index of [...Array(70).keys()]) {
			const tag = await prisma.tagEntity.create({
				data: {
					id: uuidBuffer.toBuffer(v4()),
					type_id: categoryTagTypeId,
					name: `Category - ${index}`,
					description: `Category Description - ${index}`,
					deleted: false,
					timestamp: new Date(),
				},
			});
			const corporate = await prisma.corporateEntity.create({
				data: {
					id: uuidBuffer.toBuffer(v4()),
					name: `Corporate Name - ${index}`,
					logo_url: `https://s2.coinmarketcap.com/static/img/coins/64x64/${index}.png`,
					website_url: `https://hypernetlabs.io/#${index}`,
					description: `Corporate Description - ${index}`,
					featured: index <= 9,
					deleted: false,
					timestamp: new Date(),
				},
			});

			await prisma.campaignEntity.create({
				data: {
					id: uuidBuffer.toBuffer(v4()),
					summary: `Campaign Summary - ${index}`,
					name: `Campaign Name - ${index}`,
					description: `Campaign Description - ${index}`,
					published: false,
					published_date: null,
					end_date: null,
					corporate_id: corporate.id,
					created_timestamp: new Date(),
					updated_timestamp: new Date(),
					deleted: false,
				},
			});

			for await (const insertedThirdPartyLinkTypeId of insertedThirdPartyLinkTypeIds) {
				await prisma.corporateThirdPartyLinkEntity.create({
					data: {
						id: uuidBuffer.toBuffer(v4()),
						url: `Third Party Link - ${index}`,
						corporate_id: corporate.id,
						type_id: insertedThirdPartyLinkTypeId,
						created_timestamp: new Date(),
						updated_timestamp: new Date(),
						deleted: false,
					},
				});
			}

			if (index > 60) {
				return;
			}

			await prisma.corporateTagEntity.create({
				data: {
					tag_id: tag.id,
					corporate_id: corporate.id,
					timestamp: new Date(),
				},
			});

			if (index > 50) {
				const tag2 = await prisma.tagEntity.create({
					data: {
						id: uuidBuffer.toBuffer(v4()),
						type_id: categoryTagTypeId,
						name: `Category - ${index} - 2`,
						description: `Category Description - ${index} - 2`,
						deleted: false,
						timestamp: new Date(),
					},
				});
				await prisma.corporateTagEntity.create({
					data: {
						tag_id: tag2.id,
						corporate_id: corporate.id,
						timestamp: new Date(),
					},
				});

				//campaign 2
				await prisma.campaignEntity.create({
					data: {
						id: uuidBuffer.toBuffer(v4()),
						summary: `Campaign Summary - ${index} - 2`,
						name: `Campaign Name - ${index} - 2`,
						description: `Campaign Description - ${index} - 2`,
						published: false,
						published_date: null,
						end_date: null,
						corporate_id: corporate.id,
						created_timestamp: new Date(),
						updated_timestamp: new Date(),
						deleted: false,
					},
				});
			}
		}
		// Code running in a transaction...
	} catch (err) {
		// Handle the rollback...
	}

	// [...Array(70).keys()].forEach(async (index) => {

	// });

	console.log("Seeded Corporate Data");
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
