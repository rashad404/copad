import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  compress?: number; // 0-1, where 1 is best quality
  format?: 'jpeg' | 'png';
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  compress: 0.8,
  format: 'jpeg',
};

export async function optimizeImage(
  uri: string,
  options: OptimizeOptions = {}
): Promise<{ uri: string; width: number; height: number; size: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Get original image info
    const originalInfo = await FileSystem.getInfoAsync(uri);
    const originalSize = (originalInfo as any).size || 0;
    
    console.log(`Original image size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    
    // Prepare manipulations
    const actions: ImageManipulator.Action[] = [];
    
    // Resize if needed (maintains aspect ratio)
    if (opts.maxWidth && opts.maxHeight) {
      actions.push({
        resize: {
          width: opts.maxWidth,
          height: opts.maxHeight,
        },
      });
    }
    
    // Apply manipulations
    const result = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      {
        compress: opts.compress,
        format: opts.format === 'png' 
          ? ImageManipulator.SaveFormat.PNG 
          : ImageManipulator.SaveFormat.JPEG,
      }
    );
    
    // Get optimized image info
    const optimizedInfo = await FileSystem.getInfoAsync(result.uri);
    const optimizedSize = (optimizedInfo as any).size || 0;
    
    console.log(`Optimized image size: ${(optimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Size reduction: ${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`);
    
    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      size: optimizedSize,
    };
  } catch (error) {
    console.error('Image optimization failed:', error);
    // Return original if optimization fails
    return {
      uri,
      width: 0,
      height: 0,
      size: 0,
    };
  }
}

export async function optimizeImages(
  images: Array<{ uri: string; name: string; type: string }>,
  options: OptimizeOptions = {}
): Promise<Array<{ uri: string; name: string; type: string; size?: number }>> {
  const optimizedImages = await Promise.all(
    images.map(async (image) => {
      // Only optimize actual image files
      if (!image.type || !image.type.startsWith('image/')) {
        return image;
      }
      
      try {
        const optimized = await optimizeImage(image.uri, options);
        
        // Update file extension if format changed
        let name = image.name;
        if (options.format && options.format !== 'png' && image.name.toLowerCase().endsWith('.png')) {
          name = image.name.replace(/\.png$/i, '.jpg');
        }
        
        return {
          ...image,
          uri: optimized.uri,
          name,
          type: options.format === 'png' ? 'image/png' : 'image/jpeg',
          size: optimized.size,
        };
      } catch (error) {
        console.error(`Failed to optimize image ${image.name}:`, error);
        return image;
      }
    })
  );
  
  return optimizedImages;
}

// Profile-specific optimization presets
export const OPTIMIZATION_PRESETS = {
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    compress: 0.7,
    format: 'jpeg' as const,
  },
  chat: {
    maxWidth: 1280,
    maxHeight: 1280,
    compress: 0.8,
    format: 'jpeg' as const,
  },
  highQuality: {
    maxWidth: 1920,
    maxHeight: 1920,
    compress: 0.9,
    format: 'jpeg' as const,
  },
  medical: {
    maxWidth: 2048,
    maxHeight: 2048,
    compress: 0.85,
    format: 'jpeg' as const,
  },
  // Aggressive optimization for very large files
  aggressive: {
    maxWidth: 1024,
    maxHeight: 1024,
    compress: 0.6,
    format: 'jpeg' as const,
  },
};