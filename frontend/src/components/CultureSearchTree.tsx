import React, { useEffect, useState } from 'react';
import API from '../api/axios';

interface CultureNode {
  id: number;
  name: string;
  children?: CultureNode[];
}

interface CategoryTree {
  category: string;
  items: CultureNode[];
}

interface Props {
  onSelect: (culture: CultureNode) => void;
}

const CultureSearchTree: React.FC<Props> = ({ onSelect }) => {
  const [tree, setTree] = useState<CategoryTree[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/cultures/tree-by-categories')
      .then(res => setTree(res.data))
      .catch(err => {
        console.error('Ошибка загрузки иерархии культур', err);
        setTree([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: CultureNode, depth = 0) => (
    <div key={node.id} style={{ marginLeft: depth * 16 }} className="py-1">
      <div className="flex items-center gap-2">
        {node.children && node.children.length > 0 ? (
          <button onClick={() => toggle(node.id)} className="text-gray-500">
            {expanded[node.id] ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <button
          onClick={() => onSelect(node)}
          className="text-left text-blue-700 hover:underline"
        >
          {node.name}
        </button>
      </div>
      {expanded[node.id] &&
        node.children &&
        node.children.map((child) => renderNode(child, depth + 1))}
    </div>
  );

  if (loading) {
    return <div className="p-4 text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="bg-white border p-4 rounded shadow max-h-[400px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">🌿 Поиск культуры</h3>
      {tree.length === 0 && <div className="text-gray-400">Нет данных</div>}
      {tree.map((category, index) => (
        <div key={category.category || index} className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-1">{category.category}</h4>
          <div className="ml-2">
            {category.items.map((node) => renderNode(node))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CultureSearchTree;
