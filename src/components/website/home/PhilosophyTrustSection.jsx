"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { Smile, Ticket, MapPinned, Users } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

const FALLBACK_IMAGE = "/placeholder.png";

const stats = [
  { icon: Smile, value: 2, suffix: "K+", label: "Happy Customers" },
  { icon: Ticket, value: 1500, suffix: "+", label: "Packages Sold" },
  { icon: MapPinned, value: 20, suffix: "+", label: "Destinations" },
  { icon: Users, value: 365, suffix: "+", label: "24X7 Support" },
];

function formatStat(value) {
  return Math.round(value).toLocaleString("en-US");
}

function AnimatedStatNumber({ value, suffix }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${formatStat(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, suffix]);

  return (
    <span ref={ref} className="tabular-nums font-sans">
      0{suffix}
    </span>
  );
}

export function PhilosophyTrustSection() {
  const [trustImage, setTrustImage] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/api/philosophyBanner");
        const result = await res.json();
        const url = result?.data?.philosophyTrustImage?.url;
        if (result?.success && url) {
          setTrustImage(url);
        }
      } catch {
        /* keep fallback */
      }
    };

    fetchImage();
  }, []);

  return (
    <Section spacing="xs" className="bg-background">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="max-w-xl font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
            Crafted For Comfort, Designed For You
          </h2>
          <p className="max-w-md font-body text-md leading-[1.8] text-muted-foreground lg:text-right">
            Your escape to timeless luxury.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-5">
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div
                key={label}
                className="flex flex-col rounded-card bg-surface p-4 md:p-5"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <Icon
                    className="size-3.5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <p className="mt-4 font-heading text-2xl font-semibold tracking-tight text-heading md:text-3xl">
                  <AnimatedStatNumber value={value} suffix={suffix} />
                </p>
                <p className="mt-1.5 font-body text-sm text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 items-center gap-4 rounded-card bg-surface p-4 md:grid-cols-2 md:gap-4 md:p-4">
            <div className="relative flex flex-col justify-between gap-4 p-1 ">
              <div>
                <h3 className="font-heading text-xl leading-snug text-heading md:text-2xl">
                  Where sacred tradition meets modern warmth.{" "}
                </h3>
                <p className="mt-3 font-body text-justify text-sm leading-[1.7] text-black">
                  Nestled in the heart of the city, we welcome you with genuine
                  hospitality just moments away from its most fascinating
                  landmarks. Discover ancient temples, sacred ghats, serene
                  riverside walks, and vibrant local markets, or spark your
                  spirit of adventure with nearby outdoor excursions.
                  <br />
                  Wander through historic lanes, immerse yourself in timeless
                  culture, and let us make your journey unforgettable.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex h-10 items-center rounded-button bg-primary px-6 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Learn More
                </Link>
              <div
                className="pointer-events-none flex justify-end"
                aria-hidden="true"
              >
                <div className="relative flex size-16 items-center justify-center rounded-full border border-primary text-primary md:size-20">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]"
                  >
                    <defs>
                      <path
                        id="trust-seal-path"
                        d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                      />
                    </defs>
                    <text className="fill-primary font-ui text-[9px] uppercase tracking-[0.28em]">
                      <textPath href="#trust-seal-path" startOffset="0%">
                        Nature · Stay · Explore · Journey · Welcome ·
                      </textPath>
                    </text>
                  </svg>
                  <span className="font-heading text-base italic md:text-lg">OH</span>
                </div>
              </div>
              </div>

            </div>

            <div className="relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-image md:max-w-none">
              <Image
                src={trustImage}
                alt="Guests enjoying a warm hotel stay"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 28vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
