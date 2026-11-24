import Image from "next/image";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { PEOPLE, type Person } from "../data/people";
import BookCallForm from "./BookCallForm";

function Avatar({ person }: { person: Person }) {
  if (person.photo) {
    return (
      <Image
        src={person.photo}
        alt=""
        width={96}
        height={96}
        className="size-16 rounded-card object-cover sm:size-20"
      />
    );
  }
  // TODO(assets): initials stand in until real photos arrive (TODO.md, section 3).
  const initials = person.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      data-allow-clip
      className="relative flex size-16 items-center justify-center overflow-hidden rounded-card bg-jade-tint text-xl font-semibold text-jade sm:size-20"
    >
      <i
        aria-hidden="true"
        className="absolute -right-2 -top-3 block h-12 w-4 -rotate-[38deg] rounded-full bg-jade/10"
      />
      {initials}
    </span>
  );
}

/**
 * What no other app at this price has: a named person. Every account gets a relationship manager;
 * advice comes from SEBI-registered advisers. The call-back form starts the conversation.
 */
export default function MoneyPersonSection() {
  return (
    <section id="book-a-call" aria-labelledby="people-title" className="section scroll-mt-16 bg-mist">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="people-title" className="max-w-[16ch] text-heading text-ink">
              A real person looks after your plan
            </h2>
            <p className="max-w-[56ch] text-lead text-grey-600">
              Every Fydaa account comes with a relationship manager you can call or WhatsApp, in your
              language. For the bigger decisions, talk to a SEBI-registered adviser.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {PEOPLE.map((person) => (
              <li
                key={person.name}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-4xl bg-white p-4 ring-1 ring-line sm:flex sm:flex-col sm:gap-3 sm:p-5"
              >
                <span className="row-span-3 sm:row-span-1">
                  <Avatar person={person} />
                </span>
                <div>
                  <p className="text-title text-ink">{person.name}</p>
                  <p className="text-sm text-grey-600">{person.role}</p>
                </div>
                <p className="text-sm text-grey-500">{person.experience}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5" aria-label="Languages">
                  {person.languages.map((language) => (
                    <li
                      key={language}
                      className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-grey-600"
                    >
                      {language}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="text-sm text-grey-500">
            Advice by {siteConfig.entities.adviser.legalName}, SEBI RIA{" "}
            {siteConfig.entities.adviser.sebiRegistrationNumber}.
          </p>
        </div>

        <div className="rounded-4xl border border-line bg-white p-6 shadow-window sm:p-8 lg:sticky lg:top-28">
          <BookCallForm />
        </div>
      </Container>
    </section>
  );
}
