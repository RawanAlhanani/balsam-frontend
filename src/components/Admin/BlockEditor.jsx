import React, { useState, useEffect } from 'react';
import './BlockEditor.css';

const BlockEditor = ({ value, onChange, placeholder = 'Start writing your content...' }) => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if (value && value.sections) {
            setBlocks(value.sections);
        } else if (value) {
            // Handle legacy format
            setBlocks([{
                id: 'legacy-block',
                type: 'paragraph',
                content: typeof value === 'string' ? value : ''
            }]);
        }
    }, [value]);

    const handleChange = (newBlocks) => {
        setBlocks(newBlocks);
        onChange({ sections: newBlocks });
    };

    const addBlock = (type, afterIndex = null) => {
        const newBlock = {
            id: `block-${Date.now()}`,
            type: type,
            content: '',
            ...(type === 'heading' && { level: 3 }),
            ...(type === 'list' && { listType: 'bullet', items: [''] })
        };

        let newBlocks;
        if (afterIndex !== null) {
            newBlocks = [...blocks.slice(0, afterIndex + 1), newBlock, ...blocks.slice(afterIndex + 1)];
        } else {
            newBlocks = [...blocks, newBlock];
        }
        handleChange(newBlocks);
    };

    const updateBlock = (index, updates) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...updates };
        handleChange(newBlocks);
    };

    const deleteBlock = (index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        handleChange(newBlocks);
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...blocks];
        const newIndex = index + direction;
        
        if (newIndex >= 0 && newIndex < newBlocks.length) {
            [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
            handleChange(newBlocks);
        }
    };

    const addListItem = (blockIndex) => {
        const newBlocks = [...blocks];
        newBlocks[blockIndex].items.push('');
        handleChange(newBlocks);
    };

    const updateListItem = (blockIndex, itemIndex, value) => {
        const newBlocks = [...blocks];
        newBlocks[blockIndex].items[itemIndex] = value;
        handleChange(newBlocks);
    };

    const deleteListItem = (blockIndex, itemIndex) => {
        const newBlocks = [...blocks];
        newBlocks[blockIndex].items = newBlocks[blockIndex].items.filter((_, i) => i !== itemIndex);
        handleChange(newBlocks);
    };

    const renderBlock = (block, index) => {
        switch (block.type) {
            case 'heading':
                return (
                    <div key={block.id} className="block-editor-block block-heading">
                        <div className="block-controls">
                            <select 
                                value={block.level || 3}
                                onChange={(e) => updateBlock(index, { level: parseInt(e.target.value) })}
                                className="form-control form-control-sm"
                                style={{ width: '100px' }}
                            >
                                <option value={1}>H1</option>
                                <option value={2}>H2</option>
                                <option value={3}>H3</option>
                                <option value={4}>H4</option>
                                <option value={5}>H5</option>
                                <option value={6}>H6</option>
                            </select>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => moveBlock(index, -1)}
                                disabled={index === 0}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move up"
                            >
                                ↑
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => moveBlock(index, 1)}
                                disabled={index === blocks.length - 1}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move down"
                            >
                                ↓
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => deleteBlock(index)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                        <input
                            type="text"
                            value={block.content || ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            placeholder="Heading text..."
                            className="form-control"
                            style={{ 
                                fontSize: `${2.2 - (block.level - 1) * 0.2}rem`,
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        />
                        <div className="block-add-buttons">
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('paragraph', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + Paragraph
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('heading', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + Heading
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('list', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + List
                            </button>
                        </div>
                    </div>
                );

            case 'paragraph':
                return (
                    <div key={block.id} className="block-editor-block block-paragraph">
                        <div className="block-controls">
                            <button 
                                type="button" // Added type="button"
                                onClick={() => moveBlock(index, -1)}
                                disabled={index === 0}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move up"
                            >
                                ↑
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => moveBlock(index, 1)}
                                disabled={index === blocks.length - 1}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move down"
                            >
                                ↓
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => deleteBlock(index)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                        <textarea
                            value={block.content || ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            placeholder="Write your paragraph here..."
                            className="form-control"
                            rows={4}
                            style={{ marginTop: '10px' }}
                        />
                        <div className="block-add-buttons">
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('paragraph', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + Paragraph
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('heading', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + Heading
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('list', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + List
                            </button>
                        </div>
                    </div>
                );

            case 'list':
                return (
                    <div key={block.id} className="block-editor-block block-list">
                        <div className="block-controls">
                            <select 
                                value={block.listType || 'bullet'}
                                onChange={(e) => updateBlock(index, { listType: e.target.value })}
                                className="form-control form-control-sm"
                                style={{ width: '120px' }}
                            >
                                <option value="bullet">Bullet List</option>
                                <option value="number">Numbered List</option>
                            </select>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => moveBlock(index, -1)}
                                disabled={index === 0}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move up"
                            >
                                ↑
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => moveBlock(index, 1)}
                                disabled={index === blocks.length - 1}
                                className="btn btn-sm btn-outline-secondary"
                                title="Move down"
                            >
                                ↓
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => deleteBlock(index)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                        <div className="list-items" style={{ marginTop: '10px' }}>
                            {(block.items || ['']).map((item, itemIndex) => (
                                <div key={itemIndex} className="list-item">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateListItem(index, itemIndex, e.target.value)}
                                        placeholder={`List item ${itemIndex + 1}`}
                                        className="form-control"
                                    />
                                    <button 
                                        type="button" // Added type="button"
                                        onClick={() => deleteListItem(index, itemIndex)}
                                        className="btn btn-sm btn-outline-danger"
                                        disabled={block.items.length <= 1}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addListItem(index)}
                                className="btn btn-sm btn-outline-success"
                                style={{ marginTop: '5px' }}
                            >
                                + Add Item
                            </button>
                        </div>
                        <div className="block-add-buttons">
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('paragraph', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + Paragraph
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('heading', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + Heading
                            </button>
                            <button 
                                type="button" // Added type="button"
                                onClick={() => addBlock('list', index)}
                                className="btn btn-sm btn-outline-primary"
                            >
                                + List
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="block-editor">
            <div className="block-editor-header">
                <h5>Content Editor</h5>
                <div className="block-add-buttons">
                    <button 
                        type="button" // Added type="button"
                        onClick={() => addBlock('heading')}
                        className="btn btn-sm btn-primary"
                    >
                        + Add Heading
                    </button>
                    <button 
                        type="button" // Added type="button"
                        onClick={() => addBlock('paragraph')}
                        className="btn btn-sm btn-primary"
                    >
                        + Add Paragraph
                    </button>
                    <button 
                        type="button" // Added type="button"
                        onClick={() => addBlock('list')}
                        className="btn btn-sm btn-primary"
                    >
                        + Add List
                    </button>
                </div>
            </div>
            
            {blocks.length === 0 ? (
                <div className="block-editor-empty">
                    <p>{placeholder}</p>
                    <div className="block-add-buttons">
                        <button 
                            type="button" // Added type="button"
                            onClick={() => addBlock('heading')}
                            className="btn btn-sm btn-outline-primary"
                        >
                            + Start with Heading
                        </button>
                        <button 
                            type="button" // Added type="button"
                            onClick={() => addBlock('paragraph')}
                            className="btn btn-sm btn-outline-primary"
                        >
                            + Start with Paragraph
                        </button>
                    </div>
                </div>
            ) : (
                <div className="block-editor-content">
                    {blocks.map((block, index) => renderBlock(block, index))}
                </div>
            )}
        </div>
    );
};

export default BlockEditor;