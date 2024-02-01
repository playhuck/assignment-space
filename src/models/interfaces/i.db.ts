import { ResultSetHeader } from "mysql2"
import { InsertResult } from "typeorm"

export interface IUserInsertResult extends InsertResult {
    identifiers: [{ userId: number }],
    generatedMaps: [{ userId: number, profileImage: string }],
    raw: ResultSetHeader
}