export interface ReportKpis {
	totalExhibitors: number;
	totalSponsors: number;
	totalAttendees: number;
	totalFeedback: number;
	totalBooths: number;
	availableBooths: number;
	reservedBooths: number;
	paymentSubmittedBooths: number;
	confirmedBooths: number;
	totalInvoices: number;
	paidInvoices: number;
	unpaidInvoices: number;
	pendingVerificationInvoices: number;
	rejectedInvoices: number;
	totalPaymentSubmissions: number;
	verifiedPayments: number;
	rejectedPayments: number;
	collectedRevenue: number;
	pendingRevenue: number;
	rejectedRevenueCandidates: number;
}

export interface ReportBreakdowns {
	sponsorsByLevel: Array<{ label: string; value: number }>;
	exhibitorsByCategory: Array<{ label: string; value: number }>;
	boothStatusDistribution: Array<{ label: string; value: number }>;
	invoiceStatusDistribution: Array<{ label: string; value: number }>;
	paymentStatusDistribution: Array<{ label: string; value: number }>;
	feedbackByCategory: Array<{ label: string; value: number }>;
}

export interface TimeSeriesPoint {
	date: string;
	value: number;
}

export interface ReportTrends {
	registrationsOverTime: TimeSeriesPoint[];
	attendeeRegistrationsOverTime: TimeSeriesPoint[];
}

export function createExecutiveSummary(input: { kpis: ReportKpis; breakdowns: ReportBreakdowns; trends: ReportTrends; dateRangeLabel: string }): string {
	const { kpis, breakdowns, trends, dateRangeLabel } = input;

	const topSponsorLevel = breakdowns.sponsorsByLevel.slice().sort((a, b) => b.value - a.value)[0];
	const topExhibitorCategory = breakdowns.exhibitorsByCategory.slice().sort((a, b) => b.value - a.value)[0];
	const topFeedbackCategory = breakdowns.feedbackByCategory.slice().sort((a, b) => b.value - a.value)[0];

	const occupancyRate = kpis.totalBooths > 0 ? ((kpis.confirmedBooths + kpis.reservedBooths + kpis.paymentSubmittedBooths) / kpis.totalBooths) * 100 : 0;

	const registrationTrend = calculateTrend(trends.registrationsOverTime);
	const attendeeTrend = calculateTrend(trends.attendeeRegistrationsOverTime);

	const lines = [`For ${dateRangeLabel}, ABTF recorded ${kpis.totalExhibitors} exhibitors and ${kpis.totalSponsors} sponsors, alongside ${kpis.totalAttendees} attendee registrations and ${kpis.totalFeedback} public feedback submissions.`, `Sponsor representation is led by ${topSponsorLevel ? `${topSponsorLevel.label} (${topSponsorLevel.value})` : "no recorded sponsor level"}, while exhibitor participation is highest in ${topExhibitorCategory ? `${topExhibitorCategory.label} (${topExhibitorCategory.value})` : "uncategorized sectors"}.`, `Booth utilization stands at ${occupancyRate.toFixed(1)}%, with ${kpis.confirmedBooths} booked booths, ${kpis.paymentSubmittedBooths} payment-submitted booths, and ${kpis.reservedBooths} reserved booths pending finalization.`, `Financially, invoice-based revenue tracking shows KES ${kpis.collectedRevenue.toLocaleString()} collected (paid invoices), KES ${kpis.pendingRevenue.toLocaleString()} pending verification or payment, and KES ${kpis.rejectedRevenueCandidates.toLocaleString()} currently in rejected invoice candidates.`, `Payment verification workload includes ${kpis.totalPaymentSubmissions} submissions, of which ${kpis.verifiedPayments} are verified and ${kpis.rejectedPayments} are rejected.`, `Registration movement across the selected period is ${registrationTrend}, and attendee registration movement is ${attendeeTrend}.`, `Feedback intake is concentrated in ${topFeedbackCategory ? `${topFeedbackCategory.label} (${topFeedbackCategory.value})` : "no dominant category"}, signaling the key operational communication area for follow-up.`];

	return lines.join(" ");
}

function calculateTrend(points: TimeSeriesPoint[]): string {
	if (points.length < 2) return "stable due to limited data";
	const half = Math.floor(points.length / 2);
	const firstHalf = points.slice(0, half).reduce((acc, point) => acc + point.value, 0);
	const secondHalf = points.slice(half).reduce((acc, point) => acc + point.value, 0);

	if (secondHalf > firstHalf) return "upward";
	if (secondHalf < firstHalf) return "downward";
	return "stable";
}

export function formatFilterLabel(filters: Record<string, string>): Record<string, string> {
	const entries = Object.entries(filters).filter(([, value]) => value && value !== "ALL");
	if (entries.length === 0) {
		return { Filters: "Default (no advanced filters)" };
	}

	return Object.fromEntries(entries.map(([key, value]) => [humanizeFilterKey(key), value]));
}

function humanizeFilterKey(key: string): string {
	return key
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (s) => s.toUpperCase())
		.trim();
}
