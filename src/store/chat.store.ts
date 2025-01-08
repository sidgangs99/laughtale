// store/useStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  userPersona: string;
  situation: string;
  setUserPersona: (persona: string) => void;
  setSituation: (situation: string) => void;
  clearStore: () => void;
}

const useChatStore = create<Store>()(
  persist(
    (set) => ({
      userPersona: "",
      situation: "",
      setUserPersona: (persona) => set({ userPersona: persona }),
      setSituation: (situation) => set({ situation: situation }),
      clearStore: () => set({ userPersona: "", situation: "" }),
    }),
    {
      name: "chat-store",
    }
  )
);

export default useChatStore;
