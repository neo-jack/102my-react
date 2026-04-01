import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { reconcileChildFibers, mountChildFibers } from './childFibers';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { renderWithHooks } from './fiberHooks';

//递归的递
export const beginWork = (wip: FiberNode) => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		case FunctionComponent:
			return updateFunctionComponent(wip);
		default:
			if (__DEV__) {
				console.warn('beginWork为实现的类型');
			}
			break;
	}

	//比较返回子fibernode
	return null;
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren=renderWithHooks(wip)
	reconcileChildren(wip,nextChildren)
	return wip.child;
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;

	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextchildren = wip.memoizedState;
	reconcileChildren(wip, nextchildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.penddingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	if (current !== null) {
		//update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		//mount
		
		wip.child = mountChildFibers(wip, null, children);
	}
}
