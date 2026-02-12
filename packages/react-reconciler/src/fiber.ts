import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './FiberFlags';

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

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;

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

		this.alternate = null;
		//副作用
		this.flags = NoFlags;
	}
}
