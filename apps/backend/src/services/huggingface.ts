// Hugging Face Datasets service for file storage and delivery

export interface HuggingFaceConfig {
  token: string;
  datasetRepo: string;
  privateDatasetUrl?: string;
  publicDatasetUrl?: string;
  accessLevel?: 'public' | 'private' | 'gated';
}

export class HuggingFaceService {
  private token: string;
  private datasetRepo: string;
  private privateDatasetUrl?: string;
  private publicDatasetUrl?: string;
  private accessLevel: 'public' | 'private' | 'gated';

  constructor(config: HuggingFaceConfig) {
    this.token = config.token;
    this.datasetRepo = config.datasetRepo;
    this.privateDatasetUrl = config.privateDatasetUrl;
    this.publicDatasetUrl = config.publicDatasetUrl;
    this.accessLevel = config.accessLevel || 'private';
  }

  /**
   * Upload a file to Hugging Face dataset
   */
  async uploadFile(
    fileName: string,
    fileContent: ArrayBuffer,
    commitMessage: string = `Upload ${fileName}`
  ): Promise<{ url: string; path: string }> {
    try {
      const apiUrl = `https://huggingface.co/datasets/${this.datasetRepo}/resolve/main/${fileName}`;
      
      // Create a Blob from the ArrayBuffer
      const blob = new Blob([fileContent]);
      const formData = new FormData();
      formData.append('file', blob, fileName);
      formData.append('commit_message', commitMessage);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upload to Hugging Face: ${error}`);
      }

      const url = this.getPublicUrl(fileName);
      return { url, path: fileName };
    } catch (error) {
      console.error('Hugging Face upload error:', error);
      throw error;
    }
  }

  /**
   * Get download URL for a file (with authentication for private datasets)
   */
  getPublicUrl(fileName: string): string {
    // For private datasets, use authenticated URL with token
    if (this.accessLevel === 'private') {
      return `https://huggingface.co/datasets/${this.datasetRepo}/resolve/main/${fileName}?token=${this.token}`;
    }
    
    // For public/gated datasets, use regular URL
    const baseUrl = this.publicDatasetUrl || this.privateDatasetUrl || `https://huggingface.co/datasets/${this.datasetRepo}/resolve/main`;
    return `${baseUrl}/${fileName}`;
  }

  /**
   * Download a file from Hugging Face dataset
   */
  async downloadFile(fileName: string): Promise<ArrayBuffer> {
    try {
      const url = this.getPublicUrl(fileName);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Hugging Face download error:', error);
      throw error;
    }
  }

  /**
   * Get download URL with access token (for gated datasets)
   */
  getDownloadUrlWithToken(fileName: string): string {
    const baseUrl = this.publicDatasetUrl || this.privateDatasetUrl || `https://huggingface.co/datasets/${this.datasetRepo}/resolve/main`;
    return `${baseUrl}/${fileName}?token=${this.token}`;
  }

  /**
   * Check if a file exists in the dataset
   */
  async fileExists(fileName: string): Promise<boolean> {
    try {
      const url = this.getPublicUrl(fileName);
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Hugging Face file check error:', error);
      return false;
    }
  }

  /**
   * List files in the dataset
   */
  async listFiles(): Promise<string[]> {
    try {
      const apiUrl = `https://huggingface.co/api/datasets/${this.datasetRepo}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
      }

      const data = await response.json() as any;
      // Hugging Face API returns different structures, this is a simplified version
      return data.siblings?.map((file: any) => file.rfilename) || [];
    } catch (error) {
      console.error('Hugging Face list files error:', error);
      return [];
    }
  }

  /**
   * Delete a file from the dataset
   */
  async deleteFile(fileName: string, commitMessage: string = `Delete ${fileName}`): Promise<void> {
    try {
      const apiUrl = `https://huggingface.co/datasets/${this.datasetRepo}/delete/main/${fileName}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commit_message: commitMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Hugging Face delete error:', error);
      throw error;
    }
  }
}

export function createHuggingFaceService(env: any): HuggingFaceService {
  const token = env.HF_TOKEN || env.HUGGINGFACE_API_KEY;
  const datasetRepo = env.HF_DATASET_REPO || env.HUGGINGFACE_DATASET_REPO;
  const privateDatasetUrl = env.HUGGINGFACE_PRIVATE_DATASET_URL;
  const publicDatasetUrl = env.HUGGINGFACE_DATASET_PUBLIC_URL || env.HUGGINGFACE_DATASET_BASE_URL;
  const accessLevel = (env.HF_ACCESS_LEVEL || 'private') as 'public' | 'private' | 'gated';

  if (!token || !datasetRepo) {
    throw new Error('Missing Hugging Face environment variables: HF_TOKEN and HF_DATASET_REPO are required');
  }

  return new HuggingFaceService({
    token,
    datasetRepo,
    privateDatasetUrl,
    publicDatasetUrl,
    accessLevel,
  });
}
