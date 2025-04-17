import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([createNovaPeca()]);
  const [selecionado, setSelecionado] = useState(null);

  const chapas = [
    "Branco TX", "Preto TX", "Cru", "Mocca Fibraplac", 
    "Italian Noce Eucatex", "Noce Oro Eucatex", "Cinza Italia Lacca Eucatex", "OUTROS",
  ];
  const espessuras = [3, 6, 9, 15, 18];
  const obsFixas = [
    "2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"
  ];

  function createNovaPeca(overrides = {}) {
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
      ...overrides
    };
  }

  const addPeca = () => {
    const ultima = pecas[pecas.length - 1];
    setPecas([...pecas, createNovaPeca({ chapa: ultima.chapa, espessura: ultima.espessura, fitaOutro: ultima.fitaOutro })]);
  };

  const handleChange = (i, campo, valor) => {
    const novas = pecas.map((p, idx) => {
      if (idx !== i) return p;
      const updated = { ...p };

      if ((campo === "c" || campo === "l") && parseInt(valor) > 2750) {
        return p;
      }
      if (campo === "lados") {
        updated.lados = valor === 'todos'
          ? { c1: !p.lados.todos, c2: !p.lados.todos, l1: !p.lados.todos, l2: !p.lados.todos, todos: !p.lados.todos }
          : { ...valor };
      } else if (campo === "chapa") {
        updated.chapa = valor;
        if (valor !== "OUTROS") {
          updated.outraChapa = "";
          updated.fitaOutro = valor;
        } else {
          updated.fitaOutro = "";
        }
      } else if (campo === "outraChapa") {
        updated.outraChapa = valor;
        updated.fitaOutro = valor;
      } else {
        updated[campo] = valor;
      }
      return updated;
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Plano de Corte 3F</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">CLIENTE</label>
        <input
          type="text"
          value={cliente}
          onChange={e => setCliente(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Nome do cliente"
        />
      </div>

      {pecas.map((peca, idx) => (
        <Card key={idx} className="mb-4">
          <CardContent>
            <div className="grid grid-cols-12 gap-3">
              <input
                type="number"
                value={peca.qtde}
                onChange={e => handleChange(idx, 'qtde', e.target.value)}
                placeholder="QTDE"
                className="col-span-1 border rounded p-2"
              />
              <input
                type="text"
                value={peca.nome}
                onChange={e => handleChange(idx, 'nome', e.target.value)}
                placeholder="NOME DA PEÇA"
                className="col-span-3 border rounded p-2"
              />
              <input
                type="number"
                value={peca.c}
                onChange={e => handleChange(idx, 'c', e.target.value)}
                placeholder="C (mm)"
                className="col-span-2 border rounded p-2"
              />
              <input
                type="number"
                value={peca.l}
                onChange={e => handleChange(idx, 'l', e.target.value)}
                placeholder="L (mm)"
                className="col-span-2 border rounded p-2"
              />
              <select
                value={peca.chapa}
                onChange={e => handleChange(idx, 'chapa', e.target.value)}
                className="col-span-3 border rounded p-2"
              >
                {chapas.map((ch, i) => <option key={i}>{ch}</option>)}
              </select>
            </div>

            {/* Demais campos e botões no mesmo estilo responsivo */}
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-3 mt-4">
        <Button variant="destructive" onClick={excluirPeca}>Excluir Peça</Button>
        <Button onClick={addPeca}>+ Adicionar Peça</Button>
      </div>

      {/* Aqui depois: tabela de visualização em tempo real e botão de export */}
    </div>
  );
}
