import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (inView) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: to,
        duration: 1.4,
        ease: "power3.out",
        onUpdate: () => setCount(Math.round(obj.val)),
      });
    }
  }, [inView, to]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="border-y border-[#1a1a3a] py-12 sm:py-16 md:py-20 overflow-hidden w-full px-4 sm:px-6">
      <div className="mx-auto flex flex-col md:flex-row max-w-6xl items-center justify-center gap-12 md:gap-0 md:divide-x divide-[#1a1a3a] w-full">
        <div className="flex-1 text-center w-full">
          <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            &lt;<CountUp to={400} suffix="ms" />
          </div>
          <div className="mt-3 text-[10px] sm:text-xs uppercase tracking-widest text-[#555570]">Confirmation</div>
        </div>
        <div className="flex-1 text-center w-full">
          <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            <CountUp to={100} suffix="%" />
          </div>
          <div className="mt-3 text-[10px] sm:text-xs uppercase tracking-widest text-[#555570]">Verifiable</div>
        </div>
        <div className="flex-1 text-center w-full">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
          >
            ∞
          </motion.div>
          <div className="mt-3 text-[10px] sm:text-xs uppercase tracking-widest text-[#555570]">Permanent</div>
        </div>
      </div>
    </section>
  );
}
