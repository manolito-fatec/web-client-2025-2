export type SlaPredictionRawItem = {
  subCategory: string;
  percentage: number;
  isHighRisk: boolean;
};

export type SlaPredictionDto = {
  items: SlaPredictionRawItem[];
};

export type SlaPredictionItem = {
  name: string;
  percentage: number;
  isCritical: boolean;
};
