//steps.tsx
import { motion } from "framer-motion";
import {
  BookOpen,
  Mic,
  MessageSquareText,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    icon: <BookOpen className="h-10 w-10 text-white" />,
    title: "בחירת נושא",
    description: "בחרו נושא שיחה מתוך מגוון רחב של אפשרויות ולמדו את אוצר המילים הרלוונטי",
    color: "bg-blue-600",
  },
  {
    icon: <Mic className="h-10 w-10 text-white" />,
    title: "הקלטה",
    description: "הקליטו את עצמכם מדברים אנגלית תוך שימוש במילים ובמשפטים שלמדתם",
    color: "bg-red-500",
  },
  {
    icon: <MessageSquareText className="h-10 w-10 text-white" />,
    title: "קבלת משוב",
    description: "קבלו משוב מפורט מבוסס AI על הדיבור שלכם, כולל תיקוני הגייה ודקדוק",
    color: "bg-green-600",
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-white" />,
    title: "שיפור מתמיד",
    description: "עקבו אחר ההתקדמות שלכם לאורך זמן וראו כיצד הדיבור שלכם משתפר",
    color: "bg-purple-600",
  },
];

export default function StepsSection() {
  return (
    <section className="mt-20 mb-10 px-8" dir="rtl">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">איך זה עובד?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                {step.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-700 flex items-center justify-center text-blue-700 font-bold">
                {index + 1}
              </div>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">{step.title}</h3>
            <p className="text-gray-700">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
