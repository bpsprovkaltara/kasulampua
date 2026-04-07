export const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, width, height);

        const outputType = 'image/jpeg';
        
        canvas.toBlob((blob) => {
           if (blob) {
               const newFile = new File([blob], file.name ? file.name.replace(/\.[^/.]+$/, "") + ".jpeg" : "upload.jpeg", {
                   type: outputType,
                   lastModified: Date.now()
               });
               resolve(newFile);
           } else {
               reject(new Error('Canvas to Blob conversion failed'));
           }
        }, outputType, quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = readerEvent.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};
