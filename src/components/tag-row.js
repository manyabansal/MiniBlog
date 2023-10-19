import React, { useEffect, useRef } from 'react';
import './css/tag-row.css';

export default function TagRow({ tags }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const containerHeight = container.offsetHeight;
    
    if (containerHeight > 18) {
      const tags = container.querySelectorAll('.tag');
      tags.forEach(tag => {
        tag.style.display = 'inline-block';
        tag.style.marginBottom='5px';
  
      });
    }
  }, []);

  return (
    <div className="tags-container" ref={containerRef}>
    {tags.map((tag, index) => {
      return (
        <span
          key={index}
          className="tag"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </span>
      );
    })}
  </div>
  )
}