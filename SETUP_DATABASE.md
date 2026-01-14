# 数据库设置指南

有三种方法可以设置 Supabase 数据库表：

## 方法 1: Supabase Dashboard（最简单 ⭐️）

1. **登录 Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **选择你的项目**

3. **打开 SQL Editor**
   - 点击左侧菜单的 "SQL Editor"
   - 点击 "New query"

4. **复制并执行 SQL**
   - 打开 `supabase/schema.sql` 文件
   - 复制全部内容
   - 粘贴到 SQL Editor
   - 点击 "Run" 按钮

5. **验证**
   - 点击左侧菜单的 "Table Editor"
   - 应该能看到 `package_licenses` 表

---

## 方法 2: 使用自动化脚本（推荐）

### 前提条件
- 已安装 Supabase CLI
- 已配置 `.env` 文件

### 步骤

1. **登录 Supabase CLI**
   ```bash
   supabase login
   ```

2. **运行设置脚本**
   ```bash
   ./scripts/setup-db.sh
   ```

脚本会自动：
- 读取你的 `.env` 配置
- 连接到你的 Supabase 项目
- 推送数据库 migration
- 创建所有表和索引

---

## 方法 3: 手动使用 Supabase CLI

### 步骤

1. **登录**
   ```bash
   supabase login
   ```

2. **链接项目**
   ```bash
   supabase link --project-ref your-project-ref
   ```

   提示：`your-project-ref` 可以从 Supabase URL 中获取：
   ```
   https://xxxxxxxxxxxxx.supabase.co
              ↑
         这就是 project-ref
   ```

3. **推送 migration**
   ```bash
   supabase db push
   ```

---

## 验证数据库设置

运行以下 SQL 查询来验证表是否创建成功：

```sql
-- 检查表是否存在
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'package_licenses';

-- 查看表结构
\d package_licenses

-- 测试插入数据
INSERT INTO package_licenses (package_name, package_version, license_name, risk_level)
VALUES ('react', '18.0.0', 'MIT', 'Safe');

-- 查看数据
SELECT * FROM package_licenses;
```

---

## 数据库表结构

### package_licenses

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| package_name | TEXT | 包名 |
| package_version | TEXT | 版本号 |
| license_name | TEXT | 许可证名称 |
| risk_level | TEXT | 风险等级 (Safe/Caution/High Risk) |
| metadata | JSONB | 其他元数据 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 约束和索引
- `UNIQUE(package_name, package_version)` - 防止重复
- `idx_package_licenses_name_version` - 加速查询
- `idx_package_licenses_created_at` - 按时间排序

### 安全策略
- **Row Level Security (RLS)** 已启用
- 匿名用户可以读取数据
- 只有认证用户可以插入数据

---

## 故障排除

### 问题: "relation already exists"
**解决方案**: 表已存在，无需重复创建

### 问题: "permission denied"
**解决方案**:
1. 检查 Supabase 服务密钥是否正确
2. 或在 Dashboard 中手动执行 SQL

### 问题: "connection refused"
**解决方案**:
1. 检查 `.env` 中的 `VITE_SUPABASE_URL` 是否正确
2. 确保网络连接正常
3. 使用 Dashboard 方法作为备选

---

## 下一步

数据库设置完成后：

1. ✅ 配置所有环境变量（`.env`）
2. ✅ 测试本地开发服务器
   ```bash
   bun run dev
   ```
3. ✅ 测试 license 审计功能
4. ✅ 部署到 Vercel
