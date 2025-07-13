import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl'
};

export function Logo({ size = 'md', showText = true, animated = true, className = '' }: LogoProps) {
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  const LogoIcon = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Outer glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-sm opacity-30"></div>
      
      {/* Main logo shape */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        {/* Inner light effect */}
        <div className="w-3/4 h-3/4 bg-gradient-to-br from-white/30 to-transparent rounded-full flex items-center justify-center">
          {/* Core symbol - stylized "L" for Lumo */}
          <div className="w-1/2 h-3/4 relative">
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-white rounded-sm"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white rounded-sm"></div>
            {/* AI dot indicator */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {animated ? (
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="cursor-pointer"
        >
          <LogoIcon />
        </motion.div>
      ) : (
        <LogoIcon />
      )}
      
      {showText && (
        <motion.div
          variants={animated ? textVariants : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
          className="flex items-center"
        >
          <span className={`font-bold gradient-text ${textSizeClasses[size]}`}>
            Lumo
          </span>
          <span className={`font-light text-muted-foreground ${textSizeClasses[size]} ml-0.5`}>
            .AI
          </span>
        </motion.div>
      )}
    </div>
  );
}

export function LogoMark({ size = 'md', animated = true, className = '' }: Omit<LogoProps, 'showText'>) {
  return <Logo size={size} showText={false} animated={animated} className={className} />;
}
