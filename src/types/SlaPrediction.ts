export type SlaPredictionRawItem = {
  subcategoryId: number;
  subcategoryName: string;
  averageRiskProbability: number;
};

export type SlaPredictionDto = SlaPredictionRawItem[];

export type SlaPredictionItem = {
  name: string;
  percentage: number;
};
