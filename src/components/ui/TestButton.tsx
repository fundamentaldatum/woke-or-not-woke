import React from "react";

type TestButtonProps = {
  onClick: () => void;
};

const TestButton: React.FC<TestButtonProps> = ({ onClick }) => {
  // Using inline styles to ensure the button is visible
  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: '#ff0000', // Bright red
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: '3px solid white',
    cursor: 'pointer',
    zIndex: 9999, // Very high z-index to ensure visibility
    fontFamily: '"Marcellus", serif'
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      aria-label="Test with blank image"
    >
      test
    </button>
  );
};

export default TestButton;
