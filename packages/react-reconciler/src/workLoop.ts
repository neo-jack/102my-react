import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;
function prepareFreshStack(fiber: FiberNode) {
	//DFS-初始化
	workInProgress = fiber;
}
//通过Dfs实现渲染更新
function rendeRoot(root: FiberNode) {
	prepareFreshStack(root);
	do {
		try {
			workloop();
			break;
		} catch (e) {
			console.warn('workloop发送错误', e);
			workInProgress = null;
		}
	} while (true);
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
