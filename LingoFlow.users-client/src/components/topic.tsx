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
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; // לניהול ניווט בעזרת React Router
import { Book } from '@mui/icons-material'; // אייקון חדש של ספר (למילון)

type Topic = {
  id: number;
  name: string;
};

const TopicsList = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const navigate = useNavigate();
  const { level } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5092/api/Topic/level/${level}`)
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error('Error fetching topics:', error));
  }, [level]);

  const handleNavigateToTopic = (topicId: number) => {
    navigate(`/topics/${topicId}`);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#2C3E50' }}>
        נושאים לרמה {level}
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
      🧭 גלול בין הנושאים ובחר את הנושא שמעניין אותך במיוחד!
      </Typography>
      <Grid container spacing={3} justifyContent="center" direction="row-reverse">
        {topics.map(topic => (
          <Grid item xs={12} sm={6} md={4} key={topic.id}>
            <Card
              sx={{
                backgroundColor: '#FFF',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent style={{ textAlign: 'center' }}>
                {/* <Book style={{ fontSize: '48px', color: '#F84F99' }} /> */}
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', marginTop: '16px' }}>
                  {topic.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNavigateToTopic(topic.id)}
                  sx={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    backgroundColor: '#F84F99', // צבע 
                    '&:hover': {
                      backgroundColor: 'F84A84', // כהה יותר כשעוברים עם העכבר
                    },
                  }}
                >
                  לאוצר המילים
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TopicsList;

