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
          <h1 className="mt-5 max-w-3xl font-headline text-5xl leading-[0.95] uppercase tracking-tight text-adinkra-cream sm:text-7xl">
            {title}
          </h1>
          <span className="mt-5 flex items-center gap-2" aria-hidden>
            <span className="size-2 rounded-full bg-adinkra-red" />
            <span className="size-2 rounded-full bg-adinkra-gold" />
            <span className="size-2 rounded-full bg-adinkra-gold" />
            <span className="size-2 rounded-full bg-adinkra-green" />
          </span>
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
