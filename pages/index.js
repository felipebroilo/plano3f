// pages/index.js

import { useState } from "react";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    {
      numero: 1,
      qtde: "",
      nome: "",
      comprimento: "",
      largura: "",
      chapa: "Branco TX",
      espessura: "15",
      veio: false,
      ambiente: "",
      fita: "Branco TX",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
      observacoes: [],
      obsOutros: "",
    },
  ]);

  const chapas = [
    "Branco TX",
    "Preto TX",
    "Cru",
    "Mocca Fibraplac",
    "Italian Noce Eucatex",
    "Noce Oro Eucatex",
    "Cinza Italia Lacca Eucatex",
    "OUTROS",
  ];

  const espessuras = ["3", "6", "9", "15", "18"];

  const obsFixas = [
    "2F LADO MAIOR",
    "3F LADO MAIOR",
    "4F LADO MAIOR",
    "2F LADO MENOR",
    "OUTROS",
  ];

  const handleChange = (index, field, value) => {
    const newPecas = [...pecas];
    newPecas[index][field] = value;

    if (field === "chapa") {
      newPecas[index].fita = value;
      newPecas[index].fitaOutro = "";
    }

    setPecas(newPecas);
  };

  const toggleTodosLados = (index) => {
    const newPecas = [...pecas];
    const todos = !newPecas[index].lados.todos;
    newPecas[index].lados = {
      c1: todos,
      c2: todos,
      l1: todos,
      l2: todos,
      todos,
    };
    setPecas(newPecas);
  };

  const addPeca = () => {
    const last = pecas[pecas.length - 1];
    setPecas([
      ...pecas,
      {
        ...last,
        numero: last.numero + 1,
        qtde: "",
        nome: "",
        comprimento: "",
        largura: "",
        ambiente: "",
        lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
        observacoes: [],
        obsOutros: "",
      },
    ]);
  };

  const removePeca = (index) => {
    const newPecas = [...pecas];
    newPecas.splice(index, 1);
    setPecas(newPecas);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Formulário de Peças - 3F</h1>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="CLIENTE"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      {pecas.map((peca, i) => (
        <div key={i} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">Peça #{peca.numero}</h2>

          <div className="flex flex-wrap gap-2 mt-2">
            <input
              type="number"
              placeholder="QTDE"
              value={peca.qtde}
              onChange={(e) => handleChange(i, "qtde", e.target.value)}
              className="border p-2 w-24"
            />

            <input
              placeholder="NOME DA PEÇA"
              value={peca.nome}
              onChange={(e) => handleChange(i, "nome", e.target.value)}
              className="border p-2 flex-1"
            />

            <input
              type="number"
              placeholder="Comprimento (C) mm"
              value={peca.comprimento}
              onChange={(e) => {
                const val = e.target.value;
                if (parseInt(val) > 2750) alert("Comprimento acima do limite da chapa de MDF");
                handleChange(i, "comprimento", val);
              }}
              className="border p-2 w-48"
            />

            <input
              type="number"
              placeholder="Largura (L) mm"
              value={peca.largura}
              onChange={(e) => {
                const val = e.target.value;
                if (parseInt(val) > 2750) alert("Largura acima do limite da chapa de MDF");
                handleChange(i, "largura", val);
              }}
              className="border p-2 w-48"
            />

            <select
              value={peca.chapa}
              onChange={(e) => handleChange(i, "chapa", e.target.value)}
              className="border p-2"
            >
              {chapas.map((chapa, idx) => (
                <option key={idx} value={chapa}>{chapa}</option>
              ))}
            </select>

            <select
              value={peca.espessura}
              onChange={(e) => handleChange(i, "espessura", e.target.value)}
              className="border p-2"
            >
              {espessuras.map((esp, idx) => (
                <option key={idx} value={esp}>{esp}</option>
              ))}
            </select>

            <label className="flex items-center ml-2">
              Sentido do Veio:
              <input
                type="checkbox"
                checked={peca.veio}
                onChange={() => handleChange(i, "veio", !peca.veio)}
                className="ml-2"
              />
              {peca.veio ? "Segue comprimento" : "Pode girar"}
            </label>

            <input
              placeholder="AMBIENTE"
              value={peca.ambiente}
              onChange={(e) => handleChange(i, "ambiente", e.target.value)}
              className="border p-2 w-full"
            />

            <div className="w-full">
              <p>FITA:</p>
              <input
                value={peca.fitaOutro || peca.fita}
                onChange={(e) => handleChange(i, "fitaOutro", e.target.value)}
                className="border p-2 w-full"
              />

              <p className="mt-2">QUAL LADO VAI A FITA?</p>
              {["c1", "c2", "l1", "l2"].map((lado, idx) => (
                <label key={idx} className="mr-2">
                  <input
                    type="checkbox"
                    checked={peca.lados[lado]}
                    onChange={() => {
                      const newPecas = [...pecas];
                      newPecas[i].lados[lado] = !newPecas[i].lados[lado];
                      setPecas(newPecas);
                    }}
                  /> {lado.toUpperCase()}
                </label>
              ))}
              <label className="ml-4">
                <input
                  type="checkbox"
                  checked={peca.lados.todos}
                  onChange={() => toggleTodosLados(i)}
                /> TODOS OS LADOS
              </label>
            </div>

            <div className="w-full mt-2">
              <p>OBSERVAÇÕES:</p>
              {obsFixas.map((obs, idx) => (
                <label key={idx} className="mr-4">
                  <input
                    type="checkbox"
                    checked={peca.observacoes.includes(obs)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const novaLista = checked
                        ? [...peca.observacoes, obs]
                        : peca.observacoes.filter(o => o !== obs);
                      handleChange(i, "observacoes", novaLista);
                    }}
                  /> {obs}
                </label>
              ))}
              {peca.observacoes.includes("OUTROS") && (
                <input
                  placeholder="Especifique"
                  value={peca.obsOutros}
                  onChange={(e) => handleChange(i, "obsOutros", e.target.value)}
                  className="border p-2 w-full mt-1"
                />
              )}
            </div>
          </div>

          <button
            onClick={() => removePeca(i)}
            className="bg-red-600 text-white px-4 py-1 mt-2 rounded"
          >
            Excluir Peça
          </button>
        </div>
      ))}

      <button
        onClick={addPeca}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Adicionar Peça
      </button>
    </div>
  );
}