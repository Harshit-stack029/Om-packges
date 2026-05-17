import { useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

/**
 * ImageUploader — handles two image sources:
 *   existing: [{ url, publicId }]  — from server (edit mode)
 *   newFiles: [{ file: File, preview: string }]  — locally selected files
 *
 * Props:
 *   existing       – array of {url, publicId}
 *   newFiles       – array of {file, preview}
 *   onExistingRemove(publicId)
 *   onNewRemove(index)
 *   onFilesAdd(files: File[])
 *   maxImages      – default 8
 */
const ImageUploader = ({
  existing = [],
  newFiles = [],
  onExistingRemove,
  onNewRemove,
  onFilesAdd,
  maxImages = 8,
}) => {
  const inputRef = useRef(null);
  const totalImages = existing.length + newFiles.length;
  const canAddMore = totalImages < maxImages;

  const handleDrop = (e) => {
    e.preventDefault();
    if (!canAddMore) return;
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length) onFilesAdd(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesAdd(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Image grid */}
      {(existing.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-4 gap-3">
          {existing.map((img) => (
            <div key={img.publicId} className="relative group aspect-square rounded-lg overflow-hidden bg-light-gray border border-[#E5E7EB]">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onExistingRemove(img.publicId)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} className="text-white" />
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] text-center py-0.5">
                Saved
              </span>
            </div>
          ))}
          {newFiles.map((item, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-light-gray border-2 border-orange border-dashed">
              <img src={item.preview} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onNewRemove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} className="text-white" />
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-orange/70 text-white text-[10px] text-center py-0.5">
                New
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore ? (
        <div
          className="border-2 border-dashed border-[#E5E7EB] hover:border-orange rounded-xl p-8 text-center cursor-pointer transition-colors group"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={28} className="mx-auto mb-2 text-om-gray group-hover:text-orange transition-colors" />
          <p className="text-sm text-dark-gray font-medium">
            Drop images here or <span className="text-orange">browse</span>
          </p>
          <p className="text-xs text-om-gray mt-1">
            JPG, PNG, WebP · Max 5MB · {totalImages}/{maxImages} added
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 bg-orange/10 rounded-lg text-sm text-orange">
          <Image size={16} />
          Maximum {maxImages} images reached.
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
