export interface ExhibitionCategory {
	id: number;
	slug: string;
	name: string;
	description: string;
}

export const EXHIBITION_CATEGORIES: ExhibitionCategory[] = [
	{
		id: 1,
		slug: "agricultural-machinery",
		name: "Agricultural Machinery",
		description: "Tractors, harvesters, irrigation equipment, farm tools, mechanization systems, precision agriculture equipment, drones, and other agricultural technologies used in farm operations.",
	},
	{
		id: 2,
		slug: "crops-and-seeds",
		name: "Crops and Seeds",
		description: "Crop producers, seed companies, seed technologies, fertilizers, agro-inputs, plant protection solutions, horticulture, field crops, and crop demonstration activities.",
	},
	{
		id: 3,
		slug: "livestock-and-animal-production",
		name: "Livestock and Animal Production",
		description: "Dairy, beef, poultry, sheep, goats, pig farming, animal feeds, breeding, veterinary services, animal health products, and livestock production systems.",
	},
	{
		id: 4,
		slug: "food-and-agro-processing",
		name: "Food and Agro-Processing",
		description: "Food processing, value addition, packaging, storage, post-harvest handling, agro-processing technologies, agrifood manufacturing, and related production systems.",
	},
	{
		id: 5,
		slug: "agribusiness-finance-and-insurance",
		name: "Financial Institutions and Insurance",
		description: "Connects farmers to banks, SACCOs, and insurance providers. Shares information on affordable loans and financing options, access to crop and livestock insurance, and guidance on savings and investment opportunities to help farmers manage risks and grow their agribusiness.",
	},
	{
		id: 6,
		slug: "regulatory-research-and-learning-institutions",
		name: "Regulatory, Research and Learning Institutions",
		description: "Government agencies, regulators, universities, TVETs, research organizations, extension bodies, and institutions involved in policy, innovation, training, and agricultural knowledge development.",
	},
	{
		id: 7,
		slug: "cooperatives-msmes-ngos-and-cbos",
		name: "Cooperatives, MSMEs, NGOs and CBOs",
		description: "Farmer cooperatives, small and medium enterprises, community-based organizations, non-governmental organizations, producer groups, and grassroots development organizations supporting agricultural and rural development.",
	},
	{
		id: 8,
		slug: "environment-and-climate-smart-solutions",
		name: "Environment and Climate Change",
		description: "Focuses on adapting to changing weather conditions through climate-resilient farming practices, water conservation techniques, and soil management and sustainability practices. Promotes eco-friendly and productive farming methods.",
	},
];

export const EXHIBITION_CATEGORY_SLUGS = EXHIBITION_CATEGORIES.map((c) => c.slug);

export const EXHIBITION_CATEGORY_BY_SLUG = Object.fromEntries(EXHIBITION_CATEGORIES.map((c) => [c.slug, c])) as Record<string, ExhibitionCategory>;

export function isExhibitionCategorySlug(value: string): boolean {
	return EXHIBITION_CATEGORY_SLUGS.includes(value);
}

export function getExhibitionCategoryBySlug(slug: string | null | undefined): ExhibitionCategory | null {
	if (!slug) return null;
	return EXHIBITION_CATEGORY_BY_SLUG[slug] ?? null;
}

export function getExhibitionCategoryName(slug: string | null | undefined): string {
	if (!slug) return "Not set";
	return EXHIBITION_CATEGORY_BY_SLUG[slug]?.name ?? slug;
}

export function getExhibitionCategoryDescription(slug: string | null | undefined): string {
	if (!slug) return "";
	return EXHIBITION_CATEGORY_BY_SLUG[slug]?.description ?? "";
}

export const SPONSOR_SECTION_LABELS: Record<string, string> = {
	platinum: "Platinum Sponsor Booths",
	gold: "Gold Sponsor Booths",
	silver: "Silver Sponsor Booths",
	bronze: "Bronze Sponsor Booths",
};

export function getExhibitorSectionLabel(section: string): string {
	const category = getExhibitionCategoryBySlug(section);
	return category ? `${category.name} Booths` : section;
}

export function getBoothSectionDisplay(section: string, audience: "EXHIBITOR" | "SPONSOR"): string {
	if (audience === "SPONSOR") {
		return SPONSOR_SECTION_LABELS[section] ?? section;
	}
	return getExhibitionCategoryName(section);
}
