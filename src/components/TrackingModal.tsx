import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Truck, MapPin, Home, CheckCircle2, Clock, Map } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRACKING_STEPS = [
  { id: 1, title: 'Order Placed', description: 'We have received your order', location: 'Online', icon: Package },
  { id: 2, title: 'Processing', description: 'Your order is being prepared', location: 'Fulfillment Center', icon: CheckCircle2 },
  { id: 3, title: 'Shipped', description: 'Your package is on the way', location: 'Los Angeles, CA', icon: Truck },
  { id: 4, title: 'Out for Delivery', description: 'Arriving soon', location: 'Local Distribution', icon: MapPin },
  { id: 5, title: 'Delivered', description: 'Package has been delivered', location: 'Front Porch', icon: Home },
];

export default function TrackingModal({ isOpen, onClose }: TrackingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderNumber] = useState(() => `#ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [stepTimes, setStepTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setStepTimes([]);
      return;
    }

    // Record time for the current step if it doesn't exist
    if (currentStep >= stepTimes.length) {
      setStepTimes(prev => [...prev, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })]);
    }

    // Simulate real-time tracking updates
    if (currentStep < TRACKING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3500); // Advance every 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, stepTimes.length]);

  const progressPercentage = currentStep / (TRACKING_STEPS.length - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-blue/20 shrink-0">
              <h2 className="text-xl font-serif font-semibold text-ink-900">Track Your Order</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-ink-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="mb-6 bg-ink-50 rounded-2xl p-4 border border-ink-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="text-lg font-mono font-semibold text-ink-900">{orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-1">Carrier</p>
                    <p className="text-sm font-semibold text-ink-900 flex items-center gap-1 justify-end">
                      <Map className="w-4 h-4 text-pastel-blue-dark" /> Express
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-ink-200">
                  <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 
                    {currentStep === TRACKING_STEPS.length - 1 ? 'Delivered Today' : 'Estimated Delivery: Today by 8:00 PM'}
                  </p>
                </div>
              </div>

              <div className="relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-ink-100 rounded-full" />
                
                {/* Animated Progress Line */}
                <motion.div 
                  className="absolute left-8 top-6 w-0.5 bg-pastel-blue-dark rounded-full origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: progressPercentage }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  style={{ bottom: '24px' }}
                />

                <div className="space-y-8 relative">
                  {TRACKING_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    
                    return (
                      <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-6 relative"
                      >
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-sm transition-colors duration-500 ${
                          isCompleted ? 'bg-pastel-blue-dark text-ink-900' : 
                          isActive ? 'bg-pastel-pink-dark text-white' : 
                          'bg-ink-100 text-ink-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                          {isActive && (
                            <motion.div 
                              className="absolute inset-0 rounded-full border-2 border-pastel-pink-dark"
                              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          )}
                        </div>
                        
                        <div className="pt-1.5 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-semibold transition-colors duration-500 ${isActive ? 'text-pastel-pink-dark' : isCompleted ? 'text-ink-900' : 'text-ink-400'}`}>
                              {step.title}
                            </h3>
                            {(isCompleted || isActive) && stepTimes[index] && (
                              <span className="text-xs font-medium text-ink-400">
                                {stepTimes[index]}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm transition-colors duration-500 ${isActive || isCompleted ? 'text-ink-600' : 'text-ink-400'}`}>
                            {step.description}
                          </p>
                          {(isCompleted || isActive) && (
                            <p className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {step.location}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-ink-100 bg-ink-50 shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-ink-900 text-white py-3 rounded-xl font-medium hover:bg-ink-800 transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
