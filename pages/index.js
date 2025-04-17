// pages/index.js
import { useState } from "react";

function criarPeca(overrides = {}) {
  return {
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
    obsOutros: "",
    ...overrides,
  };
}

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([criarPeca()]);
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
  const obsFixas = [
    "2F LADO MAIOR",
    "3F LADO MAIOR",
    "4F LADO MAIOR",
    "2F LADO MENOR",
    "OUTROS",
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
      const atualizado = { ...p };

      if ((campo === "c" || campo === "l") && parseInt(valor) > 2750) {
        alert("Valor máximo de 2750 mm ultrapassado.");
        return p;
      }

      if (campo === "lados") {
        if (valor === "todos") {
          const toggle = !p.lados.todos;
          atualizado.lados = {
            c1: toggle,
            c2: toggle,
            l1: toggle,
            l2: toggle,
            todos: toggle,
          };
        } else {
          atualizado.lados = { ...valor };
        }
      } else if (campo === "chapa") {
        atualizado.chapa = valor;
        atualizado.fitaOutro = valor !== "OUTROS" ? valor : "";
        if (valor !== "OUTROS") atualizado.outraChapa = "";
      } else if (campo === "outraChapa") {
        atualizado.outraChapa = valor;
        atualizado.fitaOutro = valor;
      } else {
        atualizado[campo] = valor;
      }

      return atualizado;
    });
    setPecas(novas);
  };

  const excluirPeca = () => {
    if (selecionado !== null) {
      setPecas(pecas.filter((_, idx) => idx !== selecionado));
      setSelecionado(null);
    }
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
          className="w-full border rounded px-3 py-2"
          placeholder="Nome do cliente"
          required
        />
      </div>

      {/* Formulário da última peça */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Nova Peça</h2>
        <div className="grid grid-cols-12 gap-2">
          <input
            type="number"
            value={pecas[pecas.length - 1].qtde}
            onChange={(e) =>
              handleChange(pecas.length - 1, "qtde", e.target.value)
            }
            placeholder="Qtde"
            className="col-span-1 border rounded p-2"
            required
          />
          <input
            type="text"
            value={pecas[pecas.length - 1].nome}
            onChange={(e) =>
              handleChange(pecas.length - 1, "nome", e.target.value)
            }
            placeholder="Nome da peça"
            className="col-span-3 border rounded p-2"
            required
          />
          <input
            type="number"
            value={pecas[pecas.length - 1].c}
            onChange={(e) =>
              handleChange(pecas.length - 1, "c", e.target.value)
            }
            placeholder="C (mm)"
            className="col-span-2 border rounded p-2"
            required
          />
          <input
            type="number"
            value={pecas[pecas.length - 1].l}
            onChange={(e) =>
              handleChange(pecas.length - 1, "l", e.target.value)
            }
            placeholder="L (mm)"
            className="col-span-2 border rounded p-2"
            required
          />
          <select
            value={pecas[pecas.length - 1].chapa}
            onChange={(e) =>
              handleChange(pecas.length - 1, "chapa", e.target.value)
            }
            className="col-span-2 border rounded p-2"
          >
            {chapas.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>
          {pecas[pecas.length - 1].chapa === "OUTROS" && (
            <input
              type="text"
              value={pecas[pecas.length - 1].outraChapa}
              onChange={(e) =>
                handleChange(
                  pecas.length - 1,
                  "outraChapa",
                  e.target.value
                )
              }
              placeholder="Especifique chapa"
              className="col-span-2 border rounded p-2"
              required
            />
          )}
          <select
            value={pecas[pecas.length - 1].espessura}
            onChange={(e) =>
              handleChange(
                pecas.length - 1,
                "espessura",
                e.target.value
              )
            }
            className="col-span-1 border rounded p-2"
          >
            {espessuras.map((e, i) => (
              <option key={i}>{e}</option>
            ))}
          </select>
          <label className="col-span-3 flex items-center">
            <input
              type="checkbox"
              checked={pecas[pecas.length - 1].veio}
              onChange={() =>
                handleChange(
                  pecas.length - 1,
                  "veio",
                  !pecas[pecas.length - 1].veio
                )
              }
              className="mr-2"
            />
            {pecas[pecas.length - 1].veio
              ? "Segue comprimento"
              : "Pode girar"}
          </label>
          <input
            type="text"
            value={pecas[pecas.length - 1].ambiente}
            onChange={(e) =>
              handleChange(
                pecas.length - 1,
                "ambiente",
                e.target.value
              )
            }
            placeholder="Ambiente"
            className="col-span-3 border rounded p-2"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">Fita de borda</label>
          <input
            type="text"
            value={pecas[pecas.length - 1].fitaOutro}
            onChange={(e) =>
              handleChange(
                pecas.length - 1,
                "fitaOutro",
                e.target.value
              )
            }
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mt-4">
          <p className="font-medium mb-1">Lados da fita</p>
          <div className="flex flex-wrap gap-4">
            {["c1", "c2", "l1", "l2"].map((lado) => (
              <label key={lado} className="flex items-center">
                <input
                  type="checkbox"
                  checked={pecas[pecas.length - 1].lados[lado]}
                  onChange={() =>
                    handleChange(pecas.length - 1, "lados", {
                      ...pecas[pecas.length - 1].lados,
                      [lado]: !pecas[pecas.length - 1].lados[lado],
                    })
                  }
                  className="mr-1"
                />
                {lado.toUpperCase()}
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pecas[pecas.length - 1].lados.todos}
                onChange={() =>
                  handleChange(pecas.length - 1, "lados", "todos")
                }
                className="mr-1"
              />
              TODOS
            </label>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-medium mb-1">Observações</p>
          <div className="flex flex-wrap gap-4">
            {obsFixas.map((obs) => (
              <label key={obs} className="flex items-center">
                <input
                  type="checkbox"
                  checked={pecas[pecas.length - 1].observacoes.includes(obs)}
                  onChange={(e) => {
                    const lista = e.target.checked
                      ? [...pecas[pecas.length - 1].observacoes, obs]
                      : pecas[pecas.length - 1].observacoes.filter(
                          (o) => o !== obs
                        );
                    handleChange(
                      pecas.length - 1,
                      "observacoes",
                      lista
                    );
                  }}
                  className="mr-1"
                />
                {obs}
              </label>
            ))}
          </div>
          {pecas[pecas.length - 1].observacoes.includes("OUTROS") && (
            <input
              type="text"
              value={pecas[pecas.length - 1].obsOutros}
              onChange={(e) =>
                handleChange(
                  pecas.length - 1,
                  "obsOutros",
                  e.target.value
                )
              }
              placeholder="Especifique"
              className="mt-2 w-full border rounded p-2"
              required
            />
          )}
        </div>

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

      {/* Lista de Peças */}
      <h2 className="text-xl font-bold mb-2">
        Lista de Peças - Cliente: {cliente || "-"}
      </h2>
      <div className="overflow-x-auto">
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
              const obsDisplay = p.observacoes
                .map((o) => (o === "OUTROS" ? p.obsOutros : o))
                .join(", ") || "-";
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
                  <td className="border px-2 py-1">{p.nome}</td>
                  <td className="border px-2 py-1">{p.c}</td>
                  <td className="border px-2 py-1">{p.l}</td>
                  <td className="border px-2 py-1">
                    {p.chapa === "OUTROS" ? p.outraChapa : p.chapa}
                  </td>
                  <td className="border px-2 py-1">{p.espessura}</td>
                  <td className="border px-2 py-1">{p.veio ? "S" : "N"}</td>
                  <td className="border px-2 py-1">{p.ambiente}</td>
                  <td className="border px-2 py-1">{p.lados.c1 ? "X" : ""}</td>
                  <td className="border px-2 py-1">{p.lados.c2 ? "X" : ""}</td>
                  <td className="border px-2 py-1">{p.lados.l1 ? "X" : ""}</td>
                  <td className="border px-2 py-1">{p.lados.l2 ? "X" : ""}</td>
                  <td className="border px-2 py-1">{obsDisplay}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
