/** Recompute on each request so the reporting month rolls forward with the calendar. */
export const dynamic = 'force-dynamic';

type MonthEndRow = {
  monthEnd: string;
  carriedForward: string;
  received: string;
  resolved: string;
  pending: string;
};

const DEFAULT_MONTH_STATS = {
  carriedForward: '0',
  received: '0',
  resolved: '0',
  pending: '0',
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
  '2024-08-31': { received: '1', resolved: '1' },
};

function getReportingMonthEnd(reference = new Date()): Date {
  return new Date(reference.getFullYear(), reference.getMonth(), 0);
}

function formatMonthEndIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatReportingMonthLabel(d: Date): string {
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
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
    from: 'Grand Total',
    pendingLastMonth: '0',
    received: '0',
    resolved: '0',
    totalPending: '0',
    pendingOver3Mo: '0',
    avgResolutionDays: '0',
    isGrandTotal: true,
  },
  {
    sr: '1',
    from: 'Directly from Investors',
    pendingLastMonth: '0',
    received: '0',
    resolved: '0',
    totalPending: '0',
    pendingOver3Mo: '0',
    avgResolutionDays: '0',
  },
  {
    sr: '2',
    from: 'SEBI (SCORES)',
    pendingLastMonth: '0',
    received: '1',
    resolved: '1',
    totalPending: '0',
    pendingOver3Mo: '0',
    avgResolutionDays: '0',
  },
  {
    sr: '3',
    from: 'Smart ODR',
    pendingLastMonth: '0',
    received: '0',
    resolved: '0',
    totalPending: '0',
    pendingOver3Mo: '0',
    avgResolutionDays: '0',
  },
  {
    sr: '4',
    from: 'Other Sources (if any)',
    pendingLastMonth: '0',
    received: '0',
    resolved: '0',
    totalPending: '0',
    pendingOver3Mo: '0',
    avgResolutionDays: '0',
  },
];

const annualComplaintTrend: Array<{
  year: string;
  carriedForward: string;
  received: string;
  resolved: string;
  pending: string;
}> = [
  { year: '2020-21', carriedForward: '0', received: '0', resolved: '0', pending: '0' },
  { year: '2021-22', carriedForward: '0', received: '0', resolved: '0', pending: '0' },
  { year: '2022-23', carriedForward: '0', received: '0', resolved: '0', pending: '0' },
  { year: '2023-24', carriedForward: '0', received: '0', resolved: '0', pending: '0' },
  { year: '2024-25', carriedForward: '0', received: '1', resolved: '1', pending: '0' },
];

const auditDisclosures: Array<{ financialYear: string; status: string; remarks: string }> = [
  { financialYear: 'FY 2021-22', status: 'Conducted', remarks: '--' },
  { financialYear: 'FY 2022-23', status: 'Conducted', remarks: '--' },
  { financialYear: 'FY 2023-24', status: 'Conducted', remarks: '--' },
  { financialYear: 'FY 2024-25', status: 'Conducted', remarks: '--' },
];

const tableHeadClass =
  'border border-gray-300 bg-gray-100 px-3 py-3 text-left text-sm font-semibold text-gray-900';
const tableCellClass = 'border border-gray-300 px-3 py-3 text-sm text-gray-800';
const tableRowClass = 'bg-white even:bg-gray-50';

