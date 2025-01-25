import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
  return (
    <Bounded as="main" className="pb-20 pt-10">
      <div className="grid gap-12">
        <Heading as="h1" size="xl" className="text-center">
          Get in Touch
        </Heading>

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg text-slate-300 mb-12">
            Feel free to reach out through email. If you don't hear back within a few days, 
            please feel free to contact me directly on my phone.
          </p>

          <div className="space-y-8 rounded-2xl bg-slate-800/40 p-8 backdrop-blur">
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700/50">
                  <FaEnvelope className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Primary Contact</p>
                  <a 
                    href="mailto:anarghabhatta369@gmail.com"
                    className="text-lg font-medium text-slate-200 hover:text-cyan-400 transition"
                  >
                    anarghabhatta369@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700/50">
                  <FaPhone className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Alternative Contact</p>
                  <p className="text-lg font-medium text-slate-200">+91 900-781-6552</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
}

