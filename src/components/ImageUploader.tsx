import React, { useRef } from 'react';

interface Props {
  onImageSelected: (file: File) => void;
  children: React.ReactNode;
}

const ImageUploader: React.FC<Props> = ({ onImageSelected, children }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  return (
    <div onClick={handleClick} className="w-full h-full flex items-center justify-center cursor-pointer">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {children}
    </div>
  );
};

export default ImageUploader;