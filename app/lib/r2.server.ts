import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';

// R2 Client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// 파일 타입 정의
export type FileType = 'images' | 'videos' | 'documents';
export type ContentType = 'posts' | 'projects';

// Content-Type 매핑
const MIME_TYPES: Record<string, string> = {
  // 이미지
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  // 영상
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  // 문서
  '.pdf': 'application/pdf',
};

// 파일 크기 제한 (bytes)
const SIZE_LIMITS: Record<FileType, number> = {
  images: 10 * 1024 * 1024, // 10MB
  videos: 100 * 1024 * 1024, // 100MB
  documents: 50 * 1024 * 1024, // 50MB
};

// 확장자로 파일 타입 결정
function getFileType(extension: string): FileType {
  if (
    ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'].includes(
      extension
    )
  ) {
    return 'images';
  }
  if (['.mp4', '.webm', '.mov'].includes(extension)) {
    return 'videos';
  }
  if (['.pdf'].includes(extension)) {
    return 'documents';
  }
  return 'images'; // 기본값
}

// URL에서 확장자 추출
function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.[a-zA-Z0-9]+(?:\?|$)/);
    if (match) {
      return match[0].replace('?', '').toLowerCase();
    }
  } catch {
    // URL 파싱 실패
  }
  return '.png'; // 기본값
}

// R2 키 생성
function generateKey(
  fileType: FileType,
  contentType: ContentType,
  pageId: string,
  blockId: string,
  extension: string
): string {
  // images/posts/{page_id}/{block_id}.png
  return `${fileType}/${contentType}/${pageId}/${blockId}${extension}`;
}

interface UploadOptions {
  contentType: ContentType;
  pageId: string;
  blockId: string;
  extension?: string;
  skipIfExists?: boolean;
}

interface UploadResult {
  key: string;
  url: string;
}

/**
 * Buffer를 R2에 업로드 (내부 헬퍼)
 */
async function uploadBuffer(
  buffer: Buffer,
  options: UploadOptions & { extension: string }
): Promise<UploadResult> {
  const { contentType, pageId, blockId, extension } = options;
  const fileType = getFileType(extension);

  // 크기 제한 확인
  if (buffer.length > SIZE_LIMITS[fileType]) {
    throw new Error(
      `File size (${buffer.length} bytes) exceeds limit for ${fileType} (${SIZE_LIMITS[fileType]} bytes)`
    );
  }

  // R2 키 생성
  const key = generateKey(fileType, contentType, pageId, blockId, extension);
  const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

  // R2에 업로드
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000', // 1년
    })
  );

  return {
    key,
    url: `${PUBLIC_URL}/${key}`,
  };
}

/**
 * URL에서 파일을 다운로드하여 R2에 업로드
 */
export async function uploadFromUrl(
  sourceUrl: string,
  options: UploadOptions
): Promise<UploadResult> {
  const extension = options.extension || getExtensionFromUrl(sourceUrl);
  const { contentType, pageId, blockId, skipIfExists } = options;
  const fileType = getFileType(extension);
  const key = generateKey(fileType, contentType, pageId, blockId, extension);

  // skipIfExists: 이미 존재하면 스킵
  if (skipIfExists) {
    try {
      await r2Client.send(
        new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        })
      );
      // 존재하면 URL만 반환
      return { key, url: `${PUBLIC_URL}/${key}` };
    } catch {
      // 존재하지 않으면 계속 진행
    }
  }

  // 파일 다운로드
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // 헬퍼 함수로 업로드
  return uploadBuffer(buffer, { ...options, extension });
}

/**
 * R2에서 파일 삭제
 */
export async function deleteFile(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * 퍼블릭 URL 생성
 */
export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
