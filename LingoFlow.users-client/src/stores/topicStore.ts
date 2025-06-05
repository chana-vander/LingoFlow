import { makeAutoObservable, runInAction } from "mobx";
import config from "../config";

export interface Topic {
  id: number;
  name: string;
}

class TopicStore {
  topics: Topic[] = [];
  selectedTopicId: number | null = null;
  apiUrl = config.apiUrl;

  constructor() {
    makeAutoObservable(this);
  }

  //   async fetchTopics() {
  //     try {
  //       const response = await fetch("http://localhost:5092/api/Topic")
  //       if (response.ok) {
  //         const data = await response.json()
  //         runInAction(() => {
  //           this.topics = data
  //           if (data.length > 0) {
  //             this.selectedTopicId = data[0].id
  //           }
  //         })
  //       } else {
  //         console.error("Failed to fetch topics")
  //       }
  //     } catch (error) {
  //       console.error("Error fetching topics:", error)
  //     }
  //   }
  async fetchTopics() {
    try {
      const response = await fetch(`${this.apiUrl}/Topic`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      runInAction(() => {
        this.topics = data;
        if (data.length > 0) {
          this.selectedTopicId = data[0].id;
        }
      });
    } catch (error) {
      console.error("שגיאה בקבלת נושאים:", error);
    }
  }
  setSelectedTopic(id: number) {
    this.selectedTopicId = id;
  }
}

const topicStore = new TopicStore();
export default topicStore;