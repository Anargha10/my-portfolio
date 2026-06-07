import Bounded from "@/components/Bounded";
import Chatbot from "@/components/Chatbot";
import Heading from "@/components/Heading";
import { FaPhone, FaEnvelope } from "react-icons/fa";

import { CONTACT_INFO } from "@/lib/chat/constants";

export const metadata = {
  title: "Contact | Get in Touch",
  description:
    "Contact Anargha Bhattacharjee via email, phone, or chat with the portfolio assistant.",
};

export default function ContactPage() {
  return (
    <Bounded as="main" className="pb-20 pt-10">
      <div className="grid gap-12">
        <Heading as="h1" size="xl" className="text-center">
          Get in Touch
        </Heading>

        <p className="mx-auto max-w-2xl text-center text-lg text-slate-300">
          Reach out by email or phone, or chat with the portfolio assistant below
          for quick answers about my work and experience.
        </p>

        <div className="mx-auto grid w-full min-w-0 max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
          <div className="min-w-0 space-y-8 rounded-2xl bg-slate-800/40 p-4 backdrop-blur sm:p-6 md:p-8">
            <h2 className="text-center text-lg font-semibold text-slate-100">
              Direct Contact
            </h2>

            <div className="space-y-8">
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700/50">
                  <FaEnvelope className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">Primary Contact</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="break-all text-base font-medium text-slate-200 transition hover:text-cyan-400 sm:break-normal sm:text-lg"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700/50">
                  <FaPhone className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">Alternative Contact</p>
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="text-lg font-medium text-slate-200 transition hover:text-cyan-400"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-400">
              If you don&apos;t hear back within a few days, feel free to call directly.
            </p>
          </div>

          <div className="min-w-0 w-full">
            <Chatbot />
          </div>
        </div>
      </div>
    </Bounded>
  );
}
