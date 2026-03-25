"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    BarChart3Icon,
    CalendarClockIcon,
    ChevronRightIcon,
    DownloadIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    FileTypeIcon,
    FilterIcon,
    Loader2Icon,
    RefreshCwIcon,
} from "lucide-react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Line,
    LineChart,
    Legend,
} from "recharts";
import { exportFullReport, type ExportFormat } from "@/lib/admin-export";
import { ExportActions } from "@/components/admin/ExportActions";
import { formatFilterLabel } from "@/lib/admin-reporting";

type ReportResponse = {
    generatedAt: string;
    generatedBy: string;
    filters: Record<string, string>;
    summary: string;
    kpis: Record<string, number>;
    breakdowns: {
        sponsorsByLevel: Array<{ label: string; value: number }>;
        exhibitorsByCategory: Array<{ label: string; value: number }>;
        boothStatusDistribution: Array<{ label: string; value: number }>;
        invoiceStatusDistribution: Array<{ label: string; value: number }>;
        paymentStatusDistribution: Array<{ label: string; value: number }>;
        feedbackByCategory: Array<{ label: string; value: number }>;
    };
    trends: {
        registrationsOverTime: Array<{ date: string; value: number }>;
        attendeeRegistrationsOverTime: Array<{ date: string; value: number }>;
    };
    tables: {
        exhibitors: Array<Record<string, unknown>>;
        sponsors: Array<Record<string, unknown>>;
        booths: Array<Record<string, unknown>>;
        reservations: Array<Record<string, unknown>>;
        invoices: Array<Record<string, unknown>>;
        payments: Array<Record<string, unknown>>;
        attendees: Array<Record<string, unknown>>;
        feedback: Array<Record<string, unknown>>;
    };
    metadata: {
        totalRecordsIncluded: number;
    };
};

type SectionKey = keyof ReportResponse["tables"];

const pieColors = ["#0f766e", "#1d4ed8", "#ca8a04", "#b91c1c", "#6b7280", "#7c3aed", "#c2410c"];

const sectionOrder: SectionKey[] = [
    "exhibitors",
    "sponsors",
    "booths",
    "reservations",
    "invoices",
    "payments",
    "attendees",
    "feedback",
];

const sectionLabels: Record<SectionKey, string> = {
    exhibitors: "Exhibitors",
    sponsors: "Sponsors",
    booths: "Booths",
    reservations: "Reservations",
    invoices: "Invoices",
    payments: "Payments",
    attendees: "Attendees",
    feedback: "Feedback",
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const defaultNow = new Date();
const DEFAULT_FILTERS: Record<string, string> = {
    startDate: isoDate(new Date(defaultNow.getTime() - 29 * 24 * 60 * 60 * 1000)),
    endDate: isoDate(defaultNow),
    userRole: "ALL",
    sponsorLevel: "ALL",
    exhibitorCategory: "ALL",
    boothAudience: "ALL",
    boothStatus: "ALL",
    reservationStatus: "ALL",
    invoiceStatus: "ALL",
    paymentStatus: "ALL",
    feedbackStatus: "ALL",
    feedbackCategory: "ALL",
    attendeeStatus: "ALL",
    attendeeType: "ALL",
};

function inferColumns(rows: Array<Record<string, unknown>>) {
    if (!rows.length) return [] as string[];
    const sample = rows[0];
    return Object.keys(sample).slice(0, 8);
}

function renderValue(value: unknown): string {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return `${value.length} items`;
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (obj.name) return String(obj.name);
        if (obj.companyName) return String(obj.companyName);
        if (obj.invoiceNumber) return String(obj.invoiceNumber);
        return JSON.stringify(obj);
    }
    return String(value);
}

