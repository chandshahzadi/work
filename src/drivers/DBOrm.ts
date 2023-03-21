import { D1QB } from "workers-qb/dist/types";
import { SQLiteOrm } from "~/orm/D1ORM";

export default function DBOrm<Schema>(tableName: string, QB?: D1QB){
    // this is the point where we can switch between different DBs
    // if needed we can add check here to select the desired DB
    // at the moment we only have SQLite so we just return the SQLiteOrm
    return new SQLiteOrm<Schema, keyof Schema>(tableName, QB);
}
