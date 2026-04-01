import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
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

      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pastel-pink/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Sparkles className="w-12 h-12 text-pastel-pink mx-auto mb-6 stroke-[1.5]" />
        </motion.div>
        
        {profile ? (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-serif mb-6 text-white"
            >
              Welcome back.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto"
            >
              We've customized your experience for <span className="text-pastel-pink font-medium">{profile.skinType}</span> skin targeting <span className="text-pastel-pink font-medium">{profile.concern}</span>. Look for the "Perfect Match" badge on products below.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={onOpenQuiz} 
                className="btn-shop bg-white text-ink-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:text-white transition-all duration-300"
              >
                <span>Update Profile</span>
              </button>
              <button 
                onClick={clearProfile} 
                className="border border-white/30 text-white px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Clear Profile
              </button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-serif mb-6 text-white"
            >
              Not sure where to start?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto"
            >
              Take our 3-minute diagnostic to uncover your personalized skincare ritual, curated by our experts.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenQuiz} 
              className="btn-shop bg-white text-ink-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:text-white transition-all duration-300 inline-flex items-center"
            >
              <span className="flex items-center">Take The Skin Quiz <ArrowRight className="ml-2 w-4 h-4" /></span>
            </motion.button>
          </>
        )}
      </div>
    </section>
  );
}
