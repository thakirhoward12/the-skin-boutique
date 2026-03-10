import { Sparkles, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function QuizSection({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  const { profile, clearProfile } = useUser();

  return (
    <section className="py-24 bg-ink-900 text-white relative overflow-hidden transition-colors duration-1000">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay"></div>
      
      {/* Grainy Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
        }}
      ></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <Sparkles className="w-12 h-12 text-pastel-pink mx-auto mb-6 stroke-[1.5]" />
        
        {profile ? (
          <>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Welcome back.</h2>
            <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
              We've customized your experience for <span className="text-pastel-pink font-medium">{profile.skinType}</span> skin targeting <span className="text-pastel-pink font-medium">{profile.concern}</span>. Look for the "Perfect Match" badge on products below.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onOpenQuiz} 
                className="bg-white text-ink-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-pastel-pink transition-colors"
              >
                Update Profile
              </button>
              <button 
                onClick={clearProfile} 
                className="border border-white/30 text-white px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Clear Profile
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Not sure where to start?</h2>
            <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
              Take our 3-minute diagnostic to uncover your personalized skincare ritual, curated by our experts.
            </p>
            <button 
              onClick={onOpenQuiz} 
              className="bg-white text-ink-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-pastel-pink transition-colors inline-flex items-center"
            >
              Take The Skin Quiz <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
