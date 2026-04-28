"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type FormValues = {
  name: string;
  phone: string;
  location: string;
  course: string;
};

const locations = ["Hyderabad", "Vijayawada", "Guntur", "Vizag"] as const;

export default function Form() {
  const [form, setForm] = useState<FormValues>({
    name: "",
    phone: "",
    location: "",
    course: "",
  });

  const [status, setStatus] = useState("");

  const updateField = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔴 Validation
    if (!form.name || !form.phone || !form.location || !form.course) {
      setStatus("❌ Please fill all fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setStatus("❌ Enter valid 10-digit phone number");
      return;
    }

    setStatus("Submitting...");

    // 🔗 Supabase Insert (FIXED VERSION)
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name: form.name,
          phone: form.phone,
          location: form.location,
          course: form.course,
        },
      ])
      .select(); // ✅ IMPORTANT FIX

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      setStatus("❌ Submission failed");
    } else {
      setStatus("✅ Submitted successfully 🚀");

      // Reset form
      setForm({
        name: "",
        phone: "",
        location: "",
        course: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">

      {/* LOGO */}
      <div className="mb-4">
        <Image
          src="/logo.png"
          alt="Dhanik Bharat"
          width={70}
          height={70}
          className="mx-auto"
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-5 space-y-5"
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
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
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
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
          />

          {/* Location + Course */}
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
            
            <select
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
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
          <div className="text-center text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg py-2">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}