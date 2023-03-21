import { Context } from 'hono';

type GetParamsReturn = {
	where: Dictionary;
	page: number;
	limit: number;
};

export const getParams = (c: Context<any>): GetParamsReturn => {
	const params = JSON.parse(c.req.query('params') || '{}');
	return {
		where: cleanObject(params?.where),
		page: params?.page,
		limit: params?.limit
	};
};

export const cleanObject = (obj: Dictionary = {}) => {
	const result = {};
	for (const key in obj) {
		if (!!obj[key] && obj[key] !== '') {
			result[key] = obj[key];
		}
	}
	return result;
};

export const uniqueArray = (arr: any[]) => [...new Set(arr)];