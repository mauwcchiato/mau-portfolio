import { createContext, useContext } from "react";

/* Day or night in the house (clicking any lamp flips it), and whether the
   visitor is walking around inside in first person. */
/* here: the room you're walking in (null in the model view or outside) */
export interface Daylight { day: boolean; toggle: () => void; walk: boolean; here: string | null }
export const DayContext = createContext<Daylight>({ day: false, toggle: () => {}, walk: false, here: null });
export const useDay = () => useContext(DayContext);
