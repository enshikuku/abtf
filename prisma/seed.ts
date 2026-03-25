import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { EXHIBITION_CATEGORIES } from "../lib/exhibition-categories";

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

	// Define exhibitor booths across all 8 exhibition categories
	const exhibitorSectionMeta: Record<string, { prefix: string; count: number; prices: number[] }> = {
		"agricultural-machinery": { prefix: "AM", count: 4, prices: [18000, 20000, 22000, 25000] },
		"crops-and-seeds": { prefix: "CS", count: 4, prices: [12000, 14000, 16000, 18000] },
		"livestock-and-animal-production": { prefix: "LA", count: 4, prices: [13000, 15000, 17000, 19000] },
		"food-and-agro-processing": { prefix: "FP", count: 4, prices: [11000, 13000, 15000, 17000] },
		"agribusiness-finance-and-insurance": { prefix: "AF", count: 4, prices: [10000, 12000, 14000, 16000] },
		"regulatory-research-and-learning-institutions": { prefix: "RL", count: 4, prices: [9000, 11000, 13000, 15000] },
		"cooperatives-msmes-ngos-and-cbos": { prefix: "CN", count: 3, prices: [8000, 10000, 12000] },
		"environment-and-climate-smart-solutions": { prefix: "EC", count: 3, prices: [10000, 12000, 14000] },
	};

	const exhibitorSections = EXHIBITION_CATEGORIES.map((category) => ({
		section: category.slug,
		...exhibitorSectionMeta[category.slug],
	})).filter((section) => section.prefix && section.count > 0);

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
