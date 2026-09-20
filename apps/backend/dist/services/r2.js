import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export class R2Service {
    constructor(env) {
        const accountId = env.R2_ACCOUNT_ID;
        const accessKeyId = env.R2_ACCESS_KEY_ID;
        const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
        const bucket = env.R2_BUCKET_NAME;
        const publicUrl = env.R2_PUBLIC_URL;
        if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
            throw new Error('Missing R2 environment variables');
        }
        this.bucket = bucket;
        this.publicUrl = publicUrl;
        const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
        this.client = new S3Client({
            region: 'auto',
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });
    }
    async createPresignedPutUrl(key, contentType = 'application/octet-stream', expiresInSeconds = 900) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
            ACL: 'private',
        });
        const url = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
        const publicUrl = this.publicUrl ? `${this.publicUrl.replace(/\/$/, '')}/${key}` : undefined;
        return { uploadUrl: url, publicUrl };
    }
}
export function createR2Service(env) {
    return new R2Service(env);
}
