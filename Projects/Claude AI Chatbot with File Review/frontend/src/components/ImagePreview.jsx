import { useState } from 'react';

const ImagePreview = ({ src = '', alt = 'image' }) => {
  const [expanded, setExpanded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) return null;

  if (expanded) {
    return (
      <div className="image-expanded-wrapper" onClick={() => setExpanded(false)}>
        <img
          src={src}
          alt={alt}
          className="image-expanded"
          onClick={(e) => e.stopPropagation()}
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div className="image-thumb-wrapper">
      <img
        src={src}
        alt={alt}
        className="image-thumb"
        onClick={() => setExpanded(true)}
        onError={(e) => {
          e.target.style.display = 'none';
          setErrored(true);
        }}
      />
    </div>
  );
};

export default ImagePreview;
