import React from "react";
import { motion } from "framer-motion";

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            width: '100%',
            height: '100%',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #f97316',
            borderRadius: '50%'
          }}
        />
        <motion.div
          animate={{ 
            y: [-4, 4, -4],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
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
        </motion.div>
      </div>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
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
      </motion.div>
    </div>
  );
};

export default Loader;
