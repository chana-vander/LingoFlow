import { makeAutoObservable, runInAction } from "mobx"
import { Record } from "../models/record"
class RecordStore {
    presignedUrl: string | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async getPresignedUrl(fileName: string): Promise<string | null> {
        try {
            const response = await fetch(`http://localhost:5092/api/upload/presigned-url?fileName=${fileName}`)
            if (!response.ok) throw new Error("Failed to fetch presigned URL")

            const data = await response.json()
            runInAction(() => {
                this.presignedUrl = data.url
            })
            return data.url
        } catch (error) {
            console.error("Error fetching presigned URL:", error)
            return null
        }
    }
    async getRecordsByUserId(userId: any): Promise<Record[]> {
        try {
            const response = await fetch(`http://localhost:5092/api/Conversation/user/${userId}`, {
                method: 'GET'
            });
console.log(response);

            if (!response.ok) {
                throw new Error(`Failed to get record with ID ${userId}`);
            }

            console.log(`Records with ID ${userId} get successfully`);

            // כאן נוסיף את השורה שמחזירה את הנתונים
            // const records: Record[] = await response.json();
            const records = await response.json();
            console.log(records);
            return records; // החזרת המערך של הקלטות
        } catch (err) {
            console.error("Error getting records:", err);
            return []; // החזרת מערך ריק במקרה של שגיאה
        }
    }
    async saveRecordToDatabase(recordData: any) {
        try {
            const response = await fetch("http://localhost:5092/api/Conversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recordData)
            })

            if (!response.ok) {
                throw new Error("Failed to save record")
            }
        } catch (error) {
            console.error("Error saving record:", error)
        }
    }
    async deleteRecordFromDB(recordId: any) {
        try {
            const response = await fetch(`http://localhost:5092/api/Conversation/${recordId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete record with ID ${recordId}`);
            }

            console.log(`Record with ID ${recordId} deleted successfully`);
        } catch (err) {
            console.error("Error deleting record:", err);
        }
    }

    // ✅ פונקציה חדשה: הורדת URL של הקובץ
    async getDownloadUrl(fileName: string): Promise<string | null> {
        try {
            const response = await fetch(`http://localhost:5092/api/upload/download-url?fileName=${fileName}`)
            if (!response.ok)
                throw new Error("Failed to fetch download URL")

            const data = await response.json()
            return data.url
        } catch (error) {
            console.error("Error fetching download URL:", error)
            return null
        }
    }
}

const recordStore = new RecordStore()
export default recordStore
