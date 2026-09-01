import React, { useState, useEffect } from 'react';
import { 
  Coordinates, 
  CalculationMethod, 
  PrayerTimes as AdhanPrayerTimes, 
  SunnahTimes,
  Prayer 
} from 'adhan';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Sun, 
  Sunset, 
  Sunrise, 
  Moon, 
  Navigation,
  Sparkles,
  Calendar
} from 'lucide-react';

interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
  method: 'UmmAlQura' | 'Egyptian' | 'MuslimWorldLeague' | 'Dubai' | 'Kuwait' | 'Qatar';
}

const CITIES: CityPreset[] = [
  { name: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262, method: 'UmmAlQura' },
  { name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692, method: 'UmmAlQura' },
  { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, method: 'UmmAlQura' },
  { name: 'جدة', country: 'السعودية', lat: 21.5433, lng: 39.1728, method: 'UmmAlQura' },
  { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, method: 'Egyptian' },
  { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187, method: 'Egyptian' },
  { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, method: 'Dubai' },
  { name: 'أبوظبي', country: 'الإمارات', lat: 24.4539, lng: 54.3773, method: 'Dubai' },
  { name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137, method: 'MuslimWorldLeague' },
  { name: 'عمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284, method: 'MuslimWorldLeague' },
  { name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774, method: 'Kuwait' },
  { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, method: 'Qatar' },
  { name: 'المنامة', country: 'البحرين', lat: 26.2285, lng: 50.5860, method: 'UmmAlQura' },
  { name: 'مسقط', country: 'عُمان', lat: 23.5880, lng: 58.3829, method: 'UmmAlQura' },
  { name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661, method: 'MuslimWorldLeague' },
  { name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765, method: 'MuslimWorldLeague' },
  { name: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, method: 'MuslimWorldLeague' },
  { name: 'طرابلس', country: 'ليبيا', lat: 32.8872, lng: 13.1913, method: 'MuslimWorldLeague' },
  { name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815, method: 'MuslimWorldLeague' },
  { name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588, method: 'MuslimWorldLeague' },
  { name: 'الرباط / الدار البيضاء', country: 'المغرب', lat: 34.0209, lng: -6.8416, method: 'MuslimWorldLeague' },
  { name: 'الخرطوم', country: 'السودان', lat: 15.5007, lng: 32.5599, method: 'Egyptian' },
  { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, method: 'MuslimWorldLeague' },
  { name: 'لندن', country: 'بريطانيا', lat: 51.5074, lng: -0.1278, method: 'MuslimWorldLeague' },
];

export const PrayerTimes: React.FC = () => {
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCity = CITIES[selectedCityIndex];
  const lat = customCoords ? customCoords.lat : activeCity.lat;
  const lng = customCoords ? customCoords.lng : activeCity.lng;

  // Resolve calculation method
  const getCalculationParams = (m: string) => {
    switch (m) {
      case 'UmmAlQura': return CalculationMethod.UmmAlQura();
      case 'Egyptian': return CalculationMethod.Egyptian();
      case 'Dubai': return CalculationMethod.Dubai();
      case 'Kuwait': return CalculationMethod.Kuwait();
      case 'Qatar': return CalculationMethod.Qatar();
      default: return CalculationMethod.MuslimWorldLeague();
    }
  };

  const coordinates = new Coordinates(lat, lng);
  const params = getCalculationParams(activeCity.method);
  const prayerTimes = new AdhanPrayerTimes(coordinates, currentTime, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Next prayer resolution
  const nextPrayerName = prayerTimes.nextPrayer();
  const currentPrayerName = prayerTimes.currentPrayer();
  const nextPrayerTime = prayerTimes.timeForPrayer(nextPrayerName);

  // Time remaining to next prayer
  const getTimeRemaining = () => {
    if (!nextPrayerTime) return null;
    const diffMs = nextPrayerTime.getTime() - currentTime.getTime();
    if (diffMs < 0) return null;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours > 0 ? `${hours} ساعة و ` : ''}${minutes} دقيقة و ${seconds} ثانية`;
  };

  const getPrayerArabicName = (p: string) => {
    switch (p) {
      case Prayer.Fajr:
      case 'fajr': return 'الفجر';
      case Prayer.Sunrise:
      case 'sunrise': return 'الشروق';
      case Prayer.Dhuhr:
      case 'dhuhr': return 'الظهر';
      case Prayer.Asr:
      case 'asr': return 'العصر';
      case Prayer.Maghrib:
      case 'maghrib': return 'المغرب';
      case Prayer.Isha:
      case 'isha': return 'العشاء';
      default: return 'الفجر القادم';
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('خاصية تحديد الموقع غير مدعومة في متصفحك');
      return;
    }
    setLocationStatus('جاري تحديد موقعك الجغرافي...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('تم تحديد موقعك الحالي بنجاح!');
        setTimeout(() => setLocationStatus(null), 3000);
      },
      () => {
        setLocationStatus('تعذر الوصول للموقع، يرجى اختيار المدينة يدوياً.');
      }
    );
  };

  const prayersList = [
    { id: Prayer.Fajr, name: 'صلاة الفجر', time: prayerTimes.fajr, icon: Sunrise },
    { id: Prayer.Sunrise, name: 'الشروق', time: prayerTimes.sunrise, icon: Sun },
    { id: Prayer.Dhuhr, name: 'صلاة الظهر', time: prayerTimes.dhuhr, icon: Sun },
    { id: Prayer.Asr, name: 'صلاة العصر', time: prayerTimes.asr, icon: Sun },
    { id: Prayer.Maghrib, name: 'صلاة المغرب', time: prayerTimes.maghrib, icon: Sunset },
    { id: Prayer.Isha, name: 'صلاة العشاء', time: prayerTimes.isha, icon: Moon },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* City and Location Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              اختر المدينة أو العاصمة
            </label>
            <select
              value={customCoords ? 'custom' : selectedCityIndex}
              onChange={(e) => {
                if (e.target.value === 'custom') return;
                setCustomCoords(null);
                setSelectedCityIndex(Number(e.target.value));
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {CITIES.map((c, idx) => (
                <option key={idx} value={idx}>
                  {c.name} - {c.country}
                </option>
              ))}
              {customCoords && <option value="custom">موقعي الحالي المحدد</option>}
            </select>
          </div>

          <button
            type="button"
            onClick={handleUseLocation}
            className="w-full sm:w-auto px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-blue-200"
          >
            <Navigation className="w-4 h-4" />
            <span>موقعي الجغرافي الحالي (GPS)</span>
          </button>
        </div>

        {locationStatus && (
          <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold text-center">
            {locationStatus}
          </div>
        )}

        {/* Highlight Card: Next Prayer & Live Countdown */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-100 uppercase">
            <MapPin className="w-4 h-4" />
            <span>
              {customCoords ? 'الموقع الجغرافي الحالي' : `${activeCity.name}، ${activeCity.country}`}
            </span>
          </div>

          <span className="text-xs text-emerald-100 font-medium block">
            الصلاة القادمة
          </span>

          <div className="text-3xl sm:text-5xl font-black tracking-tight">
            {getPrayerArabicName(nextPrayerName)}
          </div>

          {nextPrayerTime && (
            <div className="text-base sm:text-lg font-bold text-emerald-100">
              يحين وقت الأذان في تمام الساعة{' '}
              <span className="text-white underline font-extrabold">{formatTime(nextPrayerTime)}</span>
            </div>
          )}

          {getTimeRemaining() && (
            <div className="inline-block bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-white/20 mt-2">
              الوقت المتبقي للأذان: {getTimeRemaining()}
            </div>
          )}
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {prayersList.map((p) => {
            const Icon = p.icon;
            const isNext = p.id === nextPrayerName;
            const isCurrent = p.id === currentPrayerName;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isNext
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 ${
                    isNext
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">{p.name}</span>
                <span
                  className={`text-base sm:text-lg font-black block mt-1 ${
                    isNext ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-slate-900'
                  }`}
                >
                  {formatTime(p.time)}
                </span>
                {isNext && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                    القادمة
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Sunnah times: Midnight & Last Third */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-tajawal">
          <div className="text-center">
            <span className="text-slate-400 block font-medium">منتصف الليل الشرعي</span>
            <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
              {formatTime(sunnahTimes.middleOfTheNight)}
            </span>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden sm:block" />

          <div className="text-center">
            <span className="text-slate-400 block font-medium">بداية الثلث الأخير (وقت التهجد)</span>
            <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
              {formatTime(sunnahTimes.lastThirdOfTheNight)}
            </span>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden sm:block" />

          <div className="text-center">
            <span className="text-slate-400 block font-medium">طريقة الحساب المعتمدة</span>
            <span className="font-bold text-slate-700 text-xs mt-0.5 block">
              {activeCity.method === 'UmmAlQura' ? 'تقويم أم القرى (مكة المكرمة)' : 'رابطة العالم الإسلامي'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
