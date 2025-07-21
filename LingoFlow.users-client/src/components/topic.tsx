// import { useEffect, useState } from 'react';
// import { Button, Card, CardContent, Typography } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom'; // לניהול ניווט בעזרת React Router

// type Topic = {
//   id: number;
//   name: string;
// };

// const TopicsList = () => {

//   const [topics, setTopics] = useState<Topic[]>([]);
//   const navigate = useNavigate(); // מאפשר לנו לנווט בין המסכים
//   const { level } = useParams(); // 👈 שליפת מהנתיב

//   useEffect(() => {
//     // דמוי קריאה ל-API כדי להוריד את נושאי השיחה
//     fetch(`http://localhost:5092/api/Topic/level/${level}`) // כתובת ה-API שמחזירה את נושאי השיחה
//       .then(response => response.json())
//       .then(data => setTopics(data))
//       .catch(error => console.error('Error fetching topics:', error));
//   }, []);

//   const handleNavigateToTopic = (topicId: number) => {
//     // ניווט לעמוד של נושא השיחה
//     navigate(`/topics/${topicId}`);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//       {topics.map(topic => (
//         <Card key={topic.id} sx={{ maxWidth: 345 }}>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               {topic.name}
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleNavigateToTopic(topic.id)}
//             >
//               עמוד נושא
//             </Button>
//           </CardContent>
//         </Card>
//       ))}

//     </div>
//   );
// };

// export default TopicsList;
import config from "../config";
import { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
// import userStore from "../stores/userStore";
import { Topic } from "../models/topic";

const TopicsList = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const navigate = useNavigate();
  const { level } = useParams();
  const { apiUrl } = config;

  useEffect(() => {
    fetch(`${apiUrl}/Topic/level/${level}`)
      .then((response) => response.json())
      .then((data) => setTopics(data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, [level]);

  const levelLabels: Record<string, string> = {
    "1": "מתחילים",
    "2": "בינוניים",
    "3": "מתקדמים",
  };

  // const label = levelLabels[level ?? ""] || "לא מוגדר";

  const handleNavigateToTopic = (topicId: number) => {
    navigate(`/topics/${topicId}`);
  };

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      {/* <Typography
        variant="h6"
        color="textSecondary"
        gutterBottom
        sx={{ marginBottom: "50px" }}
      >
      נושאי שיחה ל{label}
      </Typography> */}

      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        {topics.map((topic) => (
          <Card
            key={topic.id}
            sx={{
              backgroundColor: "#cbe4fdff",
              borderRadius: "12px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.02)" },
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#50f777ff" }}
                >
                  {topic.translation}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{fontWeight: "bold", color: "#129230ff", fontStyle: "italic" }}
                >
                  {topic.name}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => handleNavigateToTopic(topic.id)}
                  sx={{
                    padding: "8px 16px",
                    fontWeight: "bold",
                    textTransform: "none",
                    // backgroundColor: "#FA5560",
                    "&:hover": {
                      backgroundColor: "#2116f0ff",
                    },
                  }}
                >
                  לאוצר המילים
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TopicsList;
