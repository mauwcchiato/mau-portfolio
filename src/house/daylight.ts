import { createContext, useContext } from "react";

/* Day or night in the house (clicking any lamp flips it), and whether the
   visitor is walking around inside in first person. */
/* here: the room you're walking in (null in the model view or outside) */
/* tall: walls stand full height (walking inside, or the roof is on) */
export interface Daylight { day: boolean; toggle: () => void; walk: boolean; here: string | null; tall: boolean }
export const DayContext = createContext<Daylight>({ day: false, toggle: () => {}, walk: false, here: null, tall: false });
export const useDay = () => useContext(DayContext);
