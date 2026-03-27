# Deploy

## 1. Vite 配置

`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		react({
			jsxRuntime: 'classic'
		})
	],
	server: {
		allowedHosts: true
	},
	resolve: {
		alias: {
			hostConfig: path.resolve(__dirname, 'packages/react-dom/src/hostConfig.ts'),
			shared: path.resolve(__dirname, 'packages/shared'),
			'react-reconciler': path.resolve(__dirname, 'packages/react-reconciler')
		}
	},
	define: {
		__DEV__: true
	}
});
```

## 2. 启动脚本

`package.json` 中添加：

```json
"demo": "vite serve demos --config vite.config.ts --force"
```

## 3. Demo 入口

`demos/main.tsx`

```tsx
import React from '../packages/react/index';
import ReactDOM from '../packages/react-dom/index';
```
