export interface TimePeriod {
  start: number;
  end: number;
}

export interface HistoricalFact {
  year: number;
  description: string;
}

export interface Theme {
  id: number;
  name: string;
  period: TimePeriod;
  facts: HistoricalFact[];
}
