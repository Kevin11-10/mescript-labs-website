// Sketchfab API service for 3D model management

export interface SketchfabModel {
  uid: string;
  name: string;
  description: string;
  thumbnails: {
    images: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  viewerUrl: string;
  embedUrl: string;
  isDownloadable: boolean;
  isArchived: boolean;
  publishedAt: string;
}

export class SketchfabService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getModel(modelUid: string): Promise<SketchfabModel | null> {
    try {
      const response = await fetch(
        `https://api.sketchfab.com/v3/models/${modelUid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Sketchfab API error:', error);
      return null;
    }
  }

  getEmbedUrl(modelUid: string, options?: {
    autostart?: boolean;
    autospin?: boolean;
    ui_controls?: boolean;
    ui_infos?: boolean;
  }): string {
    const params = new URLSearchParams();
    
    if (options?.autostart) params.append('autostart', '1');
    if (options?.autospin) params.append('autospin', '1');
    if (options?.ui_controls !== undefined) params.append('ui_controls', options.ui_controls ? '1' : '0');
    if (options?.ui_infos !== undefined) params.append('ui_infos', options.ui_infos ? '1' : '0');

    return `https://sketchfab.com/models/${modelUid}/embed?${params.toString()}`;
  }
}
