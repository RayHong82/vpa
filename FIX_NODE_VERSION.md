# 修复 Node.js 版本问题

## 问题

当前 Node.js 版本：16.20.1  
Next.js 15 要求：^18.18.0 || ^19.8.0 || >= 20.0.0

## 解决方案

### 方法 1: 使用 nvm 升级（推荐）

#### 步骤 1: 安装 nvm（如果还没有）

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

然后重新加载 shell：
```bash
source ~/.zshrc  # 或 ~/.bashrc
```

#### 步骤 2: 安装 Node.js 20

```bash
nvm install 20
nvm use 20
```

#### 步骤 3: 验证版本

```bash
node --version  # 应该显示 v20.x.x
```

#### 步骤 4: 重新安装依赖并启动

```bash
cd /Users/jinghong/projects/vpa
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### 方法 2: 使用 Homebrew 升级

```bash
# 安装/升级 Node.js
brew install node@20

# 或使用最新版本
brew install node

# 验证版本
node --version
```

### 方法 3: 从官网下载安装

1. 访问：https://nodejs.org/
2. 下载 Node.js 20 LTS 版本
3. 安装后验证：`node --version`

## 快速修复命令

如果你已经安装了 nvm：

```bash
# 切换到项目目录
cd /Users/jinghong/projects/vpa

# 安装并使用 Node.js 20
nvm install 20
nvm use 20

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 启动服务器
npm run dev
```

## 验证

运行以下命令确认版本正确：

```bash
node --version  # 应该 >= 18.18.0
npm --version
```

然后启动服务器：

```bash
npm run dev
```

应该看到：
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

## 如果 nvm 不可用

如果你不想使用 nvm，可以：

1. **直接安装 Node.js 20**：
   - macOS: 从 https://nodejs.org/ 下载安装包
   - 或使用 Homebrew: `brew install node@20`

2. **设置默认版本**（如果使用 nvm）：
   ```bash
   nvm alias default 20
   ```

## 临时解决方案（不推荐）

如果暂时无法升级 Node.js，可以尝试降级 Next.js（但可能不兼容）：

```bash
npm install next@14 --legacy-peer-deps
```

但**强烈建议升级 Node.js**，因为：
- Next.js 15 的新特性需要 Node 18+
- 依赖包也需要更新的 Node 版本
- 更好的性能和安全性

