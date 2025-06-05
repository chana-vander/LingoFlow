import config from "../config";

//קבלת מילים לפי נושא שיחה
class TopicWordsStore {
  constructor() {}
  apiUrl = config.apiUrl;

  async getWordsByTopic(topicId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/Vocabulry/Topic/${topicId}`);
      if (!response.ok) {
        console.log("if ", response.json);
        throw new Error("Failed to fetch topic words");
      }
      const data = await response.json();
      console.log(data);

      return data || []; // בהנחה שיש שדה words שמחזיר מערך מילים
    } catch (error) {
      console.log("here");

      console.error("Error fetching topic words:", error);
      return [];
    }
  }
}

const topicWordsStore = new TopicWordsStore();
export default topicWordsStore;