'use client';

import React, { useState } from 'react';

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7L12 2.5L9 12L7.5 8L2 7Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" strokeLinejoin="round" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 6.5L6.5 10.5C5.4 11.6 3.6 11.6 2.5 10.5C1.4 9.4 1.4 7.6 2.5 6.5L7.5 1.5C8.3 0.7 9.7 0.7 10.5 1.5C11.3 2.3 11.3 3.7 10.5 4.5L5.5 9.5C5.1 9.9 4.4 9.9 4 9.5C3.6 9.1 3.6 8.4 4 8L8 4" />
    </svg>
  );
}

export function MessageComposer() {
  const [value, setValue] = useState('');

  return (
    <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid #e4ded4' }}>
      <div
        className="flex items-end gap-2 rounded-xl px-3 py-2.5 transition-all duration-200"
        style={{
          background: '#faf7f2',
          border: '1px solid #e4ded4',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.4)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02), 0 0 0 3px rgba(200, 169, 110, 0.06)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e4ded4';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
        }}
      >
        {/* Attach button */}
        <button
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-150 mb-0.5"
          style={{ color: '#b5b0a8' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#7a756e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#b5b0a8'; }}
          title="Attach file"
        >
          <AttachIcon />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask the Campaign Director or provide instructions..."
          className="flex-1 bg-transparent text-[12.5px] leading-relaxed resize-none outline-none placeholder:text-[#c0bbb4]"
          style={{ color: '#2c2c2c', minHeight: '20px', maxHeight: '80px', fontFamily: 'var(--font-body)' }}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 80) + 'px';
          }}
        />
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 mb-0.5"
          style={{
            background: value.trim() ? 'linear-gradient(135deg, #c8a96e, #a68b4b)' : 'rgba(228, 222, 212, 0.6)',
            color: value.trim() ? '#fff' : '#c0bbb4',
            boxShadow: value.trim() ? '0 2px 6px rgba(166, 139, 75, 0.3)' : 'none',
          }}
          disabled={!value.trim()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
