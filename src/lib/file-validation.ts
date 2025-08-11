export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  required?: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Default limits
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  MEDIA: 50 * 1024 * 1024, // 50MB
  DEFAULT: 10 * 1024 * 1024, // 10MB
};

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  VIDEO: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
  MEDIA: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg'],
};

export function validateFile(
  file: File | null | undefined,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = FILE_SIZE_LIMITS.DEFAULT,
    allowedTypes = [],
    required = false,
  } = options;

  // Check if file is required
  if (!file) {
    if (required) {
      return { valid: false, error: 'File is required' };
    }
    return { valid: true };
  }

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { 
      valid: false, 
      error: `File size exceeds maximum limit of ${sizeMB}MB` 
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type '${file.type}' is not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  return { valid: true };
}

export function validateMultipleFiles(
  files: File[],
  options: FileValidationOptions & { maxFiles?: number } = {}
): FileValidationResult {
  const { maxFiles = 10, ...fileOptions } = options;

  // Check number of files
  if (files.length > maxFiles) {
    return { 
      valid: false, 
      error: `Maximum ${maxFiles} files allowed` 
    };
  }

  // Validate each file
  for (let i = 0; i < files.length; i++) {
    const result = validateFile(files[i], fileOptions);
    if (!result.valid) {
      return {
        valid: false,
        error: `File ${i + 1}: ${result.error}`,
      };
    }
  }

  // Check total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxTotalSize = (fileOptions.maxSize || FILE_SIZE_LIMITS.DEFAULT) * maxFiles;
  
  if (totalSize > maxTotalSize) {
    const sizeMB = (maxTotalSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Total file size exceeds maximum limit of ${sizeMB}MB`,
    };
  }

  return { valid: true };
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Server-side validation for Zod schemas
export function createFileValidator(options: FileValidationOptions = {}) {
  return (file: unknown) => {
    if (file instanceof File) {
      const result = validateFile(file, options);
      return result.valid;
    }
    return !options.required;
  };
}
