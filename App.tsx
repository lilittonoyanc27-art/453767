import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCw,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  Lightbulb,
  Share2,
  Eye,
  EyeOff,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Languages,
  MousePointerClick
} from 'lucide-react';
import { QUESTIONS, SECRET_WORD, WORD_HINTS } from './questions.ts';
import { QuizQuestion, WheelSector } from './types.ts';
import {
  playTickSound,
  playCorrectSound,
  playWrongSound,
  playLetterRevealSound,
  playGoalCheerSound,
  speakSpanish,
  toggleSound,
  isSoundEnabled
} from './sound.ts';
import { triggerConfetti } from './confetti.ts';

const WHEEL_SECTORS: WheelSector[] = [
  { id: 0, label: '⚽ 500 QUIZ', type: 'question', value: 500, color: '#047857', textColor: '#ffffff' },
  { id: 1, label: '🔤 LETRA', type: 'letter', color: '#b45309', textColor: '#ffffff' },
  { id: 2, label: '250 PTS', type: 'points', value: 250, color: '#1d4ed8', textColor: '#ffffff' },
  { id: 3, label: '⚡ x2 DOBLE', type: 'double', color: '#7c3aed', textColor: '#ffffff' },
  { id: 4, label: '⚽ 750 QUIZ', type: 'question', value: 750, color: '#059669', textColor: '#ffffff' },
  { id: 5, label: '🎯 ASIST', type: 'assist', color: '#c2410c', textColor: '#ffffff' },
  { id: 6, label: '🏆 ¡GOL! 1500', type: 'goal', value: 1500, color: '#e11d48', textColor: '#ffffff' },
  { id: 7, label: '1000 PTS', type: 'points', value: 1000, color: '#0284c7', textColor: '#ffffff' },
  { id: 8, label: '🔤 LETRA', type: 'letter', color: '#d97706', textColor: '#ffffff' },
  { id: 9, label: '⚽ 300 QUIZ', type: 'question', value: 300, color: '#15803d', textColor: '#ffffff' },
  { id: 10, label: '500 PTS', type: 'points', value: 500, color: '#2563eb', textColor: '#ffffff' },
  { id: 11, label: '🌟 TÁCTICA', type: 'question', value: 600, color: '#4338ca', textColor: '#ffffff' }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function App() {
  // Game states
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  
  // Word state: secret word is EQUIPO
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [guessedWordInput, setGuessedWordInput] = useState<string>('');
  const [wordGuessed, setWordGuessed] = useState<boolean>(false);
  
  // Manual letter picker turn state
  const [letterPicksAvailable, setLetterPicksAvailable] = useState<number>(0);
  const [manualLetterChosenMessage, setManualLetterChosenMessage] = useState<string | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  
  // Translation state: HIDDEN BY DEFAULT. Only opens when user clicks on Spanish text!
  const [showArmenianTranslation, setShowArmenianTranslation] = useState<{ [key: string]: boolean }>({});
  const [globalShowArmenian, setGlobalShowArmenian] = useState<boolean>(false);
  
  // Wheel spinning animation
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [spinResult, setSpinResult] = useState<WheelSector | null>(null);
  const [spinAnnouncement, setSpinAnnouncement] = useState<{ es: string; hy: string } | null>(null);
  
  // Active view: 'game' or 'answers_archive' (Respuestas correctas)
  const [activeTab, setActiveTab] = useState<'game' | 'answers_archive'>('game');
  const [expandedArchiveId, setExpandedArchiveId] = useState<number | null>(null);

  // Clue modal / hint state
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  // Refs
  const wheelRef = useRef<HTMLDivElement>(null);

  // Sync sound status
  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  // Toggle specific translation on click
  const toggleTranslation = (id: string) => {
    setShowArmenianTranslation(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Check if a letter is revealed
  const isLetterRevealed = (char: string) => {
    return revealedLetters.includes(char.toUpperCase()) || wordGuessed;
  };

  // Spin the wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinAnnouncement(null);
    setManualLetterChosenMessage(null);

    // Random sector
    const sectorCount = WHEEL_SECTORS.length;
    const sliceAngle = 360 / sectorCount;
    const randomSectorIndex = Math.floor(Math.random() * sectorCount);
    
    // Additional spins (5 to 7 full rotations)
    const extraRounds = 360 * (5 + Math.floor(Math.random() * 3));
    const targetAngle = extraRounds + (sectorCount - randomSectorIndex) * sliceAngle - sliceAngle / 2;
    
    const newRotation = wheelRotation + targetAngle;
    setWheelRotation(newRotation);

    // Audio ticking while spinning
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) {
        clearInterval(tickInterval);
      }
    }, 120);

    // Settle after 3.2 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const landedSector = WHEEL_SECTORS[randomSectorIndex];
      setSpinResult(landedSector);
      handleSectorAction(landedSector);
    }, 3200);
  };

  // Handle outcome of the wheel spin
  const handleSectorAction = (sector: WheelSector) => {
    playLetterRevealSound();

    if (sector.type === 'points') {
      const pts = sector.value || 300;
      setScore(prev => prev + pts);
      setSpinAnnouncement({
        es: `¡Has ganado ${pts} puntos de juego!`,
        hy: `Դուք շահեցիք ${pts} խաղային միավոր։`
      });
    } else if (sector.type === 'double') {
      setScore(prev => prev * 2 || 500);
      setSpinAnnouncement({
        es: `¡Puntos duplicados (x2)!`,
        hy: `Ձեր միավորները կրկնապատկվեցին (x2):`
      });
    } else if (sector.type === 'goal') {
      playGoalCheerSound();
      triggerConfetti();
      setScore(prev => prev + 1500);
      // Give manual letter pick rather than auto!
      setLetterPicksAvailable(prev => prev + 1);
      setSpinAnnouncement({
        es: `⚽ ¡¡¡GOOOOOOL!!! +1500 puntos. ¡Ahora elige tú mismo una letra para EQUIPO!`,
        hy: `⚽ ԳՈ՜Լ։ +1500 միավոր։ Այժմ ինքդ ընտրիր ցանկացած տառ EQUIPO բառի համար։`
      });
    } else if (sector.type === 'letter') {
      // Manual letter selection: user must choose themselves!
      setLetterPicksAvailable(prev => prev + 1);
      setScore(prev => prev + 400);
      setSpinAnnouncement({
        es: `🔤 ¡Sector Letra! Elige tú mismo cualquier letra en el tablero o teclado.`,
        hy: `🔤 Տառի սեկտոր։ Ինքնուրույն ընտրիր ցանկացած տառ տախտակի կամ ստեղնաշարի վրա։`
      });
    } else if (sector.type === 'assist') {
      setShowHintModal(true);
      setScore(prev => prev + 350);
      setSpinAnnouncement({
        es: `🎯 ¡Asistencia táctica! Has recibido una pista sobre la palabra secreta.`,
        hy: `🎯 Թիմային ասիստ։ Դուք ստացաք կարևոր հուշում գաղտնի բառի մասին։`
      });
    } else if (sector.type === 'question') {
      // Trigger a quiz question
      const q = QUESTIONS[currentQuestionIndex % QUESTIONS.length];
      setActiveQuestion(q);
      setSelectedOption(null);
      setQuestionAnswered(false);
      setSpinAnnouncement({
        es: `⚽ ¡Pregunta táctica! Responde para ganar el derecho a elegir letra.`,
        hy: `⚽ Ֆուտբոլային հարց։ Պատասխանեք ճիշտ՝ տառ ինքնուրույն ընտրելու համար։`
      });
    }
  };

  // User manually chooses a letter from the general alphabet A-Z
  const handleManualChooseLetter = (letter: string) => {
    const upper = letter.toUpperCase();
    if (revealedLetters.includes(upper) || wordGuessed) return;

    const isInSecretWord = SECRET_WORD.includes(upper);

    if (isInSecretWord) {
      playCorrectSound();
      const updated = [...revealedLetters, upper];
      setRevealedLetters(updated);
      setScore(prev => prev + 500);
      setManualLetterChosenMessage(`🎉 ԿԱ «${upper}» ՏԱՌԸ! ¡La letra «${upper}» está en la palabra EQUIPO! (+500 միավոր)`);
      checkWordCompletion(updated);
    } else {
      // Wrong letter: does NOT stop game!
      playWrongSound();
      setRevealedLetters(prev => [...prev, upper]);
      setManualLetterChosenMessage(`❌ «${upper}» տառը ՉԿԱ EQUIPO բառում: Ոչինչ, խաղը շարունակվում է!`);
    }

    if (letterPicksAvailable > 0) {
      setLetterPicksAvailable(prev => Math.max(0, prev - 1));
    }
  };

  // Clicking directly on an EQUIPO board card
  const handleBoardTileClick = (index: number) => {
    const char = SECRET_WORD[index];
    if (isLetterRevealed(char)) return;

    setManualLetterChosenMessage(`👉 Այս տառը բացելու համար ընտրեք այն ստորև գտնվող ընդհանուր այբուբենից (A-Z):`);
  };

  // Check if all letters in EQUIPO are revealed
  const checkWordCompletion = (currentRevealed: string[]) => {
    const letters = SECRET_WORD.split('');
    const allFound = letters.every(l => currentRevealed.includes(l));
    if (allFound && !wordGuessed) {
      setWordGuessed(true);
      playGoalCheerSound();
      triggerConfetti();
      setScore(prev => prev + 3000);
    }
  };

  // Guess full word directly
  const handleGuessFullWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = guessedWordInput.trim().toUpperCase();
    if (!cleaned) return;

    if (cleaned === SECRET_WORD) {
      setWordGuessed(true);
      setRevealedLetters(SECRET_WORD.split(''));
      playGoalCheerSound();
      triggerConfetti();
      setScore(prev => prev + 5000);
      setSpinAnnouncement({
        es: `🏆 ¡¡¡ENHORABUENA!!! Has acertado la palabra secreta: EQUIPO.`,
        hy: `🏆 ՇՆՈՐՀԱՎՈՐՈՒՄ ԵՆՔ։ Դուք գուշակեցիք գաղտնի բառը՝ EQUIPO (ԹԻՄ)։`
      });
      setGuessedWordInput('');
    } else {
      // Incorrect guess does NOT end the game
      playWrongSound();
      setScore(prev => Math.max(0, prev - 50));
      setSpinAnnouncement({
        es: `❌ "${cleaned}" no es la palabra correcta. ¡Sigue jugando, estás muy cerca!`,
        hy: `❌ «${cleaned}» ճիշտ բառը չէ։ Շարունակեք խաղալ, դուք շատ մոտ եք։`
      });
      setGuessedWordInput('');
    }
  };

  // Handle answering a quiz question
  const handleAnswerSubmit = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (questionAnswered || !activeQuestion) return;

    setSelectedOption(optionKey);
    setQuestionAnswered(true);

    const isCorrect = optionKey === activeQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      playCorrectSound();
      const earned = (spinResult?.value || 500) + streak * 50;
      setScore(prev => prev + earned);
      setStreak(prev => prev + 1);
      
      // CRITICAL: User chooses letter MANUALLY, not auto!
      setLetterPicksAvailable(prev => prev + 1);
      setManualLetterChosenMessage(null);
    } else {
      // CRITICAL: Even if incorrect, game continues!
      playWrongSound();
      setStreak(0);
      setScore(prev => prev + 50); // Small participation points
    }
  };

  // Proceed to next question or back to board
  const handleProceedAfterQuestion = () => {
    setActiveQuestion(null);
    setSelectedOption(null);
    setQuestionAnswered(false);
    setCurrentQuestionIndex(prev => (prev + 1) % QUESTIONS.length);
  };

  // Reset entire game
  const handleRestartGame = () => {
    setScore(0);
    setStreak(0);
    setRevealedLetters([]);
    setWordGuessed(false);
    setLetterPicksAvailable(0);
    setManualLetterChosenMessage(null);
    setCurrentQuestionIndex(0);
    setActiveQuestion(null);
    setSelectedOption(null);
    setQuestionAnswered(false);
    setSpinResult(null);
    setSpinAnnouncement(null);
  };

  // Quick launch question directly from the quiz button
  const handleLaunchQuiz = () => {
    const q = QUESTIONS[currentQuestionIndex % QUESTIONS.length];
    setActiveQuestion(q);
    setSelectedOption(null);
    setQuestionAnswered(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Pitch grass pattern & lights subtle backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/15 via-emerald-900/5 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header - strict 3-zone contract */}
      <header className="relative z-20 border-b border-emerald-950/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-emerald-500/20">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                  Campo de Maravillas: Fútbol
                </h1>
                <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 hidden sm:inline-block">
                  Պոլե Չուդես · 12 տարեկան
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Իսպաներեն-հայերեն ֆուտբոլային վիկտորինա · Գաղտնի բառը՝ <strong className="text-amber-400 font-semibold">EQUIPO</strong>
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'game'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              🎮 Խաղադաշտ (Juego)
            </button>
            <button
              onClick={() => setActiveTab('answers_archive')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'answers_archive'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              📖 Ճիշտ պատասխաններ (20)
            </button>
          </div>

          {/* Zone 3: Stats & Sound */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs sm:text-sm">
              <span className="text-amber-400 font-bold tabular-nums">⭐ {score}</span>
              <span className="text-slate-500">pts</span>
              {streak > 1 && (
                <span className="flex items-center gap-1 text-orange-400 font-bold ml-1">
                  <Flame className="w-3.5 h-3.5" />
                  {streak}x
                </span>
              )}
            </div>

            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title={soundOn ? 'Անջատել ձայնը / Silenciar' : 'Միացնել ձայնը / Activar sonido'}
              aria-label="Toggle sound"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'answers_archive' ? (
          /* ============================================================== */
          /* ARCHIVE OF ALL 20 QUESTIONS WITH TRANSLATIONS & CORRECT ANSWERS */
          /* ============================================================== */
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                      ⚽ Quiz de fútbol — 20 preguntas (12 años)
                    </h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    20 հարց իսպաներեն և հայերեն՝ 4 տարբերակով։ Թեմաներ՝ մարտավարություն, խաղային իրավիճակներ, որոշումների ընդունում և կանոններ։
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setGlobalShowArmenian(!globalShowArmenian)}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-900/50 transition-colors"
                  >
                    {globalShowArmenian ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{globalShowArmenian ? 'Թաքցնել հայերենը' : 'Ցույց տալ բոլոր հայերեն թարգմանությունները'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('game')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-emerald-600/30"
                  >
                    Վերադառնալ խաղին ➔
                  </button>
                </div>
              </div>

              {/* Translation tip notice */}
              <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-emerald-200">
                <MousePointerClick className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  👆 <strong>Թարգմանությունը տեսնելու համար կտտացրեք իսպաներեն տեքստին</strong> (կամ «Թարգմանել» կոճակին)։ Լսելու համար սեղմեք բարձրախոսը (🔊)։
                </span>
              </div>
            </div>

            {/* Questions List */}
            <div className="grid grid-cols-1 gap-4">
              {QUESTIONS.map((q) => {
                const isExpanded = expandedArchiveId === q.id;
                const showHy = globalShowArmenian || showArmenianTranslation[`archive_${q.id}`];

                return (
                  <div
                    key={q.id}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-5 transition-all shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-7 h-7 rounded-lg bg-emerald-900/80 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-700/50">
                            #{q.id}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {q.topic}
                          </span>
                          <button
                            onClick={() => speakSpanish(q.questionEs)}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                            title="Escuchar pronunciación en español"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleTranslation(`archive_${q.id}`)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md transition-colors"
                          >
                            <Languages className="w-3 h-3" />
                            <span>{showHy ? 'Թաքցնել հայերենը' : '🇦🇲 Թարգմանել'}</span>
                          </button>
                        </div>

                        {/* Question Text (Click to toggle Armenian) */}
                        <div
                          onClick={() => toggleTranslation(`archive_${q.id}`)}
                          className="cursor-pointer group"
                        >
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                            {q.questionEs}
                          </h3>
                          {showHy ? (
                            <p className="text-sm text-amber-300/90 mt-2 font-medium bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40 animate-fade-in">
                              🇦🇲 {q.questionHy}
                            </p>
                          ) : (
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:text-slate-400">
                              <span>👆 Կտտացրեք հայերեն թարգմանությունը բացելու համար</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedArchiveId(isExpanded ? null : q.id)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors shrink-0"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Choices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.correctAnswer;
                        const optTranslationOpen = globalShowArmenian || showArmenianTranslation[`archive_${q.id}_${opt.key}`];

                        return (
                          <div
                            key={opt.key}
                            onClick={() => toggleTranslation(`archive_${q.id}_${opt.key}`)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500/30'
                                : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                                isCorrect ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {opt.key}
                              </span>
                              <div className="flex items-center gap-2">
                                {isCorrect && (
                                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Ճիշտ պատասխան
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 hover:text-emerald-300 underline">
                                  {optTranslationOpen ? 'Փակել' : '🇦🇲 Թարգմ.'}
                                </span>
                              </div>
                            </div>
                            <div className="font-medium text-slate-100">{opt.es}</div>
                            {optTranslationOpen && (
                              <div className="text-amber-300/90 text-xs mt-1.5 border-t border-slate-800/80 pt-1.5 font-medium animate-fade-in">
                                🇦🇲 {opt.hy}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Tactical breakdown */}
                    <div className="mt-3 p-3 bg-emerald-950/30 border border-emerald-900/30 rounded-xl text-xs text-emerald-200/90 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div>
                          <strong>Explicación táctica:</strong> {q.tacticalTipEs}
                        </div>
                        {showHy ? (
                          <div className="text-amber-300/80 font-medium mt-1 inline-block border-t border-emerald-900/40 pt-1 w-full">
                            🇦🇲 {q.tacticalTipHy}
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleTranslation(`archive_tip_${q.id}`)}
                            className="text-[11px] text-emerald-400 underline mt-1 block"
                          >
                            {showArmenianTranslation[`archive_tip_${q.id}`] ? (
                              <span className="text-amber-300/90 font-medium">🇦🇲 {q.tacticalTipHy}</span>
                            ) : (
                              '🇦🇲 Տեսնել մարտավարական բացատրությունը հայերեն'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* MAIN GAME VIEW: POLE CHUDES (FIELD OF MIRACLES) WHEEL + EQUIPO */
          /* ============================================================== */
          <div className="space-y-8">
            {/* 1. TOP BOARD: SECRET WORD "EQUIPO" DISPLAY (ПОЛЕ ЧУДЕС ТАБЛО) */}
            <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center max-w-2xl mx-auto mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Поле чудес · Palabra Secreta / Գաղտնի բառը</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Գուշակեք իսպաներեն գլխավոր բառը
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Սեղմեք իսպաներեն տեքստին թարգմանությունը տեսնելու համար · Սխալ պատասխանից հետո խաղը շարունակվում է։
                </p>
              </div>

              {/* Notice when letter picks are available */}
              {letterPicksAvailable > 0 && !wordGuessed && (
                <div className="max-w-xl mx-auto my-3 p-3 bg-amber-500/20 border-2 border-amber-400 rounded-2xl text-center animate-pulse">
                  <p className="text-sm sm:text-base font-bold text-amber-300 flex items-center justify-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    <span>Դուք ունեք {letterPicksAvailable} տառ ընտրելու իրավունք: Ընտրեք ցանկացած տառ տախտակից կամ ստեղնաշարից!</span>
                  </p>
                </div>
              )}

              {/* Message after choosing a letter */}
              {manualLetterChosenMessage && (
                <div className="max-w-xl mx-auto mb-3 p-2.5 bg-emerald-950/80 border border-emerald-600/70 rounded-xl text-center text-xs sm:text-sm text-emerald-200">
                  {manualLetterChosenMessage}
                </div>
              )}

              {/* 6 Giant Letter Tiles for E - Q - U - I - P - O (Clickable directly to pick letter!) */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-6">
                {SECRET_WORD.split('').map((char, index) => {
                  const revealed = isLetterRevealed(char);
                  return (
                    <div
                      key={index}
                      onClick={() => handleBoardTileClick(index)}
                      className={`group relative perspective-500 ${!revealed ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
                      title={revealed ? `Տառը բացված է: ${char}` : `Կտտացրեք այս վանդակին (${index + 1})՝ «${char}» տառը ընտրելու համար`}
                    >
                      <div
                        className={`w-12 h-16 sm:w-16 sm:h-22 md:w-20 md:h-26 rounded-2xl flex flex-col items-center justify-center font-display font-black text-2xl sm:text-4xl md:text-5xl shadow-xl transition-all duration-300 transform ${
                          revealed
                            ? 'bg-gradient-to-b from-amber-400 via-amber-300 to-yellow-500 text-slate-950 ring-4 ring-amber-400/50 shadow-amber-500/30'
                            : letterPicksAvailable > 0
                            ? 'bg-gradient-to-b from-amber-900/80 to-emerald-950 border-2 border-amber-400 ring-2 ring-amber-400/40 text-amber-300 animate-pulse'
                            : 'bg-gradient-to-b from-emerald-900/90 to-emerald-950 border-2 border-emerald-600/60 text-emerald-400 shadow-emerald-950/50 hover:border-amber-400'
                        }`}
                      >
                        {revealed ? (
                          <span>{char}</span>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-emerald-400/80 group-hover:text-amber-300">
                            <span className="text-xl sm:text-2xl">⚽</span>
                            <span className="text-[10px] sm:text-xs font-mono font-medium text-emerald-400 group-hover:text-amber-300 mt-1">
                              #{index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Victory announcement if guessed */}
              {wordGuessed && (
                <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-6 text-center animate-bounce duration-1000 max-w-xl mx-auto mb-6">
                  <div className="text-3xl mb-1">🏆 ⚽ 🥳</div>
                  <h3 className="text-2xl font-black text-amber-300 font-display">
                    ¡¡¡VICTORIA TOTAL!!! EQUIPO
                  </h3>
                  <p className="text-sm sm:text-base text-white mt-1">
                    Հիանալի է։ Դուք գուշակեցիք գաղտնի բառը՝ <strong>EQUIPO (ԹԻՄ)</strong>։
                  </p>
                  <p className="text-xs text-amber-200 mt-1">
                    «Միասնական թիմն է հաղթանակի գրավականը ֆուտբոլում»
                  </p>
                  <button
                    onClick={handleRestartGame}
                    className="mt-4 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg hover:brightness-110 transition-all"
                  >
                    Խաղալ նորից (Jugar de nuevo)
                  </button>
                </div>
              )}

              {/* Word clue & direct guess bar */}
              <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                <div 
                  onClick={() => setShowHintModal(true)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-amber-300 cursor-pointer transition-colors bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 w-full sm:w-auto"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Հուշում. <strong>{WORD_HINTS[activeHintIndex].es}</strong>
                  </span>
                </div>

                <form onSubmit={handleGuessFullWord} className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={guessedWordInput}
                    onChange={(e) => setGuessedWordInput(e.target.value)}
                    placeholder="Գրեք ամբողջ բառը..."
                    className="bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none w-full sm:w-44 uppercase"
                    maxLength={10}
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 shadow-md shadow-amber-500/20"
                  >
                    Գուշակել
                  </button>
                </form>
              </div>
            </section>

            {/* 2. PLAYING INTERACTION: THE WHEEL (БАРАБАН) & ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: The Wheel of Fortune (Барабан) */}
              <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative shadow-xl">
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white font-display">
                      Барабан Поле чудес (Ruleta de Fútbol)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    12 սեկտոր
                  </span>
                </div>

                {/* The Wheel SVG Container */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-88 md:h-88 my-4 flex items-center justify-center">
                  {/* Wheel Pointer at top */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-xl flex flex-col items-center">
                    <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
                    <div className="w-3 h-3 rounded-full bg-amber-200 -mt-1 shadow" />
                  </div>

                  {/* Rotating Wheel Disk */}
                  <div
                    ref={wheelRef}
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? 'transform 3.2s cubic-bezier(0.12, 0.8, 0.25, 1)' : 'none'
                    }}
                    className="w-full h-full rounded-full border-8 border-slate-800/90 shadow-2xl relative overflow-hidden bg-slate-950"
                  >
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {WHEEL_SECTORS.map((sector, idx) => {
                        const total = WHEEL_SECTORS.length;
                        const angle = 360 / total;
                        const startAngle = idx * angle;
                        const endAngle = (idx + 1) * angle;

                        // Calculate SVG arc path
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;
                        const x1 = 200 + 195 * Math.cos(startRad);
                        const y1 = 200 + 195 * Math.sin(startRad);
                        const x2 = 200 + 195 * Math.cos(endRad);
                        const y2 = 200 + 195 * Math.sin(endRad);

                        const midAngle = startAngle + angle / 2;
                        const textRad = (midAngle * Math.PI) / 180;
                        const textX = 200 + 125 * Math.cos(textRad);
                        const textY = 200 + 125 * Math.sin(textRad);

                        return (
                          <g key={sector.id}>
                            <path
                              d={`M200,200 L${x1},${y1} A195,195 0 0,1 ${x2},${y2} Z`}
                              fill={sector.color}
                              stroke="#0f172a"
                              strokeWidth="2.5"
                            />
                            <text
                              x={textX}
                              y={textY}
                              fill={sector.textColor}
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="system-ui, sans-serif"
                              textAnchor="middle"
                              dominantBaseline="central"
                              transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                            >
                              {sector.label}
                            </text>
                          </g>
                        );
                      })}
                      {/* Center Hub */}
                      <circle cx="200" cy="200" r="42" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" />
                      <circle cx="200" cy="200" r="34" fill="#047857" />
                      <text
                        x="200"
                        y="204"
                        fill="#ffffff"
                        fontSize="22"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        ⚽
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Spin CTA Button */}
                <div className="w-full mt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleSpinWheel}
                    disabled={isSpinning}
                    className={`w-full py-3.5 px-6 rounded-2xl font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl transition-all ${
                      isSpinning
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-emerald-600/30 active:scale-95'
                    }`}
                  >
                    <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'ԲԱՐԱԲԱՆԸ ՊՏՏՎՈՒՄ Է...' : 'ՊՏՏԵԼ ԲԱՐԱԲԱՆԸ (GIRAR)'}</span>
                  </button>

                  <button
                    onClick={handleLaunchQuiz}
                    disabled={isSpinning}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors shrink-0"
                  >
                    <span>⚽ Հարց #{currentQuestionIndex + 1}</span>
                  </button>
                </div>

                {/* Announcement Banner */}
                {spinAnnouncement && (
                  <div className="mt-4 w-full p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-center animate-fade-in">
                    <p className="text-sm sm:text-base font-bold text-emerald-200">
                      {spinAnnouncement.es}
                    </p>
                    <div 
                      onClick={() => toggleTranslation('spin_announcement')}
                      className="cursor-pointer mt-1"
                    >
                      {showArmenianTranslation['spin_announcement'] ? (
                        <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                          🇦🇲 {spinAnnouncement.hy}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 hover:text-emerald-300 underline">
                          🇦🇲 Տեսնել թարգմանությունը (Click)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Alphabet Guessing + Manual Letter Picking */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Virtual Alphabet Keyboard */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-display">
                        Ընտրեք ցանկացած տառ (Elegir Letra)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Սեղմեք ցանկացած տառի վրա՝ այն EQUIPO բառում բացելու համար
                      </p>
                    </div>
                    <button
                      onClick={() => setShowHintModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium hover:bg-amber-900/50 transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Հուշում</span>
                    </button>
                  </div>

                  {/* Alphabet Grid */}
                  <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
                    {ALPHABET.map((char) => {
                      const isRevealed = revealedLetters.includes(char);
                      const isInWord = SECRET_WORD.includes(char);
                      
                      let btnStyle = "bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-500";
                      if (isRevealed && isInWord) {
                        btnStyle = "bg-emerald-600 text-slate-950 font-bold border-emerald-400 shadow-emerald-500/30";
                      } else if (isRevealed && !isInWord) {
                        btnStyle = "bg-slate-950 text-slate-600 border-slate-800/50 cursor-not-allowed";
                      }

                      return (
                        <button
                          key={char}
                          onClick={() => handleManualChooseLetter(char)}
                          disabled={isRevealed || wordGuessed}
                          className={`h-10 sm:h-11 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center ${btnStyle}`}
                        >
                          {char}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Ճիշտ տառ
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> Փորձված տառ
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      Բացված է: {revealedLetters.filter(l => SECRET_WORD.includes(l)).length} / 6
                    </span>
                  </div>
                </div>

                {/* Educational Banner: Football Rules and Translation Feature */}
                <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shrink-0 text-xl">
                      📖
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-display">
                        Խաղի կանոնները և ուսուցումը
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                        • Պտտեք барабан-ը, պատասխանեք ֆուտբոլային հարցերին և բացեք <strong>EQUIPO</strong> բառը։
                      </p>
                      <p className="text-xs sm:text-sm text-amber-300 mt-1 leading-relaxed">
                        • <strong>Ճիշտ պատասխանելիս</strong> դուք ինքներդ եք ընտրում ցանկացած տառ, այլ ոչ թե ավտոմատ։
                      </p>
                      <p className="text-xs sm:text-sm text-emerald-300 mt-1 leading-relaxed">
                        • <strong>Սխալ պատասխանի դեպքում</strong> խաղը միևնույն է շարունակվում է։
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        • Հայերեն թարգմանությունը տեսնելու համար պարզապես կտտացրեք իսպաներեն տեքստին։
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. ACTIVE QUIZ QUESTION MODAL / CARD */}
            {activeQuestion && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                <div className="bg-slate-900 border-2 border-emerald-600/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                  
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold font-mono">
                        Հարց #{activeQuestion.id} / 20
                      </span>
                      <span className="text-xs text-slate-400">
                        {activeQuestion.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakSpanish(activeQuestion.questionEs)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                        title="Escuchar en español (Լսել իսպաներեն)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTranslation(`active_q_${activeQuestion.id}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 transition-colors"
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>{showArmenianTranslation[`active_q_${activeQuestion.id}`] ? 'Թաքցնել հայերենը' : '🇦🇲 Թարգմանել'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Prompt (CLICKABLE TO OPEN ARMENIAN TRANSLATION) */}
                  <div
                    onClick={() => toggleTranslation(`active_q_${activeQuestion.id}`)}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-emerald-600/50 transition-all mb-5 group"
                    title="Կտտացրեք հայերեն թարգմանությունը բացելու համար"
                  >
                    <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-medium">
                        🇪🇸 Español (Հարց իսպաներենով)
                      </span>
                      <span className="text-emerald-400 text-[11px] group-hover:underline flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" />
                        {showArmenianTranslation[`active_q_${activeQuestion.id}`] ? 'Թաքցնել հայերենը' : 'Սեղմեք թարգմանության համար'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {activeQuestion.questionEs}
                    </h3>
                    
                    {/* Armenian Translation (HIDDEN UNTIL CLICKED) */}
                    {showArmenianTranslation[`active_q_${activeQuestion.id}`] ? (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 animate-fade-in">
                        <div className="text-xs text-amber-400 font-semibold mb-0.5">🇦🇲 Թարգմանություն հայերեն:</div>
                        <p className="text-sm sm:text-base text-amber-200 font-bold bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40">
                          {activeQuestion.questionHy}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-slate-500 italic">
                        👆 Կտտացրեք այստեղ՝ հարցի հայերեն թարգմանությունը տեսնելու համար
                      </div>
                    )}
                  </div>

                  {/* 4 Choices */}
                  <div className="space-y-3 mb-6">
                    {activeQuestion.options.map((option) => {
                      const isSelected = selectedOption === option.key;
                      const isCorrect = option.key === activeQuestion.correctAnswer;
                      const optionTranslationId = `active_opt_${activeQuestion.id}_${option.key}`;
                      const isOptTranslationOpen = showArmenianTranslation[optionTranslationId];

                      let cardStyle = "bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800/60 hover:border-slate-700";
                      if (questionAnswered) {
                        if (isCorrect) {
                          cardStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/40";
                        } else if (isSelected && !isCorrect) {
                          cardStyle = "bg-rose-950/70 border-rose-600 text-rose-200";
                        } else {
                          cardStyle = "bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-60";
                        }
                      }

                      return (
                        <div
                          key={option.key}
                          className={`p-4 rounded-2xl border transition-all ${cardStyle}`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Key Badge */}
                            <button
                              onClick={() => handleAnswerSubmit(option.key)}
                              disabled={questionAnswered}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer ${
                                questionAnswered && isCorrect
                                  ? 'bg-emerald-500 text-slate-950'
                                  : questionAnswered && isSelected && !isCorrect
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-slate-950'
                              }`}
                            >
                              {option.key}
                            </button>
                            
                            {/* Option Text and Translation */}
                            <div className="flex-1">
                              <div 
                                onClick={() => handleAnswerSubmit(option.key)}
                                className={`text-sm sm:text-base font-semibold ${!questionAnswered ? 'cursor-pointer hover:text-emerald-300' : ''}`}
                              >
                                {option.es}
                              </div>

                              {/* Armenian Translation: Only opens on click! */}
                              {isOptTranslationOpen ? (
                                <div className="text-xs sm:text-sm text-amber-300/90 mt-2 font-medium bg-amber-950/20 p-2 rounded-lg border border-amber-900/30 animate-fade-in flex items-center justify-between">
                                  <span>🇦🇲 {option.hy}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTranslation(optionTranslationId);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-slate-200 ml-2"
                                  >
                                    Փակել
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTranslation(optionTranslationId);
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-emerald-400 mt-1 inline-flex items-center gap-1 underline underline-offset-2"
                                >
                                  <Languages className="w-3 h-3" />
                                  <span>🇦🇲 Տեսնել հայերեն թարգմանությունը</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback on answer */}
                  {questionAnswered && (
                    <div className="space-y-4 animate-fade-in">
                      <div className={`p-4 rounded-2xl border ${
                        isAnswerCorrect
                          ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200'
                          : 'bg-amber-950/50 border-amber-600/60 text-amber-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          {isAnswerCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-base">
                              {isAnswerCorrect
                                ? '🎉 ¡Respuesta correcta! Ճիշտ պատասխան!'
                                : 'Ոչինչ, ֆուտբոլում սխալներ լինում են։ Շարունակիր խաղը!'}
                            </p>
                            
                            <p className="text-xs sm:text-sm mt-1 text-slate-300">
                              <strong>Ճիշտ տարբերակն է {activeQuestion.correctAnswer}:</strong> {activeQuestion.options.find(o => o.key === activeQuestion.correctAnswer)?.es}
                            </p>

                            <div 
                              onClick={() => toggleTranslation(`active_tip_${activeQuestion.id}`)}
                              className="cursor-pointer mt-2 pt-2 border-t border-slate-800/80"
                            >
                              <p className="text-xs text-amber-300">
                                💡 <strong>Táctica:</strong> {activeQuestion.tacticalTipEs}
                              </p>
                              {showArmenianTranslation[`active_tip_${activeQuestion.id}`] ? (
                                <p className="text-xs text-amber-200 font-semibold mt-1 bg-amber-950/40 p-1.5 rounded">
                                  🇦🇲 {activeQuestion.tacticalTipHy}
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-400 underline mt-0.5">
                                  🇦🇲 Կտտացրեք բացատրության հայերեն թարգմանության համար
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* MANUAL LETTER SELECTION FROM GENERAL ALPHABET A-Z ON CORRECT ANSWER */}
                      {isAnswerCorrect && (
                        <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400/80 text-amber-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-amber-300">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span>ԱՆՎԱՆԵՔ ՏԱՌԸ (Elige una letra del abecedario):</span>
                            </div>
                            <span className="text-xs text-amber-200/90 font-medium">
                              Ընդհանուր այբուբեն (A-Z)
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-300 mb-3">
                            Դուք ճիշտ պատասխանեցիք հարցին: Այժմ ընդհանուր այբուբենից ընտրեք ցանկացած տառ՝ ստուգելու, թե արդյոք այն կա EQUIPO բառում:
                          </p>

                          {/* Notification of result after picking a letter */}
                          {manualLetterChosenMessage && (
                            <div className="mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/60 text-xs sm:text-sm font-semibold text-center text-amber-200 animate-fade-in">
                              {manualLetterChosenMessage}
                            </div>
                          )}

                          {/* General Alphabet Grid A-Z */}
                          <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2">
                            {ALPHABET.map((char) => {
                              const isRevealed = revealedLetters.includes(char);
                              const isInWord = SECRET_WORD.includes(char);

                              let btnClass = "bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white border-slate-700";
                              if (isRevealed && isInWord) {
                                btnClass = "bg-emerald-600 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/20";
                              } else if (isRevealed && !isInWord) {
                                btnClass = "bg-slate-950 text-slate-600 border-slate-800/60 cursor-not-allowed opacity-50";
                              }

                              return (
                                <button
                                  key={char}
                                  type="button"
                                  onClick={() => handleManualChooseLetter(char)}
                                  disabled={isRevealed || wordGuessed}
                                  className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center ${btnClass}`}
                                  title={isRevealed ? (isInWord ? `«${char}» տառը կա բառում` : `«${char}» տառը չկա բառում`) : `Ընտրել «${char}» տառը`}
                                >
                                  {char}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-amber-900/40 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Կա EQUIPO բառում
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" /> Չկա բառում
                            </span>
                            <span className="text-amber-300 font-semibold">
                              Բացված է: {revealedLetters.filter(l => SECRET_WORD.includes(l)).length} / 6
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleProceedAfterQuestion}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold rounded-2xl text-sm sm:text-base transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                      >
                        <span>Շարունակել խաղը (Continuar)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Close without answering if desired */}
                  {!questionAnswered && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveQuestion(null)}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg"
                      >
                        Փակել և վերադառնալ барабан-ին
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* 4. HINT MODAL */}
            {showHintModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                <div className="bg-slate-900 border border-amber-600/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                      💡
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">
                        Հուշում գաղտնի բառի մասին (Pista)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Սեղմեք իսպաներեն տեքստին՝ թարգմանությունը տեսնելու համար
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 my-4">
                    {WORD_HINTS.map((hint, idx) => {
                      const hintTranslationOpen = showArmenianTranslation[`hint_${idx}`];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleTranslation(`hint_${idx}`)}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all"
                        >
                          <div className="text-sm font-semibold text-white">
                            #{idx + 1}. {hint.es}
                          </div>
                          {hintTranslationOpen ? (
                            <div className="text-xs text-amber-300 mt-1 font-medium animate-fade-in">
                              🇦🇲 {hint.hy}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 mt-1">
                              👆 Կտտացրեք թարգմանության համար
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => {
                        setShowHintModal(false);
                        setLetterPicksAvailable(prev => prev + 1);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all"
                    >
                      Ընտրել տառ (+Elegir letra)
                    </button>
                    <button
                      onClick={() => setShowHintModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all"
                    >
                      Հասկացա
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>⚽ Ֆուտբոլային վիկտորինա (12 տարեկան)</span>
            <span>·</span>
            <span>Իսպաներեն և Հայերեն</span>
            <span>·</span>
            <span className="text-amber-400 font-semibold">EQUIPO</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('answers_archive')}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Ցույց տալ 20 պատասխանները
            </button>
            <span>·</span>
            <button
              onClick={handleRestartGame}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Վերսկսել խաղը
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
