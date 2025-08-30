//topic.tsx 

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

  // const levelLabels: Record<string, string> = {
  //   "1": "מתחילים",
  //   "2": "בינוניים",
  //   "3": "מתקדמים",
  // };

  // const label = levelLabels[level ?? ""] || "לא מוגדר";

  const handleNavigateToTopic = (topicId: number) => {
    navigate(`/topics/${topicId}`);
  };

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Typography
        variant="h6"
        color="textSecondary"
        gutterBottom
        sx={{ marginBottom: "50px" }}
      ></Typography>

      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        {topics.map((topic) => (
          <Card
            key={topic.id}
            sx={{
              backgroundColor: "#d3e5f7ff",
              borderRadius: "12px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.02)" },
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <CardContent>
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  mb: 2,
                }}
              > */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  mb: 2,
                  flexWrap: "wrap", // תאפשר שבירה של טקסטים במקרה הצורך
                  overflow: "hidden", // תמנע חריגה החוצה
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#e33e49ff",
                    fontStyle: "italic",
                  }}
                >
                  {topic.translation}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#e33e49ff",
                    fontStyle: "italic",
                  }}
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