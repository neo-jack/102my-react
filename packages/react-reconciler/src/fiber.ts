import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './FiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	//基础属性
	type: any;
	tag: WorkTag;
	penddingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	//树状结构
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	//更新结构
	memoizedProps: Props | null;
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	subtreeFlags:Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		//类型
		this.type = null;
		//树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		//工作节点
		this.penddingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		//双缓存
		this.alternate = null;

		//副作用
		this.flags = NoFlags;
		this.subtreeFlags=NoFlags
	}
}

export class FiberRootNode {
	Container: Container;
	current: FiberNode;
	finishework: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.Container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishework = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	penddingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		wip = new FiberNode(current.tag, penddingProps, current.key);
		wip.type = current.type;
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		wip.penddingProps = penddingProps;
		wip.flags = NoFlags;
		wip.subtreeFlags=NoFlags
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.memoizedProps;

	return wip;
};
