import { Hero } from "./(content)/hero";
import { Categories } from "./(content)/hero";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Categories />
    </main>
  );
}
