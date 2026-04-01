import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gift, Heart, Sparkles, CalendarHeart, Star } from 'lucide-react';

export default function DiscountCalendar() {
  const [birthdayMonth, setBirthdayMonth] = useState<string>(() => localStorage.getItem('birthdayMonth') || '');
  const [birthdayDay, setBirthdayDay] = useState<string>(() => localStorage.getItem('birthdayDay') || '');

  useEffect(() => {
    localStorage.setItem('birthdayMonth', birthdayMonth);
  }, [birthdayMonth]);

  useEffect(() => {
    localStorage.setItem('birthdayDay', birthdayDay);
  }, [birthdayDay]);

  const currentMonth = new Date().getMonth() + 1; // 1-12
  const isBirthdayMonth = birthdayMonth ? parseInt(birthdayMonth) === currentMonth : false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Valentine's Day: Feb 14
  const valentinesStart = new Date(currentYear, 1, 7);
  const valentinesEnd = new Date(currentYear, 1, 14, 23, 59, 59);
  const isValentinesVisible = currentDate >= valentinesStart && currentDate <= valentinesEnd;
  const isValentinesActive = currentDate.getMonth() === 1 && currentDate.getDate() === 14;

  // Women's Day: March 8
  const womensDayStart = new Date(currentYear, 2, 1);
  const womensDayEnd = new Date(currentYear, 2, 8, 23, 59, 59);
  const isWomensDayVisible = currentDate >= womensDayStart && currentDate <= womensDayEnd;
  const isWomensDayActive = currentDate.getMonth() === 2 && currentDate.getDate() === 8;

  // Pride Month: June 1 - June 30
  const prideMonthStart = new Date(currentYear, 4, 25);
  const prideMonthEnd = new Date(currentYear, 5, 30, 23, 59, 59);
  const isPrideMonthVisible = currentDate >= prideMonthStart && currentDate <= prideMonthEnd;
  const isPrideMonthActive = currentDate.getMonth() === 5;

  // Christmas: Dec 25
  const christmasStart = new Date(currentYear, 11, 18);
  const christmasEnd = new Date(currentYear, 11, 25, 23, 59, 59);
  const isChristmasVisible = currentDate >= christmasStart && currentDate <= christmasEnd;
  const isChristmasActive = currentDate.getMonth() === 11 && currentDate.getDate() === 25;

  const events = [
    {
      title: "Valentine's Day",
      date: "February 14th",
      discount: "20% OFF",
      description: "Treat yourself or a loved one to something special this Valentine's Day.",
      icon: Heart,
      gradient: 'from-rose-50 to-pink-50',
      iconBg: 'bg-rose-100 text-rose-500',
      isActive: isValentinesActive,
      isVisible: isValentinesVisible
    },
    {
      title: "Women's Day",
      date: "March 8th",
      discount: "20% OFF",
      description: "Celebrate women's achievements with a special discount on all self-care essentials.",
      icon: Sparkles,
      gradient: 'from-violet-50 to-purple-50',
      iconBg: 'bg-violet-100 text-violet-500',
      isActive: isWomensDayActive,
      isVisible: isWomensDayVisible
    },
    {
      title: "Pride Month",
      date: "All of June",
      discount: "15% OFF",
      description: "Love is love. Celebrate Pride Month with us and enjoy a storewide discount all month long.",
      icon: Heart,
      gradient: 'from-amber-50 to-yellow-50',
      iconBg: 'bg-amber-100 text-amber-500',
      isActive: isPrideMonthActive,
      isVisible: isPrideMonthVisible
    },
    {
      title: "Christmas",
      date: "December 25th",
      discount: "25% OFF",
      description: "Get into the festive spirit with our biggest holiday sale of the year.",
      icon: Star,
      gradient: 'from-emerald-50 to-green-50',
      iconBg: 'bg-emerald-100 text-emerald-500',
      isActive: isChristmasActive,
      isVisible: isChristmasVisible
    },
    {
      title: "Your Birthday",
      date: birthdayMonth ? `${new Date(0, parseInt(birthdayMonth) - 1).toLocaleString('default', { month: 'long' })} ${birthdayDay ? birthdayDay : ''}` : "Your Special Month",
      discount: "UP TO 35% OFF",
      description: "Join our rewards program and treat yourself to our biggest discount of the year on your birthday.",
      icon: Gift,
      gradient: 'from-sky-50 to-blue-50',
      iconBg: 'bg-sky-100 text-sky-500',
      isActive: isBirthdayMonth,
      isVisible: true
    }
  ].filter(event => event.isVisible);

  return (
    <section className="py-32 bg-pastel-pink/20 border-t border-ink-100 transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-ink-50 flex items-center justify-center">
              <CalendarHeart className="h-5 w-5 text-ink-700 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[10px] font-medium text-ink-500 tracking-[0.2em] uppercase mb-4">
            Special Occasions
          </h2>
          <p className="text-4xl sm:text-5xl font-serif text-ink-900 font-light leading-tight mb-6">
            Our Discount Calendar
          </p>
          <p className="text-base text-ink-500 font-light max-w-xl mx-auto">
            Mark your calendars. We love celebrating special moments with you. Enjoy these exclusive discounts during our favorite times of the year.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative bg-white rounded-[2rem] p-10 text-center hover:-translate-y-2 transition-all duration-500 border ${event.isActive ? 'border-ink-900 shadow-xl' : 'border-ink-100 shadow-sm hover:shadow-xl hover:shadow-ink-100/40'} flex flex-col overflow-hidden`}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {event.isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[10px] font-medium tracking-widest uppercase px-5 py-1.5 rounded-b-xl shadow-md z-10">
                    Active Now
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-7 ${event.iconBg} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <p className="text-[10px] font-medium text-ink-500 uppercase tracking-[0.2em] mb-3">{event.date}</p>
                  <h3 className="text-2xl font-serif text-ink-900 mb-4">{event.title}</h3>
                  <div className="mb-6">
                    <div className={`inline-block text-xs tracking-widest uppercase font-medium px-5 py-2 rounded-full ${event.isActive ? 'bg-ink-900 text-white' : 'bg-pastel-pink text-ink-900'}`}>
                      {event.discount}
                    </div>
                  </div>
                  <p className="text-sm text-ink-500 font-light leading-relaxed mb-8 flex-grow">
                    {event.description}
                  </p>
                </div>
                
                {event.title === "Your Birthday" && (
                  <div className="relative z-10 mt-auto pt-8 border-t border-ink-100">
                    <p className="text-[10px] text-ink-500 mb-4 font-medium uppercase tracking-[0.2em]">Enter your birthday</p>
                    <div className="flex gap-3 justify-center">
                      <select 
                        value={birthdayMonth} 
                        onChange={(e) => setBirthdayMonth(e.target.value)}
                        className="text-sm border border-ink-200 rounded-full px-4 py-2 bg-white text-ink-900 focus:outline-none focus:border-ink-900 cursor-pointer hover:bg-ink-50 transition-colors appearance-none text-center"
                      >
                        <option value="">Month</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                        ))}
                      </select>
                      <select 
                        value={birthdayDay} 
                        onChange={(e) => setBirthdayDay(e.target.value)}
                        className="text-sm border border-ink-200 rounded-full px-4 py-2 bg-white text-ink-900 focus:outline-none focus:border-ink-900 cursor-pointer hover:bg-ink-50 transition-colors appearance-none text-center"
                      >
                        <option value="">Day</option>
                        {Array.from({length: 31}, (_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
