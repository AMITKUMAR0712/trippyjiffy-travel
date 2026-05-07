import React from "react";

const Loader = ({ text = "Exploring India's 4th Dimension..." }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '60px 20px',
      width: '100%',
      gap: '24px'
    }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #f97316',
            borderRadius: '50%'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '28px',
            color: '#f97316'
          }}
        >
          <i className="fas fa-paper-plane"></i>
        </div>
      </div>
      <div
        style={{
          fontWeight: '700',
          color: '#334155',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontSize: '12px',
          textAlign: 'center'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Loader;
