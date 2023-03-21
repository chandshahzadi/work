import { D1QB, SelectAll, SelectOne } from "workers-qb/dist/types";
import sendError from "../utils/sendError";

type Dictionary = Record<string, any>;
// TODO:: remove worker-qb dependency
// TODO:: remove d1-orm dependency from all models
export class SQLiteOrm<T, Columns>  {
    
    tableName: string;
    DB: D1QB;
    
    constructor(tableName: string, QB?: D1QB){
        this.tableName = tableName;
        this.DB = QB || globalThis.QB;
    }
    
    async FindOne(paramss: {where?: T, select?: Columns[] | string, orderBy?: string | string[] | Record<string, string> | undefined}) {
        let _params: SelectOne = {
            tableName: this.tableName,
            fields: paramss.select || '*' as any,
            orderBy: paramss.orderBy
        }
        if(paramss.where){
            _params.where = this.mapWhereCondition(paramss.where);
        }
        const {results} = await this.DB.fetchOne(_params);
        return paramss.select && Array.isArray(paramss.select) ? results as Extract<T, keyof Columns> : results as T;
    }
    
    async FindMany(params?: {where?: T, select?: Columns[] | string, orderBy?: string | string[] | Record<string, string> | undefined}){
        if(!params){
            params = {
                where: {} as T,
                select: '*',
            }
        }
        const _params: SelectAll =  {
            tableName: this.tableName,
            fields: params.select || '*' as any,
            orderBy: params.orderBy
        }
        if(params.where){
            _params.where = this.mapWhereCondition(params.where)
        }
        const {results} =  await this.DB.fetchAll(_params);
        return results as T[];
    }
    
    async Update(where: T, data: T){
        const _where = this.mapWhereCondition(where, Object.keys(data as any).length + 1);
        const query = 'UPDATE ' + this.tableName + ' SET ' + Object.keys(data as any).map((item, k)=> `${item} = ?${k + 1}`).join(', ') + ' WHERE ' + _where.conditions;
        const {success, changes} = await this.DB.execute({
            query,
            arguments: [...Object.values(data as any), ..._where.params]
        });
        return {changes, success};
    }
    
    async Delete(where: T): Promise<number> {
        const {success, results} = await  this.DB.delete({
            tableName: this.tableName,
            where: this.mapWhereCondition(where)
        });

        // @ts-ignore
        return success && results ? results.changes : 0;
    }
    
    async InsertOne(data: T, returning = 'id'){
        try {
			const { results } = await this.DB.insert({
				tableName: this.tableName,
				data: data as any,
				returning
			});
			return results && results.length > 0 && (results[0]?.id as number);
		} catch (e: any) {
            console.log(data)
			throw new sendError(e.cause, 500);
		}
    }
    
    async InsertMany(data: T[], returning = 'id'){
        try {
            const {results} =  await this.DB.insert({
                tableName: this.tableName,
                data: data as any,
                returning,
            });
            return results as T[];
        } catch(e: any){
            throw new sendError(e, 500);
        }
    }
    
    private mapWhereCondition(where: T, start = 1){
        return {
            conditions: Object.keys(where as Dictionary).map((item, k)=> `${item} = ?${k + start}`).join(' AND '),
            params: Object.values(where as Dictionary),
        }
    }

}
