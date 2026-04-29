"use client";

import Image from "next/image";
import { useState } from "react";
import Form from "@/components/Form"; // your form component

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <Image
        src="/bg.png"
        alt="Dhanik Bharat"
        fill
        priority
        className="object-cover"
      />

      {/* APPLY BUTTON */}
      <div className="absolute bottom-[31%]  left-1/2 -translate-x-1/2 w-[85%] z-10">

        <button
          onClick={() => setOpen(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600  text-white py-5 rounded-md font-semibold shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition"
        >
          Apply Now
          <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center">
            →
          </span>
        </button>

      </div>

      {/* FORM MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md p-4 relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 text-lg"
            >
              ✕
            </button>

            {/* YOUR FORM */}
            <Form />

          </div>

        </div>
      )}

    </div>
  );
}
