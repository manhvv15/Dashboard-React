export type ISource = {
  name: string;
  code: string;
  link: string;
  originId: string;
  originCode: string;
  originName: string;
  order: number;
  id: string;
  createdDate: string;
  imageUrl: string;
  originCurrencyCode: string;
  sourceType: ESourceType;
};

export enum ESourceType {
  GroupBySeller = 1,
  GroupBySource,
  GroupByProductLink,
}
