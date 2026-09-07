'use client';

import React, { useState, useEffect } from 'react';
import { BackendType } from '../types';
import { BACKEND_CONFIG, getActiveBackend, setActiveBackend } from '../services/api';
import { Server, Check } from 'lucide-react';

export const BackendSwitcher = () => {
  const [active, setActive] = useState<BackendType>('springboot');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActive(getActiveBackend());
  }, []);

  const handleSelect = (backend: BackendType) => {
    setActive(backend);
    setActiveBackend(backend);
    setIsOpen(false);
  };

  return (
    <div className="backend-switcher-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="backend-switcher-btn"
        title="Switch API Backend"
      >
        <Server size={14} />
        <span className="backend-label">
          {active === 'springboot' && 'Spring Boot (:8080)'}
          {active === 'node' && 'Node.js (:5000)'}
          {active === 'go' && 'Go Gin (:8081)'}
        </span>
      </button>

      {isOpen && (
        <div className="backend-dropdown-menu">
          <div className="dropdown-header">Active Backend API</div>
          {(Object.keys(BACKEND_CONFIG) as BackendType[]).map((key) => {
            const cfg = BACKEND_CONFIG[key];
            const isSelected = active === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`dropdown-item ${isSelected ? 'active' : ''}`}
              >
                <div className="dropdown-item-info">
                  <div className="dropdown-item-name">{cfg.name}</div>
                  <div className="dropdown-item-url">{cfg.url}</div>
                </div>
                {isSelected && <Check size={16} className="check-icon" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
