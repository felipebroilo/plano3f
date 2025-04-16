
import { useState } from "react"

export default function Home() {
  const [cliente, setCliente] = useState("")
  const [pecas, setPecas] = useState([
    {
      id: 1,
      qtde: "",
      comprimento: "",
      largura: "",
      chapa: "Branco TX",
      espessura: "15",
      veio: false,
      ambiente: "",
      observacoes: [],
      obsOutros: "",
      fita: "Branco TX",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
    },
  ])

  const opcoesChapas = ["Branco TX", "Preto TX", "Cru", "Mocca Fibraplac", "Italian Noce Eucatex", "Noce Oro Eucatex", "Cinza Italia Lacca Eucatex", "OUTROS"]
  const espessuras = ["3", "6", "9", "15", "18"]
  const obsFixas = ["2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"]

  const handleChange = (index, campo, valor) => {
    const novasPecas = [...pecas]
    novasPecas[index][campo] = valor

    // Atualiza fita automaticamente com base na chapa, se não estiver usando opção manual
    if (campo === "chapa" && valor !== "OUTROS") {
      novasPecas[index].fita = valor
      novasPecas[index].fitaOutro = ""
    }

    // Se mudar a espessura ou chapa, mas fita outro tiver valor, mantém ele
    if (campo === "chapa" && valor === "OUTROS") {
      novasPecas[index].fita = ""
    }

    setPecas(novasPecas)
  }

  const toggleTodosLados = (index) => {
    const novasPecas = [...pecas]
    const todos = !novasPecas[index].lados.todos
    novasPecas[index].lados = {
      c1: todos,
      c2: todos,
      l1: todos,
      l2: todos,
      todos,
    }
    setPecas(novasPecas)
  }

  const addPeca = () => {
    const ultima = pecas[pecas.length - 1]
    setPecas([
      ...pecas,
      {
        ...pecas[0],
        id: pecas.length + 1,
        qtde: "",
        comprimento: "",
        largura: "",
        veio: false,
        ambiente: "",
        observacoes: [],
        obsOutros: "",
        lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
        fitaOutro: "",
        fita: ultima.fita,
        chapa: ultima.chapa,
        espessura: ultima.espessura,
      },
    ])
  }

  const removePeca = (index) => {
    const novas = [...pecas]
    novas.splice(index, 1)
    setPecas(novas)
  }

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Formulário de Peças - 3F</h1>
      <input placeholder="CLIENTE" value={cliente} onChange={e => setCliente(e.target.value)} className="border p-2 mb-4 w-full" />

      {pecas.map((peca, i) => (
        <div key={i} className="mb-6 border-b pb-4">
          <h2 className="text-lg font-semibold mb-2">Peça #{peca.id}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <input placeholder="QTDE" value={peca.qtde} onChange={e => handleChange(i, "qtde", e.target.value)} className="border p-2 w-24" />
            <input placeholder="Comprimento (C) mm" value={peca.comprimento} onChange={e => handleChange(i, "comprimento", e.target.value)} className="border p-2 w-40" />
            <input placeholder="Largura (L) mm" value={peca.largura} onChange={e => handleChange(i, "largura", e.target.value)} className="border p-2 w-40" />
            <select value={peca.chapa} onChange={e => handleChange(i, "chapa", e.target.value)} className="border p-2">
              {opcoesChapas.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
            {peca.chapa === "OUTROS" && (
              <input placeholder="Escreva a Chapa" value={peca.chapaOutro || ""} onChange={e => handleChange(i, "chapaOutro", e.target.value)} className="border p-2 w-40" />
            )}
            <select value={peca.espessura} onChange={e => handleChange(i, "espessura", e.target.value)} className="border p-2">
              {espessuras.map((esp, idx) => (
                <option key={idx} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <label className="block mt-2">
            Sentido do Veio:
            <input type="checkbox" checked={peca.veio} onChange={() => handleChange(i, "veio", !peca.veio)} className="ml-2" />
            {peca.veio ? "Segue comprimento" : "Pode girar"}
          </label>

          <input placeholder="AMBIENTE" value={peca.ambiente} onChange={e => handleChange(i, "ambiente", e.target.value)} className="border p-2 w-full mt-2" />

          <div className="mt-2">
            <p>OBSERVAÇÕES:</p>
            {obsFixas.map((obs, idx) => (
              <label key={idx} className="mr-4">
                <input
                  type="checkbox"
                  checked={peca.observacoes.includes(obs)}
                  onChange={(e) => {
                    const checked = e.target.checked
                    const novaLista = checked
                      ? [...peca.observacoes, obs]
                      : peca.observacoes.filter(o => o !== obs)
                    handleChange(i, "observacoes", novaLista)
                  }}
                /> {obs}
              </label>
            ))}
            {peca.observacoes.includes("OUTROS") && (
              <input placeholder="Especifique" value={peca.obsOutros} onChange={e => handleChange(i, "obsOutros", e.target.value)} className="border p-2 w-full mt-1" />
            )}
          </div>

          <div className="mt-2">
            <p>FITA:</p>
            <input placeholder="Fita" value={peca.fitaOutro || peca.fita} onChange={e => handleChange(i, "fitaOutro", e.target.value)} className="border p-2 w-full" />
          </div>

          <div className="mt-2">
            <p>QUAL LADO VAI A FITA?</p>
            {["c1", "c2", "l1", "l2"].map((lado, idx) => (
              <label key={idx} className="mr-2">
                <input type="checkbox" checked={peca.lados[lado]} onChange={() => {
                  const newPecas = [...pecas]
                  newPecas[i].lados[lado] = !newPecas[i].lados[lado]
                  setPecas(newPecas)
                }} /> {lado.toUpperCase()}
              </label>
            ))}
            <label className="ml-4">
              <input type="checkbox" checked={peca.lados.todos} onChange={() => toggleTodosLados(i)} /> TODOS OS LADOS
            </label>
          </div>

          <button onClick={() => removePeca(i)} className="bg-red-600 text-white px-3 py-1 mt-2 rounded">Excluir Peça</button>
        </div>
      ))}

      <button onClick={addPeca} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">+ Adicionar Peça</button>
    </div>
  )
}
