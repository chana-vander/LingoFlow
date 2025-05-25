// AudioTranscriber.tsx
import React, { useState } from "react"
import axios from "axios"

interface TranscriberProps {
  fileUrl: string
}

const AudioTranscriber: React.FC<TranscriberProps> = ({ fileUrl }) => {
  const [transcription, setTranscription] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transcribe = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("/api/transcription", { fileUrl })
      setTranscription(response.data.text ?? JSON.stringify(response.data))
    } catch (err: any) {
      setError("שגיאה בתמלול: " + (err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={transcribe} disabled={loading}>
        {loading ? "מתמלל..." : "תמלל הקלטה"}
      </button>

      {transcription && (
        <div>
          <h3>תמלול:</h3>
          <pre>{transcription}</pre>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default AudioTranscriber
