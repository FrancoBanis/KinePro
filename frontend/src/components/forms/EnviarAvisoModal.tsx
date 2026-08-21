import { useState } from "react";

type EnvioAvisoProps = {
  onEnvio: (texto: string) => void;
};


function EnvioAviso({ onEnvio }: EnvioAvisoProps) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");

  const enviar = () => {
    onEnvio(texto);
    setTexto("");
    setAbierto(false);
  };

  return (
    <>
      {!abierto ? (
        <button className="btn-secondary" onClick={() => setAbierto(true)}>
        Enviar aviso
        </button>
      ) : (
        <div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <button className="btn-secondary" onClick={enviar}>Enviar</button>
         <button className="btn-secondary" onClick={() => setAbierto(false)}>Cancelar</button>
        </div>
      )}
    </>
  );
}

export default EnvioAviso; 