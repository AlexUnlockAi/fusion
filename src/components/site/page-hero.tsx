import { Container } from "./container";
import { Kicker } from "./kicker";
import { Reveal } from "./reveal";

export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-adinkra-cream/10 pt-40 pb-20 sm:pb-24">
      <Container>
        <Reveal>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 max-w-2xl font-heading text-5xl font-medium leading-[1.05] sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-lg text-adinkra-cream-muted">
              {description}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
