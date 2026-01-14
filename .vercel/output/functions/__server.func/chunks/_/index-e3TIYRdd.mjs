import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { R as RiskLevel, K as KNOWN_PACKAGES, C as COMMON_LICENSES } from "./localDatabase-DDum4fks.mjs";
import * as d3Hierarchy from "d3-hierarchy";
import { linkHorizontal } from "d3-shape";
import { zoom, zoomIdentity } from "d3-zoom";
import { select } from "d3-selection";
import { c as createLucideIcon, X, G as Github } from "./router-sHqUyFtU.mjs";
import { A as ArrowRight, I as Info, G as Globe } from "./info.mjs";
import "@tanstack/react-router";
import "i18next";
import "@tanstack/react-query";
import "@vercel/analytics/react";
const __iconNode$g = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$g);
const __iconNode$f = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$f);
const __iconNode$e = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$e);
const __iconNode$d = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$d);
const __iconNode$c = [
  ["path", { d: "M12 13v8l-4-4", key: "1f5nwf" }],
  ["path", { d: "m12 21 4-4", key: "1lfcce" }],
  ["path", { d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284", key: "ui1hmy" }]
];
const CloudDownload = createLucideIcon("cloud-download", __iconNode$c);
const __iconNode$b = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$b);
const __iconNode$a = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$a);
const __iconNode$9 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$9);
const __iconNode$8 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$8);
const __iconNode$7 = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
];
const Maximize = createLucideIcon("maximize", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
      key: "edeuup"
    }
  ]
];
const MousePointer2 = createLucideIcon("mouse-pointer-2", __iconNode$6);
const __iconNode$5 = [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
];
const Network = createLucideIcon("network", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomIn = createLucideIcon("zoom-in", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomOut = createLucideIcon("zoom-out", __iconNode);
const auditDependenciesWithBackend = async (dependencies) => {
  if (dependencies.length === 0) return [];
  try {
    const response = await fetch("/api/audit-licenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ dependencies })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to audit dependencies");
    }
    return result.data || [];
  } catch (error) {
    console.error("Audit error:", error);
    throw error;
  }
};
const NON_DEP_KEYS = /* @__PURE__ */ new Set([
  "name",
  "version",
  "description",
  "scripts",
  "type",
  "main",
  "module",
  "exports",
  "author",
  "license",
  "engines",
  "private",
  "keywords",
  "repository",
  "bugs",
  "homepage",
  "devDependencies",
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
  "workspaces",
  "publishConfig",
  "dependenciesMeta",
  "bundleDependencies",
  "bundledDependencies",
  "cpu",
  "os"
]);
const parseDependencies = (input) => {
  const results = [];
  const trimmedInput = input.trim();
  try {
    const json = JSON.parse(trimmedInput);
    const npmKeys = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
    let found = false;
    npmKeys.forEach((key) => {
      if (json[key] && typeof json[key] === "object") {
        found = true;
        for (const [name, version] of Object.entries(json[key])) {
          if (typeof version === "string") results.push({ name, version });
        }
      }
    });
    if (json.dependencies && typeof json.dependencies === "object" && !found) {
      found = true;
      Object.entries(json.dependencies).forEach(([name, data]) => {
        if (data.version) {
          results.push({ name, version: data.version });
        }
      });
    }
    if (json.packages && typeof json.packages === "object" && !found) {
      found = true;
      Object.entries(json.packages).forEach(([path, data]) => {
        if (path && path !== "" && data.version) {
          const name = path.replace(/^node_modules\//, "");
          if (name && !name.includes("/node_modules/")) {
            results.push({ name, version: data.version });
          }
        }
      });
    }
    if ((json.default || json._meta) && !found) {
      found = true;
      const packages = json.default || {};
      Object.entries(packages).forEach(([name, data]) => {
        if (data.version) {
          results.push({ name, version: data.version.replace(/^==/, "") });
        }
      });
    }
    if (json.packages && Array.isArray(json.packages) && !found) {
      found = true;
      json.packages.forEach((pkg) => {
        if (pkg.name && pkg.version) {
          results.push({ name: pkg.name, version: pkg.version });
        }
      });
    }
    if (json.pins && Array.isArray(json.pins)) {
      found = true;
      json.pins.forEach((pin) => {
        results.push({
          name: pin.identity || pin.package || getBaseName(pin.location),
          version: pin.state?.version || "latest"
        });
      });
    }
    if (found) return results;
  } catch (e) {
  }
  let match;
  const yarnLockRegex = /"?([^@\s"]+)@[^:]*:\s*version\s+"([^"]+)"/g;
  while ((match = yarnLockRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  if (results.length > 0) return results;
  const cargoLockRegex = /name\s*=\s*"([^"]+)"[\s\S]{0,200}?version\s*=\s*"([^"]+)"/g;
  while ((match = cargoLockRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  if (results.length > 0) return results;
  const gemfileLockRegex = /^\s{4}(\S+)\s+\(([^)]+)\)/gm;
  while ((match = gemfileLockRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  if (results.length > 0) return results;
  const goRegex = /require\s+([^\s]+)\s+([^\s\n\r]+)/g;
  while ((match = goRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  const goSumRegex = /^([^\s]+)\s+(v[^\s]+)/gm;
  while ((match = goSumRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  const rustRegex = /^([a-zA-Z0-9\-_]+)\s*=\s*["']?([^"'\n]+)["']?/gm;
  while ((match = rustRegex.exec(trimmedInput)) !== null) {
    if (!["package", "lib", "bin"].includes(match[1])) {
      results.push({ name: match[1], version: match[2] });
    }
  }
  const mavenRegex = /<dependency>[\s\S]*?<artifactId>(.*?)<\/artifactId>[\s\S]*?<version>(.*?)<\/version>/g;
  while ((match = mavenRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  const gradleRegex = /(?:implementation|api|testImplementation|classpath)\s+['"]([^:]+):([^:]+):([^'"]+)['"]/g;
  while ((match = gradleRegex.exec(trimmedInput)) !== null) {
    results.push({ name: `${match[1]}:${match[2]}`, version: match[3] });
  }
  const swiftRegex = /\.package\(url:\s*["']([^"']+)["'],\s*(?:from|branch|revision):\s*["']([^"']+)["']\)/g;
  while ((match = swiftRegex.exec(trimmedInput)) !== null) {
    results.push({ name: getBaseName(match[1]), version: match[2] });
  }
  if (results.length === 0) {
    const lines = trimmedInput.split("\n");
    const kvRegex = /["']?([^"':\s=<>!]+)["']?\s*[:=<>!]+\s*["']?([^"'\s,;]+)["']?/;
    lines.forEach((line) => {
      const l = line.trim();
      if (!l || l.startsWith("//") || l.startsWith("#") || l.startsWith("/*")) return;
      const m = l.match(kvRegex);
      if (m && !NON_DEP_KEYS.has(m[1])) {
        results.push({ name: m[1], version: m[2] });
      }
    });
  }
  return results;
};
const getBaseName = (url) => {
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1].replace(/\.git$/, "");
};
const saveToCache = (audit) => {
  console.log("Cache save disabled - TODO: implement database storage");
};
const getFromCache = (name, version) => {
  return null;
};
const RISK_SCORE = {
  [RiskLevel.HIGH]: 3,
  [RiskLevel.CAUTION]: 2,
  [RiskLevel.SAFE]: 1,
  [RiskLevel.UNKNOWN]: 0
};
const AuditTable = ({ audits }) => {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState("risk");
  const [sortOrder, setSortOrder] = useState("desc");
  const sortedAudits = useMemo(() => {
    return [...audits].sort((a, b) => {
      let comparison = 0;
      if (sortKey === "name") comparison = a.name.localeCompare(b.name);
      if (sortKey === "license") comparison = a.license.localeCompare(b.license);
      if (sortKey === "risk") comparison = RISK_SCORE[a.riskLevel] - RISK_SCORE[b.riskLevel];
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [audits, sortKey, sortOrder]);
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };
  const isGitHub = (url) => url.toLowerCase().includes("github.com");
  const getSafeHostname = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.hostname.replace("www.", "");
    } catch (e) {
      return urlString;
    }
  };
  const getRiskLabel = (level) => {
    switch (level) {
      case RiskLevel.SAFE:
        return t("risks.safe");
      case RiskLevel.CAUTION:
        return t("risks.caution");
      case RiskLevel.HIGH:
        return t("risks.high");
      default:
        return t("risks.unknown");
    }
  };
  if (audits.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
    /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10", children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx(
        "th",
        {
          className: "px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors",
          onClick: () => toggleSort("name"),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            t("table.dependency"),
            " ",
            sortKey === "name" && (sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "w-3 h-3" }))
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "th",
        {
          className: "px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors",
          onClick: () => toggleSort("license"),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            t("table.license"),
            " ",
            sortKey === "license" && (sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "w-3 h-3" }))
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "th",
        {
          className: "px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors",
          onClick: () => toggleSort("risk"),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            t("table.risk"),
            " ",
            sortKey === "risk" && (sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "w-3 h-3" }))
          ] })
        }
      ),
      /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest", children: t("table.assessment") })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-white/5", children: sortedAudits.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors", children: [
      /* @__PURE__ */ jsxs("td", { className: "px-6 py-5", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold text-xs text-black dark:text-white", children: item.name }),
        /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-slate-400 font-mono mt-0.5", children: [
          "v",
          item.version
        ] })
      ] }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5", children: item.license }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${item.riskLevel === RiskLevel.SAFE ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : item.riskLevel === RiskLevel.CAUTION ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"}` }),
        /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black uppercase tracking-tight ${item.riskLevel === RiskLevel.SAFE ? "text-emerald-600 dark:text-emerald-400" : item.riskLevel === RiskLevel.CAUTION ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`, children: getRiskLabel(item.riskLevel) })
      ] }) }),
      /* @__PURE__ */ jsxs("td", { className: "px-6 py-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-3", children: item.reason }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: item.repository && /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.repository,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase",
            children: [
              isGitHub(item.repository) ? /* @__PURE__ */ jsx(Github, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5" }),
              getSafeHostname(item.repository)
            ]
          }
        ) })
      ] })
    ] }, `${item.name}-${idx}`)) })
  ] }) });
};
const SummaryCards = ({ audits }) => {
  const { t } = useTranslation();
  const stats = audits.reduce((acc, curr) => {
    if (curr.riskLevel === RiskLevel.SAFE) acc.safe++;
    else if (curr.riskLevel === RiskLevel.CAUTION) acc.caution++;
    else if (curr.riskLevel === RiskLevel.HIGH) acc.high++;
    else acc.unknown++;
    return acc;
  }, { safe: 0, caution: 0, high: 0, unknown: 0 });
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
    { label: t("summary.total"), val: audits.length, color: "text-black dark:text-white" },
    { label: t("summary.safe"), val: stats.safe, color: "text-emerald-500", border: "border-emerald-500/20" },
    { label: t("summary.atRisk"), val: stats.high + stats.caution, color: "text-rose-500", border: "border-rose-500/20" },
    { label: t("summary.compliance"), val: audits.length ? `${Math.round(stats.safe / audits.length * 100)}%` : "0%", color: "text-blue-500", border: "border-blue-500/20" }
  ].map((card, i) => /* @__PURE__ */ jsxs("div", { className: `bg-white dark:bg-[#0A0A0A] p-5 rounded-xl border border-slate-200 dark:border-white/10`, children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1", children: card.label }),
    /* @__PURE__ */ jsx("p", { className: `text-2xl font-black ${card.color} tracking-tighter`, children: card.val })
  ] }, i)) });
};
const getRiskColor = (level) => {
  switch (level) {
    case RiskLevel.SAFE:
      return "#10b981";
    case RiskLevel.CAUTION:
      return "#f59e0b";
    case RiskLevel.HIGH:
      return "#f43f5e";
    default:
      return "#94a3b8";
  }
};
const VisualTree = ({ audits }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
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
    const layout = d3Hierarchy.tree().nodeSize([80, 240]);
    return layout(root);
  }, [rootData]);
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svgElement = select(svgRef.current);
    const gElement = select(gRef.current);
    const zoomBehavior = zoom().scaleExtent([0.1, 3]).on("zoom", (event) => {
      gElement.attr("transform", event.transform);
      setZoomLevel(event.transform.k);
    });
    svgElement.call(zoomBehavior);
    const initialTransform = zoomIdentity.translate(100, 350).scale(0.8);
    svgElement.call(zoomBehavior.transform, initialTransform);
    return () => {
      svgElement.on(".zoom", null);
    };
  }, []);
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    select(svgRef.current).transition().call(zoom().scaleBy, 1.3);
  };
  const handleZoomOut = () => {
    if (!svgRef.current) return;
    select(svgRef.current).transition().call(zoom().scaleBy, 0.7);
  };
  const handleResetZoom = () => {
    if (!svgRef.current) return;
    select(svgRef.current).transition().call(zoom().transform, zoomIdentity.translate(100, 350).scale(0.8));
  };
  const nodes = treeLayoutData.descendants();
  const links = treeLayoutData.links();
  const isGitHub = (url) => url?.toLowerCase().includes("github.com");
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[700px] bg-[#f8f9fa] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner group", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 pointer-events-none opacity-[0.03]",
        style: { backgroundImage: "radial-gradient(#000 1px, transparent 0)", backgroundSize: "24px 24px" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 z-10 flex gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MousePointer2, { className: "w-3.5 h-3.5 text-blue-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-nowrap", children: "Drag to Pan • Scroll to Zoom" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-nowrap", children: [
        "Zoom: ",
        Math.round(zoomLevel * 100),
        "%"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-6 left-6 z-10 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: handleZoomIn, className: "p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400", children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleZoomOut, className: "p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400", children: /* @__PURE__ */ jsx(ZoomOut, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleResetZoom, className: "p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400", children: /* @__PURE__ */ jsx(Maximize, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsx("svg", { ref: svgRef, width: "100%", height: "100%", className: "cursor-grab active:cursor-grabbing outline-none", children: /* @__PURE__ */ jsxs("g", { ref: gRef, children: [
      links.map((link, i) => /* @__PURE__ */ jsx(
        "path",
        {
          d: linkHorizontal().x((d) => d.y).y((d) => d.x)({
            source: link.source,
            target: link.target
          }) || void 0,
          fill: "none",
          stroke: "#cbd5e1",
          strokeWidth: "2",
          strokeDasharray: "4"
        },
        `link-${i}`
      )),
      nodes.map((node, i) => /* @__PURE__ */ jsxs(
        "g",
        {
          transform: `translate(${node.y},${node.x})`,
          onClick: () => setSelectedNode(node.data),
          className: "cursor-pointer group/node",
          children: [
            /* @__PURE__ */ jsx(
              "circle",
              {
                r: "6",
                fill: getRiskColor(node.data.riskLevel),
                stroke: "#fff",
                strokeWidth: "2",
                className: "group-hover/node:r-8 transition-all"
              }
            ),
            /* @__PURE__ */ jsx(
              "text",
              {
                dy: ".31em",
                x: node.children ? -12 : 12,
                style: {
                  textAnchor: node.children ? "end" : "start",
                  fontSize: "11px",
                  fontWeight: 800,
                  fill: "currentColor"
                },
                className: "text-slate-900 dark:text-slate-200",
                children: node.data.name
              }
            )
          ]
        },
        `node-${i}`
      ))
    ] }) }),
    selectedNode && /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-right-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedNode(null),
          className: "absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-black text-slate-900 dark:text-white pr-6", children: selectedNode.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-mono", children: [
          "v",
          selectedNode.version
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black rounded-lg border border-blue-100 dark:border-blue-800 uppercase tracking-tight", children: selectedNode.license }),
        /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 text-[10px] font-black rounded-lg uppercase border tracking-tight ${selectedNode.riskLevel === RiskLevel.SAFE ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : selectedNode.riskLevel === RiskLevel.CAUTION ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"}`, children: selectedNode.riskLevel })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Audit Reasoning" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed", children: selectedNode.reason })
        ] }),
        selectedNode.repository && /* @__PURE__ */ jsxs(
          "a",
          {
            href: selectedNode.repository,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors uppercase tracking-widest",
            children: [
              isGitHub(selectedNode.repository) ? /* @__PURE__ */ jsx(Github, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5" }),
              "View Source ",
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
const RISK_PRIORITY = {
  [RiskLevel.HIGH]: 3,
  [RiskLevel.CAUTION]: 2,
  [RiskLevel.SAFE]: 1,
  [RiskLevel.UNKNOWN]: 0
};
const EcosystemIcon = ({ type, size = "text-2xl" }) => {
  const iconMap = {
    npm: { icon: "devicon-npm-original-wordmark", bg: "bg-[#CB3837]/10", color: "text-[#CB3837]" },
    python: { icon: "devicon-python-plain", bg: "bg-[#3776AB]/10", color: "text-[#3776AB]" },
    go: { icon: "devicon-go-plain", bg: "bg-[#00ADD8]/10", color: "text-[#00ADD8]" },
    rust: { icon: "devicon-rust-plain", bg: "bg-[#CE412B]/10", color: "text-[#CE412B]" },
    maven: { icon: "devicon-maven-plain", bg: "bg-[#C71A36]/10", color: "text-[#C71A36]" },
    gradle: { icon: "devicon-gradle-plain", bg: "bg-[#02303A]/10 dark:bg-[#00DE7A]/10", color: "text-[#02303A] dark:text-[#00DE7A]" },
    swift: { icon: "devicon-swift-plain", bg: "bg-[#F05138]/10", color: "text-[#F05138]" }
  };
  const config = iconMap[type] || { icon: "", bg: "bg-slate-100 dark:bg-white/5", color: "text-slate-400" };
  return /* @__PURE__ */ jsx("div", { className: `p-1.5 rounded-lg ${config.bg} ${config.color} flex items-center justify-center`, children: config.icon ? /* @__PURE__ */ jsx("i", { className: `${config.icon} ${size}` }) : /* @__PURE__ */ jsx(Search, { className: "w-5 h-5" }) });
};
const AuditView = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const allDone = tasks.length > 0 && tasks.every((t2) => t2.status === "success" || t2.status === "error");
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const scoreA = a.result ? RISK_PRIORITY[a.result.riskLevel] : -1;
      const scoreB = b.result ? RISK_PRIORITY[b.result.riskLevel] : -1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.name.localeCompare(b.name);
    });
  }, [tasks]);
  useEffect(() => {
    if (allDone && tasks.length > 0 && !isAuditing) {
      const timer = setTimeout(() => {
        setShowResults(true);
        window.scrollTo({ top: 100, behavior: "smooth" });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [allDone, tasks.length, isAuditing]);
  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    setError(null);
    try {
      let targetUrl = urlInput.trim();
      if (targetUrl.includes("github.com") && !targetUrl.includes("raw.githubusercontent.com") && !targetUrl.includes("/raw/")) {
        targetUrl = targetUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
      }
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(`Failed to fetch URL: ${err.message}`);
    } finally {
      setIsFetchingUrl(false);
    }
  };
  const normalizeResult = (res) => {
    const lic = res.license?.toUpperCase() || "UNKNOWN";
    const safeKeywords = ["MIT", "ISC", "BSD", "APACHE", "UNLICENSE", "ZLIB", "WTFPL", "PUBLIC DOMAIN"];
    const isSafe = safeKeywords.some((k) => lic.includes(k));
    let finalRisk = res.riskLevel;
    let finalFriendly = res.isFriendly;
    let finalReason = res.reason;
    if (isSafe) {
      finalRisk = RiskLevel.SAFE;
      finalFriendly = true;
      if (res.riskLevel !== RiskLevel.SAFE) {
        finalReason = `[Auto-Correction] ${res.license} is a permissive and safe license. Original check suggested: ${res.reason}`;
      }
    }
    const repository = res.repository || (res.name.includes("/") ? `https://github.com/${res.name}` : `https://www.google.com/search?q=${res.name}+repo`);
    return { ...res, repository, riskLevel: finalRisk, isFriendly: finalFriendly, reason: finalReason };
  };
  const runAudit = async () => {
    if (!content.trim()) return;
    setIsAuditing(true);
    setError(null);
    setShowResults(false);
    const rawDeps = parseDependencies(content);
    if (rawDeps.length === 0) {
      setError(t("audit.noDeps"));
      setIsAuditing(false);
      return;
    }
    const initialTasks = rawDeps.map((d) => ({ name: d.name, version: d.version, status: "pending" }));
    const unknownQueue = [];
    const updatedTasks = [...initialTasks];
    rawDeps.forEach((dep, idx) => {
      const nameKey = dep.name.toLowerCase();
      const known = KNOWN_PACKAGES[nameKey];
      if (known && known.license && COMMON_LICENSES[known.license]) {
        const licInfo = COMMON_LICENSES[known.license];
        const result = {
          name: dep.name,
          version: dep.version,
          license: known.license,
          repository: known.repository || `https://www.npmjs.com/package/${dep.name}`,
          riskLevel: licInfo.risk,
          isFriendly: licInfo.friendly,
          reason: `[Internal DB] ${licInfo.reason}`,
          sources: ["System Database"]
        };
        updatedTasks[idx] = { ...updatedTasks[idx], status: "success", result: normalizeResult(result) };
        return;
      }
      getFromCache(dep.name, dep.version);
      unknownQueue.push({ ...dep, index: idx });
      updatedTasks[idx].status = "loading";
    });
    setTasks(updatedTasks);
    if (unknownQueue.length === 0) {
      setIsAuditing(false);
      return;
    }
    try {
      const results = await auditDependenciesWithBackend(unknownQueue.map((q) => ({ name: q.name, version: q.version })));
      setTasks((prev) => {
        const next = [...prev];
        results.forEach((res) => {
          const matchedItem = unknownQueue.find((q) => q.name.toLowerCase() === res.name.toLowerCase());
          if (matchedItem) {
            const finalRes = normalizeResult(res);
            saveToCache(finalRes);
            next[matchedItem.index] = { ...next[matchedItem.index], status: "success", result: finalRes };
          }
        });
        next.forEach((t2) => {
          if (t2.status === "loading") {
            t2.status = "error";
            t2.error = "No response";
          }
        });
        return next;
      });
    } catch (err) {
      setTasks((prev) => {
        const next = [...prev];
        unknownQueue.forEach((q) => {
          if (next[q.index].status === "loading") {
            next[q.index].status = "error";
            next[q.index].error = "Batch scan failed";
          }
        });
        return next;
      });
    } finally {
      setIsAuditing(false);
    }
  };
  const clearResults = () => {
    setTasks([]);
    setContent("");
    setUrlInput("");
    setError(null);
    setShowResults(false);
  };
  const isGitHub = (url) => url?.toLowerCase().includes("github.com");
  const ecosystems = ["npm", "python", "go", "rust", "maven", "gradle", "swift"];
  return /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-6 pt-16 pb-24", children: tasks.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tighter mb-4", children: t("audit.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-lg font-medium", children: t("audit.desc") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(CloudDownload, { className: "h-4 w-4 text-slate-400" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: urlInput,
            onChange: (e) => setUrlInput(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleFetchUrl(),
            placeholder: t("audit.urlPlaceholder"),
            className: "block w-full pl-10 pr-24 py-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl text-sm outline-none focus:border-black dark:focus:border-white/30 transition-all placeholder:text-slate-400 font-medium"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-1.5 flex items-center gap-1", children: [
          urlInput && /* @__PURE__ */ jsx("button", { onClick: () => setUrlInput(""), className: "p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleFetchUrl,
              disabled: isFetchingUrl || !urlInput,
              className: "px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold disabled:opacity-50 transition-all active:scale-95",
              children: isFetchingUrl ? /* @__PURE__ */ jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : t("audit.fetchBtn")
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-none overflow-hidden group focus-within:border-black dark:focus-within:border-white/30 transition-all", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5" }),
            " ",
            t("audit.inputLabel")
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setContent("module github.com/user/project\n\ngo 1.18\n\nrequire (\n  github.com/gin-gonic/gin v1.8.1\n  github.com/sirupsen/logrus v1.9.0\n)"), className: "text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400", children: "Go Mod" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setContent('[dependencies]\nserde = "1.0"\ntokio = { version = "1.0", features = ["full"] }'), className: "text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400", children: "Cargo" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setContent('{\n  "dependencies": {\n    "react": "^19.0.0",\n    "next": "latest"\n  }\n}'), className: "text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400", children: "NPM" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: "w-full h-72 p-6 text-sm font-mono bg-transparent dark:text-slate-200 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600",
            placeholder: t("audit.placeholder"),
            value: content,
            onChange: (e) => setContent(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-slate-400 uppercase tracking-tight", children: "Support: NPM, Maven, Go, Rust, Gradle, Swift + Lock Files" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: runAudit,
              disabled: isAuditing || !content.trim(),
              className: `px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${isAuditing || !content.trim() ? "bg-slate-200 dark:bg-white/5 text-slate-400" : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-lg"}`,
              children: [
                isAuditing ? /* @__PURE__ */ jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : t("audit.run"),
                !isAuditing && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all shadow-sm", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowFormats(!showFormats),
            className: "w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest", children: [
                /* @__PURE__ */ jsx(Info, { className: "w-3.5 h-3.5" }),
                " ",
                t("audit.supportedTitle")
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex -space-x-1.5", children: [
                  ecosystems.slice(0, 4).map((eco) => /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx(EcosystemIcon, { type: eco, size: "text-xs" }) }, eco)),
                  /* @__PURE__ */ jsxs("div", { className: "w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[8px] font-bold", children: [
                    "+",
                    ecosystems.length - 4
                  ] })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { className: `w-4 h-4 text-slate-400 transition-transform ${showFormats ? "rotate-90" : ""}` })
              ] })
            ]
          }
        ),
        showFormats && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-2 duration-300", children: ecosystems.map((eco) => /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5 group hover:border-black/10 dark:hover:border-white/10 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsx(EcosystemIcon, { type: eco }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black text-black dark:text-white uppercase tracking-tight", children: t(`audit.formats.${eco}.name`) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1", children: "Target File" }),
            /* @__PURE__ */ jsx("code", { className: "text-[10px] font-mono text-blue-500 dark:text-blue-400 bg-blue-500/5 px-2 py-1 rounded inline-block w-fit", children: t(`audit.formats.${eco}.file`) })
          ] })
        ] }, eco)) })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-medium", children: [
      /* @__PURE__ */ jsx(TriangleAlert, { className: "w-4 h-4" }),
      error
    ] })
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-black dark:text-white tracking-tight", children: allDone ? t("audit.completed") : t("audit.scanning") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
            " ",
            t("audit.riskHigh")
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
            " ",
            t("audit.riskSafe")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("button", { onClick: clearResults, className: "px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
          " ",
          t("audit.startOver")
        ] }),
        allDone && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowResults(!showResults),
            className: "px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105",
            children: showResults ? t("audit.showQueue") : t("audit.showReport")
          }
        )
      ] })
    ] }),
    !showResults ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: sortedTasks.map((task, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group h-full ${task.status === "success" ? "bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 shadow-sm" : task.status === "loading" ? "bg-white dark:bg-[#0A0A0A] border-blue-500 ring-4 ring-blue-500/5" : task.status === "error" ? "bg-rose-50/50 dark:bg-rose-900/5 border-rose-200 dark:border-rose-900/30" : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 opacity-60"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "overflow-hidden", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-black dark:text-white truncate", children: task.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-mono mt-0.5", children: [
                "v",
                task.version
              ] })
            ] }),
            task.status === "loading" && /* @__PURE__ */ jsx(LoaderCircle, { className: "w-4 h-4 text-blue-500 animate-spin" }),
            task.status === "success" && /* @__PURE__ */ jsx("div", { className: `w-2.5 h-2.5 rounded-full ring-4 ${task.result?.riskLevel === RiskLevel.SAFE ? "bg-emerald-500 ring-emerald-500/10" : task.result?.riskLevel === RiskLevel.CAUTION ? "bg-amber-500 ring-amber-500/10" : "bg-rose-500 ring-rose-500/10"}` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${task.result?.riskLevel === RiskLevel.HIGH ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"}`, children: task.result?.license || (task.status === "loading" ? "..." : "?") }),
              task.result?.repository && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: task.result.repository,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "flex items-center gap-1.5 text-[9px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase",
                  children: [
                    isGitHub(task.result.repository) ? /* @__PURE__ */ jsx(Github, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(Link2, { className: "w-3 h-3" }),
                    "Source"
                  ]
                }
              )
            ] }),
            task.result?.reason && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed italic", children: task.result.reason })
          ] })
        ]
      },
      `${task.name}-${i}`
    )) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-12 animate-in fade-in slide-in-from-top-4 duration-700", children: [
      /* @__PURE__ */ jsx(SummaryCards, { audits: tasks.filter((t2) => t2.result).map((t2) => t2.result) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2", children: [
          t("audit.resultsTitle"),
          " ",
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => setViewMode("table"), className: `px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === "table" ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`, children: [
            /* @__PURE__ */ jsx(LayoutGrid, { className: "w-3 h-3" }),
            " Table"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setViewMode("tree"), className: `px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === "tree" ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`, children: [
            /* @__PURE__ */ jsx(Network, { className: "w-3 h-3" }),
            " Graph"
          ] })
        ] })
      ] }),
      viewMode === "table" ? /* @__PURE__ */ jsx(AuditTable, { audits: tasks.filter((t2) => t2.result).map((t2) => t2.result) }) : /* @__PURE__ */ jsx(VisualTree, { audits: tasks.filter((t2) => t2.result).map((t2) => t2.result) })
    ] })
  ] }) });
};
function Index() {
  return /* @__PURE__ */ jsx(AuditView, {});
}
export {
  Index as component
};
