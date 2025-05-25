class FeedbackStore {
    constructor() { }

    // שליחת בקשת POST לשרת לקבלת תמלול
    async getTranscription(fileUrl: string): Promise<string> {
        try {
            const response = await fetch("http://localhost:5092/Transcription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fileUrl })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("שגיאה בקבלת תמלול:", error);
                throw new Error("שגיאה בקבלת תמלול");
            }

            const data = await response.json();
            return data.text; // מחזיר את הטקסט המתומלל
        }
        catch (error) {
            console.error("שגיאה:", error);
            throw error;
        }
    }
}

const feedbackStore = new FeedbackStore();
export default feedbackStore;
