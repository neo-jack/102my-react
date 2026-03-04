//ReactDOM.creatRoot(fiber).render(APP)

import { Container } from 'hostConfig';
import {
	createContainer,
	updatedContainer
} from 'react-reconciler/src/fiberReconciler';
import { ReactElementType } from 'shared/ReactTypes';

export function createRoot(container: Container ) {

const root = createContainer(container);

	return {
		render(element: ReactElementType) {
			updatedContainer(element, root);
		}
	};
}
