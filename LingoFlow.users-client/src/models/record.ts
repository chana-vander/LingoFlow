// export interface Record2 {
//     userId: number,
//     topicId: number,
//     name: string,
//     length: string,
//     url: string,
//     date:Date,
// }
// types.ts
interface DatabaseRecord {
    id: number;
    userId: number;
    topicId: number;
    name: string;
    url: string;
    length: string;
}

interface Record {
    id: number;
    name: string;
    date: string;
    length: string;
    url: string;
    topicName: string;
}

function getTopicNameById(topicId: number): string {
    const topicNames: { [key: string]: string } = {
        '1': 'Topic One',
        '2': 'Topic Two',
    };
    return topicNames[topicId] || 'Unknown Topic';
}

function mapDatabaseRecordToRecord(dbRecord: DatabaseRecord): Record {
    return {
        id: dbRecord.id,
        name: dbRecord.name,
        date: new Date().toISOString(),
        length: dbRecord.length,
        url: dbRecord.url,
        topicName: getTopicNameById(dbRecord.topicId),
    };
}

// כאן תוכל לייצא את המפענח אם אתה צריך להשתמש בו בקבצים אחרים
export { mapDatabaseRecordToRecord };   
export type { DatabaseRecord, Record };

