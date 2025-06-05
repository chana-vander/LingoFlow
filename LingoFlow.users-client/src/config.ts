// הגדרת טיפוס עבור משתני הסביבה
interface EnvConfig {
  apiUrl: string;
}

// קריאה למשתני הסביבה מתוך import.meta.env (שיטה של Vite)
const getEnv = (): EnvConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not defined in your environment variables.");
  }

  return {
    apiUrl,
  };
};

const config = getEnv();

export default config;