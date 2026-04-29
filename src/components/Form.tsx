"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

type FormValues = {
  name: string;
  phone: string;
  location: string;
  course: string;
};

const locations = ["Hyderabad", "Vijayawada", "Guntur", "Vizag"] as const;

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxn2ewKFMZCVpT06M2K5aCP_tuI1HjzRwKSZEiP8fleOfRSD9Lmk6LxcFziRmQHKujq/exec";

export default function Form() {
  const [form, setForm] = useState<FormValues>({
    name: "",
    phone: "",
    location: "",
    course: "",
  });

  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false); // 🔥 new state

  const updateField = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.phone || !form.location || !form.course) {
      setStatus("❌ Please fill all fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setStatus("❌ Enter valid 10-digit phone number");
      return;
    }

    setStatus("Submitting...");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // important for Google script
        body: JSON.stringify(form),
      });

      // 🔥 show success screen
      setSubmitted(true);

      // reset form
      setForm({
        name: "",
        phone: "",
        location: "",
        course: "",
      });

    } catch (err) {
      console.error(err);
      setStatus("❌ Network error");
    }
  };

  // 🔥 SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">

        <Image
          src="/logoo.png"
          alt="Dhanik Bharat"
          width={100}
          height={100}
          className="mb-6"
        />

        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Thank You! 🎉
        </h2>

        <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
          Your application has been submitted successfully. <br />
          Our team will reach out to you shortly.
        </p>

        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full text-sm font-semibold"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-2">

      {/* LOGO */}
      <div className="mb-4">
        <Image
          src="/logoo.png"
          alt="Dhanik Bharat"
          width={90}
          height={90}
          className="mx-auto"
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-5 space-y-7"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">
            Apply Now
          </h2>
          <p className="text-xs text-slate-500">
            Quick admission form
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">

          {/* Name */}
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Student Name"
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
          />

          {/* Phone */}
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="Phone Number"
            required
            pattern="[0-9]{10}"
            maxLength={10}
            className="w-full rounded-lg border border-slate-200 px-4 py-5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
          />

          {/* Location + Course */}
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">

            <select
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              value={form.course}
              onChange={(e) => updateField("course", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            >
              <option value="">Select Course</option>
              <option value="MPC">MPC</option>
              <option value="BIPC">BIPC</option>
            </select>

          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 text-white py-3 text-sm font-semibold active:scale-[0.98] transition"
        >
          Submit Application
        </button>

        {/* Status */}
        {status && (
          <div
            className={`text-center text-sm rounded-lg py-2 border ${
              status.includes("❌")
                ? "text-red-600 bg-red-50 border-red-200"
                : "text-green-600 bg-green-50 border-green-200"
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
}