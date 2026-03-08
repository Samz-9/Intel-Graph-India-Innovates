import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const MOCK_NODES = [
  { id: '1', position: { x: 250, y: 300 }, data: { label: 'India' }, style: { background: 'var(--color-statusSuccess)', color: '#fff', fontWeight: 'bold' } },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'USA' }, style: { background: 'var(--color-accentBlue)', color: '#fff', fontWeight: 'bold' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'China' }, style: { background: 'var(--color-statusDanger)', color: '#fff', fontWeight: 'bold' } },
  { id: '4', position: { x: 250, y: 50 }, data: { label: 'Russia' }, style: { background: 'var(--color-statusWarning)', color: '#fff', fontWeight: 'bold' } },
];

const MOCK_EDGES = [
  { id: 'e1-2', source: '1', target: '2', label: 'trade_with', animated: true, style: { stroke: 'var(--color-panelBorder)', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', label: 'tension_with', animated: true, style: { stroke: 'var(--color-statusDanger)', strokeWidth: 2 }, labelStyle: { fill: 'var(--color-statusDanger)' } },
  { id: 'e3-4', source: '3', target: '4', label: 'alliance_with', animated: true, style: { stroke: 'var(--color-statusWarning)', strokeWidth: 2 } },
  { id: 'e1-4', source: '1', target: '4', label: 'trade_with', animated: true, style: { stroke: 'var(--color-panelBorder)', strokeWidth: 2 } },
];

export function GraphViewInteractive() {
  const nodes = useMemo(() => MOCK_NODES, []);
  const edges = useMemo(() => MOCK_EDGES, []);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px' }} className="glass-panel">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#8b949e" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
