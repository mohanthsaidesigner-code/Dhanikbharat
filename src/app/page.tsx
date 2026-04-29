"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxn2ewKFMZCVpT06M2K5aCP_tuI1HjzRwKSZEiP8fleOfRSD9Lmk6LxcFziRmQHKujq/exec";

const WHATSAPP_NUMBER = "9555825559"; // Replace with real number

type FormValues = {
  name: string;
  phone: string;
  location: string;
  course: string;
};

// ─── Sub-components ────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full">
      {children}
    </span>
  );
}

function TrustCard({ icon, stat, label }: { icon: string; stat: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-1"
    >
      <span className="text-2xl">{icon}</span>
      <p className="text-lg font-bold text-slate-900 leading-tight">{stat}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </motion.div>
  );
}

function CourseCard({
  title,
  subtitle,
  focus,
  color,
  onClick,
  selected,
}: {
  title: string;
  subtitle: string;
  focus: string;
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${
        selected
          ? `border-orange-500 bg-orange-50`
          : "border-slate-100 bg-white"
      } shadow-sm`}
    >
      <div className={`text-3xl mb-2`}>{color}</div>
      <p className="font-bold text-slate-900 text-base">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      <span className="mt-3 inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
        {focus}
      </span>
    </motion.button>
  );
}

function CampusCard({
  city,
  icon,
  onClick,
  selected,
}: {
  city: string;
  icon: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`w-full rounded-2xl p-4 border-2 transition-all flex items-center gap-3 ${
        selected ? "border-orange-500 bg-orange-50" : "border-slate-100 bg-white"
      } shadow-sm`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold text-slate-800 text-sm">{city}</span>
      {selected && (
        <span className="ml-auto text-xs text-orange-500 font-semibold">Selected ✓</span>
      )}
    </motion.button>
  );
}

// ─── Admission Form ─────────────────────────────────────────────────

function AdmissionForm({
  defaultCourse,
  defaultLocation,
  onClose,
}: {
  defaultCourse?: string;
  defaultLocation?: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormValues>({
    name: "",
    phone: "",
    location: defaultLocation || "",
    course: defaultCourse || "",
  });
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.course) {
      setStatus("error");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      setStatus("phone");
      return;
    }
    setStatus("loading");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setStatus("network");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
          🎉
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Application Received!</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
          Thank you! Our counselling team will call you within 24 hours.
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full text-sm font-semibold"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-1">
      <div className="text-center mb-1">
        <p className="font-bold text-slate-900 text-lg">Apply in 2 minutes</p>
        <p className="text-xs text-slate-400">Free counselling • No commitment</p>
      </div>

      <input
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="Student Name *"
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
      />

      <input
        type="tel"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
        placeholder="Phone Number *"
        maxLength={10}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
      />

      <select
        value={form.location}
        onChange={(e) => update("location", e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-700"
      >
        <option value="">Select Campus *</option>
        {["Hyderabad", "Vijayawada", "Guntur", "Vizag"].map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <select
        value={form.course}
        onChange={(e) => update("course", e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-700"
      >
        <option value="">Select Course *</option>
        <option value="MPC">MPC — IIT-JEE</option>
        <option value="BIPC">BIPC — NEET</option>
      </select>

      {status === "error" && (
        <p className="text-red-500 text-xs text-center">Please fill all fields.</p>
      )}
      {status === "phone" && (
        <p className="text-red-500 text-xs text-center">Enter a valid 10-digit phone number.</p>
      )}
      {status === "network" && (
        <p className="text-red-500 text-xs text-center">Network error. Please try again.</p>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm mt-1 active:opacity-90 disabled:opacity-60 transition"
      >
        {status === "loading" ? "Submitting..." : "Submit Application →"}
      </motion.button>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const openModal = (course?: string, location?: string) => {
    if (course) setSelectedCourse(course);
    if (location) setSelectedLocation(location);
    setModalOpen(true);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="relative bg-slate-50 min-h-screen max-w-md mx-auto font-sans pb-28">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 px-5 pt-10 pb-14 text-white overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
            <Image src="/logoo.png" alt="Dhanik Bharat" width={56} height={56} className="object-contain" />
          </div>

          <Badge>🔥 Admissions Open 2026</Badge>

          <motion.h1
            {...fadeUp}
            className="text-3xl font-extrabold leading-tight tracking-tight"
          >
            Empowering Students.<br />Building Futures.
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-sm leading-relaxed"
          >
            Limited Seats • Expert Faculty • Result-Oriented Coaching
          </motion.p>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => openModal()}
            className="mt-2 w-full bg-white text-orange-600 font-extrabold py-4 rounded-2xl text-base shadow-xl active:scale-[0.97] transition"
          >
            Apply Now — Free Counselling
          </motion.button>

          <p className="text-white/60 text-xs">⚡ Takes only 2 minutes • No fees</p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <TrustCard icon="👨‍🎓" stat="" label="Success without Stress" />
          <TrustCard icon="🏆" stat="" label="Expert Faculty" />
          <TrustCard icon="📈" stat="" label="Focused Learning" />
          <TrustCard icon="📍" stat="" label="Multi-City Campuses" />
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="px-4 mt-8">
        <motion.div {...fadeUp} className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Choose Your Stream</h2>
          <p className="text-xs text-slate-500 mt-0.5">Tap a card to pre-select your course</p>
        </motion.div>
        <div className="flex flex-col gap-3">
          <CourseCard
            title="MPC"
            subtitle="Mathematics • Physics • Chemistry"
            focus="IIT-JEE Focus"
            color="🔬"
            selected={selectedCourse === "MPC"}
            onClick={() => { setSelectedCourse("MPC"); openModal("MPC"); }}
          />
          <CourseCard
            title="BIPC"
            subtitle="Biology • Physics • Chemistry"
            focus="NEET Focus"
            color="🧬"
            selected={selectedCourse === "BIPC"}
            onClick={() => { setSelectedCourse("BIPC"); openModal("BIPC"); }}
          />
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="px-4 mt-8">
        <motion.div {...fadeUp}>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Why Dhanik Bharat?</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {[
              ["📚", "Structured Learning", "Curriculum designed for exam success"],
              ["📝", "Daily Tests", "Regular assessments to track progress"],
              ["🤝", "Personal Mentorship", "One-on-one student guidance"],
              ["📊", "Performance Tracking", "Detailed reports & parent updates"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex items-start gap-3 px-4 py-3.5">
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── URGENCY ── */}
      <section className="px-4 mt-8">
        <motion.div
          {...fadeUp}
          className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center"
        >
          <p className="text-2xl mb-2">⏳</p>
          <p className="font-bold text-red-700 text-base">Admissions Closing Soon</p>
          <p className="text-red-500 text-sm mt-1">⚠️ Limited Seats Available — Apply Today</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal()}
            className="mt-4 bg-red-500 text-white font-bold py-3 px-8 rounded-xl text-sm w-full"
          >
            Secure My Seat Now
          </motion.button>
        </motion.div>
      </section>

      {/* ── CAMPUSES ── */}
      <section className="px-4 mt-8">
        <motion.div {...fadeUp} className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Our Campuses</h2>
          <p className="text-xs text-slate-500 mt-0.5">Tap to auto-select your city</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Hyderabad", "🏙️"],
            ["Vijayawada", "🌉"],
            ["Guntur", "🌿"],
            ["Vizag", "🌊"],
          ].map(([city, icon]) => (
            <CampusCard
              key={city}
              city={city}
              icon={icon}
              selected={selectedLocation === city}
              onClick={() => { setSelectedLocation(city); openModal(undefined, city); }}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 mt-10 text-center">
        <p className="text-xs text-slate-400">
          © 2026 Dhanik Bharat Educational Institutions. All rights reserved.
        </p>
      </footer>

      {/* ── STICKY CTA ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-slate-50 to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => openModal()}
          className="w-full bg-orange-500 text-white font-extrabold py-4 rounded-2xl text-base shadow-2xl flex items-center justify-center gap-2"
        >
          <span>Apply Now</span>
          <span className="bg-white text-orange-500 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">→</span>
        </motion.button>
      </div>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20want%20to%20know%20more%20about%20admissions`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.41.638 4.67 1.748 6.625L2 30l7.588-1.727A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5c-2.17 0-4.21-.59-5.96-1.62l-.43-.26-4.49 1.02 1.05-4.37-.28-.45A11.48 11.48 0 0 1 4.5 16C4.5 9.648 9.648 4.5 16 4.5S27.5 9.648 27.5 16 22.352 27.5 16 27.5zm6.29-8.5c-.34-.17-2.02-1-2.34-1.11-.32-.11-.56-.17-.79.17s-.9 1.11-1.11 1.34c-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.22-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.79-1.91-1.09-2.62-.28-.68-.57-.59-.79-.6h-.67c-.23 0-.6.09-.91.43s-1.2 1.17-1.2 2.85c0 1.68 1.23 3.31 1.4 3.54.17.23 2.41 3.68 5.84 5.16.82.35 1.45.56 1.95.72.82.26 1.56.22 2.15.13.66-.1 2.02-.83 2.31-1.63.29-.8.29-1.49.2-1.63-.09-.14-.33-.23-.68-.4z" />
        </svg>
      </a>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center px-4 pb-0 sm:pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl leading-none"
              >
                ✕
              </button>
              <AdmissionForm
                defaultCourse={selectedCourse}
                defaultLocation={selectedLocation}
                onClose={() => setModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}