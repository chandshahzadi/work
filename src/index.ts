import { D1QB } from 'workers-qb'
import { D1Orm } from 'd1-orm';
import app from "./app";
import { Env } from "./types/global";

export default {
	fetch: async (req: Request, env: Env, ctx: ExecutionContext)=> {
		globalThis.env = env;
		globalThis.QB = new D1QB(env.DB);
		globalThis.DB = {
			default: new D1Orm(env.DB)
		};
		await import("./routes");
		return app.fetch(req, env, ctx);
	},
};