function statusOptionsFor(key: string) {
    if (key === "boothStatus") return ["ALL", "AVAILABLE", "RESERVED", "PAYMENT_SUBMITTED", "CONFIRMED"];
    if (key === "reservationStatus") return ["ALL", "PENDING", "CONFIRMED", "EXPIRED"];
    if (key === "invoiceStatus") return ["ALL", "UNPAID", "PENDING_VERIFICATION", "PAID", "REJECTED"];
    if (key === "paymentStatus") return ["ALL", "SUBMITTED", "VERIFIED", "REJECTED"];
    if (key === "feedbackStatus") return ["ALL", "NEW", "IN_REVIEW", "RESOLVED", "ARCHIVED"];
    if (key === "attendeeStatus") return ["ALL", "REGISTERED", "CONTACTED", "CONFIRMED", "ARCHIVED"];
    if (key === "boothAudience") return ["ALL", "EXHIBITOR", "SPONSOR"];
    if (key === "userRole") return ["ALL", "EXHIBITOR", "SPONSOR", "ADMIN"];
    if (key === "sponsorLevel") return ["ALL", "PLATINUM", "GOLD", "SILVER", "BRONZE"];
    if (key === "attendeeType") return ["ALL", "FARMER", "STUDENT", "RESEARCHER", "INVESTOR", "GOVERNMENT", "OTHER"];
    return ["ALL"];
}

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState<SectionKey>("exhibitors");
    const [drillFilter, setDrillFilter] = useState<{ section: SectionKey; key: string; value: string } | null>(null);

    const [filters, setFilters] = useState<Record<string, string>>(DEFAULT_FILTERS);

    const [report, setReport] = useState<ReportResponse | null>(null);

    const loadReport = useCallback(async (appliedFilters: Record<string, string>) => {
        setLoading(true);
        setError("");

        const params = new URLSearchParams(appliedFilters);
        const response = await fetch(`/api/admin/reports?${params.toString()}`);
        if (!response.ok) {
            setError("Failed to load reporting data");
            setLoading(false);
            return;
        }

        const data = (await response.json()) as ReportResponse;
        setReport(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadInitialReport = async () => {
            try {
                const params = new URLSearchParams(DEFAULT_FILTERS);
                const response = await fetch(`/api/admin/reports?${params.toString()}`);
                if (!response.ok) {
                    if (!cancelled) {
                        setError("Failed to load reporting data");
                        setLoading(false);
                    }
                    return;
                }

                const data = (await response.json()) as ReportResponse;
                if (!cancelled) {
                    setReport(data);
                    setLoading(false);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load reporting data");
                    setLoading(false);
                }
            }
        };

        loadInitialReport();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredSectionRows = useMemo(() => {
        if (!report) return [] as Array<Record<string, unknown>>;

        const baseRows = report.tables[activeSection] || [];
        if (!drillFilter || drillFilter.section !== activeSection) return baseRows;

        return baseRows.filter((row) => {
            const value = row[drillFilter.key];
            return String(value || "").toUpperCase() === drillFilter.value.toUpperCase();
        });
    }, [report, activeSection, drillFilter]);

    const sectionColumns = useMemo(() => inferColumns(filteredSectionRows), [filteredSectionRows]);

    const kpiCards = useMemo<Array<{ label: string; value: number; section: SectionKey; drill?: { key: string; value: string } }>>(() => {
        if (!report) return [];

        const kpis = report.kpis;
        return [
            { label: "Total Exhibitors", value: kpis.totalExhibitors, section: "exhibitors" },
            { label: "Total Sponsors", value: kpis.totalSponsors, section: "sponsors" },
            { label: "Total Attendees", value: kpis.totalAttendees, section: "attendees" },
            { label: "Total Feedback", value: kpis.totalFeedback, section: "feedback" },
            { label: "Total Booths", value: kpis.totalBooths, section: "booths" },
            { label: "Available Booths", value: kpis.availableBooths, section: "booths", drill: { key: "status", value: "AVAILABLE" } },
            { label: "Reserved Booths", value: kpis.reservedBooths, section: "booths", drill: { key: "status", value: "RESERVED" } },
            { label: "Payment Submitted Booths", value: kpis.paymentSubmittedBooths, section: "booths", drill: { key: "status", value: "PAYMENT_SUBMITTED" } },
            { label: "Booked Booths", value: kpis.confirmedBooths, section: "booths", drill: { key: "status", value: "CONFIRMED" } },
            { label: "Total Invoices", value: kpis.totalInvoices, section: "invoices" },
            { label: "Paid Invoices", value: kpis.paidInvoices, section: "invoices", drill: { key: "status", value: "PAID" } },
            { label: "Unpaid Invoices", value: kpis.unpaidInvoices, section: "invoices", drill: { key: "status", value: "UNPAID" } },
            { label: "Pending Verification", value: kpis.pendingVerificationInvoices, section: "invoices", drill: { key: "status", value: "PENDING_VERIFICATION" } },
            { label: "Rejected Invoices", value: kpis.rejectedInvoices, section: "invoices", drill: { key: "status", value: "REJECTED" } },
            { label: "Payment Submissions", value: kpis.totalPaymentSubmissions, section: "payments" },
            { label: "Verified Payments", value: kpis.verifiedPayments, section: "payments", drill: { key: "status", value: "VERIFIED" } },
            { label: "Rejected Payments", value: kpis.rejectedPayments, section: "payments", drill: { key: "status", value: "REJECTED" } },
        ];
    }, [report]);

    const exportWholeReport = async (format: ExportFormat) => {
        if (!report) return;

        const filterLabels = formatFilterLabel(report.filters);
        await exportFullReport(format, {
            title: "ABTF Administrative Report",
            generatedAt: new Date(report.generatedAt).toLocaleString(),
            generatedBy: report.generatedBy,
            filters: filterLabels,
            kpis: kpiCards.map((kpi) => ({ label: kpi.label, value: kpi.value })),
            summary: report.summary,
            chartSeries: [
                { title: "Sponsors by Level", rows: report.breakdowns.sponsorsByLevel },
                { title: "Exhibitors by Category", rows: report.breakdowns.exhibitorsByCategory },
                { title: "Booth Status Distribution", rows: report.breakdowns.boothStatusDistribution },
                { title: "Invoice Status Distribution", rows: report.breakdowns.invoiceStatusDistribution },
                { title: "Payment Status Distribution", rows: report.breakdowns.paymentStatusDistribution },
                { title: "Feedback by Category", rows: report.breakdowns.feedbackByCategory },
                {
                    title: "Registrations Over Time",
                    rows: report.trends.registrationsOverTime.map((point) => ({ label: point.date, value: point.value })),
                },
                {
                    title: "Attendee Registrations Over Time",
                    rows: report.trends.attendeeRegistrationsOverTime.map((point) => ({ label: point.date, value: point.value })),
                },
            ],
            sectionSummaries: sectionOrder.map((section) => ({
                title: sectionLabels[section],
                totalRows: report.tables[section].length,
            })),
        });
    };

    const filterGroups: Array<Array<{ key: string; label: string }>> = [
        [
            { key: "startDate", label: "Start Date" },
            { key: "endDate", label: "End Date" },
            { key: "userRole", label: "User Role" },
            { key: "sponsorLevel", label: "Sponsor Level" },
            { key: "exhibitorCategory", label: "Exhibitor Category" },
        ],
        [
            { key: "boothAudience", label: "Booth Audience" },
            { key: "boothStatus", label: "Booth Status" },
            { key: "reservationStatus", label: "Reservation Status" },
            { key: "invoiceStatus", label: "Invoice Status" },
            { key: "paymentStatus", label: "Payment Status" },
        ],
        [
            { key: "feedbackStatus", label: "Feedback Status" },
            { key: "feedbackCategory", label: "Feedback Category" },
            { key: "attendeeStatus", label: "Attendee Status" },
            { key: "attendeeType", label: "Attendee Type" },
        ],
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
            </div>
        );
    }

    if (!report) {
        return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error || "No report data available"}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-2">
                        <BarChart3Icon className="h-7 w-7 text-maroon" /> Admin Reporting Center
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Generated {new Date(report.generatedAt).toLocaleString()} • {report.metadata.totalRecordsIncluded} records included
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => loadReport(filters)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <RefreshCwIcon className="h-4 w-4" /> Refresh Data
                    </button>
                    {(["csv", "pdf", "docx"] as ExportFormat[]).map((format) => (
                        <button
                            key={format}
                            onClick={() => exportWholeReport(format)}
                            className="inline-flex items-center gap-1 rounded-md bg-maroon px-3 py-2 text-sm font-medium text-white hover:bg-gold"
                        >
                            {format === "csv" ? <FileSpreadsheetIcon className="h-4 w-4" /> : format === "pdf" ? <FileTextIcon className="h-4 w-4" /> : <FileTypeIcon className="h-4 w-4" />}
                            <DownloadIcon className="h-4 w-4" /> Export {format.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FilterIcon className="h-5 w-5 text-maroon" />
                    <h2 className="font-semibold text-deepBlue">Report Filters</h2>
                </div>
                <div className="space-y-3">
                    {filterGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {group.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                                    {(field.key === "startDate" || field.key === "endDate") ? (
                                        <input
                                            type="date"
                                            value={filters[field.key]}
                                            onChange={(e) => setFilters((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    ) : field.key === "feedbackCategory" || field.key === "exhibitorCategory" ? (
                                        <input
                                            type="text"
                                            placeholder="ALL"
                                            value={filters[field.key]}
                                            onChange={(e) => setFilters((prev) => ({ ...prev, [field.key]: e.target.value || "ALL" }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        />
                                    ) : (
                                        <select
                                            value={filters[field.key]}
                                            onChange={(e) => setFilters((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                                        >
                                            {statusOptionsFor(field.key).map((option) => (
                                                <option key={option} value={option}>{option.replace(/_/g, " ")}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <button
                        onClick={() => loadReport(filters)}
                        className="rounded-md bg-deepBlue px-4 py-2 text-sm font-semibold text-white hover:bg-maroon"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={() => {
                            setFilters(DEFAULT_FILTERS);
                        }}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Reset Filters
                    </button>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold text-deepBlue mb-3">KPI Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {kpiCards.map((card) => (
                        <button
                            key={card.label}
                            onClick={() => {
                                setActiveSection(card.section);
                                setDrillFilter(card.drill ? { section: card.section, key: card.drill.key, value: card.drill.value } : null);
                                document.getElementById("report-detailed-sections")?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-maroon/40 hover:shadow-sm"
                        >
                            <p className="text-xs font-medium text-gray-500">{card.label}</p>
                            <p className="mt-1 text-2xl font-bold text-deepBlue">{card.value}</p>
                            <p className="mt-2 inline-flex items-center text-xs font-medium text-maroon">
                                Open details <ChevronRightIcon className="ml-1 h-3.5 w-3.5" />
                            </p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
                <h2 className="text-lg font-semibold text-deepBlue mb-3">Executive Report Summary</h2>
                <p className="text-sm leading-7 text-gray-700 whitespace-pre-wrap">{report.summary}</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-deepBlue">Visual Analytics</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Registrations Over Time</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={report.trends.registrationsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#7f1d1d" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Attendee Registrations Over Time</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={report.trends.attendeeRegistrationsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sponsors by Level</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={report.breakdowns.sponsorsByLevel}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#1d4ed8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Exhibitors by Category</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={report.breakdowns.exhibitorsByCategory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" height={80} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#0f766e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Booth Status Distribution</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={report.breakdowns.boothStatusDistribution} dataKey="value" nameKey="label" outerRadius={90}>
                                    {report.breakdowns.boothStatusDistribution.map((entry, index) => (
                                        <Cell key={entry.label} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Invoices by Status</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={report.breakdowns.invoiceStatusDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#ca8a04" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Payments by Status</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={report.breakdowns.paymentStatusDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#b91c1c" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 h-[320px]">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Feedback by Category</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={report.breakdowns.feedbackByCategory} dataKey="value" nameKey="label" outerRadius={90}>
                                    {report.breakdowns.feedbackByCategory.map((entry, index) => (
                                        <Cell key={entry.label} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <section id="report-detailed-sections" className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-deepBlue">Detailed Reporting Sections</h2>
                        <p className="text-sm text-gray-500 mt-1">Switch sections to review detailed records and export current view.</p>
                    </div>
                    <div className="text-xs text-gray-500 inline-flex items-center gap-1">
                        <CalendarClockIcon className="h-3.5 w-3.5" />
                        Drill-down: {drillFilter ? `${sectionLabels[drillFilter.section]} / ${drillFilter.key}=${drillFilter.value}` : "none"}
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    {sectionOrder.map((section) => (
                        <button
                            key={section}
                            onClick={() => {
                                setActiveSection(section);
                                setDrillFilter(null);
                            }}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium ${activeSection === section ? "bg-maroon text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                            {sectionLabels[section]} ({report.tables[section].length})
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                    <div className="text-sm text-gray-600">
                        Active section: <span className="font-semibold text-deepBlue">{sectionLabels[activeSection]}</span> • Rows: {filteredSectionRows.length}
                    </div>
                    <ExportActions
                        title={`ABTF ${sectionLabels[activeSection]} Report`}
                        filenameBase={`abtf-${activeSection}`}
                        rows={filteredSectionRows}
                        metadata={{
                            "Rows Included": filteredSectionRows.length,
                            "Date Range": `${filters.startDate} to ${filters.endDate}`,
                        }}
                        columns={sectionColumns.map((column) => ({
                            header: column,
                            value: (row: Record<string, unknown>) => renderValue(row[column]),
                        }))}
                    />
                </div>

                {filteredSectionRows.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 py-12 text-center text-gray-500">No records available for this section and filter combination.</div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {sectionColumns.map((column) => (
                                        <th key={column} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{column}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSectionRows.slice(0, 200).map((row, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        {sectionColumns.map((column) => (
                                            <td key={`${index}-${column}`} className="px-3 py-2 text-gray-700 align-top">{renderValue(row[column])}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredSectionRows.length > 200 && (
                    <p className="mt-2 text-xs text-gray-500">Showing first 200 rows in-browser for performance. Exports include all filtered rows.</p>
                )}
            </section>
        </div>
    );
}
