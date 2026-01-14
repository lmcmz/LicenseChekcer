
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { DependencyAudit, RiskLevel } from '../types';
import * as d3Hierarchy from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
import 'd3-transition';
import { Info, ExternalLink, ZoomIn, ZoomOut, Maximize, MousePointer2, X, Globe, Github } from 'lucide-react';

interface VisualTreeProps {
  audits: DependencyAudit[];
}

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.SAFE: return '#10b981';
    case RiskLevel.CAUTION: return '#f59e0b';
    case RiskLevel.HIGH: return '#f43f5e';
    default: return '#94a3b8';
  }
};

const VisualTree: React.FC<VisualTreeProps> = ({ audits }) => {
  const [selectedNode, setSelectedNode] = useState<DependencyAudit | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const rootData = useMemo(() => ({
    name: "Project Root",
    version: "",
    license: "N/A",
    riskLevel: RiskLevel.UNKNOWN,
    reason: "Primary entry point",
    isFriendly: true,
    children: audits
  }), [audits]);

  const treeLayoutData = useMemo(() => {
    const root = d3Hierarchy.hierarchy(rootData);
    const layout = d3Hierarchy.tree<any>().nodeSize([80, 240]);
    return layout(root);
  }, [rootData]);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svgElement = select(svgRef.current);
    const gElement = select(gRef.current);

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        gElement.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svgElement.call(zoomBehavior as any);

    const initialTransform = zoomIdentity.translate(100, 350).scale(0.8);
    svgElement.call(zoomBehavior.transform as any, initialTransform);

    return () => {
      svgElement.on('.zoom', null);
    };
  }, []);

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    select(svgRef.current).transition().call(zoom().scaleBy as any, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    select(svgRef.current).transition().call(zoom().scaleBy as any, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    select(svgRef.current).transition().call(zoom().transform as any, zoomIdentity.translate(100, 350).scale(0.8));
  };

  const nodes = treeLayoutData.descendants();
  const links = treeLayoutData.links();

  const isGitHub = (url?: string) => url?.toLowerCase().includes('github.com');

  return (
    <div className="relative w-full h-[700px] bg-[#f8f9fa] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner group">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
          <MousePointer2 className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-nowrap">Drag to Pan • Scroll to Zoom</span>
        </div>
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-nowrap">Zoom: {Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={handleResetZoom} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400">
          <Maximize className="w-5 h-5" />
        </button>
      </div>
      
      <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing outline-none">
        <g ref={gRef}>
          {links.map((link, i) => (
            <path
              key={`link-${i}`}
              d={linkHorizontal<any, any>()
                .x(d => d.y)
                .y(d => d.x)({
                  source: link.source,
                  target: link.target
                }) || undefined}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4"
            />
          ))}
          {nodes.map((node, i) => (
            <g
              key={`node-${i}`}
              transform={`translate(${node.y},${node.x})`}
              onClick={() => setSelectedNode(node.data)}
              className="cursor-pointer group/node"
            >
              <circle
                r="6"
                fill={getRiskColor(node.data.riskLevel)}
                stroke="#fff"
                strokeWidth="2"
                className="group-hover/node:r-8 transition-all"
              />
              <text
                dy=".31em"
                x={node.children ? -12 : 12}
                style={{
                  textAnchor: node.children ? 'end' : 'start',
                  fontSize: '11px',
                  fontWeight: 800,
                  fill: 'currentColor'
                }}
                className="text-slate-900 dark:text-slate-200"
              >
                {node.data.name}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {selectedNode && (
        <div className="absolute top-4 right-4 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mb-4">
            <h4 className="font-black text-slate-900 dark:text-white pr-6">{selectedNode.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono">v{selectedNode.version}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black rounded-lg border border-blue-100 dark:border-blue-800 uppercase tracking-tight">
              {selectedNode.license}
            </span>
            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase border tracking-tight ${
              selectedNode.riskLevel === RiskLevel.SAFE ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
              selectedNode.riskLevel === RiskLevel.CAUTION ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 
              'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
            }`}>
              {selectedNode.riskLevel}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Reasoning</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedNode.reason}
              </p>
            </div>
            
            {selectedNode.repository && (
              <a 
                href={selectedNode.repository} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors uppercase tracking-widest"
              >
                {isGitHub(selectedNode.repository) ? <Github className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                View Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualTree;
