import { conn } from "./conn"

async function clearDb() {

    const connection = await conn();

    try {

        const [tablesRows] = await connection.promise().query('SHOW TABLES');
        const rows = tablesRows as Array<any>;
        const tables = rows.map((row: any) => Object.values(row)[0]);

        for (const table of tables) {
            const deleteSql = `DELETE FROM ${table}`;
            await connection.promise().query(deleteSql);
        }

    } catch (e: unknown) {

        console.error('DB ERROR:', e);

    } finally {

        connection.end();
    }

};

export default clearDb;