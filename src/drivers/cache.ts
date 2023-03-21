class CacheDriver {
	Namespace: string;

	constructor(space: string) {
		this.Namespace = space;
	}

	put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: KVNamespacePutOptions): Promise<void> {
		return globalThis.env[this.Namespace].put(key, value, options);
	}

	get(key: string, options?: KVNamespaceGetOptions<any>): Promise<any> {
		return globalThis.env[this.Namespace].get(key, options);
	}

	delete(key: string): Promise<void> {
		return globalThis.env[this.Namespace].delete(key);
	}

	async increament(key: string): Promise<void> {
		const v = parseInt((await globalThis.env[this.Namespace].get(key)) || 0) + 1;
		return await globalThis.env[this.Namespace].put(key, v.toString());
	}

	async decreament(key: string): Promise<void> {
		const v = parseInt((await globalThis.env[this.Namespace].get(key)) || 0);
		return await globalThis.env[this.Namespace].put(key, (v <= 0 ? 0 : v - 1).toString());
	}
}

export const SITE_KV = new CacheDriver('SITE_KV');
export const DOMAIN_KV = new CacheDriver('DOMAIN_KV');
export const STATS_KV = new CacheDriver('STATS_KV');
