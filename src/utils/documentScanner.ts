export interface DocumentManifest {
  documents: ManifestDocument[];
}

export interface ManifestDocument {
  filename: string;
  title?: string;
  author?: string;
  dynasty?: string;
  type?: string;
  database?: string;
  tags?: string[];
  summary?: string;
  content?: string;
}

export const scanDocumentsFolder = async (): Promise<ManifestDocument[]> => {
  try {
    const response = await fetch('/documents/manifest.json');
    if (!response.ok) {
      return [];
    }
    const manifest: DocumentManifest = await response.json();
    return manifest.documents || [];
  } catch (error) {
    console.warn('Could not load document manifest:', error);
    return [];
  }
};

export const scanPDFFilenames = async (): Promise<string[]> => {
  try {
    const response = await fetch('/documents/files.json');
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const files = data.files || [];
    return files.map((f: { filename: string; title?: string }) => f.filename);
  } catch (error) {
    return [];
  }
};

export const getDocumentUrl = (filename: string): string => {
  return `/documents/${filename}`;
};

export const getDocumentList = async (): Promise<ManifestDocument[]> => {
  return scanDocumentsFolder();
};