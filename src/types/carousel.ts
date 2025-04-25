import { GenericType } from ".";


export type Carousel = {
  id: number;
  title: string;
  description: string;
  desktopImage: string;
  phoneImage: string;
  link: string;
  standardList: GenericType[];
};

export type CarousalResponse = {
  streamId: number;
  streamName: string;
  carousels: Carousel[];
};

export const streams: CarousalResponse[] = [/* Your Data Here */];
