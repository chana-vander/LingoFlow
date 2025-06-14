import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { Feedback } from "../models/feedback";
import config from "../config";
class FeedbackStore {
  transcription: string = "";
  feedback: Feedback | null = null;
  loading: boolean = false;
  error: string = "";
  apiUrl = config.apiUrl;
  constructor() {
    makeAutoObservable(this);
  }

  set Feedback(feedback: Feedback) {
    this.feedback = feedback;
  }

  get Feedback() {
    if (this.feedback === null) {
      return {
        /* פרמטרים של אובייקט ברירת מחדל */
      } as Feedback; // או זרוק שגיאה
    }
    return this.feedback;
  }

  async getFeedbackByRecordId(recordId: number) {
    console.log(recordId);
    
    try {
      const response = await axios.get(
        `${this.apiUrl}/${recordId}`
      );
      return response.data; // מחזיר את הנתונים שהתקבלו
    } catch (error) {
      console.error("Error fetching feedback:", error); // טיפול בשגיאה
      throw error;
    }
  }

  async transcribeFromUrl(fileUrl: string, recordId: number) {
    console.log("fileUrl: ", fileUrl);
    console.log("recordId: ", recordId);

    this.loading = true;
    this.error = "";
    try {
      const response = await axios.post(
        `${this.apiUrl}/transcription`,
        {
          fileUrl,
          recordId,
        }
      );

      runInAction(() => {
        this.transcription = response.data.transcription;
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err.response?.data || "שגיאה בתמלול";
        this.loading = false;
      });
    }
  }
  async analyzeTranscription(
    transcription: string,
    topicId: number,
    recordId: number
  ) {
    this.loading = true;
    this.error = "";
    try {
      const response = await axios.post<Feedback>(
        `${this.apiUrl}/Feedback/analyze`,
        {
          transcription,
          topicId,
          recordId,
        }
      );
      console.log("1");

      runInAction(() => {
        this.feedback = response.data;
        this.loading = false;
        console.log("res ", response.data);
      });
      console.log("2");
    } catch (err: any) {
      runInAction(() => {
        this.error = err.response?.data || "שגיאה בניתוח המשוב";
        this.loading = false;
        console.log("3");
      });
    }
  }
  // async getTranscriptionByRecordId() {

  // }
  reset() {
    this.transcription = "";
    this.feedback = null;
    this.error = "";
  }
}

export const feedbackStore = new FeedbackStore();

// class FeedbackStore {
//     constructor() { }

//     // שליחת בקשת POST לשרת לקבלת תמלול
//     async getTranscription(fileUrl: string): Promise<string> {
//         try {
//             const response = await fetch("http://localhost:5092/Transcription", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ fileUrl })
//             });

//             if (!response.ok) {
//                 const error = await response.text();
//                 console.error("שגיאה בקבלת תמלול:", error);
//                 throw new Error("שגיאה בקבלת תמלול");
//             }

//             const data = await response.json();
//             return data.text; // מחזיר את הטקסט המתומלל
//         }
//         catch (error) {
//             console.error("שגיאה:", error);
//             throw error;
//         }
//     }

// }

// const feedbackStore = new FeedbackStore();
// export default feedbackStore;
