import { useState } from "react";

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    {
      qtde: "",
      c: "",
      l: "",
      chapa: "",
      espessura: "",
      veio: true,
      ambiente: "",
      observacoes: [],
      obsOutros: "",
      fita: "",
      fitaOutro: "",
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
    },
  ]);

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

  const espessuras = ["HDF 3", "6", "9", "15", "18"];
  const obsFixas = [
    "2F LADO MAIOR",
    "3F LADO MAIOR",
    "4F LADO MAIOR",
    "2F LADO MENOR",
    "OUTROS",
  ];

  const toggleTodosLados = (index) => {
    const newPecas = [...pecas];
    const todosAtivado = !newPecas[index].lados.todos;
    newPecas[index].lados = {
      c1: todosAtivado,
      c2: todosAtivado,
      l1: todosAtivado,
      l2: todosAtivado,
      todos: todosAtivado,
    };
    setPecas(newPecas);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Formulário de Peças - 3F</h1>
      <input
        className="border p-2 w-full mb-4"
        placeholder="CLIENTE"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />
      <p className="italic text-gray-500 mb-2">Adicione suas peças abaixo:</p>
      {/* A lógica de renderização continua… */}
    </div>
  );
}
