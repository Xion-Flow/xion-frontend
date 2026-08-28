import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Tag, Layers } from 'lucide-react';
import { parseTechStack, formatTechStackToString } from '../utils/techStackParser';

interface VisualTechStackEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  techs: string[];
  newTechInput: string;
}

const PRESET_CATEGORIES = ['Frontend', 'Backend', 'AI / NLP', 'Database', 'RAG / Retrieval', 'DevOps & Cloud', 'Code Analysis', 'Security'];

export const VisualTechStackEditor: React.FC<VisualTechStackEditorProps> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Initialize categories from value string
  useEffect(() => {
    const parsed = parseTechStack(value);
    const items: CategoryItem[] = Object.entries(parsed).map(([name, techs], idx) => ({
      id: `cat-${idx}-${Date.now()}`,
      name,
      techs,
      newTechInput: '',
    }));
    setCategories(items);
  }, []);

  // Synchronize back to string on any change
  const syncChanges = (updated: CategoryItem[]) => {
    setCategories(updated);
    const stackMap: Record<string, string[]> = {};
    for (const item of updated) {
      if (item.name.trim()) {
        stackMap[item.name.trim()] = item.techs.filter(Boolean);
      }
    }
    onChange(formatTechStackToString(stackMap));
  };

  const handleAddCategory = (categoryName: string) => {
    if (!categoryName.trim()) return;
    const trimmed = categoryName.trim();
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return; // Already exists
    }
    const updated = [
      ...categories,
      {
        id: `cat-${Date.now()}-${Math.random()}`,
        name: trimmed,
        techs: [],
        newTechInput: '',
      },
    ];
    syncChanges(updated);
    setCustomCategoryInput('');
    setShowCustomInput(false);
  };

  const handleRemoveCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    syncChanges(updated);
  };

  const handleAddTech = (catId: string) => {
    const updated = categories.map((cat) => {
      if (cat.id === catId && cat.newTechInput.trim()) {
        const newTech = cat.newTechInput.trim();
        if (!cat.techs.includes(newTech)) {
          return {
            ...cat,
            techs: [...cat.techs, newTech],
            newTechInput: '',
          };
        }
        return { ...cat, newTechInput: '' };
      }
      return cat;
    });
    syncChanges(updated);
  };

  const handleRemoveTech = (catId: string, techIndex: number) => {
    const updated = categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          techs: cat.techs.filter((_, idx) => idx !== techIndex),
        };
      }
      return cat;
    });
    syncChanges(updated);
  };

  const handleCategoryNameChange = (catId: string, newName: string) => {
    const updated = categories.map((cat) => (cat.id === catId ? { ...cat, name: newName } : cat));
    syncChanges(updated);
  };

  const handleTechInputChange = (catId: string, val: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === catId ? { ...cat, newTechInput: val } : cat)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Quick Add Preset Category Chips */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'block' }}>
          Add Architecture Categories
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
          {PRESET_CATEGORIES.map((catName) => {
            const isAdded = categories.some((c) => c.name.toLowerCase() === catName.toLowerCase());
            return (
              <button
                key={catName}
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={isAdded}
                onClick={() => handleAddCategory(catName)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  opacity: isAdded ? 0.4 : 1,
                  backgroundColor: isAdded ? 'transparent' : 'var(--bg-surface-secondary)',
                }}
              >
                <Plus size={12} />
                <span>{catName}</span>
              </button>
            );
          })}

          {!showCustomInput ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowCustomInput(true)}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
            >
              <Plus size={12} />
              <span>Custom Category...</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <input
                type="text"
                className="input-field"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', width: '140px' }}
                placeholder="Category Name"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory(customCategoryInput);
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                onClick={() => handleAddCategory(customCategoryInput)}
              >
                Add
              </button>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowCustomInput(false)}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Category Builder Cards */}
      {categories.length === 0 ? (
        <div style={{ padding: '1.25rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Layers size={24} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
          <p style={{ fontSize: '0.8125rem' }}>No tech stack categories defined yet.</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>Click any category button above (e.g. <strong>+ Frontend</strong>) to start building your tech stack!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <Tag size={14} style={{ color: 'var(--accent-primary)' }} />
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                    style={{
                      fontWeight: 800,
                      fontSize: '0.8125rem',
                      color: 'var(--text-primary)',
                      border: 'none',
                      background: 'transparent',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      width: '100%',
                      outline: 'none',
                    }}
                    placeholder="CATEGORY NAME"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-blocked)', padding: '0.25rem', opacity: 0.8 }}
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Added Tech Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.625rem' }}>
                {cat.techs.map((tech, techIdx) => (
                  <span
                    key={`${tech}-${techIdx}`}
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(cat.id, techIdx)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tech Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input-field"
                  style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', flex: 1 }}
                  placeholder={`Add tech to ${cat.name} (e.g. React.js)...`}
                  value={cat.newTechInput}
                  onChange={(e) => handleTechInputChange(cat.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech(cat.id);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  onClick={() => handleAddTech(cat.id)}
                  disabled={!cat.newTechInput.trim()}
                >
                  <Plus size={12} />
                  <span>Add Tech</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
