import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFocusTrap } from '../utils/accessibility';

const CommandPalette = ({ isOpen, onClose, projects = [] }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    const commands = [
        { id: 'home', label: 'Go to Home', shortcut: 'G H', action: () => navigate('/') },
        { id: 'projects', label: 'View Projects', shortcut: 'G P', action: () => navigate('/projects') },
        { id: 'experience', label: 'View Experience', shortcut: 'G E', action: () => navigate('/experience') },
        { id: 'resume', label: 'View Resume', shortcut: 'G R', action: () => navigate('/resume') },
        { id: 'certificates', label: 'View Certifications', shortcut: 'G C', action: () => navigate('/certificates') },
        { id: 'skills', label: 'View Skills', shortcut: 'G S', action: () => navigate('/skills') },
        { id: 'about', label: 'View About', shortcut: 'G A', action: () => navigate('/about') },
        { id: 'contact', label: 'Contact Me', shortcut: 'G C', action: () => navigate('/contact') },
    ];

    const projectCommands = projects.slice(0, 5).map((project, index) => ({
        id: `project-${index}`,
        label: `Project: ${project.title || project.name}`,
        shortcut: '',
        action: () => navigate(`/project/${encodeURIComponent(project.title || project.name)}`),
    }));

    const allCommands = [...commands, ...projectCommands];

    const filteredCommands = query
        ? allCommands.filter(cmd =>
            cmd.label.toLowerCase().includes(query.toLowerCase())
        )
        : allCommands;

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && resultsRef.current) {
            createFocusTrap(resultsRef.current);
        }
    }, [isOpen, filteredCommands]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < filteredCommands.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : filteredCommands.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
            };
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" onClick={onClose}>
            <div
                className="command-palette"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
            >
                <div className="command-palette-header">
                    <svg className="command-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="command-palette-input"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        aria-label="Search commands"
                    />
                    <kbd className="command-palette-shortcut">ESC</kbd>
                </div>

                <div className="command-palette-results" ref={resultsRef}>
                    {filteredCommands.length === 0 ? (
                        <div className="command-palette-empty">No results found</div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                className={`command-palette-item ${index === selectedIndex ? 'command-palette-item-selected' : ''}`}
                                onClick={() => {
                                    cmd.action();
                                    onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <span className="command-palette-item-label">{cmd.label}</span>
                                {cmd.shortcut && (
                                    <kbd className="command-palette-item-shortcut">{cmd.shortcut}</kbd>
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="command-palette-footer">
                    <span className="command-palette-hint">
                        <kbd>↑↓</kbd> to navigate
                    </span>
                    <span className="command-palette-hint">
                        <kbd>↵</kbd> to select
                    </span>
                    <span className="command-palette-hint">
                        <kbd>esc</kbd> to close
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;