export default function Complaints() {
  const reference = new Date();
  const reportingMonthLabel = formatReportingMonthLabel(getReportingMonthEnd(reference));
  const monthlyComplaintTrend = buildMonthlyComplaintTrend(reference);

  return (
    <div className="min-h-screen w-full bg-white pb-8 pl-2 pr-2 pt-24 text-gray-900 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <h1 className="mb-3 text-center text-2xl font-semibold md:text-3xl">Complaint Data</h1>
        <p className="mb-8 text-center text-gray-600">
          Data for the month ending – {reportingMonthLabel}
        </p>

        <div className="mb-10 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className={tableHeadClass}>Sr. No.</th>
                <th className={tableHeadClass}>Received From</th>
                <th className={tableHeadClass}>Pending at the end of Last Month</th>
                <th className={tableHeadClass}>Received</th>
                <th className={tableHeadClass}>Resolved</th>
                <th className={tableHeadClass}>Total Pending</th>
                <th className={tableHeadClass}>Pending Complaints &gt; 3 Months</th>
                <th className={tableHeadClass}>Average Resolution Time (in Days)</th>
              </tr>
            </thead>
            <tbody>
              {complaintRows.map((row, i) => (
                <tr key={i} className={tableRowClass}>
                  <td className={tableCellClass}>{row.isGrandTotal ? '' : row.sr}</td>
                  <td className={tableCellClass}>{row.from}</td>
                  <td className={tableCellClass}>{row.pendingLastMonth}</td>
                  <td className={tableCellClass}>{row.received}</td>
                  <td className={tableCellClass}>{row.resolved}</td>
                  <td className={tableCellClass}>{row.totalPending}</td>
                  <td className={tableCellClass}>{row.pendingOver3Mo}</td>
                  <td className={tableCellClass}>{row.avgResolutionDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-2 mt-10 text-base font-semibold text-gray-900">
          Trend of monthly disposal of complaints
        </h2>
        <div className="mb-10 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className={tableHeadClass}>Sr. No</th>
                <th className={tableHeadClass}>Month</th>
                <th className={tableHeadClass}>Carried Forward from last Month</th>
                <th className={tableHeadClass}>Received</th>
                <th className={tableHeadClass}>Resolved</th>
                <th className={tableHeadClass}>Pending</th>
              </tr>
            </thead>
            <tbody>
              {monthlyComplaintTrend.map((row, i) => (
                <tr key={row.monthEnd} className={tableRowClass}>
                  <td className={tableCellClass}>{(i + 1).toString().padStart(2, '0')}</td>
                  <td className={tableCellClass}>{row.monthEnd}</td>
                  <td className={tableCellClass}>{row.carriedForward}</td>
                  <td className={tableCellClass}>{row.received}</td>
                  <td className={tableCellClass}>{row.resolved}</td>
                  <td className={tableCellClass}>{row.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-2 mt-10 text-base font-semibold text-gray-900">
          Trend of annual disposal of complaints
        </h2>
        <div className="mb-10 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                <th className={tableHeadClass}>Sr. No</th>
                <th className={tableHeadClass}>Year</th>
                <th className={tableHeadClass}>Carried forward form last Year</th>
                <th className={tableHeadClass}>Received</th>
                <th className={tableHeadClass}>Resolved</th>
                <th className={tableHeadClass}>Pending</th>
              </tr>
            </thead>
            <tbody>
              {annualComplaintTrend.map((row, i) => (
                <tr key={row.year} className={tableRowClass}>
                  <td className={tableCellClass}>{i + 1}</td>
                  <td className={tableCellClass}>{row.year}</td>
                  <td className={tableCellClass}>{row.carriedForward}</td>
                  <td className={tableCellClass}>{row.received}</td>
                  <td className={tableCellClass}>{row.resolved}</td>
                  <td className={tableCellClass}>{row.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-2 text-sm text-gray-600">RIA Audit Status Disclosure</p>
        <p className="mb-4 text-sm text-gray-600">
          &ldquo;Disclosure with respect to compliance with Annual compliance audit requirement under
          Regulation 19(3) of SECURITIES AND EXCHANGE BOARD OF INDIA (INVESTMENT ADVISERS)
          REGULATIONS, 2013:&rdquo;
        </p>

        <div className="mb-10 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={tableHeadClass}>Sr. No.</th>
                <th className={tableHeadClass}>Financial Year</th>
                <th className={tableHeadClass}>Compliance Audit Status</th>
                <th className={tableHeadClass}>Remarks, If any</th>
              </tr>
            </thead>
            <tbody>
              {auditDisclosures.map((row, i) => (
                <tr key={row.financialYear} className={tableRowClass}>
                  <td className={tableCellClass}>{i + 1}</td>
                  <td className={tableCellClass}>{row.financialYear}</td>
                  <td className={tableCellClass}>{row.status}</td>
                  <td className={tableCellClass}>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-gray-600">
          You can submit your grievance/complaints with us at{' '}
          <a href="mailto:support@fydaa.com" className="text-blue-700 underline hover:text-blue-900">
            support@fydaa.com
          </a>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          If the Complaint is not resolved within a period of 21 (Twenty-One) business days from the
          date of such issues being raised or if the client is not satisfied with the
          company&rsquo;s grievance redressal, the client may approach SEBI at{' '}
          <a
            href="https://scores.sebi.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-900"
          >
            www.scores.sebi.gov.in
          </a>{' '}
          or{' '}
          <a
            href="https://smartodr.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-900"
          >
            www.smartodr.in
          </a>
        </p>
      </div>
    </div>
  );
}
