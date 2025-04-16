import { useState } from "react"

export default function Home() {
  const [cliente, setCliente] = useState("")
  const [pecas, setPecas] = useState([
    {
      qtde: "",
      c: "",
      l: "",
      chapa: "",
      espessura: "15",
      veio: true,
      ambiente: "",
      observacoes: [],
      obsOutros: "",
      fita: "",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
    },
  ])

  const chapas = [
    "Branco TX", "Preto TX", "Cru", "Mocca Fibraplac",
    "Italian Noce Eucatex", "Noce Oro Eucatex",
    "Cinza Italia Lacca Eucatex", "OUTROS",
  ]

  const espessuras = ["HDF 3", "6", "9", "15", "18"]
  const obsFixas = ["2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"]

  const handleChange = (i, field, value) => {
    const newPecas = [...pecas]
    newPecas[i][field] = value
    if (field === "chapa") newPecas[i].fita = value
    setPecas(newPecas)
  }

  const toggleTodosLados = (i) => {
    const todosAtivo = !pecas[i].lados.todos
    const newPecas = [...pecas]
    newPecas[i].lados = {
      c1: todosAtivo,
      c2: todosAtivo,
      l1: todosAtivo,
      l2: todosAtivo,
      todos: todosAtivo,
    }
    setPecas(newPecas)
  }

  const addPeca = () => {
    setPecas([...pecas, JSON.parse(JSON.stringify(pecas[0]))])
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Formulário de Peças - 3F</h1>
      <input
        className="border p-2 w-full"
        placeholder="CLIENTE"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      {pecas.map((peca, i) => (
        <div key={i} className="border p-4 space-y-2">
          <h2 className="font-semibold">Peça #{i + 1}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="QTDE" value={peca.qtde} onChange={e => handleChange(i, "qtde", e.target.value)} className="border p-2" />
            <input placeholder="Comprimento (C) mm" value={peca.c} maxLength={4} onChange={e => handleChange(i, "c", e.target.value)} className="border p-2" />
            <input placeholder="Largura (L) mm" value={peca.l} maxLength={4} onChange={e => handleChange(i, "l", e.target.value)} className="border p-2" />

            <select value={peca.chapa} onChange={e => handleChange(i, "chapa", e.target.value)} className="border p-2">
              <option>CHAPA</option>
              {chapas.map((c, idx) => <option key={idx}>{c}</option>)}
            </select>
            <select value={peca.espessura} onChange={e => handleChange(i, "espessura", e.target.value)} className="border p-2">
              <option>ESPESSURA</option>
              {espessuras.map((e, idx) => <option key={idx}>{e}</option>)}
            </select>
          </div>

          <label className="block mt-2">Sentido do Veio:
            <input type="checkbox" checked={peca.veio} onChange={() => handleChange(i, "veio", !peca.veio)} className="ml-2" />
            {peca.veio ? "Segue comprimento" : "Pode girar"}
          </label>

          <input placeholder="AMBIENTE" value={peca.ambiente} onChange={e => handleChange(i, "ambiente", e.target.value)} className="border p-2 w-full" />

          <div>
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
        </div>
      ))}

      <button onClick={addPeca} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">+ Adicionar Peça</button>
    </div>
  )
}