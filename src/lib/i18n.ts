import { useApp } from "./store";

const en = {
  dashboard: "Dashboard", explore: "Explore", messages: "Messages", calendar: "Calendar", wallet: "Credit Wallet",
  community: "Community", groups: "Skill Circles", progress: "Progress", profile: "Profile", settings: "Settings",
  hello: "Hello", findPartner: "Find a learning partner", offerSkill: "Offer a skill",
};
type Dict = typeof en;
// Partial dictionaries fall back to English per key.
const dicts: Record<string, Partial<Dict>> = {
  en,
  hi: { dashboard: "डैशबोर्ड", explore: "खोजें", messages: "संदेश", calendar: "कैलेंडर", wallet: "क्रेडिट वॉलेट", community: "समुदाय", groups: "स्किल सर्कल", progress: "प्रगति", profile: "प्रोफ़ाइल", settings: "सेटिंग्स", hello: "नमस्ते", findPartner: "सीखने का साथी खोजें", offerSkill: "कौशल सिखाएँ" },
};

export function useT() {
  const { state } = useApp();
  const d = dicts[state.prefs.lang] ?? {};
  return (k: keyof Dict) => d[k] ?? en[k];
}
