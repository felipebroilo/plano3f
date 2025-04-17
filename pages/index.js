import { useState } from "react";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

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

  const espessuras = [3, 6, 9, 15, 18];
  const obsFixas = ["2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"];

  const addPeca = () => {
    setPecas([
      ...pecas,
      {
        qtde: 0,
        nome: "",
        c: 0,
        l: 0,
        chapa: "Branco TX",
        outraChapa: "",
        espessura: 15,
        veio: false,
        ambiente: "",
        fita: "Branco TX",
        fitaOutro: "",
        lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
        observacoes: [],
        obsOutros: ""
      }
    ]);
  };

  const handleChange = (i, campo, valor) => {
    const novasPecas = [...pecas];
    novasPecas[i][campo] = valor;

    if (campo === "chapa") {
      if (valor !== "OUTROS") {
        novasPecas[i].outraChapa = "";
        novasPecas[i].fitaOutro = valor;
      } else {
        novasPecas[i].fitaOutro = "";
      }
    }

    if (campo === "outraChapa") {
      novasPecas[i].fitaOutro = valor;
    }

    if (campo === "lados" && valor === "todos") {
      const marcar = !novasPecas[i].lados.todos;
      novasPecas[i].lados = { c1: marcar, c2: marcar, l1: marcar, l2: marcar, todos: marcar };
    }

    setPecas(novasPecas);
  };

  const excluirPeca = () => {
    if (selecionado !== null) {
      const novas = [...pecas];
      novas.splice(selecionado, 1);
      setPecas(novas);
      setSelecionado(null);
    }
  };

  return (
    <div className="p-4 font-sans text-sm">
      <h1 className="text-2xl font-bold mb-4">Plano de corte na 3F</h1>
      <div className="mb-4">
        <label className="block mb-1">CLIENTE:
          <input value={cliente} onChange={e => setCliente(e.target.value)} className="ml-2 border p-1" />
        </label>
      </div>

      {pecas.length === 0 && (
        <button onClick={addPeca} className="bg-blue-600 text-white px-4 py-1 rounded">+ Adicionar Peça</button>
      )}

      {pecas.length > 0 && (
        <div>
          {pecas.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-10 gap-2 mb-2">
                <input placeholder="QTDE" type="number" value={pecas[0].qtde} onChange={e => handleChange(0, "qtde", parseInt(e.target.value))} className="border p-1 col-span-1" />
                <input placeholder="NOME DA PEÇA" value={pecas[0].nome} onChange={e => handleChange(0, "nome", e.target.value)} className="border p-1 col-span-2" />
                <input placeholder="C (mm)" type="number" max={2750} value={pecas[0].c} onChange={e => handleChange(0, "c", parseInt(e.target.value) > 2750 ? 2750 : parseInt(e.target.value))} className="border p-1 col-span-1" />
                <input placeholder="L (mm)" type="number" max={2750} value={pecas[0].l} onChange={e => handleChange(0, "l", parseInt(e.target.value) > 2750 ? 2750 : parseInt(e.target.value))} className="border p-1 col-span-1" />
                <select value={pecas[0].chapa} onChange={e => handleChange(0, "chapa", e.target.value)} className="border p-1 col-span-2">
                  {chapas.map((c, i) => <option key={i}>{c}</option>)}
                </select>
                {pecas[0].chapa === "OUTROS" && (
                  <input placeholder="Digite o nome da chapa" value={pecas[0].outraChapa} onChange={e => handleChange(0, "outraChapa", e.target.value)} className="border p-1 col-span-2" />
                )}
                <select value={pecas[0].espessura} onChange={e => handleChange(0, "espessura", e.target.value)} className="border p-1 col-span-1">
                  {espessuras.map((e, i) => <option key={i}>{e}</option>)}
                </select>
                <label className="col-span-2 flex items-center">
                  <input type="checkbox" checked={pecas[0].veio} onChange={() => handleChange(0, "veio", !pecas[0].veio)} className="mr-2" />
                  {pecas[0].veio ? "SEGUE COMPRIMENTO" : "PODE GIRAR"}
                </label>
                <input placeholder="AMBIENTE" value={pecas[0].ambiente} onChange={e => handleChange(0, "ambiente", e.target.value)} className="border p-1 col-span-2" />
              </div>
              <div className="mb-2">
                <p>FITA:</p>
                <input value={pecas[0].fitaOutro || pecas[0].chapa === "OUTROS" ? pecas[0].fitaOutro : pecas[0].chapa} onChange={e => handleChange(0, "fitaOutro", e.target.value)} className="border p-1 w-full" />
              </div>
              <div>
                <p>QUAL LADO VAI A FITA?</p>
                {Object.keys(pecas[0].lados).filter(l => l !== "todos").map((lado, idx) => (
                  <label key={idx} className="mr-2">
                    <input type="checkbox" checked={pecas[0].lados[lado]} onChange={() => {
                      const nova = { ...pecas[0].lados, [lado]: !pecas[0].lados[lado], todos: false };
                      handleChange(0, "lados", nova);
                    }} /> {lado.toUpperCase()}
                  </label>
                ))}
                <label className="ml-4">
                  <input type="checkbox" checked={pecas[0].lados.todos} onChange={() => handleChange(0, "lados", "todos")} /> TODOS OS LADOS
                </label>
              </div>
              <div className="mt-2">
                <p>OBSERVAÇÕES:</p>
                {obsFixas.map((obs, idx) => (
                  <label key={idx} className="mr-4">
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
                  <input placeholder="Especifique" value={pecas[0].obsOutros} onChange={e => handleChange(0, "obsOutros", e.target.value)} className="border p-1 w-full mt-1" />
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={excluirPeca} className="bg-red-500 text-white px-3 py-1 rounded">Excluir Peça</button>
                <button onClick={addPeca} className="bg-green-600 text-white px-3 py-1 rounded">+ Adicionar Peça</button>
              </div>
            </div>
          )}

          {pecas.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">LISTA DE PEÇAS - CLIENTE: {cliente.toUpperCase()}</h2>
              <table className="w-full border text-left text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2">#</th>
                    <th className="border px-2">QTDE</th>
                    <th className="border px-2">PEÇA</th>
                    <th className="border px-2">C</th>
                    <th className="border px-2">L</th>
                    <th className="border px-2">CHAPA</th>
                    <th className="border px-2">ESPESSURA</th>
                    <th className="border px-2">FIBRA</th>
                    <th className="border px-2">AMBIENTE</th>
                    <th className="border px-2">FITA C1</th>
                    <th className="border px-2">FITA C2</th>
                    <th className="border px-2">FITA L1</th>
                    <th className="border px-2">FITA L2</th>
                    <th className="border px-2">OBS</th>
                  </tr>
                </thead>
                <tbody>
                  {pecas.map((p, i) => (
                    <tr key={i} className={`border cursor-pointer ${selecionado === i ? "bg-yellow-200" : ""}`} onClick={() => setSelecionado(i)}>
                      <td className="border px-2">{i + 1}</td>
                      <td className="border px-2">{p.qtde}</td>
                      <td className="border px-2">{p.nome}</td>
                      <td className="border px-2">{p.c}</td>
                      <td className="border px-2">{p.l}</td>
                      <td className="border px-2">{p.chapa === "OUTROS" ? p.outraChapa : p.chapa}</td>
                      <td className="border px-2">{p.espessura}</td>
                      <td className="border px-2">{p.veio ? "SEGUE COMPRIMENTO" : "PODE GIRAR"}</td>
                      <td className="border px-2">{p.ambiente}</td>
                      <td className="border px-2">{p.lados.c1 ? "X" : ""}</td>
                      <td className="border px-2">{p.lados.c2 ? "X" : ""}</td>
                      <td className="border px-2">{p.lados.l1 ? "X" : ""}</td>
                      <td className="border px-2">{p.lados.l2 ? "X" : ""}</td>
                      <td className="border px-2">
                        {[...p.observacoes.filter(o => o !== "OUTROS"), p.obsOutros].join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}