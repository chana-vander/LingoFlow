//קבלת מילים לפי נושא שיחה
class TopicWordsStore {
    constructor() {}

    async getWordsByTopic(topicId: string): Promise<string[]> {
        try {
            const response = await fetch(`http://localhost:5092/api/Word/Topic/${topicId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch topic words");
            }
            const data = await response.json();
            return data.words || []; // בהנחה שיש שדה words שמחזיר מערך מילים
        } catch (error) {
            console.error("Error fetching topic words:", error);
            return [];
        }
    }
}

const topicWordsStore = new TopicWordsStore();
export default topicWordsStore;