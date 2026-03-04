import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './FiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';
import { appendChildToContainer, Container } from 'hostConfig';

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finisheWork: FiberNode) => {
	nextEffect = finisheWork;
	while (nextEffect != null) {
		const child: FiberNode | null = nextEffect.child;
		if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child != null) {
			//往下
			nextEffect = child;
		} else {
			//向上
			up: while (nextEffect != null) {
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
};

const commitPlacement = (finishedWork: FiberNode) => {
	//finishedWork dom
	if (__DEV__) {
		console.warn('执行placementc操作', finishedWork);
	}
	//parent Dom
	const hostParent = getHostParent(finishedWork);
	//
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
};

function getHostParent(fiber: FiberNode): Container | null {
	let parent = fiber.return;
	while (parent) {
		const parentTag = parent.tag;
		// HostComponent HostRoot
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).Container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未找到host parent');
	}
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	//fiber host
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer( hostParent,finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
