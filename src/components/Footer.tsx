import React from 'react';
import { Music, Heart, Shield, Code, Sparkles, Globe, DownloadCloud } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080b11] border-t border-[#1e2638] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#141a26] border border-[#242f44] flex items-center justify-center">
                <Music className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                Tube<span className="text-cyan-400">flow</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, free and unlimited music discovery and media conversion engine. Save your favorite YouTube songs in pristine 320kbps MP3 audio or 1080p MP4 video.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#141a26] border border-[#242f44] text-[11px] text-cyan-400">
              <Sparkles className="w-3 h-3" />
              <span>No API Key Required</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Home & Search</a></li>
              <li><a href="#trending" className="hover:text-cyan-400 transition-colors">Trending Now</a></li>
              <li><a href="#charts" className="hover:text-cyan-400 transition-colors">Top Global Charts</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">Frequently Asked Questions</a></li>
              <li className="pt-2">
                <PWAInstallButton variant="hero" className="w-full text-center justify-center !py-2" />
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Formats */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display">Supported Formats</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>MP3 Audio (320kbps / 256kbps / 192kbps)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>M4A / AAC (Apple High Efficiency)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>FLAC Lossless Audio (Studio Master)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>MP4 Video (1080p 60fps / 720p / 480p)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Tech */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display">Technology & Legal</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Tubeflow is an independent media proxy and search engine tool. We do not host copyrighted media files on our servers. All media streams are delivered for personal offline backup purposes.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hover:text-white cursor-pointer">DMCA Notice</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1e2638] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Tubeflow. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              SEO Optimized
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              SSL Encrypted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
