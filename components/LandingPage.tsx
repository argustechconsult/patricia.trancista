import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Instagram,
  MessageCircle,
  CheckCircle,
  Clock,
  Check,
  Menu,
  X as CloseIcon,
  Scissors,
  Star,
  Heart,
} from 'lucide-react';
import { Appointment, GlobalSettings } from '../types';
import { generateConfirmationMessage } from '../services/geminiService';
import { useAppContext } from '@/context/AppContext';

const LandingPage: React.FC = () => {
  const { appointments, registerNewBooking, settings } = useAppContext();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [finalAppointment, setFinalAppointment] = useState<Appointment | null>(
    null,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getBrazilDateTime = () => {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
  };

  const todayStr = useMemo(() => {
    const brDate = getBrazilDateTime();
    const year = brDate.getFullYear();
    const month = String(brDate.getMonth() + 1).padStart(2, '0');
    const day = String(brDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    // Agendamentos de tranças costumam ser longos, então os slots são mais espaçados
    const slotsHours = ['08:00', '13:00', '14:00'];
    return slotsHours;
  }, []);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const brNow = getBrazilDateTime();
    const currentHour = brNow.getHours();
    const currentMinute = brNow.getMinutes();

    return timeSlots.filter((time) => {
      if (selectedDate === todayStr) {
        const [hour, minute] = time.split(':').map(Number);
        if (
          hour < currentHour ||
          (hour === currentHour && minute <= currentMinute)
        ) {
          return false;
        }
      }
      const isOccupied = appointments.some(
        (app) =>
          app.date === selectedDate &&
          app.time === time &&
          app.status !== 'cancelled',
      );
      return !isOccupied;
    });
  }, [selectedDate, todayStr, timeSlots, appointments]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const elementId = targetId.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const app = registerNewBooking(clientInfo, {
        date: selectedDate,
        time: selectedTime,
      });
      const message = await generateConfirmationMessage(
        clientInfo.name,
        new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR'),
        selectedTime,
        '',
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFinalAppointment(app);
      setBookingStep(3);
    } catch (error) {
      console.error('Erro ao agendar:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingStep(1);
    setIsProcessing(false);
    setSelectedDate('');
    setSelectedTime('');
    setClientInfo({ name: '', email: '', phone: '' });
    setFinalAppointment(null);
  };

  return (
    <div className="min-h-screen scroll-smooth overflow-x-hidden font-sans">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex flex-col cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-2xl font-bold text-amber-900 leading-tight group-hover:text-amber-600 transition-colors">
              Patrícia
            </span>
            <span className="text-[10px] text-amber-600 font-bold tracking-widest uppercase">
              Arte & Tranças Afro
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="text-slate-600 hover:text-amber-600 font-semibold"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, '#sobre')}
              className="text-slate-600 hover:text-amber-600 font-semibold"
            >
              Sobre
            </a>
            <a
              href="#especialidades"
              onClick={(e) => handleNavClick(e, '#especialidades')}
              className="text-slate-600 hover:text-amber-600 font-semibold"
            >
              Serviços
            </a>
            <Link
              href="/login"
              className="text-amber-700 font-bold hover:text-amber-900"
            >
              Acesso Profissional
            </Link>
            <button
              onClick={() => setShowBooking(true)}
              className="btn-attention bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-700 shadow-lg"
            >
              Agendar Agora
            </button>
          </div>
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-amber-50 p-6 space-y-4 shadow-xl">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="block py-2 text-slate-600 font-semibold"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, '#sobre')}
              className="block py-2 text-slate-600 font-semibold"
            >
              Sobre
            </a>
            <a
              href="#especialidades"
              onClick={(e) => handleNavClick(e, '#especialidades')}
              className="block py-2 text-slate-600 font-semibold"
            >
              Serviços
            </a>
            <Link href="/login" className="block py-2 text-amber-700 font-bold">
              Acesso Profissional
            </Link>
            <button
              onClick={() => {
                setShowBooking(true);
                setIsMenuOpen(false);
              }}
              className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold shadow-lg"
            >
              Agendar Agora
            </button>
          </div>
        )}
      </nav>

      <section
        id="inicio"
        className="pt-32 pb-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-amber-100 text-amber-800 text-xs font-bold tracking-widest uppercase shadow-sm">
                Especialista em Tranças Afro
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Realçando sua beleza através da{' '}
                <span className="text-amber-600 italic">
                  nossa ancestralidade
                </span>
                .
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                Patrícia é uma artista capilar dedicada a elevar sua autoestima
                com tranças impecáveis, duradouras e que respeitam a saúde dos
                seus fios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => setShowBooking(true)}
                  className="bg-amber-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-amber-700 shadow-2xl shadow-amber-200"
                >
                  Quero Trançar
                </button>
                <a
                  href="#especialidades"
                  onClick={(e) => handleNavClick(e, '#especialidades')}
                  className="px-10 py-5 rounded-2xl font-bold text-lg text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all text-center flex items-center justify-center bg-white/50"
                >
                  Ver Modelos
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl -z-10"></div>
              {/* Carousel implementation */}
              {(() => {
                const [currentImage, setCurrentImage] = React.useState(0);
                const images = [
                  '/hero1.png',
                  '/hero2.png',
                  '/hero3.png',
                  '/hero4.png',
                ];

                React.useEffect(() => {
                  const timer = setInterval(() => {
                    setCurrentImage((prev) => (prev + 1) % images.length);
                  }, 3000);
                  return () => clearInterval(timer);
                }, []);

                return (
                  <div className="relative rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden aspect-[4/5]">
                    {images.map((img, index) => (
                      <img
                        key={img}
                        src={img}
                        alt={`Braids ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                          currentImage === index ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ))}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentImage === index
                              ? 'bg-white w-4'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">
                Mãos que{' '}
                <span className="text-amber-600">contam histórias</span>
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Com anos de experiência e paixão pela estética negra, Patrícia
                  transformou o ato de trançar em uma jornada de cuidado e
                  empoderamento.
                </p>
                <p>
                  Cada nó e cada mecha são trabalhados com precisão, garantindo
                  que o seu visual não seja apenas bonito, mas uma expressão da
                  sua identidade.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                    <p className="text-amber-700 font-bold text-3xl">500+</p>
                    <p className="text-[10px] uppercase font-bold text-amber-600/60 tracking-widest mt-1">
                      Clientes Felizes
                    </p>
                  </div>
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <p className="text-orange-700 font-bold text-3xl">
                      Premium
                    </p>
                    <p className="text-[10px] uppercase font-bold text-orange-600/60 tracking-widest mt-1">
                      Acabamento
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Star className="text-amber-400" /> Diferenciais Patrícia
              </h3>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    <Check size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Saúde Capilar</p>
                    <p className="text-slate-400 text-sm">
                      Tranças que não machucam o couro cabeludo.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    <Check size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Material de Qualidade</p>
                    <p className="text-slate-400 text-sm">
                      Uso do melhor jumbo e fibras do mercado.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="especialidades"
        className="py-24 bg-amber-50/30 text-center scroll-mt-20"
      >
        <h2 className="text-4xl font-bold mb-12">Nossos Serviços</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          <div className="p-10 bg-white rounded-[2.5rem] border border-amber-100 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 mx-auto text-amber-600">
              <Star size={32} />
            </div>
            <h3 className="text-2xl font-bold text-amber-700 mb-4">
              Box Braids
            </h3>
            <p className="text-slate-600 mb-6">
              Tranças soltas e versáteis. Estilo clássico que dura até 3 meses.
            </p>
          </div>
          <div className="p-10 bg-white rounded-[2.5rem] border border-amber-100 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 mx-auto text-orange-600">
              <Scissors size={32} />
            </div>
            <h3 className="text-2xl font-bold text-orange-700 mb-4">
              Nagô & Penteados
            </h3>
            <p className="text-slate-600 mb-6">
              Tranças rasteiras com desenhos artísticos e designs exclusivos.
            </p>
          </div>
          <div className="p-10 bg-white rounded-[2.5rem] border border-amber-100 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-8 mx-auto text-red-600">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              Twist & Entrelace
            </h3>
            <p className="text-slate-600 mb-6">
              Técnicas modernas para volume e comprimento com acabamento
              natural.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 relative">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-400">
              Patrícia Transista
            </span>
            <span className="text-xs text-amber-600 uppercase tracking-widest">
              Arte Afro & Estética Profissional
            </span>
          </div>
          <div className="pt-1 mt-6 md:mt-12 text-center">
          <p className="text-white text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} Patrícia Transista. Todos os direitos
            reservados.
          </p>
          <a
            href="https://argustech.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-white hover:text-neutral-300 transition-colors py-2"
          >
            Produzido por
            <span className="font-bold text-white">Argus</span>
            <span className="font-bold" style={{ color: '#0000FF' }}>
              Tech
            </span>
          </a>
        </div>
        </div>
        <a
          href="https://www.instagram.com/paty.adriana/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 left-8 p-3 bg-white/5 hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 rounded-full text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Instagram"
        >
          <Instagram size={24} />
        </a>
        <a
          href="https://wa.me/5521969103370"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 right-8 p-3 bg-green-500 hover:bg-green-600 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg flex items-center justify-center"
          aria-label="WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      </footer>

      {showBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-up">
            <button
              onClick={closeBooking}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10 p-2 hover:bg-slate-50 rounded-full"
            >
              ✕
            </button>
            <div className="bg-amber-600 p-10 text-white">
              <h3 className="text-3xl font-bold mb-2">Agendamento</h3>
              <p className="text-amber-100 text-sm font-medium">
                Garanta seu horário com a Patrícia
              </p>
              <div className="flex gap-4 mt-8">
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    bookingStep >= 1 ? 'bg-white' : 'bg-white/20'
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    bookingStep >= 2 ? 'bg-white' : 'bg-white/20'
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    bookingStep >= 3 ? 'bg-white' : 'bg-white/20'
                  }`}
                ></div>
              </div>
            </div>
            <div className="p-10">
              {isProcessing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                  <div className="w-20 h-20 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin"></div>
                  <p className="text-xl font-bold text-slate-800">
                    Processando...
                  </p>
                </div>
              ) : (
                <>
                  {bookingStep === 1 && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Calendar size={18} className="text-amber-600" />{' '}
                          Escolha o dia
                        </label>
                        <input
                          type="date"
                          min={todayStr}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none font-semibold"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime('');
                          }}
                        />
                      </div>
                      {selectedDate && (
                        <div className="space-y-5">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock size={18} className="text-amber-600" />{' '}
                            Horários livres
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {availableTimeSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                                  selectedTime === time
                                    ? 'bg-amber-600 border-amber-600 text-white shadow-md'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-amber-200'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setBookingStep(2)}
                        className="w-full bg-amber-600 text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-40"
                      >
                        Próximo Passo
                      </button>
                    </div>
                  )}
                  {bookingStep === 2 && (
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-800 font-bold">
                        {new Date(
                          selectedDate + 'T12:00:00',
                        ).toLocaleDateString('pt-BR')}{' '}
                        às {selectedTime}
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5"
                          placeholder="Seu Nome"
                          value={clientInfo.name}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          type="tel"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5"
                          placeholder="WhatsApp"
                          value={clientInfo.phone}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              phone: e.target.value,
                            })
                          }
                        />
                        <input
                          type="email"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5"
                          placeholder="Email"
                          value={clientInfo.email}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold"
                        >
                          Voltar
                        </button>
                        <button
                          type="submit"
                          className="flex-[2] bg-amber-600 text-white py-5 rounded-2xl font-bold"
                        >
                          Confirmar
                        </button>
                      </div>
                    </form>
                  )}
                  {bookingStep === 3 && (
                    <div className="text-center space-y-8 py-4">
                      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={56} />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900">
                        Agendado!
                      </h3>
                      <p className="text-slate-500">
                        Aguardamos você no dia escolhido. Você receberá uma
                        confirmação em breve.
                      </p>
                      <button
                        onClick={closeBooking}
                        className="w-full bg-slate-100 text-slate-800 py-5 rounded-2xl font-bold"
                      >
                        Voltar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
