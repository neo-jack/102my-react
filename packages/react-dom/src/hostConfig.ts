export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string): Instance => {
	//TODO: 处理props
	const Element = document.createElement(type);
	return Element;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (context: string) => {
	return document.createTextNode(context);
};

export const appendChildToContainer = appendInitialChild;
