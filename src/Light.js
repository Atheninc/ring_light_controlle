    import React from 'react';
    
    import {get_ws} from './websocket';

    const Light = ({tokens}) => {
        console.log(tokens);
        return (<div>
                    <h2> Lights </h2>
                    <LightList tokens={tokens} />
                </div>);
    };

    const LightItem = ({token}) => {
        //element de list qui affiche le token
        return (<div className="Light_item">
                    <h2> {token} </h2>
                    <LightItemCtrl token={token} />
                </div>);
    }

    const LightItemCtrl = ({token}) => {

        const [current, setCurrent] = React.useState('all');
        
        //variable pour cacher le body
        const [hidden, setHidden] = React.useState(false);

        const [isOff, setIsOff] = React.useState(false);

        const off_switch = () => {
            setIsOff(!isOff);
        }


        const allClick = () => {
            setCurrent('all');
        }

        const rangeClick = () => {
            setCurrent('range');
        }

        const offClick = () => {
            var val = isOff ? 0 : 1;
            setIsOff(!isOff);
            setCurrent('off');
            
            if (val === 0)
            {
                var message = token + ',color_all:0,0,0';
            }
            else
            {
                var message = token + ',color_all:255,255,255';
            }
            let ws = get_ws();
            if (ws && ws.readyState === 1) {
                ws.send(message);
                console.log('Message sent to server ', message);
            }
        }

        

        //afficher les option uniquement si le body n'est pas caché
        return (<div className="Light_item_ctrl">
                    <div className="Light_item_ctrl_header">

                        <div className="Light_item_ctrl_header_btn" onClick={allClick} hidden={hidden}>All</div>
                        <div className="Light_item_ctrl_header_btn" onClick={rangeClick} hidden={hidden}>Range</div>
                        <div className="Light_item_ctrl_header_btn" onClick={offClick}> {isOff ? 'On' : 'Off'} </div>
                        <div className="Light_item_ctrl_header_btn" onClick={() => setHidden(!hidden)}> {hidden ? 'Show' : 'Hide'} </div>                
                    </div>
                    <div className="Light_item_ctrl_body" hidden={hidden}>
                        {current === 'all' && <LightItemCtrlBodyAll token={token} />}
                        {current === 'range' && <LightItemCtrlBodyRange token={token} />}
                        {current === 'off' && <Empty />}
                    </div>
                </div>);
    };

    const LightItemCtrlBodyAll = ({token}) => {

        //quand l'un des sliders est modifié, envoyer un message au serveur au format token,color_all:R,G,B
        const [Red, setRed] = React.useState(0);
        const [Green, setGreen] = React.useState(0);
        const [Blue, setBlue] = React.useState(0);
        
        const sendColor = (R, G, B) => {
            const message = token + ',color_all:' + R + ',' + G + ',' + B;
            let ws = get_ws();
            console.log('ws', ws);
            if (ws && ws.readyState === 1) {
                ws.send(message);
                console.log('Message sent to server ', message);
            }
        }

        const redChange = (e) => {
            setRed(e.target.value);
            sendColor(e.target.value, Green, Blue);
            console.log('redChange', e.target.value);
        }

        const greenChange = (e) => {
            setGreen(e.target.value);
            sendColor(Red, e.target.value, Blue);
            console.log('greenChange', e.target.value);
        }

        const blueChange = (e) => {
            setBlue(e.target.value);
            sendColor(Red, Green, e.target.value);
            console.log('blueChange', e.target.value);
        }

        return (<div className="Light_item_ctrl_body">
                    <p>R : <input type="range" min="0" max="255" value={Red} onChange={redChange} /></p>
                    <p>G : <input type="range" min="0" max="255" value={Green} onChange={greenChange} /></p>
                    <p>B : <input type="range" min="0" max="255" value={Blue} onChange={blueChange} /></p>
                </div>);
    };

    const Empty = () => {
        return (<div></div>);
    }

    const LightItemCtrlBodyRange = ({token}) => {
        const [Red, setRed] = React.useState(0);
        const [Green, setGreen] = React.useState(0);
        const [Blue, setBlue] = React.useState(0);

        const [StartPos, setStartPos] = React.useState(0);
        const [Length, setLength] = React.useState(0);

        const sendColor = (R, G, B, S, L) => {
            var message = token + ',color_all:0,0,0';
            let ws = get_ws();
            if (ws && ws.readyState === 1) {
                ws.send(message);
                console.log('Message sent to server ', message);
            }
            for (let i = 0; i < L; i++) {
                var p = (S + i) % 9; 
                const message = token + ',color_one:' + p + ',' + R + ',' + G + ',' + B;
                let ws = get_ws();
                if (ws && ws.readyState === 1) {
                    ws.send(message);
                    console.log('Message sent to server ', message);
                }
            }
        }

        const redChange = (e) => {
            setRed(e.target.value);
            sendColor(e.target.value, Green, Blue, StartPos, Length);
            console.log('redChange', e.target.value);
        }

        const greenChange = (e) => {
            setGreen(e.target.value);
            sendColor(Red, e.target.value, Blue, StartPos, Length);
            console.log('greenChange', e.target.value);
        }

        const blueChange = (e) => {
            setBlue(e.target.value);
            sendColor(Red, Green, e.target.value, StartPos, Length);
            console.log('blueChange', e.target.value);
        }

        const startPosChange = (e) => {
            setStartPos(e.target.value);
            sendColor(Red, Green, Blue, e.target.value, Length);
            console.log('startPosChange', e.target.value);
        }

        const lengthChange = (e) => {
            setLength(e.target.value);
            sendColor(Red, Green, Blue, StartPos, e.target.value);
            console.log('lengthChange', e.target.value);
        }


        return (<div className="Light_item_ctrl_body">
                    <p>R : <input type="range" min="0" max="255" value={Red} onChange={redChange} /></p>
                    <p>G : <input type="range" min="0" max="255" value={Green} onChange={greenChange} /></p>
                    <p>B : <input type="range" min="0" max="255" value={Blue} onChange={blueChange} /></p>
                    <p>StartPos : <input type="range" min="0" max="8" value={StartPos} onChange={startPosChange} /></p>
                    <p>Length : <input type="range" min="0" max="9" value={Length} onChange={lengthChange} /></p>
                </div>);
    };

    const LightList = ({tokens}) => {
        //liste des tokens
        return (<div className="Light_list">
                    {tokens.map((token, index) => (
                        <LightItem key={index} token={token} />
                ))}
            </div>
        );
    }

    export default Light;

