import { D1Orm, D1QB } from 'd1-orm';
export {};

declare global {
    interface ENV {
        DB: D1Database;
        ENCRYPTION_SECRET_KEY: string;
    }
    var env: Env;
    var QB: D1QB;
    var Orm: D1Orm;
    var DB: {
        default: D1Orm;
    };
}