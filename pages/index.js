// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [cliente, setCliente] = useState('');
  const [pecas, setPecas] = useState([
    {
      qtde: '',
      nome: '',
      comprimento: '',
      largura: '',
      chapa: 'Branco TX',
      chapaOutro: '',
      espessura: '15',
      veio: false,
      ambiente: '',
      fita: 'Branco TX',
      fitaOutro: '',
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
      observacoes: [],
      obsOutros: ''
    }
  ]);

  const chapas = ['Branco TX', 'Preto TX', 'Cru', 'Mocca Fibraplac', 'Italian Noce Eucatex', 'Noce Oro Eucatex', 'Cinza Italia Lacca Eucatex', 'OUTROS'];
  const espessuras = ['3', '6', '9', '15', '18'];
  const obsFixas = ['2F LADO MAIOR', '3F LADO MAIOR', '4F LADO MAIOR', '2F LADO MENOR', 'OUTROS'];

  const handleChange = (index, field, value) => {
    const novasPecas = [...pecas];
    novasPecas[index][field] = value;
    if (field === 'chapa') {
      if (value !== 'OUTROS') {
        novasPecas[index].fita = value;
        novasPecas[index].fitaOutro = '';
        novasPecas[index].chapaOutro = '';
      }
    }
    setPecas(novasPecas);
  };

  const toggleTodosLados = (index) => {
    const novasPecas = [...pecas];
    const novoValor = !novasPecas[index].lados.todos;
    novasPecas[index].lados = {
      c1: novoValor,
      c2: novoValor,
      l1: novoValor,
      l2: novoValor,
      todos: novoValor
    };
    setPecas(novasPecas);
  };

  const addPeca = () => {
    const nova = JSON.parse(JSON.stringify(pecas[pecas.length - 1]));
    nova.qtde = '';
    nova.nome = '';
    nova.comprimento = '';
    nova.largura = '';
    nova.veio = false;
    nova.ambiente = '';
    nova.fitaOutro = '';
    nova.chapaOutro = '';
    nova.lados = { c1: false, c2: false, l1: false, l2: false, todos: false };
    nova.observacoes = [];
    nova.obsOutros = '';
    setPecas([...pecas, nova]);
  };

  const removerPeca = (index) => {
    const novas = pecas.filter((_, i) => i !== index);
    setPecas(novas);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-600 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Plano de corte na 3F</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium">CLIENTE:</label>
        <input value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full p-2 rounded text-black" />
      </div>

      {pecas.map((peca, i) => (
        <div key={i} className="bg-white text-black rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <input placeholder="QTDE" value={peca.qtde} onChange={(e) => handleChange(i, 'qtde', e.target.value.replace(/\D/g, ''))} className="p-2 rounded border" />
            <input placeholder="NOME DA PEÇA" value={peca.nome} onChange={(e) => handleChange(i, 'nome', e.target.value)} className="p-2 rounded border" />
            <input placeholder="C (mm)" value={peca.comprimento} onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (val <= 2750) handleChange(i, 'comprimento', val);
              else alert('Comprimento acima do permitido (2750 mm)');
            }} className="p-2 rounded border" />
            <input placeholder="L (mm)" value={peca.largura} onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (val <= 2750) handleChange(i, 'largura', val);
              else alert('Largura acima do permitido (2750 mm)');
            }} className="p-2 rounded border" />
            <select value={peca.chapa} onChange={(e) => handleChange(i, 'chapa', e.target.value)} className="p-2 rounded border col-span-2">
              {chapas.map((c, idx) => <option key={idx}>{c}</option>)}
            </select>
            {peca.chapa === 'OUTROS' && (
              <input placeholder="Digite o nome da chapa" value={peca.chapaOutro} onChange={(e) => handleChange(i, 'chapaOutro', e.target.value)} className="p-2 rounded border col-span-2" />
            )}
            <select value={peca.espessura} onChange={(e) => handleChange(i, 'espessura', e.target.value)} className="p-2 rounded border">
              {espessuras.map((e, idx) => <option key={idx}>{e}</option>)}
            </select>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={peca.veio} onChange={() => handleChange(i, 'veio', !peca.veio)} />
              <span>{peca.veio ? 'Segue comprimento' : 'Pode girar'}</span>
            </label>
            <input placeholder="AMBIENTE" value={peca.ambiente} onChange={(e) => handleChange(i, 'ambiente', e.target.value)} className="p-2 rounded border col-span-2" />
          </div>

          <div className="mt-4">
            <label className="block mb-1">FITA:</label>
            <input value={peca.fitaOutro || peca.fita} onChange={(e) => handleChange(i, 'fitaOutro', e.target.value)} className="p-2 rounded border w-full" />
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-1">QUAL LADO VAI A FITA?</p>
            <div className="flex flex-wrap gap-4">
              {['c1', 'c2', 'l1', 'l2'].map((lado, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="checkbox" checked={peca.lados[lado]} onChange={() => {
                    const newPecas = [...pecas];
                    newPecas[i].lados[lado] = !peca.lados[lado];
                    setPecas(newPecas);
                  }} /> {lado.toUpperCase()}
                </label>
              ))}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={peca.lados.todos} onChange={() => toggleTodosLados(i)} /> TODOS OS LADOS
              </label>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-1">OBSERVAÇÕES:</p>
            <div className="flex flex-wrap gap-4">
              {obsFixas.map((obs, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="checkbox" checked={peca.observacoes.includes(obs)} onChange={(e) => {
                    const novaLista = e.target.checked ? [...peca.observacoes, obs] : peca.observacoes.filter(o => o !== obs);
                    handleChange(i, 'observacoes', novaLista);
                  }} /> {obs}
                </label>
              ))}
            </div>
            {peca.observacoes.includes('OUTROS') && (
              <input placeholder="Especifique" value={peca.obsOutros} onChange={e => handleChange(i, 'obsOutros', e.target.value)} className="p-2 rounded border w-full mt-2" />
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={() => removerPeca(i)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Excluir Peça</button>
          </div>
        </div>
      ))}

      <button onClick={addPeca} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">+ Adicionar Peça</button>
    </div>
  );
}
