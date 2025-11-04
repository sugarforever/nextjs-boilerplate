# Next.js 样板项目

一个现代化的、可用于生产的 Next.js 样板项目，包含身份验证、基于角色的访问控制和管理控制台。

## 功能特性

- **Next.js 14** - App Router、Server Components 和现代 React 功能
- **TypeScript** - 类型安全的开发体验
- **Better Auth** - 安全的邮箱/密码和 Google OAuth 身份验证
- **Prisma** - 类型安全的数据库 ORM，支持 PostgreSQL
- **基于角色的访问控制** - USER 和 ADMIN 角色，带路由保护
- **管理控制台** - 完整的管理面板，包含：
  - 用户管理仪表板
  - 角色分配功能
  - 用户统计和分析
- **shadcn/ui** - 美观、可访问的 UI 组件
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vercel Analytics** - 内置分析支持

## 技术栈

- **框架：** Next.js 14 (App Router)
- **语言：** TypeScript
- **身份验证：** Better Auth
- **数据库：** PostgreSQL + Prisma ORM
- **样式：** Tailwind CSS
- **UI 组件：** Radix UI + shadcn/ui
- **图标：** Lucide React
- **部署：** 支持 Vercel

## 快速开始

### 前置要求

- Node.js 18+ 和 npm
- PostgreSQL 数据库

### 1. 克隆并安装

```bash
git clone <your-repo-url>
cd nextjs-boilerplate
npm install
```

### 2. 环境配置

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

在 `.env` 文件中更新以下变量：

```env
# 数据库连接字符串
DATABASE_URL=postgresql://user:password@localhost:5432/your_database

# Better Auth 密钥（生成随机字符串）
BETTER_AUTH_SECRET=your-secret-key-here

# 应用 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth（可选，但推荐）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

生成 `BETTER_AUTH_SECRET` 的安全密钥：

```bash
openssl rand -base64 32
```

**注意：** Google OAuth 凭证是可选的。如果未提供，应用程序将仅使用邮箱/密码身份验证。

### 3. 数据库设置

运行 Prisma 迁移以创建数据库表：

```bash
npx prisma migrate dev
```

### 4. Google OAuth 设置（可选）

要启用 Google OAuth 身份验证：

1. **创建 Google Cloud 项目：**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目

2. **启用 Google+ API：**
   - 导航到 "API 和服务" > "库"
   - 搜索 "Google+ API" 并启用它

3. **配置 OAuth 同意屏幕：**
   - 转到 "API 和服务" > "OAuth 同意屏幕"
   - 选择 "外部" 用户类型（除非您使用 Google Workspace）
   - 填写所需信息：
     - 应用名称
     - 用户支持邮箱
     - 开发者联系邮箱
   - 点击 "保存并继续"，完成作用域屏幕
   - 如果您的应用处于测试模式，请添加测试用户

4. **创建 OAuth 凭证：**
   - 转到 "API 和服务" > "凭据"
   - 点击 "创建凭据" > "OAuth 客户端 ID"
   - 选择 "Web 应用程序" 作为应用程序类型
   - 添加授权的重定向 URI：
     - `http://localhost:3000/api/auth/callback/google`（用于开发）
     - `https://yourdomain.com/api/auth/callback/google`（用于生产）
   - 点击 "创建"
   - 复制 **客户端 ID** 和 **客户端密钥**

5. **将凭证添加到 `.env`：**
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

6. **重启开发服务器：**
   ```bash
   npm run dev
   ```

现在用户可以使用他们的 Google 账户登录或注册了！

### 5. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看您的应用程序。

**注意：** 如果您已配置 Google OAuth，您将在登录和注册页面上看到 "使用 Google 登录" 按钮。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── admin/             # 管理控制台页面
│   │   ├── users/         # 用户管理
│   │   ├── layout.tsx     # 管理布局（带侧边栏）
│   │   └── page.tsx       # 管理仪表板
│   ├── sign-in/           # 登录页面
│   ├── sign-up/           # 注册页面
│   ├── api/               # API 路由
│   │   └── auth/          # Better Auth 端点
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── AdminGuard.tsx    # 管理路由保护
│   ├── Navbar.tsx        # 导航栏
│   └── Footer.tsx        # 页脚
├── lib/                   # 工具和配置
│   ├── auth.ts           # Better Auth 配置
│   ├── auth-client.ts    # 客户端身份验证辅助函数
│   └── prisma.ts         # Prisma 客户端
└── middleware.ts          # Next.js 中间件（已移除，使用客户端守卫）

prisma/
└── schema.prisma          # 数据库架构

scripts/
└── make-admin.ts          # 管理员提升脚本
```

## 用户角色

应用程序支持两种角色：

- **USER** - 新注册用户的默认角色
- **ADMIN** - 完全访问管理控制台和用户管理

### 将用户提升为管理员

要将用户提升为管理员角色，请使用内置的 npm 脚本：

```bash
npm run make-admin user@example.com
```

这将：
- 通过邮箱查找用户
- 将其角色更新为 ADMIN
- 显示确认信息（包含用户详情）

## 路由

### 公共路由

- `/` - 首页
- `/sign-in` - 登录页面
- `/sign-up` - 注册页面

### 受保护的路由（仅管理员）

- `/admin` - 带用户统计的管理仪表板
- `/admin/users` - 带角色分配的用户管理

管理员路由由 `AdminGuard` 组件保护，该组件：
- 将未认证用户重定向到 `/sign-in`
- 将非管理员用户重定向到 `/`

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
- `npm run make-admin <email>` - 将用户提升为管理员角色

## 数据库

应用程序使用 Prisma 和 PostgreSQL。主要模型：

- **User** - 带基于角色的访问控制的用户账户
- **Session** - 身份验证会话
- **Account** - Better Auth 账户数据
- **Verification** - 邮箱验证令牌

要查看/编辑数据库：

```bash
npx prisma studio
```

在架构更改后创建新迁移：

```bash
npx prisma migrate dev --name your_migration_name
```

## 部署

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 上导入您的仓库
3. 在 Vercel 仪表板中添加环境变量：
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `GOOGLE_CLIENT_ID`（可选）
   - `GOOGLE_CLIENT_SECRET`（可选）
4. 部署！

### Vercel 上的数据库

对于生产环境，请考虑使用：
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

## 自定义

### 添加新的 UI 组件

此项目使用 shadcn/ui。要添加新组件：

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### 修改身份验证

编辑 `src/lib/auth.ts` 以自定义 Better Auth 配置：

- 添加 OAuth 提供商
- 修改会话持续时间
- 向用户模型添加自定义字段

### 添加新角色

1. 更新 `prisma/schema.prisma` 中的 `Role` 枚举
2. 运行 `npx prisma migrate dev`
3. 更新 `AdminGuard.tsx` 和其他受保护组件中的角色检查

## 了解更多

- [Next.js 文档](https://nextjs.org/docs)
- [Better Auth 文档](https://www.better-auth.com/)
- [Prisma 文档](https://www.prisma.io/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 许可证

MIT

