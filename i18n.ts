
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        auditor: 'Auditor',
        guide: 'Handbook',
        selector: 'Selector',
        lang: 'ZH'
      },
      audit: {
        title: 'Audit your dependencies.',
        desc: 'Scans package lists, verifies licenses, and flags compliance risks automatically.',
        inputLabel: 'Dependency Input',
        loadExample: 'Load Example',
        placeholder: 'Paste package.json, requirements.txt, go.mod, pom.xml, Cargo.toml or build.gradle content here...',
        urlPlaceholder: 'Enter URL (e.g., GitHub Raw URL)...',
        fetchBtn: 'Fetch',
        run: 'Run Audit',
        scanning: 'Scanning Dependencies...',
        completed: 'Audit Completed',
        startOver: 'Start Over',
        showReport: 'View Detailed Report',
        showQueue: 'Show Task Queue',
        resultsTitle: 'Audit Results Breakdown',
        riskHigh: 'High Risk First',
        riskSafe: 'Safe',
        noDeps: 'No dependencies identified. Please paste a valid dependency list or provide a URL.'
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
        privacy: 'Privacy',
        terms: 'Terms',
        status: 'Status'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        auditor: '审计器',
        guide: '协议指南',
        selector: '选择器',
        lang: 'EN'
      },
      audit: {
        title: '审计您的依赖库',
        desc: '智能扫描包列表，验证协议合规性并自动标记风险。',
        inputLabel: '依赖输入',
        loadExample: '加载示例',
        placeholder: '在此粘贴 package.json, requirements.txt, go.mod, pom.xml, Cargo.toml 或 build.gradle 内容...',
        urlPlaceholder: '输入 URL (例如 GitHub Raw 链接)...',
        fetchBtn: '获取',
        run: '开始审计',
        scanning: '正在扫描依赖...',
        completed: '审计完成',
        startOver: '重新开始',
        showReport: '查看详细报告',
        showQueue: '显示任务队列',
        resultsTitle: '审计结果分析',
        riskHigh: '高风险优先',
        riskSafe: '安全',
        noDeps: '未识别到有效依赖。请粘贴有效的依赖列表或输入 URL。'
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
        privacy: '隐私政策',
        terms: '服务条款',
        status: '运行状态'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('licensechecker_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
