export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  es: string;
  hy: string;
}

export interface QuizQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  tacticalTipEs: string;
  tacticalTipHy: string;
  topic: string;
}

export interface WheelSector {
  id: number;
  label: string;
  type: 'points' | 'question' | 'letter' | 'double' | 'assist' | 'goal';
  value?: number;
  color: string;
  textColor: string;
}
