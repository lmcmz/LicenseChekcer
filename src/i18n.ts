
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        auditor: 'Auditor',
        guide: 'Handbook',
        selector: 'Selector',
        api: 'API',
        lang: 'ZH'
      },
      audit: {
        title: 'Audit your dependencies.',
        desc: 'Scans package lists, verifies licenses, and flags compliance risks automatically.',
        inputLabel: 'Dependency Input',
        loadExample: 'Load Example',
        placeholder: 'Paste your dependency file content here, or drag & drop a file...',
        urlPlaceholder: 'Enter GitHub repo or file URL...',
        loadBtn: 'Load',
        run: 'Run Audit',
        scanning: 'Scanning Dependencies...',
        completed: 'Audit Completed',
        startOver: 'Start Over',
        showReport: 'View Detailed Report',
        showQueue: 'Show Task Queue',
        resultsTitle: 'Audit Results Breakdown',
        riskHigh: 'High Risk First',
        riskSafe: 'Safe',
        noDeps: 'No dependencies identified. Please paste a valid dependency list or provide a URL.',
        supportedTitle: 'Supported Formats',
        formats: {
          npm: { name: 'Node.js', file: 'package.json, package-lock.json, yarn.lock' },
          python: { name: 'Python', file: 'requirements.txt, Pipfile.lock' },
          go: { name: 'Go', file: 'go.mod, go.sum' },
          rust: { name: 'Rust', file: 'Cargo.toml, Cargo.lock' },
          maven: { name: 'Maven', file: 'pom.xml' },
          gradle: { name: 'Gradle', file: 'build.gradle' },
          swift: { name: 'Swift', file: 'Package.swift, Package.resolved' }
        }
      },
      guide: {
        title: 'License Handbook',
        desc: 'The definitive guide to understanding open source compliance for your business.',
        tabs: {
          details: 'License Details',
          comparison: 'Comparison',
          stats: 'Insights'
        },
        details: {
          canDo: 'Can Do',
          mustDo: 'Must Do',
          commercial: 'Commercial Use',
          modification: 'Modification',
          notice: 'Include Notice',
          shareSource: 'Share Source'
        },
        table: {
          license: 'License',
          comm: 'Comm.',
          modify: 'Modify',
          copyleft: 'Copyleft',
          required: 'Required',
          none: 'None'
        },
        stats: {
          title: 'Permissiveness Index',
          desc: 'Relative score of commercial freedom.'
        }
      },
      selector: {
        title: 'License Selector',
        desc: "Not sure which license to choose? Select your priorities and we'll find the best fit.",
        priorities: 'Project Priorities',
        recommendations: 'Recommendations',
        matches_zero: 'No matches found',
        matches_one: '1 match found',
        matches_other: '{{count}} matches found',
        empty: 'Select at least one priority on the left to see results.',
        noMatches: 'No licenses perfectly match these conflicting criteria. Try adjusting your selections.',
        topPick: 'Top Pick',
        whyMatch: 'Why it matches',
        viewHandbook: 'View Handbook',
        freedom: 'Freedom',
        clear: 'Clear selections',
        criteria: {
          permissive: {
            label: 'Permissive',
            desc: 'Allow anyone to use the code for any purpose, even proprietary.'
          },
          copyleft: {
            label: 'Copyleft',
            desc: 'Ensure that derivative works also remain open source.'
          },
          patent: {
            label: 'Patent Protection',
            desc: 'Explicit protection against patent litigation from contributors.'
          },
          saas: {
            label: 'SaaS Friendly',
            desc: 'Closing the SaaS loophole: users over a network must get source.'
          },
          attribution: {
            label: 'Attribution',
            desc: 'Require users to include the original license/copyright notice.'
          }
        },
        reasons: {
          proprietary: 'It allows commercial/proprietary use without sharing back.',
          stayFree: 'It ensures your code and its derivatives stay free.',
          patentGrant: 'Provides explicit patent grants.',
          saasEnforce: 'Designed specifically for network/SaaS enforcement.',
          keepNotice: 'Requires users to keep your copyright notice.'
        }
      },
      summary: {
        total: 'Total Inspected',
        safe: 'Safe',
        atRisk: 'At Risk',
        compliance: 'Compliance Rate'
      },
      table: {
        dependency: 'Dependency',
        license: 'License',
        risk: 'Risk',
        assessment: 'Assessment & Repository'
      },
      risks: {
        safe: 'Safe',
        caution: 'Caution',
        high: 'High Risk',
        unknown: 'Unknown'
      },
      footer: {
        built: 'Built for compliance.',
        moreProjects: 'More Projects'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        auditor: '审计器',
        guide: '协议指南',
        selector: '选择器',
        api: 'API',
        lang: 'EN'
      },
      audit: {
        title: '审计您的依赖库',
        desc: '智能扫描包列表，验证协议合规性并自动标记风险。',
        inputLabel: '依赖输入',
        loadExample: '加载示例',
        placeholder: '在此粘贴您的依赖文件内容，或拖放文件...',
        urlPlaceholder: '输入 GitHub 仓库或文件链接...',
        loadBtn: '加载',
        run: '开始审计',
        scanning: '正在扫描依赖...',
        completed: '审计完成',
        startOver: '重新开始',
        showReport: '查看详细报告',
        showQueue: '显示任务队列',
        resultsTitle: '审计结果分析',
        riskHigh: '高风险优先',
        riskSafe: '安全',
        noDeps: '未识别到有效依赖。请粘贴有效的依赖列表或输入 URL。',
        supportedTitle: '支持的格式',
        formats: {
          npm: { name: 'Node.js', file: 'package.json, package-lock.json, yarn.lock' },
          python: { name: 'Python', file: 'requirements.txt, Pipfile.lock' },
          go: { name: 'Go', file: 'go.mod, go.sum' },
          rust: { name: 'Rust', file: 'Cargo.toml, Cargo.lock' },
          maven: { name: 'Maven', file: 'pom.xml' },
          gradle: { name: 'Gradle', file: 'build.gradle' },
          swift: { name: 'Swift', file: 'Package.swift, Package.resolved' }
        }
      },
      guide: {
        title: '许可证协议指南',
        desc: '为您的业务理解开源合规性的权威指南。',
        tabs: {
          details: '协议详情',
          comparison: '横向对比',
          stats: '深度见解'
        },
        details: {
          canDo: '允许事项',
          mustDo: '必须事项',
          commercial: '商业使用',
          modification: '代码修改',
          notice: '保留声明',
          shareSource: '开源源代码'
        },
        table: {
          license: '许可证',
          comm: '商业',
          modify: '修改',
          copyleft: '传染性',
          required: '强制',
          none: '无限制'
        },
        stats: {
          title: '宽松度指数',
          desc: '商业自由度的相对得分。'
        }
      },
      selector: {
        title: '许可证选择器',
        desc: '不确定该使用哪种协议？选择您的需求，我们将为您找到最佳匹配。',
        priorities: '项目优先级',
        recommendations: '推荐方案',
        matches_zero: '未找到匹配项',
        matches_one: '找到 1 个匹配项',
        matches_other: '找到 {{count}} 个匹配项',
        empty: '请在左侧至少选择一个优先级以查看结果。',
        noMatches: '没有许可证能完美匹配这些冲突的标准。请尝试调整您的选择。',
        topPick: '首选推荐',
        whyMatch: '匹配原因',
        viewHandbook: '查看指南',
        freedom: '自由度',
        clear: '清除选择',
        criteria: {
          permissive: {
            label: '宽松授权',
            desc: '允许任何人出于任何目的使用代码，甚至是闭源商业用途。'
          },
          copyleft: {
            label: '传染性 (Copyleft)',
            desc: '确保衍生作品也必须保持开源。'
          },
          patent: {
            label: '专利保护',
            desc: '明确保护开发者和使用者免受专利诉讼。'
          },
          saas: {
            label: 'SaaS 友好',
            desc: '弥补 SaaS 漏洞：通过网络提供服务的用户也必须能获取源码。'
          },
          attribution: {
            label: '署名要求',
            desc: '要求用户保留原始的许可证和版权声明。'
          }
        },
        reasons: {
          proprietary: '它允许商业/闭源使用，无需回馈社区。',
          stayFree: '它确保您的代码及其衍生作品始终保持免费。',
          patentGrant: '提供了明确的专利授权。',
          saasEnforce: '专为网络/SaaS 环境下的源码强制公开而设计。',
          keepNotice: '要求用户保留您的版权声明。'
        }
      },
      summary: {
        total: '检测总量',
        safe: '安全数量',
        atRisk: '风险数量',
        compliance: '合规率'
      },
      table: {
        dependency: '依赖项',
        license: '许可证协议',
        risk: '风险等级',
        assessment: '评估结果与仓库'
      },
      risks: {
        safe: '安全',
        caution: '警告',
        high: '高风险',
        unknown: '未知'
      },
      footer: {
        built: '为合规而生。',
        moreProjects: '更多项目'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: typeof window !== 'undefined' ? localStorage.getItem('licensechecker_lang') || 'en' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
