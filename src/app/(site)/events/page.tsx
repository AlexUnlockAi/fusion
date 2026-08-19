import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { EventForm } from "@/components/site/event-form";

export const metadata: Metadata = {
  title: "Event Inquiry",
  description:
    "Tell us about your event and Adinkra Fusion Kitchen will build a custom catering menu around it.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        kicker="Event Inquiry"
        title="Tell us about your event."
        description="Guest count, date, and vision — we'll follow up within 48 hours with a custom menu."
      />

      <section className="pb-24 sm:pb-32">
        <Container className="max-w-2xl">
          <Reveal>
            <EventForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
