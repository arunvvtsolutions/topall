import { GenericType } from "..";

export type UpcomingTests = {
  id: string;
  name: string;
  scheduledAt: string;
  subjects: GenericType[];
};
