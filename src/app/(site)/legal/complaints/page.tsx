import { legalPageSeo } from "@/config/routes";
import { TableScroll } from "@/components/ui/table-scroll";
import { pageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "../_components/legal-document";

export const metadata = pageMetadata(legalPageSeo("/legal/complaints"));
/** Recompute on each request so the reporting month rolls forward with the calendar. */
export const dynamic = "force-dynamic";

type MonthEndRow = {
  monthEnd: string;
  carriedForward: string;
  received: string;
  resolved: string;
  pending: string;
};

const DEFAULT_MONTH_STATS = {
  carriedForward: "0",
  received: "0",
  resolved: "0",
  pending: "0",
} as const;

/** How many month-end rows to show (newest first). */
const MONTHLY_TREND_ROW_COUNT = 25;

/**
 * When a month closes, its figures usually need to be entered here (defaults are all "0").
 * Key = `YYYY-MM-DD` month-end date as shown in the Month column.
 */
const MONTHLY_STATS_OVERRIDES: Record<
  string,
  Partial<{
    carriedForward: string;
    received: string;
    resolved: string;
    pending: string;
  }>
> = {
  "2024-08-31": { received: "1", resolved: "1" },
};

function getReportingMonthEnd(reference = new Date()): Date {
  return new Date(reference.getFullYear(), reference.getMonth(), 0);
}

function formatMonthEndIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatReportingMonthLabel(d: Date): string {
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function buildMonthlyComplaintTrend(reference = new Date()): MonthEndRow[] {
  const anchor = getReportingMonthEnd(reference);
  const rows: MonthEndRow[] = [];
  let cursor = new Date(anchor);
  for (let i = 0; i < MONTHLY_TREND_ROW_COUNT; i++) {
    const monthEnd = formatMonthEndIso(cursor);
    const override = MONTHLY_STATS_OVERRIDES[monthEnd] ?? {};
    rows.push({
      monthEnd,
      carriedForward: override.carriedForward ?? DEFAULT_MONTH_STATS.carriedForward,
      received: override.received ?? DEFAULT_MONTH_STATS.received,
      resolved: override.resolved ?? DEFAULT_MONTH_STATS.resolved,
      pending: override.pending ?? DEFAULT_MONTH_STATS.pending,
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 0);
  }
  return rows;
}

const complaintRows: Array<{
  sr?: string;
  from: string;
  pendingLastMonth: string;
  received: string;
  resolved: string;
  totalPending: string;
  pendingOver3Mo: string;
  avgResolutionDays: string;
  isGrandTotal?: boolean;
}> = [
  {
    from: "Grand Total",
    pendingLastMonth: "0",
    received: "0",
    resolved: "0",
    totalPending: "0",
    pendingOver3Mo: "0",
    avgResolutionDays: "0",
    isGrandTotal: true,
  },
  {
    sr: "1",
    from: "Directly from Investors",
    pendingLastMonth: "0",
    received: "0",
    resolved: "0",
    totalPending: "0",
    pendingOver3Mo: "0",
    avgResolutionDays: "0",
  },
  {
    sr: "2",
    from: "SEBI (SCORES)",
    pendingLastMonth: "0",
    received: "1",
    resolved: "1",
    totalPending: "0",
    pendingOver3Mo: "0",
    avgResolutionDays: "0",
  },
  {
    sr: "3",
    from: "Smart ODR",
    pendingLastMonth: "0",
    received: "0",
    resolved: "0",
    totalPending: "0",
    pendingOver3Mo: "0",
    avgResolutionDays: "0",
  },
  {
    sr: "4",
    from: "Other Sources (if any)",
    pendingLastMonth: "0",
    received: "0",
    resolved: "0",
    totalPending: "0",
    pendingOver3Mo: "0",
    avgResolutionDays: "0",
  },
];

const annualComplaintTrend: Array<{
  year: string;
  carriedForward: string;
  received: string;
  resolved: string;
  pending: string;
}> = [
  { year: "2020-21", carriedForward: "0", received: "0", resolved: "0", pending: "0" },
  { year: "2021-22", carriedForward: "0", received: "0", resolved: "0", pending: "0" },
  { year: "2022-23", carriedForward: "0", received: "0", resolved: "0", pending: "0" },
  { year: "2023-24", carriedForward: "0", received: "0", resolved: "0", pending: "0" },
  { year: "2024-25", carriedForward: "0", received: "1", resolved: "1", pending: "0" },
];

const auditDisclosures: Array<{ financialYear: string; status: string; remarks: string }> = [
  { financialYear: "FY 2021-22", status: "Conducted", remarks: "--" },
  { financialYear: "FY 2022-23", status: "Conducted", remarks: "--" },
  { financialYear: "FY 2023-24", status: "Conducted", remarks: "--" },
  { financialYear: "FY 2024-25", status: "Conducted", remarks: "--" },
];

/* Table cells are styled once in legal.css (`.legal-prose table`). */

export default function Complaints() {
  const reference = new Date();
  const reportingMonthLabel = formatReportingMonthLabel(getReportingMonthEnd(reference));
  const monthlyComplaintTrend = buildMonthlyComplaintTrend(reference);

  return (
    <LegalDocument title="Complaint Data" subtitle={<>Data for the month ending – {reportingMonthLabel}</>}>
      <TableScroll label="Complaints for the reporting month">
        <table className="min-w-[45rem]">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Received From</th>
              <th>Pending at the end of Last Month</th>
              <th>Received</th>
              <th>Resolved</th>
              <th>Total Pending</th>
              <th>Pending Complaints &gt; 3 Months</th>
              <th>Average Resolution Time (in Days)</th>
            </tr>
          </thead>
          <tbody>
            {complaintRows.map((row, i) => (
              <tr key={i} className={row.isGrandTotal ? "font-semibold" : undefined}>
                <td>{row.isGrandTotal ? "" : row.sr}</td>
                <td>{row.from}</td>
                <td>{row.pendingLastMonth}</td>
                <td>{row.received}</td>
                <td>{row.resolved}</td>
                <td>{row.totalPending}</td>
                <td>{row.pendingOver3Mo}</td>
                <td>{row.avgResolutionDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>

      <h2>Trend of monthly disposal of complaints</h2>
      <TableScroll label="Trend of monthly disposal of complaints">
        <table className="min-w-[40rem]">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Month</th>
              <th>Carried Forward from last Month</th>
              <th>Received</th>
              <th>Resolved</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {monthlyComplaintTrend.map((row, i) => (
              <tr key={row.monthEnd}>
                <td>{(i + 1).toString().padStart(2, "0")}</td>
                <td>{row.monthEnd}</td>
                <td>{row.carriedForward}</td>
                <td>{row.received}</td>
                <td>{row.resolved}</td>
                <td>{row.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>

      <h2>Trend of annual disposal of complaints</h2>
      <TableScroll label="Trend of annual disposal of complaints">
        <table className="min-w-[35rem]">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Year</th>
              <th>Carried forward form last Year</th>
              <th>Received</th>
              <th>Resolved</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {annualComplaintTrend.map((row, i) => (
              <tr key={row.year}>
                <td>{i + 1}</td>
                <td>{row.year}</td>
                <td>{row.carriedForward}</td>
                <td>{row.received}</td>
                <td>{row.resolved}</td>
                <td>{row.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>

      <h2>RIA Audit Status Disclosure</h2>
      <p>
        &ldquo;Disclosure with respect to compliance with Annual compliance audit requirement under Regulation
        19(3) of SECURITIES AND EXCHANGE BOARD OF INDIA (INVESTMENT ADVISERS) REGULATIONS, 2013:&rdquo;
      </p>

      <TableScroll label="RIA annual compliance audit status">
        <table className="min-w-[32rem]">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Financial Year</th>
              <th>Compliance Audit Status</th>
              <th>Remarks, If any</th>
            </tr>
          </thead>
          <tbody>
            {auditDisclosures.map((row, i) => (
              <tr key={row.financialYear}>
                <td>{i + 1}</td>
                <td>{row.financialYear}</td>
                <td>{row.status}</td>
                <td>{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>

      <p>
        You can submit your grievance/complaints with us at{" "}
        <a href="mailto:support@fydaa.com">support@fydaa.com</a>
      </p>
      <p>
        If the Complaint is not resolved within a period of 21 (Twenty-One) business days from the date of
        such issues being raised or if the client is not satisfied with the company&rsquo;s grievance
        redressal, the client may approach SEBI at{" "}
        <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer">
          www.scores.sebi.gov.in
        </a>{" "}
        or{" "}
        <a href="https://smartodr.in/" target="_blank" rel="noopener noreferrer">
          www.smartodr.in
        </a>
      </p>
    </LegalDocument>
  );
}
