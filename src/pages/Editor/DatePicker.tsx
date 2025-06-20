import { Timestamp } from 'firebase/firestore';
import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  label: string;
  onChange: (selectedDate: Date | undefined) => void;
  value: Timestamp | undefined;
}

export default function DatePicker({ label = "Select date", onChange, value }: DatePickerProps) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [selectedHours, setSelectedHours] = useState(12);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [isAM, setIsAM] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      const date = value.toDate();
      setScheduledDate(date);
      setSelectedHours(date.getHours() % 12 || 12);
      setSelectedMinutes(date.getMinutes());
      setIsAM(date.getHours() < 12);
    } else {
      setScheduledDate(undefined);
      setSelectedHours(12);
      setSelectedMinutes(0);
      setIsAM(false);
    }
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowTimePicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Format for display
  const formatDisplayDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      isAM ? selectedHours : selectedHours + 12,
      selectedMinutes
    );

    setScheduledDate(newDate);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = () => {
    if (!scheduledDate) return;
    
    const newDate = new Date(
      scheduledDate.getFullYear(),
      scheduledDate.getMonth(),
      scheduledDate.getDate(),
      isAM ? selectedHours : selectedHours + 12,
      selectedMinutes
    );

    setScheduledDate(newDate);
    setIsOpen(false);
    setShowTimePicker(false);
    if (onChange) {
      onChange(newDate);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = getFirstDayOfMonth(year, month);
    
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = scheduledDate && 
        scheduledDate.getDate() === day && 
        scheduledDate.getMonth() === month && 
        scheduledDate.getFullYear() === year;
      
      days.push(
        <div 
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer
            ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderTimePicker = () => {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">HOURS</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSelectedHours(prev => Math.min(prev + 1, 12))}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="text-lg font-medium w-6 text-center">{selectedHours}</span>
              <button 
                onClick={() => setSelectedHours(prev => Math.max(prev - 1, 1))}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">MINUTES</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSelectedMinutes(prev => (prev + 5) % 60)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="text-lg font-medium w-6 text-center">
                {String(selectedMinutes).padStart(2, '0')}
              </span>
              <button 
                onClick={() => setSelectedMinutes(prev => (prev - 5 + 60) % 60)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">AM/PM</span>
            <button 
              onClick={() => setIsAM(!isAM)}
              className="px-2 py-1 bg-gray-100 rounded text-sm font-medium"
            >
              {isAM ? 'AM' : 'PM'}
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowTimePicker(false)}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1"
          >
            Back
          </button>
          <button
            onClick={handleTimeConfirm}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative max-w-sm" ref={calendarRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
        </div>
        <input
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
          placeholder="Select date"
          value={formatDisplayDate(scheduledDate)}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
        />
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-64 bg-white shadow-lg rounded-lg p-4 z-10 border">
          {!showTimePicker ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <button 
                  onClick={previousMonth}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-sm font-medium">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                
                <button 
                  onClick={nextMonth}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="h-6 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
              
              {scheduledDate && (
                <div className="mt-4 pt-2 border-t border-gray-100 text-right">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Done
                  </button>
                </div>
              )}
            </>
          ) : (
            renderTimePicker()
          )}
        </div>
      )}
    </div>
  );
}