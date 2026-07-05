import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

function Accordion({ title, badge, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-dark-600/20 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {badge && (
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full font-medium border border-cyan-500/30">
              {badge}
            </span>
          )}
        </div>
        <FiChevronDown
          className={`text-gray-400 text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 border-t border-dark-600/30 pt-4">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
