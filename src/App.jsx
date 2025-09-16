// import { useState } from 'react'
// import { Bot, BrainCircuit, Cpu } from "lucide-react";
// import Card from './Components/Card'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className='mx-10'>
//       <h1 className='text-indigo-500 text-2xl font-semibold'>Hello</h1>

//       <div className="flex gap-6">
//         {/* Card 1 */}
//         <Card
//           icon={<Bot className="w-10 h-10 text-blue-400" />}
//           title="AI WarmUp"
//           subtitle="Kickstart your journey into Artificial Intelligence with simple, engaging, and hands-on learning steps."
//         />

//         {/* Card 2 */}
//         <Card
//           icon={<BrainCircuit className="w-10 h-10 text-green-400" />}
//           title="Machine Learning"
//           subtitle="Explore algorithms that allow computers to learn patterns and make predictions from data."
//         />

//         {/* Card 3 */}
//         <Card
//           icon={<Cpu className="w-10 h-10 text-purple-400" />}
//           title="Neural Networks"
//           subtitle="Understand how deep learning models mimic the human brain to solve complex problems."
//         />
//       </div>
//     </div>
//   )
// }

// export default App


// Deep Seek Approach
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, BrainCircuit, Cpu } from "lucide-react";

const initialCards = [
  {
    id: 1,
    icon: <Bot className="w-10 h-10 text-blue-400" />,
    title: "AI WarmUp",
    subtitle: "Kickstart your journey into Artificial Intelligence with simple, engaging, and hands-on learning steps.",
    color: "blue"
  },
  {
    id: 2,
    icon: <BrainCircuit className="w-10 h-10 text-green-400" />,
    title: "Machine Learning",
    subtitle: "Explore algorithms that allow computers to learn patterns and make predictions from data.",
    color: "green"
  },
  {
    id: 3,
    icon: <Cpu className="w-10 h-10 text-purple-400" />,
    title: "Neural Networks",
    subtitle: "Understand how deep learning models mimic the human brain to solve complex problems.",
    color: "purple"
  },
];

function Card({ icon, title, subtitle, color, isDragging, onMouseMove, onMouseLeave }) {
  const colorClasses = {
    blue: "border-blue-500/20",
    green: "border-green-500/20",
    purple: "border-purple-500/20"
  };

  return (
    <div 
      className={`border-2 max-w-[420px] bg-neutral-900 text-white rounded-2xl shadow-lg p-10 flex flex-col items-start gap-6 relative overflow-hidden ${colorClasses[color]}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Glare effect */}
      <div className="glare-effect absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"></div>
      
      {/* Logo */}
      <div className="bg-neutral-800 p-4 rounded-full flex items-center justify-center relative z-10">
        {icon}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold relative z-10">{title}</h2>

      {/* Subtitle */}
      <p className="text-neutral-400 relative z-10">{subtitle}</p>
      
      {/* Swipe hint */}
      {!isDragging && (
        <motion.div 
          className="absolute bottom-4 right-4 text-xs text-neutral-600 z-10"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ← Swipe any direction →
        </motion.div>
      )}
    </div>
  );
}

function App() {
  const [cards, setCards] = useState(initialCards);
  const [dragDirection, setDragDirection] = useState({ x: 0, y: 0 });
  const cardRefs = useRef([]);

  const handleDrag = (event, info) => {
    setDragDirection({ x: info.offset.x, y: info.offset.y });
  };

  const handleDragEnd = (event, info, card) => {
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    if (distance > 150) {
      // Calculate angle to determine direction
      const angle = Math.atan2(offsetY, offsetX) * 180 / Math.PI;
      
      // Animate out, then reorder stack
      setCards((prev) => {
        const rest = prev.filter((c) => c.id !== card.id);
        return [...rest, card]; // send swiped card to bottom
      });
    }
    
    setDragDirection({ x: 0, y: 0 });
  };

  const handleMouseMove = (e, index) => {
    // Only apply to the top card
    if (index !== 0) return;
    
    const card = cardRefs.current[index];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleX = (y - centerY) / 10;
    const angleY = (centerX - x) / 10;
    
    // Apply slight rotation based on cursor position
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
    
    // Calculate glare position (white gradient)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    const glare = card.querySelector('.glare-effect');
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`;
      glare.style.opacity = '1';
    }
  };

  const handleMouseLeave = (index) => {
    // Only apply to the top card
    if (index !== 0) return;
    
    const card = cardRefs.current[index];
    if (!card) return;
    
    // Reset transformations
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    
    const glare = card.querySelector('.glare-effect');
    if (glare) {
      glare.style.opacity = '0';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-indigo-400 text-4xl font-bold mb-4">3D Card Swipe</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Swipe cards in any direction to explore. Cards move in 3D space with realistic physics.
        </p>
      </div>

      <div className="relative w-[420px] h-[360px]">
        <AnimatePresence>
          {cards.map((card, index) => {
            const scale = 1 - index * 0.05;
            const translateY = index * 15;
            const zIndex = cards.length - index;
            const rotateX = index * -1; // Slight perspective effect

            return (
              <motion.div
                key={card.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDrag={handleDrag}
                onDragEnd={(e, info) => handleDragEnd(e, info, card)}
                className="absolute top-0 left-0 origin-center transition-transform duration-300 ease-out"
                style={{
                  zIndex,
                  scale,
                  y: translateY,
                  rotate: rotateX,
                }}
                ref={el => cardRefs.current[index] = el}
                whileDrag={{
                  rotateZ: dragDirection.x * 0.05,
                  rotateX: dragDirection.y * 0.03,
                  scale: 1.02,
                  transition: { duration: 0.1 }
                }}
                exit={{
                  opacity: 0,
                  x: dragDirection.x * 5,
                  y: dragDirection.y * 5,
                  rotateZ: dragDirection.x * 0.1,
                  transition: { duration: 0.5 },
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: translateY,
                  rotateZ: 0,
                  rotateX: rotateX,
                  transition: { 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 15,
                  }
                }}
                initial={false}
              >
                <Card
                  icon={card.icon}
                  title={card.title}
                  subtitle={card.subtitle}
                  color={card.color}
                  isDragging={dragDirection.x !== 0 || dragDirection.y !== 0}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center text-neutral-500 text-sm">
        <p>Drag cards in any direction to swipe. Cards will fly away with 3D rotation effects.</p>
        <p className="mt-2">Hover over the top card to see the glare effect.</p>
      </div>

      <style jsx>{`
        .glare-effect {
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default App;