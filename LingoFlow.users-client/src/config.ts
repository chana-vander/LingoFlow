// הגדרת טיפוס עבור משתני הסביבה שנרצה לבדוק
interface EnvConfig {
  apiUrl: string;
}

// קריאה למשתני הסביבה מתוך process.env
const getEnv = (): EnvConfig => {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    throw new Error(
      "REACT_APP_API_URL is not defined in your environment variables."
    );
  }

  return {
    apiUrl,
  };
};

const config = getEnv();

export default config;
