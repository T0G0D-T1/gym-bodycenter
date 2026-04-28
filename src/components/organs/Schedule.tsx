import { Link } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";
import {
  CalendarBlank,
  CalendarCheck,
  Clock,
  Phone,
  Suitcase,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Text } from "../atoms/Text";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type DaySchedule = {
  key: DayKey;
  label: string;
  open: string | null; // "HH:MM" local time or null (closed)
  close: string | null;
};

// Business rules (requested):
// - Mon-Fri: 07:30-21:30
// - Sat: 09:00-15:00
// - Sun: closed
const WEEKLY_SCHEDULE: DaySchedule[] = [
  { key: "mon", label: "Lunes", open: "07:30", close: "21:30" },
  { key: "tue", label: "Martes", open: "07:30", close: "21:30" },
  { key: "wed", label: "Miercoles", open: "07:30", close: "21:30" },
  { key: "thu", label: "Jueves", open: "07:30", close: "21:30" },
  { key: "fri", label: "Viernes", open: "07:30", close: "21:30" },
  { key: "sat", label: "Sabado", open: "09:00", close: "15:00" },
  { key: "sun", label: "Domingo", open: null, close: null },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

const toMinutes = (hhmm: string) => {
  const [hh, mm] = hhmm.split(":").map((x) => Number(x));
  return hh * 60 + mm;
};

const getDayIndex = (d: Date) => d.getDay(); // 0=Sun..6=Sat

const dayIndexToKey = (idx: number): DayKey => {
  switch (idx) {
    case 0:
      return "sun";
    case 1:
      return "mon";
    case 2:
      return "tue";
    case 3:
      return "wed";
    case 4:
      return "thu";
    case 5:
      return "fri";
    default:
      return "sat";
  }
};

const getScheduleByKey = (key: DayKey) => WEEKLY_SCHEDULE.find((d) => d.key === key)!;

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const getNextOpenFrom = (base: Date) => {
  // Returns next day that has opening hours (starting from base date).
  for (let offset = 0; offset < 8; offset++) {
    const probe = addDays(base, offset);
    const key = dayIndexToKey(getDayIndex(probe));
    const schedule = getScheduleByKey(key);
    if (schedule.open && schedule.close) return { schedule, offset };
  }
  return { schedule: getScheduleByKey("mon"), offset: 1 };
};

const Schedule = () => {
  // Live clock for the open/closed status (kept light: updates every 30s).
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const status = useMemo(() => {
    const dayKey = dayIndexToKey(getDayIndex(now));
    const today = getScheduleByKey(dayKey);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (today.open && today.close) {
      const openM = toMinutes(today.open);
      const closeM = toMinutes(today.close);

      if (nowMinutes >= openM && nowMinutes <= closeM) {
        return {
          isOpen: true,
          headline: "Abierto ahora",
          subline: `Cierra a las ${today.close}`,
        };
      }

      if (nowMinutes < openM) {
        return {
          isOpen: false,
          headline: "Cerrado ahora",
          subline: `Abrimos hoy a las ${today.open}`,
        };
      }
    }

    const next = getNextOpenFrom(addDays(now, 1));
    return {
      isOpen: false,
      headline: "Cerrado ahora",
      subline:
        next.offset === 0
          ? `Abrimos hoy a las ${next.schedule.open}`
          : next.offset === 1
            ? `Abrimos manana a las ${next.schedule.open}`
            : `Abrimos ${next.schedule.label.toLowerCase()} a las ${next.schedule.open}`,
    };
  }, [now]);

  return (
    <div className="w-full bg-zinc-950 text-white">
      {/* Hero */}
      <section className="w-full pt-24 md:pt-28 lg:pt-32">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-20 py-12">
          <Fade direction="up" triggerOnce>
            <div className="w-full rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl overflow-hidden relative">
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative px-6 md:px-10 py-10 md:py-12 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-red-500">
                  <Clock size={26} color="currentColor" weight="fill" />
                  <Text as="p" className="tracking-widest uppercase text-xs font-semibold">
                    Horarios BodyCenter
                  </Text>
                </div>

                <div className="flex flex-col gap-3">
                  <Slide direction="up" triggerOnce>
                    <Text as="h1" className="text-zinc-100 lg:text-6xl md:text-5xl text-4xl font-extrabold">
                      Nuestros Horarios
                    </Text>
                  </Slide>
                  <Slide direction="up" triggerOnce>
                    <Text as="p" className="text-zinc-400 md:text-lg text-base max-w-2xl">
                      Entrena cuando quieras. Nos adaptamos a tu ritmo de vida.
                    </Text>
                  </Slide>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    to="/"
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold text-center shadow-md hover:opacity-95 transition-opacity"
                  >
                    Ver planes
                  </Link>
                  <a
                    href="https://wa.me/+56947977983"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-100 font-semibold text-center hover:border-red-500/50 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* Open/Closed status (premium banner) */}
      <section className="w-full">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-20 pb-6">
          <div
            className={`w-full rounded-3xl border shadow-lg p-6 md:p-8 bg-zinc-900 ${
              status.isOpen ? "border-emerald-500/30" : "border-red-500/25"
            }`}
          >
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    status.isOpen
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                      : "bg-red-500/10 border-red-500/25 text-red-400"
                  }`}
                >
                  <Clock size={22} color="currentColor" weight="fill" />
                </div>
                <div className="flex flex-col">
                  <Text as="h2" className="text-zinc-100 text-2xl md:text-3xl font-bold">
                    {status.headline}
                  </Text>
                  <Text as="p" className="text-zinc-400 text-base md:text-lg">
                    {status.subline}
                  </Text>
                </div>
              </div>
              <div className="text-zinc-400 text-sm">
                {pad2(now.getHours())}:{pad2(now.getMinutes())}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly schedule (no cards, no table) */}
      <section className="w-full">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-20 py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-3">
              <CalendarBlank size={22} color="currentColor" weight="fill" className="text-red-500" />
              <Text as="h2" className="text-zinc-100 text-2xl md:text-3xl font-bold">
                Horario semanal
              </Text>
            </div>
            <Text as="p" className="text-zinc-400 text-sm">
              14 norte #931, Vina del Mar, Chile
            </Text>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg overflow-hidden">
            {WEEKLY_SCHEDULE.map((d, idx) => (
              <div
                key={d.key}
                className={`w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 transition-colors ${
                  idx !== WEEKLY_SCHEDULE.length - 1 ? "border-b border-zinc-800" : ""
                } hover:bg-zinc-800/40`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-500 flex-none">
                    <CalendarCheck size={20} color="currentColor" weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <Text as="h3" className="text-zinc-100 text-lg md:text-xl font-bold">
                      {d.label}
                    </Text>
                    <Text as="p" className="text-zinc-400 text-sm">
                      {d.open && d.close ? "Horario continuo" : "Descanso semanal"}
                    </Text>
                  </div>
                </div>

                <div className="text-right flex-none">
                  {d.open && d.close ? (
                    <Text as="p" className="text-zinc-200 text-base md:text-lg font-semibold">
                      {d.open} - {d.close}
                    </Text>
                  ) : (
                    <Text as="p" className="text-zinc-200 text-base md:text-lg font-semibold">
                      Cerrado
                    </Text>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick benefits (no cards) */}
      <section className="w-full bg-zinc-900">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-20 py-14">
          <div className="flex flex-col gap-3 mb-8">
            <Text as="h2" className="text-zinc-100 text-2xl md:text-3xl font-bold">
              Beneficios de nuestros horarios
            </Text>
            <Text as="p" className="text-zinc-400">
              Disenados para que puedas entrenar sin excusas.
            </Text>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="px-6 md:px-8 py-5 border-b md:border-b-0 md:border-r border-zinc-800 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-none">
                  <Clock size={20} color="currentColor" weight="fill" />
                </div>
                <div>
                  <Text as="h3" className="text-zinc-100 font-bold text-lg">
                    Amplio horario
                  </Text>
                  <Text as="p" className="text-zinc-400 text-sm mt-1">
                    Mas tiempo para ti, todos los dias.
                  </Text>
                </div>
              </div>

              <div className="px-6 md:px-8 py-5 border-b border-zinc-800 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-none">
                  <Suitcase size={20} color="currentColor" weight="fill" />
                </div>
                <div>
                  <Text as="h3" className="text-zinc-100 font-bold text-lg">
                    Antes o despues del trabajo
                  </Text>
                  <Text as="p" className="text-zinc-400 text-sm mt-1">
                    Ajusta tu entrenamiento a tu jornada.
                  </Text>
                </div>
              </div>

              <div className="px-6 md:px-8 py-5 border-b md:border-b-0 md:border-r border-zinc-800 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-none">
                  <CalendarBlank size={20} color="currentColor" weight="fill" />
                </div>
                <div>
                  <Text as="h3" className="text-zinc-100 font-bold text-lg">
                    Clases durante el dia
                  </Text>
                  <Text as="p" className="text-zinc-400 text-sm mt-1">
                    Entrena cuando tu energia este arriba.
                  </Text>
                </div>
              </div>

              <div className="px-6 md:px-8 py-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-none">
                  <CalendarCheck size={20} color="currentColor" weight="fill" />
                </div>
                <div>
                  <Text as="h3" className="text-zinc-100 font-bold text-lg">
                    Fin de semana disponible
                  </Text>
                  <Text as="p" className="text-zinc-400 text-sm mt-1">
                    Aprovecha el sabado para avanzar.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-zinc-950">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 lg:px-20 py-16">
          <div className="w-full rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl px-6 md:px-10 py-12 text-center">
            <Text as="h2" className="text-zinc-100 text-3xl md:text-4xl font-extrabold">
              Listo para empezar hoy?
            </Text>
            <Text as="p" className="text-zinc-400 md:text-lg text-base mt-3 max-w-2xl mx-auto">
              Ven a entrenar y transforma tu cuerpo con nosotros.
            </Text>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a
                href="https://wa.me/+56947977983"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold text-center shadow-md hover:opacity-95 transition-opacity"
              >
                Unirme Ahora
              </a>
              <a
                href="https://wa.me/+56947977983"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-100 font-semibold text-center hover:border-red-500/50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone size={18} color="currentColor" weight="fill" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Schedule;
