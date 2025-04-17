// pages/index.js
import { useState } from "react";

export default function Home() {
  const chapas = ["Branco TX", "Preto TX", "Cru", "Mocca Fibraplac", "Italian Noce Eucatex", "Noce Oro Eucatex", "Cinza Italia Lacca Eucatex", "OUTROS"];
  const espessuras = ["3", "6", "9", "15", "18"];
  const obsFixas = ["2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"];

  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([]);
  const [pecaAtual, setPecaAtual] = useState({
    qtde: "",
    nome: "",
    c: "",
    l: "",
    chapa: "Branco TX",
    chapaOutro: "",
    espessura: "15",
    veio: false,
    ambiente: "",
    fita: "Branco TX",
    fitaOutro: "",
    lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
    observacoes: [],
    obsOutros: ""
  });
  const [indiceSelecionado, setIndiceSelecionado] = useState(null);

  const handleChange = (campo, valor) => {
    const nova = { ...pecaAtual, [campo]: valor };

    if (campo === "chapa") {
      nova.fita = valor;
      nova.fitaOutro = "";
      if (valor === "OUTROS") nova.chapaOutro = "";
    }

    if (campo === "chapaOutro") {
      nova.fita = valor;
      nova.fitaOutro = "";
    }

    if (campo === "fitaOutro") {
      nova.fita = valor;
    }

    if (campo === "lados") {
      nova.lados = valor;
    }

    setPecaAtual(nova);
  };

  const toggleTodosLados = () => {
    const ativar = !pecaAtual.lados.todos;
    const lados = { c1: ativar, c2: ativar, l1: ativar, l2: ativar, todos: ativar };
    handleChange("lados", lados);
  };

  const toggleLado = (lado) => {
    const novos = { ...pecaAtual.lados, [lado]: !pecaAtual.lados[lado] };
    novos.todos = novos.c1 && novos.c2 && novos.l1 && novos.l2;
    handleChange("lados", novos);
  };

  const adicionarPeca = () => {
    if (!pecaAtual.qtde || !pecaAtual.c || !pecaAtual.l) return;
    const novaLista = [...pecas, pecaAtual];
    setPecas(novaLista);
    setPecaAtual({
      qtde: "",
      nome: "",
      c: "",
      l: "",
      chapa: "Branco TX",
      chapaOutro: "",
      espessura: "15",
      veio: false,
      ambiente: "",
      fita: "Branco TX",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
      observacoes: [],
      obsOutros: ""
    });
    setIndiceSelecionado(null);
  };

  const excluirPeca = () => {
    if (indiceSelecionado === null) return;
    const nova = pecas.filter((_, idx) => idx !== indiceSelecionado);
    setPecas(nova);
    setIndiceSelecionado(null);
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-2">Plano de corte na 3F</h1>
      <input
        placeholder="CLIENTE"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        className="border p-1 mb-2 w-full"
      />
      <div className="grid grid-cols-10 gap-2 mb-2">
        <input placeholder="QTDE" type="number" value={pecaAtual.qtde} onChange={e => handleChange("qtde", e.target.value)} className="border p-1 col-span-1" />
        <input placeholder="NOME DA PEÇA" value={pecaAtual.nome} onChange={e => handleChange("nome", e.target.value)} className="border p-1 col-span-2" />
        <input placeholder="C (mm)" type="number" max={2750} value={pecaAtual.c} onChange={e => handleChange("c", e.target.value)} className="border p-1 col-span-1" />
        <input placeholder="L (mm)" type="number" max={2750} value={pecaAtual.l} onChange={e => handleChange("l", e.target.value)} className="border p-1 col-span-1" />
        <select value={pecaAtual.chapa} onChange={e => handleChange("chapa", e.target.value)} className="border p-1 col-span-2">
          {chapas.map((c, idx) => <option key={idx}>{c}</option>)}
        </select>
        {pecaAtual.chapa === "OUTROS" && (
          <input placeholder="Digite o nome da chapa" value={pecaAtual.chapaOutro} onChange={e => handleChange("chapaOutro", e.target.value)} className="border p-1 col-span-2" />
        )}
        <select value={pecaAtual.espessura} onChange={e => handleChange("espessura", e.target.value)} className="border p-1 col-span-1">
          {espessuras.map((e, i) => <option key={i}>{e}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <label className="mr-2"><input type="checkbox" checked={pecaAtual.veio} onChange={() => handleChange("veio", !pecaAtual.veio)} /> PODE GIRAR</label>
        <input placeholder="AMBIENTE" value={pecaAtual.ambiente} onChange={e => handleChange("ambiente", e.target.value)} className="border p-1 ml-2" />
      </div>
      <div className="mb-2">
        <p>FITA:</p>
        <input placeholder="Fita" value={pecaAtual.fita} onChange={e => handleChange("fitaOutro", e.target.value)} className="border p-1 w-full" />
      </div>
      <div className="mb-2">
        <p>QUAL LADO VAI A FITA?</p>
        {Object.keys(pecaAtual.lados).filter(l => l !== "todos").map((lado, idx) => (
          <label key={idx} className="mr-2">
            <input type="checkbox" checked={pecaAtual.lados[lado]} onChange={() => toggleLado(lado)} /> {lado.toUpperCase()}
          </label>
        ))}
        <label className="ml-4">
          <input type="checkbox" checked={pecaAtual.lados.todos} onChange={toggleTodosLados} /> TODOS OS LADOS
        </label>
      </div>
      <div className="mb-4">
        <p>OBSERVAÇÕES:</p>
        {obsFixas.map((obs, idx) => (
          <label key={idx} className="mr-4">
            <input
              type="checkbox"
              checked={pecaAtual.observacoes.includes(obs)}
              onChange={(e) => {
                const checked = e.target.checked
                const novaLista = checked
                  ? [...pecaAtual.observacoes, obs]
                  : pecaAtual.observacoes.filter(o => o !== obs)
                handleChange("observacoes", novaLista)
              }}
            /> {obs}
          </label>
        ))}
        {pecaAtual.observacoes.includes("OUTROS") && (
          <input placeholder="Especifique" value={pecaAtual.obsOutros} onChange={e => handleChange("obsOutros", e.target.value)} className="border p-1 w-full mt-1" />
        )}
      </div>
      <button onClick={adicionarPeca} className="bg-green-600 text-white px-4 py-2 mr-2">+ Adicionar Peça</button>
      <button onClick={excluirPeca} className="bg-red-600 text-white px-4 py-2">Excluir Peça</button>

      {pecas.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">LISTA DE PEÇAS - CLIENTE: {cliente.toUpperCase()}</h2>
          <table className="table-fixed border border-black w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black px-2">#</th>
                <th className="border border-black px-2">QTDE</th>
                <th className="border border-black px-2">PEÇA</th>
                <th className="border border-black px-2">C</th>
                <th className="border border-black px-2">L</th>
                <th className="border border-black px-2">CHAPA</th>
                <th className="border border-black px-2">ESPESSURA</th>
                <th className="border border-black px-2">FIBRA</th>
                <th className="border border-black px-2">AMBIENTE</th>
                <th className="border border-black px-2">FITA C1</th>
                <th className="border border-black px-2">FITA C2</th>
                <th className="border border-black px-2">FITA L1</th>
                <th className="border border-black px-2">FITA L2</th>
                <th className="border border-black px-2">OBS</th>
              </tr>
            </thead>
            <tbody>
              {pecas.map((p, idx) => (
                <tr key={idx} className={`cursor-pointer ${indiceSelecionado === idx ? 'bg-yellow-200' : ''}`} onClick={() => setIndiceSelecionado(idx)}>
                  <td className="border border-black px-2 text-center">{idx + 1}</td>
                  <td className="border border-black px-2 text-center">{p.qtde}</td>
                  <td className="border border-black px-2">{p.nome}</td>
                  <td className="border border-black px-2 text-center">{p.c}</td>
                  <td className="border border-black px-2 text-center">{p.l}</td>
                  <td className="border border-black px-2">{p.chapa === "OUTROS" ? p.chapaOutro : p.chapa}</td>
                  <td className="border border-black px-2 text-center">{p.espessura}</td>
                  <td className="border border-black px-2">{p.veio ? "PODE GIRAR" : "SEGUE COMPRIMENTO"}</td>
                  <td className="border border-black px-2">{p.ambiente}</td>
                  <td className="border border-black px-2 text-center">{p.lados.c1 ? "X" : ""}</td>
                  <td className="border border-black px-2 text-center">{p.lados.c2 ? "X" : ""}</td>
                  <td className="border border-black px-2 text-center">{p.lados.l1 ? "X" : ""}</td>
                  <td className="border border-black px-2 text-center">{p.lados.l2 ? "X" : ""}</td>
                  <td className="border border-black px-2">{[...p.observacoes.filter(o => o !== "OUTROS"), p.obsOutros].join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}




