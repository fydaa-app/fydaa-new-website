import { Container } from "@/components/layout/container";
import { AMC_PARTNERS } from "../data/amcPartners";

/** The fund houses whose schemes you can invest in: a still logo wall, no marquee. */
export default function FundHouses() {
  return (
    <section aria-labelledby="fund-houses" className="border-y border-line bg-mist py-10 sm:py-12">
      <Container className="grid gap-6 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <h2 id="fund-houses" className="max-w-[22ch] text-base font-semibold text-ink [font-stretch:104%]">
          Funds from {AMC_PARTNERS.length} fund houses, all direct to the AMC
        </h2>
        <ul className="grid grid-cols-6 gap-1.5 sm:gap-2 lg:grid-cols-9" role="list">
          {AMC_PARTNERS.map((amc) => (
            <li
              key={amc.name}
              className="flex h-11 items-center justify-center rounded-btn bg-white px-1.5 ring-1 ring-line sm:h-14 sm:rounded-card sm:px-2"
              title={amc.name}
            >
              <img src={amc.src} alt={amc.name} className="max-h-6 w-auto max-w-full object-contain sm:max-h-8" loading="lazy" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
