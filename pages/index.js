import { useState } from "react";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    {
      qtde: "",
      nome: "",
      c: "",
      l: "",
      chapa: "Branco TX",
      outraChapa: "",
      espessura: 15,
      veio: false,
      ambiente: "",
      fitaOutro: "Branco TX",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
      observacoes: [],
      obsOutros: ""
    }
  ]);
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
    const ultima = pecas[pecas.length - 1];
    setPecas([
      ...pecas,
      {
        qtde: "",
        nome: "",
        c: "",
        l: "",
        chapa: ultima.chapa,
        outraChapa: "",
        espessura: ultima.espessura,
        veio: false,
        ambiente: "",
        fitaOutro: ultima.chapa,
        lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
        observacoes: [],
        obsOutros: ""
      }
    ]);
  };

  const handleChange = (i, campo, valor) => {
    const novasPecas = [...pecas];
    if (campo === "c" || campo === "l") {
      if (parseInt(valor) > 2750) {
        alert("Atenção: medidas fora do padrão da chapa de MDF. Confira os valores inseridos.");
        return;
      }
    }
    if (campo === "lados" && valor === "todos") {
      const marcar = !novasPecas[i].lados.todos;
      novasPecas[i].lados = { c1: marcar, c2: marcar, l1: marcar, l2: marcar, todos: marcar };
    } else if (campo === "chapa") {
      novasPecas[i].chapa = valor;
      if (valor !== "OUTROS") {
        novasPecas[i].outraChapa = "";
        novasPecas[i].fitaOutro = valor;
      } else {
        novasPecas[i].fitaOutro = "";
      }
    } else if (campo === "outraChapa") {
      novasPecas[i].outraChapa = valor;
      novasPecas[i].fitaOutro = valor;
    } else {
      novasPecas[i][campo] = valor;
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

      {/* Formulário para a primeira peça */}
      {pecas.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-10 gap-2 mb-2">
            <input placeholder="QTDE" type="number" value={pecas[0].qtde} onChange={e => handleChange(0, "qtde", e.target.value)} className="border p-1 col-span-1" />
            <input placeholder="NOME DA PEÇA" value={pecas[0].nome} onChange={e => handleChange(0, "nome", e.target.value)} className="border p-1 col-span-2" />
            <input placeholder="C (mm)" type="number" value={pecas[0].c} onChange={e => handleChange(0, "c", e.target.value)} className="border p-1 col-span-1" />
            <input placeholder="L (mm)" type="number" value={pecas[0].l} onChange={e => handleChange(0, "l", e.target.value)} className="border p-1 col-span-1" />
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
            <input value={pecas[0].fitaOutro || (pecas[0].chapa === "OUTROS" ? pecas[0].fitaOutro : pecas[0].chapa)} onChange={e => handleChange(0, "fitaOutro", e.target.value)} className="border p-1 w-full" />
          </div>
          <div>
            <p>QUAL LADO VAI A FITA?</p>
            {["c1", "c2", "l1", "l2"].map((lado, idx) => (
              <label key={idx} className="mr-2">
                <input type="checkbox" checked={pecas[0].lados[lado]} onChange={() => {
                  const nova = { ...pecas[0].lados, [lado]: !pecas[0].lados[lado] };
                  nova.todos = nova.c1 && nova.c2 && nova.l1 && nova.l2;
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
    </div>
  );
}
