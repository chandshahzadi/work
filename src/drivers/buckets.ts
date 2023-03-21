class BucketDriver {
    
    BucketName: string;
    
    constructor(bucket: string) {
        this.BucketName = bucket;
    }
    
    put(key: string, value:
      | ReadableStream
      | ArrayBuffer
      | ArrayBufferView
      | string
      | null
      | Blob,
    options?: R2PutOptions): Promise<R2Object> {
        return globalThis.env[this.BucketName].put(key, value, options);
    }
    
    get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null> {
        return globalThis.env[this.BucketName].get(key, options);
    }

    delete(key: string | string[]): Promise<void> {
        return globalThis.env[this.BucketName].delete(key);
    }
    
}

export const PRIVATE_BUCKET = new BucketDriver('PRIVATE_BUCKET');
export const PUBLIC_BUCKET = new BucketDriver('PUBLIC_BUCKET');
