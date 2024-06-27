// Code for the main App component
import './App.css';
import React from 'react';
import Light from './Light';
import Boot from './Boot';

import { get_ws, set_ws } from './websocket';


var server_ws_url = '192.162.68.131';
var server_ws_port = '81';
var server_ws_protocol = 'ws';
var tokens_lst = [];

function App() {

  const [current, setCurrent] = React.useState('Boot');
  const [tokens, setTokens] = React.useState([]);


  React.useEffect(() => {

    const timer = setTimeout(() => {
      let ws = get_ws();
      ws = new WebSocket(server_ws_protocol + '://' + server_ws_url + ':' + server_ws_port);
      var a = document.getElementById('loader_ball');
      a.style.backgroundColor = 'rgb(255,128,0)';
      a.style.width = '25px';
      a.style.height = '25px';
      a.style.borderRadius = '12.5px';
      a.style.transition = '0.25s'
      ws.onopen = function () {
        
        set_ws(ws);
        var a = document.getElementById('loader_ball');
        //lancer l'annimation connected sur le loader
        a.style.backgroundColor = 'rgb(0,128,255)';
        a.style.width = '50px';
        a.style.height = '50px';
        a.style.borderRadius = '25px';
        

       
        ws.onmessage = function (event) {
          console.log('Message from server ('+ event.data+")");
          //si le message est un token et si il n'est pas deja dans la liste
          if (event.data.toString().length == 12 && !tokens_lst.includes(event.data))
          {

            tokens_lst.push(event.data);
            /*afficher sur le holo glace le nombre de token*/
            ws.send({
              command: 'displayText',
              params: {
                  text: tokens_lst.length
              }});

            setTokens([...tokens_lst]);
          }
        };
        ws.send('ping');

        a.style.backgroundColor = 'rgba(0,128,255,0)';
        setTimeout(() => {
          setCurrent('Light');
        }, 500);

      };
    }, 100);
    /*
    const timer = setTimeout(() => {
      setCurrent('Light');
    }, 3000);
    */
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (current) {
      case 'Boot':
        return <Boot />;
      case 'Light':
        return <Light tokens={tokens} />;
      default:
        return <Boot />;
    }
  }

  return (
    <div className="App">
      {renderPage()}
    </div>
  );

}

export default App;