import styles from "@pagestyles/Home.module.scss";
import Head from "next/head";
import React, {useEffect, useState} from "react";

function App() {
    const [GameComponent, setGameComponent] = useState<JSX.Element>();

    useEffect(() => {
        const importGameComponent = async () => {
            try {
                const Component = (await import(`@components/Games/Game4`))
                    .default;
                setGameComponent(Component);
                console.log('component is loaded', Component, typeof Component);
            } catch (e) {
                console.log('unable to load the component');
            }
        };

        importGameComponent();
    }, []);

    return <div style={{flex: 1, display: "flex", position:"relative"}}>
        {GameComponent && React.cloneElement(GameComponent)}
    </div>
}

export default App