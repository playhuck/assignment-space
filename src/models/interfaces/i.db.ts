import { ResultSetHeader } from "mysql2"

export interface IUserInsertResult {
    identifiers: [{ userId: number }],
    generatedMaps: [{ userId: number, profileImage: string }],
    raw: ResultSetHeader
}