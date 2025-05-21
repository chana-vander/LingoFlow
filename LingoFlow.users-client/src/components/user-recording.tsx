"use client"

import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
// import { Skeleton } from "@mui/material"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription } from "./ui/alert"
import { Play, Calendar, Clock, Headphones, FileAudio, Info, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import userStore, { UserStore } from "../stores/userStore";

// טיפוס להקלטה
interface Recording {
  id: number
  userId: number
  user: any
  topicId: number
  topic: any
  url: string
  name: string
  date: string
  length: string
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const router = useNavigate();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const userId = userStore.user?.id
        if (!userId) {
          router("/login")
          return
        }

        // שליפת ההקלטות מהשרת
        const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`)

        if (!response.ok) {
          throw new Error(`שגיאה בטעינת ההקלטות: ${response.status}`)
        }

        const data = await response.json()
        setRecordings(data)
      } catch (err) {
        console.error("שגיאה בטעינת ההקלטות:", err)
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה בטעינת ההקלטות")
      } finally {
        setLoading(false)
      }
    }

    fetchRecordings()
  }, [router])

  // פונקציה לפורמט תאריך
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // פונקציה לניגון הקלטה
  const playRecording = (id: number, url: string) => {
    setCurrentlyPlaying(id)
    const audio = new Audio(url)
    audio.onended = () => setCurrentlyPlaying(null)
    audio.play().catch((err) => {
      console.error("שגיאה בניגון ההקלטה:", err)
      setCurrentlyPlaying(null)
      setError("לא ניתן לנגן את ההקלטה. ייתכן שהקישור פג תוקף או שאין הרשאות מתאימות.")
    })
  }

  // פונקציה לקבלת צבע רקע לפי מזהה
  const getCardColor = (id: number) => {
    const colors = [
      "from-blue-50 to-blue-100 border-blue-200",
      "from-green-50 to-green-100 border-green-200",
      "from-purple-50 to-purple-100 border-purple-200",
      "from-orange-50 to-orange-100 border-orange-200",
      "from-pink-50 to-pink-100 border-pink-200",
      "from-teal-50 to-teal-100 border-teal-200",
    ]
    return colors[id % colors.length]
  }

  return (
    <div className="container mx-auto px-4 py-8 rtl">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">ההקלטות שלי</h1>
        <p className="text-gray-600 text-center max-w-2xl">
          כאן תוכלו לצפות בכל ההקלטות שביצעתם, להאזין להן ולעקוב אחר ההתקדמות שלכם בדיבור האנגלית
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      ) : recordings.length === 0 ? (
        <div className="text-center py-12">
          <FileAudio className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הקלטות עדיין</h3>
          <p className="text-gray-600 mb-6">
            לא נמצאו הקלטות במערכת. התחילו להקליט את עצמכם מדברים אנגלית כדי לראות את ההקלטות כאן.
          </p>
          <Button onClick={() => router("/record")} className="bg-blue-700 hover:bg-blue-800">
            להתחלת הקלטה חדשה
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`border-2 bg-gradient-to-br ${getCardColor(recording.id)} hover:shadow-md transition-all duration-300 relative overflow-hidden`}
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rotate-12 z-0"></div>
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold z-10 border-2 border-blue-600">
                  {index + 1}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                    <FileAudio className="h-5 w-5" />
                    {recording.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span>נושא: {recording.topicId ? `נושא ${recording.topicId}` : "לא צוין"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>תאריך: {formatDate(recording.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>משך: {recording.length}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => playRecording(recording.id, recording.url)}
                    className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    disabled={currentlyPlaying === recording.id}
                  >
                    {currentlyPlaying === recording.id ? (
                      <>
                        <Headphones className="h-4 w-4 animate-pulse" />
                        מנגן כעת...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        האזנה להקלטה
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
