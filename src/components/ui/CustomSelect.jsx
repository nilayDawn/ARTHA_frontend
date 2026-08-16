import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  className = '',
  name,
  size = 'md',
  disabled = false,
  title
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format options to object array if passed as strings
  const formattedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt;
    }
    return { label: String(opt), value: opt };
  });

  const selectedOption = formattedOptions.find((opt) => String(opt.value) === String(value));

  const handleSelect = (optionValue) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Simulate standard event object for seamless form integration if name is passed
      const event = {
        target: {
          name: name || '',
          value: optionValue,
        },
      };
      onChange(event);
    }
  };

  const pyClass = size === 'sm' ? 'py-1.5 px-2.5 text-xs' : 'py-2 px-3 text-[13px]';

  return (
    <div className={`relative inline-block w-full ${className}`} ref={dropdownRef} title={title}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${pyClass} bg-[#0D0D0D] border border-white/[0.08] hover:border-white/[0.18] text-neutral-200 rounded-lg flex items-center justify-between gap-2 focus:outline-none focus:border-emerald-500/50 transition-all duration-150 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {/* Options Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[140px] bg-[#0D0D0D] border border-white/[0.1] rounded-lg shadow-2xl py-1 text-xs max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
          {formattedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
