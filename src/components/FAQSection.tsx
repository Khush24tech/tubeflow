import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Tubeflow free to use?',
      a: 'Yes, Tubeflow is 100% free and unlimited. You do not need to register an account, subscribe, or install any browser extensions.'
    },
    {
      q: 'What audio and video formats are supported?',
      a: 'Tubeflow supports MP3 (up to 320 kbps High Fidelity), AAC / M4A (Apple Audio), FLAC Lossless Audio, and MP4 Video (from 360p mobile up to 1080p Full HD at 60fps).'
    },
    {
      q: 'How do I download music on iPhone or Android?',
      a: 'Simply search for the song, tap MP3 or MP4, and the file will download directly through Safari or Chrome to your Files or Downloads folder without requiring third-party apps.'
    },
    {
      q: 'Do I need an official YouTube Data API key?',
      a: 'No! Tubeflow is built with a self-contained scraping and proxy engine, meaning it runs autonomously with zero API key dependencies or quota limits.'
    },
    {
      q: 'Where are downloaded songs saved?',
      a: 'Files are saved automatically to your device’s default Downloads folder (e.g. ~/Downloads on Mac/Windows, or the Files app on iOS/Android).'
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="faq">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141a26] border border-[#242f44] text-xs font-semibold text-cyan-400 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          Got Questions?
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-[#141a26] border border-[#1e2638] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-slate-100 hover:text-cyan-300 transition-colors font-semibold text-sm sm:text-base cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-[#1e2638] pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
