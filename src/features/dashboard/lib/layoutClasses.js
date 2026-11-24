/** Shared responsive shells — mobile → 4xl */

export const PAGE_SHELL =
  "px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 py-5 sm:py-8 max-w-[1200px] 4xl:max-w-[1600px] mx-auto w-full min-w-0 pb-[max(5rem,env(safe-area-inset-bottom))] lg:pb-8";

export const PAGE_SHELL_NARROW =
  "px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 py-5 sm:py-8 max-w-[1000px] 4xl:max-w-[1400px] mx-auto w-full min-w-0 pb-[max(5rem,env(safe-area-inset-bottom))] lg:pb-8";

export const FLOW_SHELL =
  "min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 py-5 sm:py-6 max-w-[1000px] 4xl:max-w-[1400px] mx-auto w-full min-w-0 pb-[max(5rem,env(safe-area-inset-bottom))] lg:pb-8";

export const WIZARD_INNER =
  "w-full max-w-[1000px] xl:max-w-[1100px] 4xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 min-w-0";

/** Centered stage cards (consent / mandate / debit / success) */
export const WIZARD_STAGE =
  "w-full max-w-lg sm:max-w-xl lg:max-w-2xl 4xl:max-w-3xl mx-auto min-w-0";

export const WIZARD_CARD =
  "w-full max-w-lg sm:max-w-xl lg:max-w-2xl 4xl:max-w-3xl mx-auto bg-white border border-border rounded-card p-5 sm:p-6 lg:p-8 4xl:p-10 shadow-card min-w-0";

export const WIZARD_TITLE =
  "text-[26px] sm:text-[32px] lg:text-[36px] 4xl:text-[40px] font-bold text-ink tracking-tight leading-tight";

export const WIZARD_SUB =
  "text-sm sm:text-[15px] 4xl:text-base text-muted";

export const WIZARD_CTA =
  "w-full h-12 4xl:h-[52px] rounded-btn bg-jade text-white text-[15px] 4xl:text-base font-semibold hover:bg-jade-hover disabled:opacity-60";

export const SHEET_PANEL =
  "relative w-full sm:max-w-lg lg:max-w-xl 4xl:max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-elevated px-4 sm:px-5 4xl:px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]";