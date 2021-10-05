import styles from '@pagestyles/Home.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const TOTAL_GAMES = 2;

const Game = () => {
	const router = useRouter();
	const { gameId } = router.query;
	const [GameComponent, setGameComponent] = useState<JSX.Element>();

	useEffect(() => {
		const importGameComponent = async () => {
			try {
				const Component = (await import(`@components/Games/Game${gameId}`))
					.default;
				setGameComponent(Component);
				console.log('component is loaded', Component, typeof Component);
			} catch (e) {
				console.log('unable to load the component');
			}
		};

		importGameComponent();
	}, [gameId]);
	return (
		<div className={styles.container}>
			<Head>
				<title>Game</title>
				<meta name='description' content='Generated by create next app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Welcome to Game {gameId}</h1>

				<p className={styles.description}>
					Get started by editing{' '}
					<code className={styles.code}>pages/index.js</code>
				</p>
				{GameComponent && React.cloneElement(GameComponent)}
				<div>
					<Link
						href={`/game/${
							(Number(gameId) || 1) - 1 < 1
								? TOTAL_GAMES
								: (Number(gameId) || 1) - 1
						}`}
					>
						<a>prev</a>
					</Link>
					<Link
						href={`/game/${
							(Number(gameId) || 1) + 1 > TOTAL_GAMES
								? 1
								: (Number(gameId) || 1) + 1
						}`}
					>
						<a>next</a>
					</Link>
				</div>
			</main>

			<footer className={styles.footer}>
				<a
					href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
					target='_blank'
					rel='noopener noreferrer'
				>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	);
};

export default Game;
