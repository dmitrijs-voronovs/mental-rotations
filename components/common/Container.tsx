export const Container: React.FC = ({ children }) => {
	return (
		<div
			style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
		>
			{children}
		</div>
	);
};
