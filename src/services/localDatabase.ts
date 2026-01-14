
import { RiskLevel, DependencyAudit, LicenseDetail } from "../types";

export const LICENSE_DETAILS: LicenseDetail[] = [
  {
    id: 'MIT',
    name: 'MIT License',
    permissiveness: 95,
    description: '极其简洁的宽松协议。仅要求保留版权声明，几乎没有任何限制。',
    bestFor: '追求最大传播度和最小法律负担的项目。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: true, sameLicense: false },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'Apache-2.0',
    name: 'Apache License 2.0',
    permissiveness: 90,
    description: '除了宽松的许可，还提供了明确的专利授权，对贡献者和使用者都有保障。',
    bestFor: '大型企业级项目，重视专利保护。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: true, sameLicense: false },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'BSD-3-Clause',
    name: 'BSD 3-Clause License',
    permissiveness: 92,
    description: '允许自由使用，但禁止使用贡献者的名字进行商业背书。',
    bestFor: '学术研究或核心技术组件。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: true, sameLicense: false },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'MPL-2.0',
    name: 'Mozilla Public License 2.0',
    permissiveness: 65,
    description: '“文件级”的传染性协议。修改后的文件必须开源，但可以与闭源项目结合。',
    bestFor: '希望保持核心组件开放，同时方便商业集成。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: true, sameLicense: true },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'LGPL-3.0',
    name: 'GNU LGPL v3.0',
    permissiveness: 55,
    description: '“较弱”的传染性。如果仅作为库链接使用，不强制整个项目开源。',
    bestFor: '希望被商业软件使用的开源类库。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: false },
    conditions: { notice: true, sameLicense: true },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'GPL-3.0',
    name: 'GNU GPL v3.0',
    permissiveness: 40,
    description: '强传染性协议。任何修改或衍生作品都必须在 GPL 下开源。',
    bestFor: '纯开源社区驱动、防止被商业公司“白嫖”的项目。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: false },
    conditions: { notice: true, sameLicense: true },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'AGPL-3.0',
    name: 'GNU AGPL v3.0',
    permissiveness: 10,
    description: '针对网络服务优化的 GPL。即使仅通过网络提供服务，也必须开源。',
    bestFor: '数据库、底层云服务软件。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: false },
    conditions: { notice: true, sameLicense: true },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'Zlib',
    name: 'zlib License',
    permissiveness: 98,
    description: '非常简洁，允许自由重用，甚至在商业软件中。',
    bestFor: '游戏引擎、压缩算法等底层工具。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: true, sameLicense: false },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'Artistic-2.0',
    name: 'Artistic License 2.0',
    permissiveness: 70,
    description: '最初为 Perl 开发，强调原作者对标准的控制权。',
    bestFor: '脚本语言插件或跨平台工具。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: true, sameLicense: false },
    limitations: { liability: true, warranty: true }
  },
  {
    id: 'WTFPL',
    name: 'Do What The F*ck You Want To Public License',
    permissiveness: 100,
    description: '一种极端的自由软件许可，意味着你可以做任何你想做的事。',
    bestFor: '非严肃的小玩具或公开领域代码。',
    permissions: { commercial: true, modification: true, distribution: true, sublicense: true },
    conditions: { notice: false, sameLicense: false },
    limitations: { liability: false, warranty: false }
  }
];

export const COMMON_LICENSES: Record<string, { risk: RiskLevel, friendly: boolean, reason: string }> = {
  'MIT': { risk: RiskLevel.SAFE, friendly: true, reason: '极度宽松，允许闭源商业化。' },
  'Apache-2.0': { risk: RiskLevel.SAFE, friendly: true, reason: '宽松且包含专利授权。' },
  'BSD-3-Clause': { risk: RiskLevel.SAFE, friendly: true, reason: '宽松，仅禁止使用名义背书。' },
  'BSD-2-Clause': { risk: RiskLevel.SAFE, friendly: true, reason: '类似于 MIT。' },
  'ISC': { risk: RiskLevel.SAFE, friendly: true, reason: '功能等同于 MIT/BSD。' },
  'MPL-2.0': { risk: RiskLevel.CAUTION, friendly: true, reason: '文件级传染，商业友好度尚可。' },
  'EPL-2.0': { risk: RiskLevel.CAUTION, friendly: true, reason: '弱传染性。' },
  'GPL-3.0': { risk: RiskLevel.CAUTION, friendly: false, reason: '强传染性，商业项目慎用。' },
  'GPL-2.0': { risk: RiskLevel.CAUTION, friendly: false, reason: '强传染性。' },
  'AGPL-3.0': { risk: RiskLevel.HIGH, friendly: false, reason: 'SaaS 穿透传染，商业风险极高。' },
  'LGPL-3.0': { risk: RiskLevel.CAUTION, friendly: true, reason: '动态链接安全，修改库本身需开源。' },
  'Unlicense': { risk: RiskLevel.SAFE, friendly: true, reason: '放弃版权，等同于公有领域。' },
  'CC0-1.0': { risk: RiskLevel.SAFE, friendly: true, reason: '放弃版权。' },
  'Zlib': { risk: RiskLevel.SAFE, friendly: true, reason: '极度宽松。' },
  'WTFPL': { risk: RiskLevel.SAFE, friendly: true, reason: '无限制。' },
  'BSL-1.1': { risk: RiskLevel.HIGH, friendly: false, reason: '后期商业限制协议。' },
  'SSPL': { risk: RiskLevel.HIGH, friendly: false, reason: '防止云厂商托管的限制性协议。' }
};

export const KNOWN_PACKAGES: Record<string, Partial<DependencyAudit>> = {
  'react': { license: 'MIT', repository: 'https://github.com/facebook/react' },
  'react-dom': { license: 'MIT', repository: 'https://github.com/facebook/react' },
  'vue': { license: 'MIT', repository: 'https://github.com/vuejs/core' },
  'lodash': { license: 'MIT', repository: 'https://github.com/lodash/lodash' },
  'axios': { license: 'MIT', repository: 'https://github.com/axios/axios' },
  'express': { license: 'MIT', repository: 'https://github.com/expressjs/express' },
  'typescript': { license: 'Apache-2.0', repository: 'https://github.com/microsoft/TypeScript' },
  'next': { license: 'MIT', repository: 'https://github.com/vercel/next.js' },
  'tailwindcss': { license: 'MIT', repository: 'https://github.com/tailwindlabs/tailwindcss' },
  'pandas': { license: 'BSD-3-Clause', repository: 'https://github.com/pandas-dev/pandas' },
  'numpy': { license: 'BSD-3-Clause', repository: 'https://github.com/numpy/numpy' },
  'requests': { license: 'Apache-2.0', repository: 'https://github.com/psf/requests' },
  'flask': { license: 'BSD-3-Clause', repository: 'https://github.com/pallets/flask' },
  'django': { license: 'BSD-3-Clause', repository: 'https://github.com/django/django' },
  'firefox': { license: 'MPL-2.0', repository: 'https://github.com/mozilla/gecko-dev' },
  'sharp': { license: 'Apache-2.0', repository: 'https://github.com/lovell/sharp' },
  'nitro': { license: 'MIT', repository: 'https://github.com/unjs/nitro' }
};
