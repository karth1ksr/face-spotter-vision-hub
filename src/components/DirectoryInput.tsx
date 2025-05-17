
import React, { useRef } from 'react';

interface DirectoryInputProps {
  onChange: (files: FileList | null) => void;
  className?: string;
  children?: React.ReactNode;
}

const DirectoryInput: React.FC<DirectoryInputProps> = ({ onChange, className, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      <input
        ref={inputRef}
        type="file"
        // @ts-ignore - These are non-standard attributes but work in modern browsers
        webkitdirectory=""
        directory=""
        multiple
        onChange={(e) => onChange(e.target.files)}
        className="hidden"
      />
      {children}
    </div>
  );
};

export default DirectoryInput;
