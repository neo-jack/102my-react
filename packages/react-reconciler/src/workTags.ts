// React Fiber 工作标签常量定义
export const FunctionComponent = 0;
export const HostRoot = 3;
export const HostComponent = 5; // <div>123</div>
export const HostText = 6;

// WorkTag 类型定义
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;
