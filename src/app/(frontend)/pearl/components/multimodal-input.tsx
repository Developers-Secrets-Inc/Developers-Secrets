import React from 'react';

const MultimodalInput: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-200">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default MultimodalInput;
