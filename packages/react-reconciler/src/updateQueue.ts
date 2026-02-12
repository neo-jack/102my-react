import { Action } from 'shared/ReactTypes';
import { Updated } from './FiberFlags';

export interface Update<State> {
	actions: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(actions: Action<State>): Update<State> => {
	return {
		actions
	};
};

export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<Action>;
};

export const enquequeUPdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: { memoizedState: State } = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.actions;
		if (action instanceof Function) {
			// 如果是函数类型：baseState = 1, action = (s) => s + 1 -> result = 2
			result.memoizedState = action(baseState);
		} else {
			// 如果是具体值类型：baseState = 1, action = 2 -> result = 2
			result.memoizedState = action;
		}
	}

	return result;
};
