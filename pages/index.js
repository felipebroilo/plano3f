import { useState } from "react";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    criarPecaVazia()
  ]);
  const [selecionado, setSelecionado] = useState(null);

  function criarPecaVazia() {
    return {
      qtde: "",
      nome: "",
      c: "",
      l: "",
      chapa: "",
      outraChapa: "",
      espessura: "18",
      veio: false,
      ambiente: "",
      observacoes: [],
      obsOutros: "",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false }
    };
  }

  const chapas = [
    "Branco TX", "Preto TX", "Cru", "Mocca Fibraplac", "Italian Noce Eucatex", "Noce Oro Eucatex", "Cinza Italia Lacca Eucatex", "OUTROS"
  ];
  const espessuras = ["HDF 3", "6", "9", "15", "18"];
  const obsFixas = ["2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"];

  function handleChange(index, campo, valor) {
    const novasPecas = [...pecas];
    novasPecas[index][campo] = valor;

    if (campo === "chapa") {
      if (valor === "OUTROS") {
        novasPecas[index].outraChapa = "";
        novasPecas[index].fitaOutro = "";
      } else {
        novasPecas[index].fitaOutro = valor;
      }
    }
    if (campo === "outraChapa") {
      novasPecas[index].fitaOutro = valor;
    }

    if (campo === "lados") {
      novasPecas[index].lados = valor;
    }

    setPecas(novasPecas);
  }

  function toggleTodosLados(index) {
    const nova = { ...pecas[index] };
    const marcar = !nova.lados.todos;
    nova.lados = {
      c1: marcar,
      c2: marcar,
      l1: marcar,
      l2: marcar,
      todos: marcar
    };
    const novas = [...pecas];
    novas[index] = nova;
    setPecas(novas);
  }

  function addPeca() {
    setPecas([...pecas, criarPecaVazia()]);
  }

  function removerSelecionada() {
    if (selecionado === null) return;
    const novas = pecas.filter((_, i) => i !== selecionado);
    setPecas(novas);
    setSelecionado(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Preenchimento de Peças - plano3f</h1>

      <input placeholder="CLIENTE" value={cliente} onChange={e => setCliente(e.target.value)} className="border p-2 w-full mb-6" />

      {pecas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 bg-gray-50">
          <input type="number" min="1" placeholder="QTDE" value={pecas[0].qtde} onChange={e => handleChange(0, "qtde", e.target.value.replace(/\D/g, ""))} className="border p-2 w-full" />
          <input placeholder="NOME DA PEÇA" value={pecas[0].nome} onChange={e => handleChange(0, "nome", e.target.value)} className="border p-2 w-full" />

          <input type="number" placeholder="C (mm)" value={pecas[0].c} onChange={e => {
            const v = e.target.value;
            if (v === "" || parseInt(v) <= 2750) handleChange(0, "c", v);
            else alert("⚠️ Medidas fora do padrão da chapa de MDF (máx. 2750mm)");
          }} className="border p-2 w-full" />

          <input type="number" placeholder="L (mm)" value={pecas[0].l} onChange={e => {
            const v = e.target.value;
            if (v === "" || parseInt(v) <= 2750) handleChange(0, "l", v);
            else alert("⚠️ Medidas fora do padrão da chapa de MDF (máx. 2750mm)");
          }} className="border p-2 w-full" />

          <select value={pecas[0].chapa} onChange={e => handleChange(0, "chapa", e.target.value)} className="border p-2 w-full">
            <option value="">Selecione a CHAPA</option>
            {chapas.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>

          {pecas[0].chapa === "OUTROS" && (
            <input placeholder="Digite o nome da CHAPA" value={pecas[0].outraChapa} onChange={e => handleChange(0, "outraChapa", e.target.value)} className="border p-2 w-full" />
          )}

          <select value={pecas[0].espessura} onChange={e => handleChange(0, "espessura", e.target.value)} className="border p-2 w-full">
            {espessuras.map((e, i) => <option key={i} value={e}>{e}</option>)}
          </select>

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={pecas[0].veio} onChange={() => handleChange(0, "veio", !pecas[0].veio)} />
            <span>{pecas[0].veio ? "Segue comprimento" : "Pode girar"}</span>
          </label>

          <input placeholder="AMBIENTE" value={pecas[0].ambiente} onChange={e => handleChange(0, "ambiente", e.target.value)} className="border p-2 w-full" />

          <input placeholder="FITA" value={pecas[0].fitaOutro} onChange={e => handleChange(0, "fitaOutro", e.target.value)} className="border p-2 w-full" />

          <div>
            <p>QUAL LADO VAI A FITA?</p>
            {["c1", "c2", "l1", "l2"].map((lado, i) => (
              <label key={i} className="mr-2">
                <input type="checkbox" checked={pecas[0].lados[lado]} onChange={() => {
                  const novosLados = { ...pecas[0].lados, [lado]: !pecas[0].lados[lado], todos: false };
                  handleChange(0, "lados", novosLados);
                }} /> {lado.toUpperCase()}
              </label>
            ))}
            <label className="ml-4">
              <input type="checkbox" checked={pecas[0].lados.todos} onChange={() => toggleTodosLados(0)} /> TODOS OS LADOS
            </label>
          </div>

          <div className="col-span-2">
            <p>OBSERVAÇÕES:</p>
            {obsFixas.map((obs, i) => (
              <label key={i} className="mr-4">
                <input
                  type="checkbox"
                  checked={pecas[0].observacoes.includes(obs)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const novaLista = checked
                      ? [...pecas[0].observacoes, obs]
                      : pecas[0].observacoes.filter(o => o !== obs);
                    handleChange(0, "observacoes", novaLista);
                  }}
                /> {obs}
              </label>
            ))}
            {pecas[0].observacoes.includes("OUTROS") && (
              <input placeholder="Especifique" value={pecas[0].obsOutros} onChange={e => handleChange(0, "obsOutros", e.target.value)} className="border p-2 w-full mt-1" />
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button onClick={addPeca} className="bg-green-600 text-white px-4 py-2 rounded">+ Adicionar Peça</button>
        <button onClick={removerSelecionada} className="bg-red-600 text-white px-4 py-2 rounded">- Excluir Peça</button>
      </div>

      {pecas.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Lista de Peças</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">QTDE</th>
                <th className="p-2 border">NOME</th>
                <th className="p-2 border">C (mm)</th>
                <th className="p-2 border">L (mm)</th>
                <th className="p-2 border">CHAPA</th>
                <th className="p-2 border">ESPESSURA</th>
                <th className="p-2 border">FITA</th>
                <th className="p-2 border">VEIO</th>
                <th className="p-2 border">LADOS</th>
              </tr>
            </thead>
            <tbody>
              {pecas.slice(1).map((p, idx) => (
                <tr
                  key={idx + 1}
                  className={`cursor-pointer ${selecionado === idx + 1 ? "bg-blue-100" : ""}`}
                  onClick={() => setSelecionado(idx + 1)}
                >
                  <td className="p-2 border">{idx + 2}</td>
                  <td className="p-2 border">{p.qtde}</td>
                  <td className="p-2 border">{p.nome}</td>
                  <td className="p-2 border">{p.c}</td>
                  <td className="p-2 border">{p.l}</td>
                  <td className="p-2 border">{p.chapa === "OUTROS" ? p.outraChapa : p.chapa}</td>
                  <td className="p-2 border">{p.espessura}</td>
                  <td className="p-2 border">{p.fitaOutro}</td>
                  <td className="p-2 border">{p.veio ? "Sim" : "Não"}</td>
                  <td className="p-2 border">{["c1", "c2", "l1", "l2"].filter(l => p.lados[l]).join(", ").toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
