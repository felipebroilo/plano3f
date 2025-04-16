import { useState } from "react";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    {
      id: 1,
      qtde: "",
      nome: "",
      c: "",
      l: "",
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

  const opcoesChapas = [
    "Branco TX",
    "Preto TX",
    "Cru",
    "Mocca Fibraplac",
    "Italian Noce Eucatex",
    "Noce Oro Eucatex",
    "Cinza Italia Lacca Eucatex",
    "OUTROS",
  ];

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
    if (field === "chapa") newPecas[index].fita = value;
    setPecas(newPecas);
  };

  const toggleTodosLados = (index) => {
    const newPecas = [...pecas];
    const all = !newPecas[index].lados.todos;
    newPecas[index].lados = {
      c1: all,
      c2: all,
      l1: all,
      l2: all,
      todos: all,
    };
    setPecas(newPecas);
  };

  const addPeca = () => {
    const ultima = pecas[pecas.length - 1];
    setPecas([
      ...pecas,
      {
        ...ultima,
        id: ultima.id + 1,
        qtde: "",
        nome: "",
        c: "",
        l: "",
        ambiente: "",
        fitaOutro: "",
        lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
        observacoes: [],
        obsOutros: "",
      },
    ]);
  };

  const removePeca = (id) => {
    setPecas(pecas.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-600 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Plano de corte na 3F</h1>

      <div className="mb-4">
        <label className="block mb-2 font-bold text-lg">CLIENTE</label>
        <input
          type="text"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="bg-white text-black p-2 rounded w-full max-w-md"
        />
      </div>

      {pecas.map((peca, i) => (
        <div
          key={peca.id}
          className="bg-white text-black rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4"
        >
          <input
            type="number"
            placeholder="QTDE"
            value={peca.qtde}
            onChange={(e) => handleChange(i, "qtde", e.target.value.replace(/\D/g, ""))}
            className="p-2 rounded w-20"
          />

          <input
            placeholder="NOME DA PEÇA"
            value={peca.nome}
            onChange={(e) => handleChange(i, "nome", e.target.value)}
            className="p-2 rounded w-48"
          />

          <input
            type="number"
            placeholder="C (mm)"
            value={peca.c}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > 2750) alert("Medidas fora da realidade da chapa de MDF");
              handleChange(i, "c", val);
            }}
            className="p-2 rounded w-24"
          />

          <input
            type="number"
            placeholder="L (mm)"
            value={peca.l}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > 2750) alert("Medidas fora da realidade da chapa de MDF");
              handleChange(i, "l", val);
            }}
            className="p-2 rounded w-24"
          />

          <select
            value={peca.chapa}
            onChange={(e) => handleChange(i, "chapa", e.target.value)}
            className="p-2 rounded"
          >
            {opcoesChapas.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={peca.espessura}
            onChange={(e) => handleChange(i, "espessura", e.target.value)}
            className="p-2 rounded"
          >
            {["3", "6", "9", "15", "18"].map((e, idx) => (
              <option key={idx} value={e}>
                {e}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={peca.veio}
              onChange={() => handleChange(i, "veio", !peca.veio)}
            />
            Sentido do Veio
          </label>

          <input
            placeholder="AMBIENTE"
            value={peca.ambiente}
            onChange={(e) => handleChange(i, "ambiente", e.target.value)}
            className="p-2 rounded"
          />

          <div className="w-full mt-2">
            <label className="font-bold block mb-1">FITA</label>
            <input
              value={peca.fitaOutro || peca.fita}
              onChange={(e) => handleChange(i, "fitaOutro", e.target.value)}
              className="p-2 rounded w-full"
            />
          </div>

          <div className="mt-2 w-full">
            <p className="font-bold">QUAL LADO VAI A FITA?</p>
            {["c1", "c2", "l1", "l2"].map((lado) => (
              <label key={lado} className="mr-4">
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
              />
              TODOS OS LADOS
            </label>
          </div>

          <div className="w-full mt-4">
            <p className="font-bold">OBSERVAÇÕES</p>
            {obsFixas.map((obs, idx) => (
              <label key={idx} className="mr-4">
                <input
                  type="checkbox"
                  checked={peca.observacoes.includes(obs)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const novaLista = checked
                      ? [...peca.observacoes, obs]
                      : peca.observacoes.filter((o) => o !== obs);
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
                className="p-2 rounded w-full mt-1"
              />
            )}
          </div>

          <button
            onClick={() => removePeca(peca.id)}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
          >
            Excluir Peça
          </button>
        </div>
      ))}

      <button
        onClick={addPeca}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        + Adicionar Peça
      </button>
    </div>
  );
}
