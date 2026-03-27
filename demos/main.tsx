import React from 'react';
import ReactDOM from 'react-dom/client';

const jsx = (
	<div>
		<span>my-react</span>
	</div>
);
const root = document.querySelector('#root')!;

ReactDOM.createRoot(root).render(jsx);

console.log(root)
console.log(React);
console.log(jsx);
console.log(jsx instanceof Element);
console.log(ReactDOM);
