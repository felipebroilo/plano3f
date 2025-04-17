// pages/index.js
import { useState } from "react";

const materialCodeMap = {
  "BRANCO TX": { "3.0": 1384, "6.0": 1108, "15.0": 1105, "18.0": 1109 },
  "PRETO TX": { "15.0": 1509, "18.0": 1508 },
  "CRU":      { "6.0": 1500, "9.0": 1593, "15.0": 1389, "18.0": 1402 },
  "MOCCA FIBRAPLAC":          { "15.0": 1666, "18.0": 1107 },
  "ITALIAN NOCE EUCATEX":     { "15.0": 1668 },
  "NOCE ORO EUCATEX":         { "15.0": 1669 },
  "CINZA ITALIA LACCA EUCATEX": { "15.0": 1670 },
  "OUTROS": {}
};

function criarPeca(overrides = {}) {
  return {
    qtde: "",
    nome: "",
    c: "",
    l: "",
    chapa: "BRANCO TX",
    outraChapa: "",
    espessura: 15,
    veio: false,
    ambiente: "",
    fitaOutro: "BRANCO TX",
    lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
    observacoes: [],
    obsOutros: "",
    ...overrides,
  };
}

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([criarPeca()]);
  const [selecionado, setSelecionado] = useState(null);

  const chapas = [
    "BRANCO TX",
    "PRETO TX",
    "CRU",
    "MOCCA FIBRAPLAC",
    "ITALIAN NOCE EUCATEX",
    "NOCE ORO EUCATEX",
    "CINZA ITALIA LACCA EUCATEX",
    "OUTROS",
  ];
  const espessuras = [3, 6, 9, 15, 18];
  const obsFixas = [
    "2F LADO MAIOR",
    "3F LADO MAIOR",
    "4F LADO MAIOR",
    "2F LADO MENOR",
    "OUTROS",
  ];
  const nomeSugestoes = [
    "BASE",
    "DIVISORIA",
    "ESPALA",
    "FRENTE",
    "FUNDO",
    "GAVETA",
    "LATERAL",
    "PORTA",
    "PRATELEIRA",
    "TAMPO",
  ];

  const addPeca = () => {
    const ultima = pecas[pecas.length - 1];
    setPecas([
      ...pecas,
      criarPeca({
        chapa: ultima.chapa,
        espessura: ultima.espessura,
        fitaOutro: ultima.fitaOutro,
      }),
    ]);
    setSelecionado(null);
  };

  const handleChange = (i, campo, valor) => {
    const novas = pecas.map((p, idx) => {
      if (idx !== i) return p;
      const at = { ...p };
      if ((campo === "c" || campo === "l") && parseInt(valor) > 2750) {
        alert("Valor máximo de 2750 mm ultrapassado.");
        return p;
      }
      if (campo === "lados") {
        if (valor === "todos") {
          const t = !p.lados.todos;
          at.lados = { c1: t, c2: t, l1: t, l2: t, todos: t };
        } else {
          at.lados = { ...valor };
        }
      } else if (campo === "chapa") {
        at.chapa = valor;
        at.fitaOutro = valor !== "OUTROS" ? valor : "";
        if (valor !== "OUTROS") at.outraChapa = "";
      } else if (campo === "outraChapa") {
        at.outraChapa = valor;
        at.fitaOutro = valor;
      } else {
        at[campo] = valor;
      }
      return at;
    });
    setPecas(novas);
  };

  const excluirPeca = () => {
    if (selecionado !== null) {
      setPecas(pecas.filter((_, idx) => idx !== selecionado));
      setSelecionado(null);
    }
  };

  const getMaterialCode = (chapa, esp) => {
    const e = parseFloat(esp).toFixed(1);
    if (chapa === "OUTROS") return 823;
    return materialCodeMap[chapa]?.[e] ?? "";
  };

  const generateCSV = () => {
    const headers = [
      "DESCRIÇÃO PEÇA",
      "MATERIAL/CODE",
      "COMPRIMENTO",
      "LARGURA",
      "QUANTIDADE",
      "FIBRA",
      "CLIENTE",
      "AMBIENTE",
      "OBSERVAÇÕES",
      "ESPESSURA",
      "CHAPA",
      "C1",
      "C2",
      "L1",
      "L2",
    ];
    const lines = [
      headers.join(";"),
      ...pecas.map((p) => {
        const nome = p.nome.trim() === "" ? "SEM ID" : p.nome;
        const obs = p.observacoes
          .map((o) => (o === "OUTROS" ? p.obsOutros : o))
          .join(", ");
        const esp = parseFloat(p.espessura).toFixed(1);
        const chapaNome = p.chapa === "OUTROS" ? p.outraChapa : p.chapa;
        const fitaText = `FITA ${p.fitaOutro}`;
        return [
          nome,
          getMaterialCode(p.chapa, p.espessura),
          p.c,
          p.l,
          p.qtde,
          p.veio ? "S" : "N",
          cliente,
          p.ambiente,
          obs,
          esp,
          chapaNome,
          p.lados.c1 ? fitaText : "",
          p.lados.c2 ? fitaText : "",
          p.lados.l1 ? fitaText : "",
          p.lados.l2 ? fitaText : "",
        ].join(";");
      }),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plano3f.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Plano de Corte 3F</h1>

      {/* Cliente */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Cliente</label>
        <input
          type="text"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          placeholder="Nome do cliente"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Formulário de Peça */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Nova Peça</h2>
        <div className="grid grid-cols-12 gap-2">
          <input
            type="number"
            placeholder="Qtde"
            className="col-span-1 border rounded p-2"
            value={pecas[pecas.length - 1].qtde}
            onChange={(e) =>
              handleChange(pecas.length - 1, "qtde", e.target.value)
            }
            required
          />

          <input
            type="text"
            list="nome-pecas"
            placeholder="Nome da peça"
            className="col-span-3 border rounded p-2"
            value={pecas[pecas.length - 1].nome}
            onChange={(e) =>
              handleChange(pecas.length - 1, "nome", e.target.value)
            }
          />
          <datalist id="nome-pecas">
            {nomeSugestoes.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>

          <input
            type="number"
            placeholder="C (mm)"
            className="col-span-2 border rounded p-2"
            value={pecas[pecas.length - 1].c}
            onChange={(e) =>
              handleChange(pecas.length - 1, "c", e.target.value)
            }
            required
          />
          <input
            type="number"
            placeholder="L (mm)"
            className="col-span-2 border rounded p-2"
            value={pecas[pecas.length - 1].l}
            onChange={(e) =>
              handleChange(pecas.length - 1, "l", e.target.value)
            }
            required
          />

          <select
            className="col-span-2 border rounded p-2"
            value={pecas[pecas.length - 1].chapa}
            onChange={(e) =>
              handleChange(pecas.length - 1, "chapa", e.target.value)
            }
          >
            {chapas.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>
          {pecas[pecas.length - 1].chapa === "OUTROS" && (
            <input
              type="text"
              placeholder="Especifique chapa"
              className="col-span-2 border rounded p-2"
              value={pecas[pecas.length - 1].outraChapa}
              onChange={(e) =>
                handleChange(
                  pecas.length - 1,
                  "outraChapa",
                  e.target.value
                )
              }
              required
            />
          )}

          <select
            className="col-span-1 border rounded p-2"
            value={pecas[pecas.length - 1].espessura}
            onChange={(e) =>
              handleChange(pecas.length - 1, "espessura", e.target.value)
            }
          >
            {espessuras.map((e, i) => (
              <option key={i}>{e}</option>
            ))}
          </select>

          <label className="col-span-3 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={pecas[pecas.length - 1].veio}
              onChange={() =>
                handleChange(
                  pecas.length - 1,
                  "veio",
                  !pecas[pecas.length - 1].veio
                )
              }
            />
            {pecas[pecas.length - 1].veio
              ? "SEGUE COMPRIMENTO"
              : "PODE GIRAR"}
          </label>

          <input
            type="text"
            placeholder="Ambiente"
            className="col-span-3 border rounded p-2"
            value={pecas[pecas.length - 1].ambiente}
            onChange={(e) =>
              handleChange(pecas.length - 1, "ambiente", e.target.value)
            }
          />
        </div>

        {/* Fita de borda */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">Fita de borda</label>
          <input
            className="w-full border rounded p-2"
            value={pecas[pecas.length - 1].fitaOutro}
            onChange={(e) =>
              handleChange(
                pecas.length - 1,
                "fitaOutro",
                e.target.value
              )
            }
            required
          />
        </div>

        {/* Lados da fita */}
        <div className="mt-4">
          <p className="font-medium mb-1">Lados da fita</p>
          <div className="flex flex-wrap gap-4">
            {["c1", "c2", "l1", "l2"].map((lado) => (
              <label key={lado} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={pecas[pecas.length - 1].lados[lado]}
                  onChange={() =>
                    handleChange(pecas.length - 1, "lados", {
                      ...pecas[pecas.length - 1].lados,
                      [lado]: !pecas[pecas.length - 1].lados[lado],
                    })
                  }
                />
                {lado.toUpperCase()}
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                checked={pecas[pecas.length - 1].lados.todos}
                onChange={() =>
                  handleChange(pecas.length - 1, "lados", "todos")
                }
              />
              TODOS
            </label>
          </div>
        </div>

        {/* Observações */}
        <div className="mt-4">
          <p className="font-medium mb-1">Observações</p>
          <div className="flex flex-wrap gap-4">
            {obsFixas.map((o) => (
              <label key={o} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={pecas[pecas.length - 1].observacoes.includes(o)}
                  onChange={(e) => {
                    const lista = e.target.checked
                      ? [...pecas[pecas.length - 1].observacoes, o]
                      : pecas[pecas.length - 1].observacoes.filter((x) => x !== o);
                    handleChange(pecas.length - 1, "observacoes", lista);
                  }}
                />
                {o}
              </label>
            ))}
          </div>
          {pecas[pecas.length - 1].observacoes.includes("OUTROS") && (
            <input
              type="text"
              placeholder="Especifique"
              className="mt-2 w-full border rounded p-2"
              value={pecas[pecas.length - 1].obsOutros}
              onChange={(e) =>
                handleChange(pecas.length - 1, "obsOutros", e.target.value)
              }
              required
            />
          )}
        </div>

        {/* Botões de ação */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={excluirPeca}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Excluir selecionada
          </button>
          <button
            onClick={addPeca}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            + Adicionar Peça
          </button>
        </div>
      </div>

      {/* Tabela de visualização */}
      <h2 className="text-xl font-bold mb-2">
        Lista de Peças - Cliente: {cliente || "-"}
      </h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-1">#</th>
              <th className="px-2 py-1">Qtde</th>
              <th className="px-2 py-1">Peça</th>
              <th className="px-2 py-1">C (mm)</th>
              <th className="px-2 py-1">L (mm)</th>
              <th className="px-2 py-1">Chapa</th>
              <th className="px-2 py-1">Espessura</th>
              <th className="px-2 py-1">Veio</th>
              <th className="px-2 py-1">Ambiente</th>
              <th className="px-2 py-1">Fita C1</th>
              <th className="px-2 py-1">Fita C2</th>
              <th className="px-2 py-1">Fita L1</th>
              <th className="px-2 py-1">Fita L2</th>
              <th className="px-2 py-1">Obs</th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((p, i) => {
              const obsDisp =
                p.observacoes.map((o) => (o === "OUTROS" ? p.obsOutros : o)).join(", ") ||
                "-";
              return (
                <tr
                  key={i}
                  onClick={() => setSelecionado(i)}
                  className={`cursor-pointer ${
                    selecionado === i ? "bg-blue-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{p.qtde}</td>
                  <td className="border px-2 py-1">{p.nome.trim()||"SEM ID"}</td>
                  <td className="border px-2 py-1">{p.c}</td>
                  <td className="border px-2 py-1">{p.l}</td>
                  <td className="border px-2 py-1">
                    {p.chapa === "OUTROS" ? p.outraChapa : p.chapa}
                  </td>
                  <td className="border px-2 py-1">
                    {parseFloat(p.espessura).toFixed(1)}
                  </td>
                  <td className="border px-2 py-1">{p.veio ? "S" : "N"}</td>
                  <td className="border px-2 py-1">{p.ambiente}</td>
                  <td className="border px-2 py-1">
                    {p.lados.c1 ? `FITA ${p.fitaOutro}` : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {p.lados.c2 ? `FITA ${p.fitaOutro}` : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {p.lados.l1 ? `FITA ${p.fitaOutro}` : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {p.lados.l2 ? `FITA ${p.fitaOutro}` : ""}
                  </td>
                  <td className="border px-2 py-1">{obsDisp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botão Gerar CSV (Excel) */}
      <div className="mt-4">
        <button
          onClick={generateCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Gerar Excel (CSV)
        </button>
      </div>
    </div>
  );
}
