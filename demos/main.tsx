import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [testNum, setNum] = useState(100);

	return (
		<div>
			<span>
				{testNum}
				{/* <Child /> */}
			</span>
		</div>
	);
}

function Child() {
	return <span>my-react</span>;
}

const root = document.querySelector('#root')!;

ReactDOM.createRoot(root).render(<App />);
