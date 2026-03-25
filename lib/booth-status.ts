export type BoothStatus = "AVAILABLE" | "RESERVED" | "PAYMENT_SUBMITTED" | "CONFIRMED";

export interface BoothStatusTheme {
	label: string;
	badgeClass: string;
	dotClass: string;
	cardTintClass: string;
}

export const BOOTH_STATUS_THEME: Record<BoothStatus, BoothStatusTheme> = {
	AVAILABLE: {
		label: "Available",
		badgeClass: "bg-green-100 text-green-800",
		dotClass: "bg-green-500",
		cardTintClass: "bg-green-50/40 border-green-200",
	},
	RESERVED: {
		label: "Reserved",
		badgeClass: "bg-blue-100 text-blue-800",
		dotClass: "bg-blue-600",
		cardTintClass: "bg-blue-50/40 border-blue-200",
	},
	PAYMENT_SUBMITTED: {
		label: "Payment Submitted",
		badgeClass: "bg-amber-100 text-amber-800",
		dotClass: "bg-amber-500",
		cardTintClass: "bg-amber-50/40 border-amber-200",
	},
	CONFIRMED: {
		label: "Booked",
		badgeClass: "bg-red-100 text-red-800",
		dotClass: "bg-red-500",
		cardTintClass: "bg-red-50/40 border-red-200",
	},
};

export function getBoothStatusTheme(status: string): BoothStatusTheme {
	return BOOTH_STATUS_THEME[(status as BoothStatus) || "AVAILABLE"] || BOOTH_STATUS_THEME.AVAILABLE;
}
