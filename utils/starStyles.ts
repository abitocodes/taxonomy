const generateStarStyles = () => {
    const colors = ['#bea400', '#ffffff', '#ffff00'];
    const layers = [
      { id: 'stars2', count: 200, size: 2, duration: 100 },
      { id: 'stars3', count: 100, size: 6, duration: 150 },
      { id: 'stars4', count: 500, size: 2, duration: 600 },
    ];
  
    let styles = `.bg-animation {
      position: sticky;
      top: 0;
      width: 100%;
      height: 100%;
    }`;
  
    layers.forEach(layer => {
      const stars = Array.from({ length: layer.count }, () => ({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
  
      styles += `
        #${layer.id} {
          width: ${layer.size}px;
          height: ${layer.size}px;
          background: transparent;
          box-shadow: ${stars.map(star => `${star.x}px ${star.y}px ${star.color}`).join(', ')};
          animation: animStar ${layer.duration}s linear infinite;
        }
        #${layer.id}:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: ${layer.size}px;
          height: ${layer.size}px;
          background: transparent;
          box-shadow: ${stars.map(star => `${star.x}px ${star.y}px ${star.color}`).join(', ')};
        }
      `;
    });
  
    styles += `
      @keyframes animStar {
        from { transform: translateY(0px); }
        to { transform: translateY(-2000px); }
      }
    `;
  
    return styles;
  };
  
  export { generateStarStyles };