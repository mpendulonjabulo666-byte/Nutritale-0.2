import { BookOpen, Search, ShoppingBasket } from "lucide-react";
import SlideTextButton from "@/components/kokonutui/slide-text-button";
import { RiseIn } from "@/components/rise-in";

const features = [
  { Icon: Search, title: "Search that knows local names", body: "Dhania, mealie meal, brinjal: we understand the words you use." },
  { Icon: BookOpen, title: "Recipes from your pantry", body: "See what you can cook now, and what is missing." },
  { Icon: ShoppingBasket, title: "One tap to your list", body: "Add missing ingredients to your shopping list." },
];

/** Public landing page placeholder (signed-out entry). Sign-in is not built yet. */
export default function Landing() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-[22px] py-20">
      <RiseIn index={0}>
        <p className="font-numeric text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">NutriTale</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-forest sm:text-5xl">
          Cook from what you already have.
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-7 text-charcoal">
          NutriTale matches recipes to your pantry, warns you what to use soon, and builds your shopping list.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {/* Kokonut UI slide-text-button, restyled with brand tokens: 52px tall (44px minimum), forest, 17px label. */}
          <SlideTextButton
            href="#features"
            text="See what it does"
            hoverText="Search · Cook · Shop"
            className="h-[52px] rounded-2xl bg-forest px-6 text-[17px] font-semibold tracking-normal text-white hover:bg-forest/90 focus-visible:outline-forest"
          />
          <span className="font-numeric text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">Coming soon</span>
        </div>
      </RiseIn>
      <ul id="features" className="grid scroll-mt-8 gap-4 sm:grid-cols-3">
        {features.map(({ Icon, title, body }, i) => (
          <li key={title}>
            <RiseIn index={i + 1}>
              <div className="h-full rounded-[20px] border border-mint bg-white p-[18px] shadow-[0_8px_22px_rgba(23,76,53,.10)]">
                <Icon aria-hidden className="h-6 w-6 text-sage-deep" />
                <h2 className="mt-3 text-[17px] font-semibold text-forest">{title}</h2>
                <p className="mt-1 text-[15px] leading-6 text-muted">{body}</p>
              </div>
            </RiseIn>
          </li>
        ))}
      </ul>
      <p className="text-[14px] text-muted">Built with AI tools. Nutrition values are marked &quot;Estimated&quot; until verified.</p>
    </main>
  );
}
