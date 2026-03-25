export type SiteImageCategory = "hero" | "event" | "university" | "exhibitors" | "sponsors" | "contact" | "registration";

export interface SiteImageMeta {
	src: string;
	alt: string;
	category: SiteImageCategory[];
	recommended: string[];
	objectPosition?: string;
}

export const siteImages = {
	dsc4573: {
		src: "/img/_DSC4573.jpg",
		alt: "Cabbage demo plot with agronomy sponsor signage at the trade fair",
		category: ["event", "exhibitors", "sponsors"],
		recommended: ["exhibitors", "sponsors", "about-event"],
		objectPosition: "center",
	},
	dsc4621: {
		src: "/img/_DSC4621.jpg",
		alt: "Officials and visitors inspecting crops during a field demonstration",
		category: ["hero", "event", "exhibitors"],
		recommended: ["home", "about-event", "exhibitors"],
		objectPosition: "center",
	},
	dsc4907: {
		src: "/img/_DSC4907.JPG",
		alt: "Red combine harvester showcased at the event grounds",
		category: ["event", "exhibitors"],
		recommended: ["home", "about-event", "exhibitors"],
		objectPosition: "center",
	},
	dsc4992: {
		src: "/img/_DSC4992.JPG",
		alt: "Opening ceremony with dignitaries and attendees at the trade fair",
		category: ["hero", "event"],
		recommended: ["home", "about-event"],
		objectPosition: "center",
	},
	dsc5025: {
		src: "/img/_DSC5025.JPG",
		alt: "Innovation drone displayed near the University of Eldoret pavilion",
		category: ["hero", "event", "university", "sponsors", "contact"],
		recommended: ["home", "about-event", "about-university", "sponsors", "contact"],
		objectPosition: "center",
	},
	dsc5095: {
		src: "/img/_DSC5095.jpg",
		alt: "Partner and sponsor branded materials displayed at the event",
		category: ["sponsors"],
		recommended: ["sponsors"],
		objectPosition: "center",
	},
	dsc5127: {
		src: "/img/_DSC5127.jpg",
		alt: "Tractors and implements in a mechanization demonstration parade",
		category: ["event", "exhibitors"],
		recommended: ["home", "about-event", "exhibitors"],
		objectPosition: "center",
	},
	dsc5133: {
		src: "/img/_DSC5133.jpg",
		alt: "Green tractor moving through the event route with crowd and banners",
		category: ["hero", "event", "exhibitors", "sponsors"],
		recommended: ["home", "about-event", "exhibitors", "sponsors"],
		objectPosition: "center",
	},
	dsc5158: {
		src: "/img/_DSC5158.jpg",
		alt: "Livestock exhibitors presenting goats to visitors",
		category: ["event", "exhibitors"],
		recommended: ["home", "about-event", "exhibitors"],
		objectPosition: "center",
	},
	dsc5363: {
		src: "/img/_DSC5363.jpg",
		alt: "Officials touring vegetable plots at a field demonstration",
		category: ["event", "exhibitors"],
		recommended: ["about-event", "exhibitors"],
		objectPosition: "center",
	},
	dsc5510: {
		src: "/img/_DSC5510.jpg",
		alt: "Cultural performance group in traditional attire at the fair",
		category: ["event"],
		recommended: ["home", "about-event"],
		objectPosition: "center",
	},
	uoe001: {
		src: "/img/UOE_001.jpg",
		alt: "University of Eldoret graduation ceremony showcasing academic achievement",
		category: ["university"],
		recommended: ["about-university"],
		objectPosition: "center",
	},
	uoe002: {
		src: "/img/UOE_002.jpg",
		alt: "Students listening attentively during a university engagement session",
		category: ["university", "registration"],
		recommended: ["about-university", "register-exhibitor", "register-sponsor"],
		objectPosition: "center",
	},
	uoe003: {
		src: "/img/UOE_003.jpg",
		alt: "Student speaker addressing participants with a microphone",
		category: ["university", "contact", "registration"],
		recommended: ["about-university", "contact", "register-exhibitor", "register-sponsor"],
		objectPosition: "center",
	},
} satisfies Record<string, SiteImageMeta>;

export const homepageHeroSlides = [siteImages.dsc5133, siteImages.dsc5025, siteImages.dsc4621];

export const aboutEventGallery = [siteImages.dsc4621, siteImages.dsc4907, siteImages.dsc5127, siteImages.dsc5133, siteImages.dsc5158, siteImages.dsc5363, siteImages.dsc5510];
