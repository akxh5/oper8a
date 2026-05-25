import { motion } from "framer-motion";

const quotes = [
  { q: "Oper8a gave us something we couldn't get anywhere else — proof.", a: "Sarah K.", r: "Head of Compliance" },
  { q: "Sub-second confirmation on Solana is a game changer for our audit workflow.", a: "James T.", r: "CTO" },
  { q: "Finally a Web3 tool that doesn't feel like a Web3 tool.", a: "Priya M.", r: "Product Lead" },
];

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function Testimonials() {
  return (
    <section id="about" className="px-4 sm:px-8 lg:px-16 py-20 md:py-32 overflow-hidden w-full">
      <div className="mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          viewport={{ once: true }}
        >
          <div className="mb-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#555570]">
            WHAT TEAMS ARE SAYING
          </div>
          <h2 className="mb-12 md:mb-16 max-w-3xl font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white break-words">
            Built for teams who can't afford to be wrong.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.a}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EXPO_OUT }}
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ 
                y: -4, 
                borderColor: "rgba(0, 246, 255, 0.2)",
                transition: { duration: 0.2, ease: EXPO_OUT }
              }}
              className="glass flex flex-col justify-between p-5 sm:p-6 lg:p-8 w-full"
            >
              <blockquote className="font-display text-sm sm:text-base leading-snug text-white">
                "{q.q}"
              </blockquote>
              <figcaption className="mt-8">
                <div className="text-sm text-white font-medium">{q.a}</div>
                <div className="text-xs text-[#A0A0B8]">{q.r}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
