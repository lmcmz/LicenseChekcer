import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { forwardRef, createElement, useState, useEffect } from "react";
import { createRouter, RouterProvider, createRootRoute, createFileRoute, lazyRouteComponent, HeadContent, Outlet, Scripts, useLocation, Link } from "@tanstack/react-router";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$6 = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
];
const Github = createLucideIcon("github", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
];
const Languages = createLucideIcon("languages", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const resources = {
  en: {
    translation: {
      nav: {
        auditor: "Auditor",
        guide: "Handbook",
        selector: "Selector",
        lang: "ZH"
      },
      audit: {
        title: "Audit your dependencies.",
        desc: "Scans package lists, verifies licenses, and flags compliance risks automatically.",
        inputLabel: "Dependency Input",
        loadExample: "Load Example",
        placeholder: "Paste your dependency file content here...",
        urlPlaceholder: "Enter URL (e.g., GitHub Raw URL)...",
        fetchBtn: "Fetch",
        run: "Run Audit",
        scanning: "Scanning Dependencies...",
        completed: "Audit Completed",
        startOver: "Start Over",
        showReport: "View Detailed Report",
        showQueue: "Show Task Queue",
        resultsTitle: "Audit Results Breakdown",
        riskHigh: "High Risk First",
        riskSafe: "Safe",
        noDeps: "No dependencies identified. Please paste a valid dependency list or provide a URL.",
        supportedTitle: "Supported Formats",
        formats: {
          npm: { name: "Node.js", file: "package.json, package-lock.json, yarn.lock" },
          python: { name: "Python", file: "requirements.txt, Pipfile.lock" },
          go: { name: "Go", file: "go.mod, go.sum" },
          rust: { name: "Rust", file: "Cargo.toml, Cargo.lock" },
          maven: { name: "Maven", file: "pom.xml" },
          gradle: { name: "Gradle", file: "build.gradle" },
          swift: { name: "Swift", file: "Package.swift, Package.resolved" }
        }
      },
      guide: {
        title: "License Handbook",
        desc: "The definitive guide to understanding open source compliance for your business.",
        tabs: {
          details: "License Details",
          comparison: "Comparison",
          stats: "Insights"
        },
        details: {
          canDo: "Can Do",
          mustDo: "Must Do",
          commercial: "Commercial Use",
          modification: "Modification",
          notice: "Include Notice",
          shareSource: "Share Source"
        },
        table: {
          license: "License",
          comm: "Comm.",
          modify: "Modify",
          copyleft: "Copyleft",
          required: "Required",
          none: "None"
        },
        stats: {
          title: "Permissiveness Index",
          desc: "Relative score of commercial freedom."
        }
      },
      selector: {
        title: "License Selector",
        desc: "Not sure which license to choose? Select your priorities and we'll find the best fit.",
        priorities: "Project Priorities",
        recommendations: "Recommendations",
        matches_zero: "No matches found",
        matches_one: "1 match found",
        matches_other: "{{count}} matches found",
        empty: "Select at least one priority on the left to see results.",
        noMatches: "No licenses perfectly match these conflicting criteria. Try adjusting your selections.",
        topPick: "Top Pick",
        whyMatch: "Why it matches",
        viewHandbook: "View Handbook",
        freedom: "Freedom",
        clear: "Clear selections",
        criteria: {
          permissive: {
            label: "Permissive",
            desc: "Allow anyone to use the code for any purpose, even proprietary."
          },
          copyleft: {
            label: "Copyleft",
            desc: "Ensure that derivative works also remain open source."
          },
          patent: {
            label: "Patent Protection",
            desc: "Explicit protection against patent litigation from contributors."
          },
          saas: {
            label: "SaaS Friendly",
            desc: "Closing the SaaS loophole: users over a network must get source."
          },
          attribution: {
            label: "Attribution",
            desc: "Require users to include the original license/copyright notice."
          }
        },
        reasons: {
          proprietary: "It allows commercial/proprietary use without sharing back.",
          stayFree: "It ensures your code and its derivatives stay free.",
          patentGrant: "Provides explicit patent grants.",
          saasEnforce: "Designed specifically for network/SaaS enforcement.",
          keepNotice: "Requires users to keep your copyright notice."
        }
      },
      summary: {
        total: "Total Inspected",
        safe: "Safe",
        atRisk: "At Risk",
        compliance: "Compliance Rate"
      },
      table: {
        dependency: "Dependency",
        license: "License",
        risk: "Risk",
        assessment: "Assessment & Repository"
      },
      risks: {
        safe: "Safe",
        caution: "Caution",
        high: "High Risk",
        unknown: "Unknown"
      },
      footer: {
        built: "Built for compliance.",
        privacy: "Privacy",
        terms: "Terms",
        status: "Status"
      }
    }
  },
  zh: {
    translation: {
      nav: {
        auditor: "审计器",
        guide: "协议指南",
        selector: "选择器",
        lang: "EN"
      },
      audit: {
        title: "审计您的依赖库",
        desc: "智能扫描包列表，验证协议合规性并自动标记风险。",
        inputLabel: "依赖输入",
        loadExample: "加载示例",
        placeholder: "在此粘贴您的依赖文件内容...",
        urlPlaceholder: "输入 URL (例如 GitHub Raw 链接)...",
        fetchBtn: "获取",
        run: "开始审计",
        scanning: "正在扫描依赖...",
        completed: "审计完成",
        startOver: "重新开始",
        showReport: "查看详细报告",
        showQueue: "显示任务队列",
        resultsTitle: "审计结果分析",
        riskHigh: "高风险优先",
        riskSafe: "安全",
        noDeps: "未识别到有效依赖。请粘贴有效的依赖列表或输入 URL。",
        supportedTitle: "支持的格式",
        formats: {
          npm: { name: "Node.js", file: "package.json, package-lock.json, yarn.lock" },
          python: { name: "Python", file: "requirements.txt, Pipfile.lock" },
          go: { name: "Go", file: "go.mod, go.sum" },
          rust: { name: "Rust", file: "Cargo.toml, Cargo.lock" },
          maven: { name: "Maven", file: "pom.xml" },
          gradle: { name: "Gradle", file: "build.gradle" },
          swift: { name: "Swift", file: "Package.swift, Package.resolved" }
        }
      },
      guide: {
        title: "许可证协议指南",
        desc: "为您的业务理解开源合规性的权威指南。",
        tabs: {
          details: "协议详情",
          comparison: "横向对比",
          stats: "深度见解"
        },
        details: {
          canDo: "允许事项",
          mustDo: "必须事项",
          commercial: "商业使用",
          modification: "代码修改",
          notice: "保留声明",
          shareSource: "开源源代码"
        },
        table: {
          license: "许可证",
          comm: "商业",
          modify: "修改",
          copyleft: "传染性",
          required: "强制",
          none: "无限制"
        },
        stats: {
          title: "宽松度指数",
          desc: "商业自由度的相对得分。"
        }
      },
      selector: {
        title: "许可证选择器",
        desc: "不确定该使用哪种协议？选择您的需求，我们将为您找到最佳匹配。",
        priorities: "项目优先级",
        recommendations: "推荐方案",
        matches_zero: "未找到匹配项",
        matches_one: "找到 1 个匹配项",
        matches_other: "找到 {{count}} 个匹配项",
        empty: "请在左侧至少选择一个优先级以查看结果。",
        noMatches: "没有许可证能完美匹配这些冲突的标准。请尝试调整您的选择。",
        topPick: "首选推荐",
        whyMatch: "匹配原因",
        viewHandbook: "查看指南",
        freedom: "自由度",
        clear: "清除选择",
        criteria: {
          permissive: {
            label: "宽松授权",
            desc: "允许任何人出于任何目的使用代码，甚至是闭源商业用途。"
          },
          copyleft: {
            label: "传染性 (Copyleft)",
            desc: "确保衍生作品也必须保持开源。"
          },
          patent: {
            label: "专利保护",
            desc: "明确保护开发者和使用者免受专利诉讼。"
          },
          saas: {
            label: "SaaS 友好",
            desc: "弥补 SaaS 漏洞：通过网络提供服务的用户也必须能获取源码。"
          },
          attribution: {
            label: "署名要求",
            desc: "要求用户保留原始的许可证和版权声明。"
          }
        },
        reasons: {
          proprietary: "它允许商业/闭源使用，无需回馈社区。",
          stayFree: "它确保您的代码及其衍生作品始终保持免费。",
          patentGrant: "提供了明确的专利授权。",
          saasEnforce: "专为网络/SaaS 环境下的源码强制公开而设计。",
          keepNotice: "要求用户保留您的版权声明。"
        }
      },
      summary: {
        total: "检测总量",
        safe: "安全数量",
        atRisk: "风险数量",
        compliance: "合规率"
      },
      table: {
        dependency: "依赖项",
        license: "许可证协议",
        risk: "风险等级",
        assessment: "评估结果与仓库"
      },
      risks: {
        safe: "安全",
        caution: "警告",
        high: "高风险",
        unknown: "未知"
      },
      footer: {
        built: "为合规而生。",
        privacy: "隐私政策",
        terms: "服务条款",
        status: "运行状态"
      }
    }
  }
};
i18n.use(initReactI18next).init({
  resources,
  lng: typeof window !== "undefined" ? localStorage.getItem("licensechecker_lang") || "en" : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});
const Layout = ({ children }) => {
  const { t, i18n: i18n2 } = useTranslation();
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("licensechecker_theme");
    return saved || "dark";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("licensechecker_theme", theme);
    }
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => prev === "light" ? "dark" : "light");
  const toggleLanguage = () => {
    const newLang = i18n2.language === "en" ? "zh" : "en";
    i18n2.changeLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("licensechecker_lang", newLang);
    }
  };
  const isActive = (path) => location.pathname === path;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white dark:bg-[#000] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-blue-500/30", children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-200 dark:border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 h-14 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "flex items-center gap-2 cursor-pointer",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-white dark:text-black" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-sm tracking-tight uppercase", children: "License Checker" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: `text-xs font-medium transition-colors ${isActive("/") ? "text-black dark:text-white" : "text-slate-500 hover:text-black dark:hover:text-white"}`,
              children: t("nav.auditor")
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/guide",
              className: `text-xs font-medium transition-colors ${isActive("/guide") ? "text-black dark:text-white" : "text-slate-500 hover:text-black dark:hover:text-white"}`,
              children: t("nav.guide")
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/selector",
              className: `text-xs font-medium transition-colors ${isActive("/selector") ? "text-black dark:text-white" : "text-slate-500 hover:text-black dark:hover:text-white"}`,
              children: t("nav.selector")
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: toggleLanguage,
            className: "flex items-center gap-1.5 px-2 py-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all text-[10px] font-bold",
            children: [
              /* @__PURE__ */ jsx(Languages, { className: "w-3.5 h-3.5" }),
              t("nav.lang")
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleTheme,
            className: "p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all",
            children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsx("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", className: "p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-all", children: /* @__PURE__ */ jsx(Github, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "md:hidden p-1.5 text-slate-500 dark:text-slate-400",
            onClick: () => setIsMenuOpen(!isMenuOpen),
            children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Menu, { className: "w-4 h-4" })
          }
        )
      ] })
    ] }) }),
    isMenuOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40 bg-white dark:bg-black pt-20 px-6 md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 text-xl font-bold", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", onClick: () => setIsMenuOpen(false), children: t("nav.auditor") }),
      /* @__PURE__ */ jsx(Link, { to: "/guide", onClick: () => setIsMenuOpen(false), children: t("nav.guide") }),
      /* @__PURE__ */ jsx(Link, { to: "/selector", onClick: () => setIsMenuOpen(false), children: t("nav.selector") }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        toggleLanguage();
        setIsMenuOpen(false);
      }, className: "flex items-center gap-2 text-left", children: t("nav.lang") })
    ] }) }),
    /* @__PURE__ */ jsx("main", { children }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-slate-200 dark:border-white/10 py-12 mt-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-xs font-medium", children: [
        "© 2024 License Checker — ",
        t("footer.built")
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-xs font-medium text-slate-500", children: [
        /* @__PURE__ */ jsx("button", { className: "hover:text-black dark:hover:text-white", children: t("footer.privacy") }),
        /* @__PURE__ */ jsx("button", { className: "hover:text-black dark:hover:text-white", children: t("footer.terms") }),
        /* @__PURE__ */ jsx("button", { className: "hover:text-black dark:hover:text-white", children: t("footer.status") })
      ] })
    ] }) })
  ] });
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
const Route$3 = createRootRoute({
  head: () => {
    return {
      meta: [
        {
          charSet: "utf-8"
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        {
          title: "License Checker - Audit Open Source Dependencies"
        },
        {
          name: "description",
          content: "A tool to check and manage open source licenses for your dependencies"
        }
      ],
      links: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" }
      ]
    };
  },
  component: RootDocument
});
function RootDocument() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
        /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
        /* @__PURE__ */ jsx(Analytics, {})
      ] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$2 = () => import("./selector-D7ursGl3.mjs");
const Route$2 = createFileRoute("/selector")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./guide-BpWPrrJd.mjs");
const Route$1 = createFileRoute("/guide")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-e3TIYRdd.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SelectorRoute = Route$2.update({
  id: "/selector",
  path: "/selector",
  getParentRoute: () => Route$3
});
const GuideRoute = Route$1.update({
  id: "/guide",
  path: "/guide",
  getParentRoute: () => Route$3
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  GuideRoute,
  SelectorRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => createRouter({
  routeTree,
  defaultPreload: "intent"
});
const AppRouterProvider = () => {
  const router = React__default.useMemo(() => getRouter(), []);
  return /* @__PURE__ */ jsx(RouterProvider, { router });
};
const routerSHqUyFtU = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AppRouterProvider,
  getRouter
});
export {
  Github as G,
  ShieldCheck as S,
  X,
  createLucideIcon as c,
  routerSHqUyFtU as r
};
