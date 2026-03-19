import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding database...");

	// Create admin user
	const adminPassword = await bcrypt.hash("abtf@1234", 10);
	await prisma.user.upsert({
		where: { email: "abtf@uoeld.ac.ke" },
		update: {},
		create: {
			name: "ABTF Admin",
			email: "abtf@uoeld.ac.ke",
			password: adminPassword,
			role: "ADMIN",
			companyName: "University of Eldoret",
			phone: "+254700000000",
		},
	});
	console.log("Admin user created: abtf@uoeld.ac.ke");

	// Define booths per section
	const exhibitorSections = [
		{
			section: "machinery",
			prefix: "M",
			count: 8,
			prices: [15000, 18000, 20000, 25000],
		},
		{
			section: "crops",
			prefix: "C",
			count: 8,
			prices: [10000, 12000, 15000],
		},
		{
			section: "animals",
			prefix: "A",
			count: 7,
			prices: [12000, 14000, 16000],
		},
		{
			section: "food",
			prefix: "F",
			count: 7,
			prices: [8000, 10000, 12000],
		},
	];

	const sponsorBooths = [
		{ name: "SP-P-01", section: "platinum", sponsorLevel: "PLATINUM", price: 120000 },
		{ name: "SP-P-02", section: "platinum", sponsorLevel: "PLATINUM", price: 120000 },
		{ name: "SP-G-01", section: "gold", sponsorLevel: "GOLD", price: 90000 },
		{ name: "SP-G-02", section: "gold", sponsorLevel: "GOLD", price: 90000 },
		{ name: "SP-S-01", section: "silver", sponsorLevel: "SILVER", price: 70000 },
		{ name: "SP-S-02", section: "silver", sponsorLevel: "SILVER", price: 70000 },
		{ name: "SP-B-01", section: "bronze", sponsorLevel: "BRONZE", price: 50000 },
		{ name: "SP-B-02", section: "bronze", sponsorLevel: "BRONZE", price: 50000 },
	] as const;

	let totalBooths = 0;

	for (const s of exhibitorSections) {
		for (let i = 1; i <= s.count; i++) {
			const name = `${s.prefix}-${String(i).padStart(2, "0")}`;
			const price = s.prices[i % s.prices.length];
			await prisma.booth.upsert({
				where: { name },
				update: { section: s.section, price, audience: "EXHIBITOR", sponsorLevel: null },
				create: {
					name,
					section: s.section,
					audience: "EXHIBITOR",
					price,
					status: "AVAILABLE",
				},
			});
			totalBooths++;
		}
	}

	for (const booth of sponsorBooths) {
		await prisma.booth.upsert({
			where: { name: booth.name },
			update: {
				section: booth.section,
				price: booth.price,
				audience: "SPONSOR",
				sponsorLevel: booth.sponsorLevel,
			},
			create: {
				name: booth.name,
				section: booth.section,
				audience: "SPONSOR",
				sponsorLevel: booth.sponsorLevel,
				price: booth.price,
				status: "AVAILABLE",
			},
		});
		totalBooths++;
	}

	console.log(`${totalBooths} booths seeded across exhibitor and sponsor inventories`);
	console.log("Seeding complete!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
