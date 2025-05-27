export interface Feedback {
    id?: number;
    conversationId: number;
    usedWordsCount: number;
    totalWordsRequired: number;
    grammarScore: number;
    grammarComment: string;
    fluencyScore: number;
    fluencyComment: string;
    vocabularyScore: number;
    vocabularyComment: string;
    generalFeedback: string;
    score: number;
    givenAt: string;
}