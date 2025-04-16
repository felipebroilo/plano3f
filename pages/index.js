export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    {
      id: 1,
      qtde: 1,
      c: "",
      l: "",
      chapa: "Branco TX",
      espessura: "15",
      veio: false,
      ambiente: "",
      observacoes: [],
      obsOutros: "",
      fita: "Branco TX",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false }
    }
  ]);

  const chapas = [
    "Branco TX",
    "Preto TX",
    "Cru",
    "Mocca Fibraplac",
    "Italian Noce Eucatex",
    "Noce Oro Eucatex",
    "Cinza Italia Lacca Eucatex",
    "OUTROS"
  ];

  const obsFixas = [
    "2F LADO MAIOR",
    "3F LADO MAIOR",
    "4F LADO MAIOR",
    "2F LADO MENOR",
    "OUTROS"
  ];

  const addPeca = () => {
    const ultima = pecas[pecas.length - 1];
    setPecas([...pecas, {
      ...ultima,
      id: pecas.length + 1,
      qtde: 1,
      c: "",
      l: "",
      ambiente: "",
      observacoes: [],
      obsOutros: "",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false }
    }]);
  };

  const excluirPeca = (index) => {
    const novas = pecas.filter((_, i) => i !== index).map((p, i) => ({ ...p, id: i + 1 }));
    setPecas(novas);
  };

  const toggleTodosLados = (index) => {
    const novo = [...pecas];
    const todos = !novo[index].lados.todos;
    novo[index].lados = { c1: todos, c2: todos, l1: todos, l2: todos, todos };
    setPecas(novo);
  };

  const handleChange = (index, campo, valor) => {
    const novo = [...pecas];
    novo[index][campo] = valor;
    if (campo === "chapa" && valor !== "OUTROS") {
      novo[index].fita = valor;
      novo[index].fitaOutro = "";
    }
    setPecas(novo);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Formulário de Peças - 3F</h1>
      <input
        placeholder="CLIENTE"
        value={cliente}
        onChange={e => setCliente(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      {pecas.map((peca, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center mb-4 border-b pb-2">
          <div className="col-span-1 font-semibold">#{peca.id}</div>
          <input className="col-span-1 border p-2" placeholder="QTDE" type="number" value={peca.qtde} onChange={e => handleChange(i, "qtde", e.target.value)} />
          <input className="col-span-1 border p-2" placeholder="C" type="number" value={peca.c} onChange={e => handleChange(i, "c", e.target.value)} />
          <input className="col-span-1 border p-2" placeholder="L" type="number" value={peca.l} onChange={e => handleChange(i, "l", e.target.value)} />
          <select className="col-span-2 border p-2" value={peca.chapa} onChange={e => handleChange(i, "chapa", e.target.value)}>
            {chapas.map((c, idx) => (
              <option key={idx}>{c}</option>
            ))}
          </select>
          {peca.chapa === "OUTROS" && (
            <input className="col-span-2 border p-2" placeholder="Nome da chapa" value={peca.chapaOutro || ""} onChange={e => handleChange(i, "chapa", e.target.value)} />
          )}
          <select className="col-span-1 border p-2" value={peca.espessura} onChange={e => handleChange(i, "espessura", e.target.value)}>
            {["3", "6", "9", "15", "18"].map((esp, idx) => (
              <option key={idx}>{esp}</option>
            ))}
          </select>
          <label className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={peca.veio} onChange={() => handleChange(i, "veio", !peca.veio)} />
            {peca.veio ? "Segue comprimento" : "Pode girar"}
          </label>
          <input className="col-span-2 border p-2" placeholder="AMBIENTE" value={peca.ambiente} onChange={e => handleChange(i, "ambiente", e.target.value)} />
          <div className="col-span-12 text-sm">
            <p>OBSERVAÇÕES:</p>
            {obsFixas.map((obs, idx) => (
              <label key={idx} className="mr-4">
                <input type="checkbox" checked={peca.observacoes.includes(obs)} onChange={(e) => {
                  const novaLista = e.target.checked
                    ? [...peca.observacoes, obs]
                    : peca.observacoes.filter(o => o !== obs);
                  handleChange(i, "observacoes", novaLista);
                }} /> {obs}
              </label>
            ))}
            {peca.observacoes.includes("OUTROS") && (
              <input className="border p-1 mt-1 w-full" placeholder="Especifique" value={peca.obsOutros} onChange={e => handleChange(i, "obsOutros", e.target.value)} />
            )}
          </div>
          <div className="col-span-3">
            <p>FITA:</p>
            <input className="border p-2 w-full" value={peca.fitaOutro || peca.fita} onChange={e => handleChange(i, "fitaOutro", e.target.value)} />
          </div>
          <div className="col
