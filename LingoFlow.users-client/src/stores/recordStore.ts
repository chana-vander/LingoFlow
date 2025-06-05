// import { makeAutoObservable, runInAction } from "mobx"
// import { Record } from "../models/record"
// class RecordStore {
//     presignedUrl: string | null = null;
//     Recording: Record|null = null;

//     constructor() {
//         makeAutoObservable(this)
//     }

//     setRecording(recording:Record){
//         this.Recording=recording;
//     }

//     get recording(){
//         return this.Recording;
//     }
//     async getPresignedUrl(fileName: string): Promise<string | null> {
//         try {
//             const response = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${fileName}`)
//             if (!response.ok) throw new Error("Failed to fetch presigned URL")

//             const data = await response.json()
//             runInAction(() => {
//                 this.presignedUrl = data.url
//             })
//             return data.url
//         } catch (error) {
//             console.error("Error fetching presigned URL:", error)
//             return null
//         }
//     }
//     async getRecordsByUserId(userId: any): Promise<Record[]> {
//         try {
//             const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`, {
//                 method: 'GET'
//             });
//             console.log(response);

//             if (!response.ok) {
//                 throw new Error(`Failed to get record with ID ${userId}`);
//             }

//             console.log(`Records with ID ${userId} get successfully`);

//             // כאן נוסיף את השורה שמחזירה את הנתונים
//             // const records: Record[] = await response.json();
//             const records = await response.json();
//             console.log(records);
//             return records; // החזרת המערך של הקלטות
//         } catch (err) {
//             console.error("Error getting records:", err);
//             return []; // החזרת מערך ריק במקרה של שגיאה
//         }
//     }
//     async saveRecordToDatabase(recordData: any) {
//         try {
//             const response = await fetch("http://localhost:5092/api/Conversation", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(recordData)
//             })

//             if (!response.ok) {
//                 throw new Error("Failed to save record");
//             }
//             return response.json;
//         } catch (error) {
//             console.error("Error saving record:", error);
//             return null;
//         }
//     }
//     async deleteRecordFromDB(recordId: any) {
//         try {
//             const response = await fetch(`http://localhost:5092/api/Conversation/${recordId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to delete record with ID ${recordId}`);
//             }

//             console.log(`Record with ID ${recordId} deleted successfully`);
//         } catch (err) {
//             console.error("Error deleting record:", err);
//         }
//     }

//     // ✅ פונקציה חדשה: הורדת URL של הקובץ
//     async getDownloadUrl(fileName: string): Promise<string | null> {
//         try {
//             const response = await fetch(`http://localhost:5092/api/upload/download-url?fileName=${fileName}`)
//             if (!response.ok)
//                 throw new Error("Failed to fetch download URL")

//             const data = await response.json()
//             return data.url
//         } catch (error) {
//             console.error("Error fetching download URL:", error)
//             return null
//         }
//     }
// }

// const recordStore = new RecordStore();
// export default recordStore;
import { makeAutoObservable, runInAction } from "mobx";
import { Record } from "../models/record";
import config from "../config";

class RecordStore {
  presignedUrl: string | null = null;
  Recording: Record | null = null;
  apiUrl = config.apiUrl;

  constructor() {
    makeAutoObservable(this);
  }

  setRecording(recording: Record) {
    this.Recording = recording;
  }

  get recording() {
    return this.Recording;
  }

  async getPresignedUrl(fileName: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}/upload/presigned-url?fileName=${fileName}`
      );
      if (!response.ok) throw new Error("Failed to fetch presigned URL");

      const data = await response.json();
      runInAction(() => {
        this.presignedUrl = data.url;
      });
      return data.url;
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
      return null;
    }
  }

  async getRecordsByUserId(userId: any): Promise<Record[]> {
    try {
      const response = await fetch(`${this.apiUrl}/recording/user/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to get records for user ID ${userId}`);
      }

      const records = await response.json();
      return records;
    } catch (err) {
      console.error("Error getting records:", err);
      return [];
    }
  }

  async saveAndStoreRecording(recordData: Record): Promise<Record | null> {
    try {
      const response = await fetch(`${this.apiUrl}/recording`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        console.log("1111 ");
        throw new Error("Failed to save record");
      }

      const savedRecord: Record = await response.json();
      console.log("savedRecord: ", savedRecord);
      console.log("222");

      // שמירה ל-Store בעזרת runInAction
      runInAction(() => {
        this.Recording = savedRecord;
        console.log("333");
      });

      return savedRecord;
    } catch (error) {
      console.error("Error saving record:", error);
      return null;
    }
  }

  async deleteRecordFromDB(recordId: any) {
    try {
      const response = await fetch(`${this.apiUrl}/recording/${recordId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete record with ID ${recordId}`);
      }

      console.log(`Record with ID ${recordId} deleted successfully`);
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  }

  async getDownloadUrl(fileName: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}/upload/download-url?fileName=${fileName}`
      );
      if (!response.ok) throw new Error("Failed to fetch download URL");

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error fetching download URL:", error);
      return null;
    }
  }
}

const recordStore = new RecordStore();
export default recordStore;
