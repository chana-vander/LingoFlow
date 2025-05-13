import { Container, Typography, Card, CardContent, Button } from "@mui/material";

const AboutUs = () => {
    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                minHeight: "100vh",
                textAlign: "right",
                direction: "rtl",
                mt: 4,
            }}
        >
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                מה זה LingoFlow?
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
                הדרך החדשנית והאפקטיבית ביותר לשפר את הדיבור באנגלית – בקלות, בכיף ובקצב שלכם!
            </Typography>

            <Card sx={{ maxWidth: 600, mt: 4, p: 2, boxShadow: 3, textAlign: "right" }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                        למה דווקא LingoFlow?
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        ✅ למידה פעילה – לא רק לקרוא ולכתוב, אלא באמת **לדבר ולתרגל**.
                        <br /> ✅ משוב חכם – קבלו ניתוח אישי על ההגייה והשימוש במילים.
                        <br /> ✅ התאמה אישית – תכנים שמותאמים לרמה ולתחומי העניין שלכם.
                        <br /> ✅ נוחות וגמישות – למדו בכל זמן ומכל מקום.
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ maxWidth: 600, mt: 4, p: 2, boxShadow: 3, textAlign: "right" }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                        איך זה עובד?
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        1️⃣ **בחרו נושא שיחה** שמתאים לכם.
                        <br /> 2️⃣ **למדו ושננו** את אוצר המילים הרלוונטי לנושא.
                        <br /> 3️⃣ **הקליטו את עצמכם** מדברים באנגלית.
                        <br /> 4️⃣ **קבלו משוב חכם** וניתוח מפורט.
                        <br /> 5️⃣ **שפרו את הדיבור** עם תרגולים ממוקדים.
                    </Typography>
                </CardContent>
            </Card>

            <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }}>
                התחל לתרגל עכשיו!
            </Button>
        </Container>
    );
};

export default AboutUs;
