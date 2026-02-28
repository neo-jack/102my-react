import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;
function prepareFreshStack(root: FiberRootNode) {
	//DFS-初始化
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	//调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	rendeRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}

	return null;
}

//通过Dfs实现渲染更新
function rendeRoot(root: FiberRootNode) {
	prepareFreshStack(root);
	do {
		try {
			workloop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workloop发送错误', e);
			}

			workInProgress = null;
		}
	} while (true);

	const finishework = root.current.alternate;

	root.finishework = finishework;

	//wip fiberNode树 树中的flags
	commitRoot(root);
}

//DFS-递归函数
function workloop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

//DFS-遍历
function performUnitOfWork(fiber: FiberNode) {
	//DFS-递
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.penddingProps;
	if (next === null) {
		//DFS-归
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node != null);
}
