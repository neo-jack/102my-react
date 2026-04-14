import { useState } from 'react';
import ReactDOM from 'react-dom/client';

declare global {
	interface Window {
		setNum: (value: number) => void;
	}
}

function App() {
	const [testNum, setNum] = useState(100);
	window.setNum = setNum;
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
