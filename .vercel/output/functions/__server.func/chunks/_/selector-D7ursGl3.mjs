import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { L as LICENSE_DETAILS } from "./localDatabase-DDum4fks.mjs";
import { c as createLucideIcon, S as ShieldCheck } from "./router-sHqUyFtU.mjs";
import { A as ArrowRight, G as Globe, I as Info } from "./info.mjs";
import "@tanstack/react-router";
import "i18next";
import "@tanstack/react-query";
import "@vercel/analytics/react";
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$4);
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode$3);
const __iconNode$2 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["path", { d: "M19 7h-9", key: "6i9tg" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const CRITERIA = [
  {
    id: "permissive",
    labelKey: "selector.criteria.permissive.label",
    descKey: "selector.criteria.permissive.desc",
    icon: /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" })
  },
  {
    id: "copyleft",
    labelKey: "selector.criteria.copyleft.label",
    descKey: "selector.criteria.copyleft.desc",
    icon: /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" })
  },
  {
    id: "patent",
    labelKey: "selector.criteria.patent.label",
    descKey: "selector.criteria.patent.desc",
    icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" })
  },
  {
    id: "saas",
    labelKey: "selector.criteria.saas.label",
    descKey: "selector.criteria.saas.desc",
    icon: /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4" })
  },
  {
    id: "attribution",
    labelKey: "selector.criteria.attribution.label",
    descKey: "selector.criteria.attribution.desc",
    icon: /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" })
  }
];
const LicenseSelector = () => {
  const { t } = useTranslation();
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const toggleCriterion = (id) => {
    setSelectedCriteria(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const recommendations = useMemo(() => {
    return LICENSE_DETAILS.map((lic) => {
      let score = 0;
      let reasonKeys = [];
      if (selectedCriteria.includes("permissive")) {
        if (!lic.conditions.sameLicense) {
          score += 40;
          reasonKeys.push("selector.reasons.proprietary");
        }
      }
      if (selectedCriteria.includes("copyleft")) {
        if (lic.conditions.sameLicense) {
          score += 40;
          reasonKeys.push("selector.reasons.stayFree");
        }
      }
      if (selectedCriteria.includes("patent")) {
        if (lic.id === "Apache-2.0" || lic.id === "MPL-2.0" || lic.id === "EPL-2.0") {
          score += 30;
          reasonKeys.push("selector.reasons.patentGrant");
        }
      }
      if (selectedCriteria.includes("saas")) {
        if (lic.id === "AGPL-3.0") {
          score += 50;
          reasonKeys.push("selector.reasons.saasEnforce");
        }
      }
      if (selectedCriteria.includes("attribution")) {
        if (lic.conditions.notice) {
          score += 20;
          reasonKeys.push("selector.reasons.keepNotice");
        }
      }
      return { ...lic, score, reasonKeys };
    }).filter((lic) => lic.score > 0).sort((a, b) => b.score - a.score);
  }, [selectedCriteria]);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-6 py-16 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-black dark:text-white mb-3 tracking-tighter", children: t("selector.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl", children: t("selector.desc") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsx(Settings2, { className: "w-4 h-4 text-black dark:text-white" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xs font-black uppercase tracking-widest text-slate-400", children: t("selector.priorities") })
        ] }),
        CRITERIA.map((item) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleCriterion(item.id),
            className: `w-full text-left p-4 rounded-xl border transition-all ${selectedCriteria.includes(item.id) ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg scale-[1.02]" : "bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                item.icon,
                /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: t(item.labelKey) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: `text-[10px] leading-relaxed ${selectedCriteria.includes(item.id) ? "text-white/80 dark:text-black/80" : "text-slate-500"}`, children: t(item.descKey) })
            ]
          },
          item.id
        )),
        selectedCriteria.length > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedCriteria([]),
            className: "text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white pt-4",
            children: t("selector.clear")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xs font-black uppercase tracking-widest text-slate-400", children: t("selector.recommendations") }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: t("selector.matches", { count: recommendations.length }) })
        ] }),
        selectedCriteria.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl text-center p-8", children: [
          /* @__PURE__ */ jsx(CircleQuestionMark, { className: "w-8 h-8 text-slate-200 dark:text-white/10 mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-400", children: t("selector.empty") })
        ] }) : recommendations.length === 0 ? /* @__PURE__ */ jsx("div", { className: "h-64 flex flex-col items-center justify-center border-2 border-dashed border-rose-100 dark:border-rose-900/10 rounded-3xl text-center p-8", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-rose-500", children: t("selector.noMatches") }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: recommendations.map((lic, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border transition-all duration-300 ${idx === 0 ? "border-black dark:border-white shadow-xl scale-[1.01]" : "border-slate-200 dark:border-white/10"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-black dark:text-white", children: lic.name }),
                  idx === 0 && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase rounded tracking-widest", children: t("selector.topPick") })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-400", children: lic.id })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed", children: lic.description }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black text-slate-400 uppercase tracking-widest", children: t("selector.whyMatch") }),
                /* @__PURE__ */ jsx("div", { className: "space-y-2", children: lic.reasonKeys.map((rKey, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300", children: [
                  /* @__PURE__ */ jsx(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-500 mt-0.5" }),
                  t(rKey)
                ] }, i)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black text-slate-400 uppercase", children: t("selector.freedom") }),
                  /* @__PURE__ */ jsxs("p", { className: `text-sm font-black ${lic.permissiveness > 80 ? "text-emerald-500" : "text-amber-500"}`, children: [
                    lic.permissiveness,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 text-xs font-bold text-black dark:text-white group", children: [
                  t("selector.viewHandbook"),
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
                ] })
              ] })
            ]
          },
          lic.id
        )) })
      ] })
    ] })
  ] });
};
function Selector() {
  return /* @__PURE__ */ jsx(LicenseSelector, {});
}
export {
  Selector as component
};
