import { useEffect, useState } from "react";
import { Box, Typography} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// אנימציית אותיות רקע
const float = keyframes`
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-150vh) rotate(360deg);
    opacity: 0;
  }
`;

const FloatingLetter = styled("div")<{
  delay: number;
  duration: number;
  left: number;
  color: string;
}>`
  position: fixed;
  font-size: 2rem;
  font-weight: bold;
  z-index: 0;
  pointer-events: none;
  animation: ${float} ${(props) => props.duration}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  left: ${(props) => props.left}%;
  color: ${(props) => props.color};
  opacity: 0.3;
`;

const MainTitle = styled(Typography)`
  text-align: center;
  margin-bottom: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #2196f3, #21cbf3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StepNumber = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #2196f3, #21cbf3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

// const StepTitle = styled(Typography)`
//   font-weight: bold;
//   color: #1976d2;
//   margin-bottom: 0.5rem;
// `;

const StepDescription = styled(Typography)`
  color: #444;
  line-height: 1.6;
`;

interface FloatingLetterData {
  id: number;
  letter: string;
  delay: number;
  duration: number;
  left: number;
  color: string;
}

export default function LingoFloUsage() {
  const [floatingLetters, setFloatingLetters] = useState<FloatingLetterData[]>(
    []
  );

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
  ];

  useEffect(() => {
    const generateFloatingLetters = () => {
      const newLetters: FloatingLetterData[] = [];
      for (let i = 0; i < 20; i++) {
        newLetters.push({
          id: i,
          letter: letters[Math.floor(Math.random() * letters.length)],
          delay: Math.random() * 10,
          duration: 8 + Math.random() * 4,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setFloatingLetters(newLetters);
    };

    generateFloatingLetters();
    const interval = setInterval(generateFloatingLetters, 12000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "בחר נושא שיחה",
      description: "בחר נושא מתוך מאגר נושאים מותאמים לרמתך.",
    },
    {
      title: "הקלט את עצמך",
      description: "שוחח באופן חופשי והשתמש באוצר מילים רלוונטי.",
    },
    {
      title: "קבל משוב",
      description: "קבל הערות וציון לשיפור הדקדוק, השטף והביטחון.",
    },
    { title: "התפתח", description: "עקוב אחר ההתקדמות שלך ושפר משיחה לשיחה." },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
      dir="rtl"
    >
      {/* אותיות רקע */}
      {floatingLetters.map((letter) => (
        <FloatingLetter
          key={letter.id}
          delay={letter.delay}
          duration={letter.duration}
          left={letter.left}
          color={letter.color}
        >
          {letter.letter}
        </FloatingLetter>
      ))}

      <MainTitle variant="h2" 
    //   component="h1"
      >
        ללמוד בכיף, לדבר שוטף!
      </MainTitle>

      <Box sx={{ width: "100%", maxWidth: 700 }}>
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
              textAlign: "right",
            }}
          >
            <StepNumber>{index + 1}</StepNumber>
            <Box>
              <StepDescription
                variant="body1"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  padding: "10px 16px",
                  borderRadius: "12px",
                }}
              >
                {step.title} - {step.description}
              </StepDescription>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
