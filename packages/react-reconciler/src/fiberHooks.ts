import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatcher, Dispatch } from 'react/src/currentDispatcher';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

//fiber的memoizedState
interface Hook {
	memoizedState: any; //hook保存的状态
	updateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	//赋值操作
	currentlyRenderingFiber = wip;
	//重置
	wip.memoizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		//update
	} else {
		//mount
		currentDispatcher.current = HookDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.penddingProps;
	const children = Component(props);

	//重置操作
	currentlyRenderingFiber = null;
	workInProgressHook = null; //！

	return children;
}

const HookDispatcherOnMount: Dispatcher = {
	useState: mountState
};

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	//找到当前useState对应的hook数据
	const hook = mountWorkInProgresHook();
	let memoizedState;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.memoizedState = memoizedState; //！
	hook.updateQueue = queue;

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber!, queue);
	queue.dispatch = dispatch;

	return [memoizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber); //将更新移动的roothostfiber

	// 	// 1. 创建更新
	// 	const update = createUpdate<ReactElementType | null>(reactElement);
	// 	// 2. 入队
	// 	enqueueUpdate(
	// 		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
	// 		update
	// 	);
	// 	scheduleUpdateOnFiber(hostRootFiber);
	//
}

function mountWorkInProgresHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		//mount 第一个hook
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
