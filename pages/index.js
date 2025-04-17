// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [cliente, setCliente] = useState('');
  const [pecas, setPecas] = useState([criarNovaPeca()]);
  const [selecionado, setSelecionado] = useState(null);

  function criarNovaPeca() {
    return {
      qtde: '',
      nome: '',
      c: '',
      l: '',
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
    };
  }

  function handleChange(index, campo, valor) {
    const novasPecas = [...pecas];
    novasPecas[index][campo] = valor;

    // Atualiza fita com base na chapa (inclusive quando OUTROS é editado)
    if (campo === 'chapa') {
      if (valor !== 'OUTROS') {
        novasPecas[index].fitaOutro = valor;
      } else {
        novasPecas[index].chapaOutro = '';
        novasPecas[index].fitaOutro = '';
      }
    }
    if (campo === 'chapaOutro') {
      novasPecas[index].fitaOutro = valor;
    }

    if (campo === 'lados') {
      novasPecas[index].lados = valor;
    }

    setPecas(novasPecas);
  }

  function toggleLado(index, lado) {
    const novasPecas = [...pecas];
    novasPecas[index].lados[lado] = !novasPecas[index].lados[lado];
    novasPecas[index].lados.todos = false;
    setPecas(novasPecas);
  }

  function toggleTodosLados(index) {
    const novasPecas = [...pecas];
    const marcar = !novasPecas[index].lados.todos;
    novasPecas[index].lados = {
      c1: marcar,
      c2: marcar,
      l1: marcar,
      l2: marcar,
      todos: marcar
    };
    setPecas(novasPecas);
  }

  function addPeca() {
    setPecas([...pecas, criarNovaPeca()]);
  }

  function excluirPeca() {
    if (selecionado !== null) {
      const novas = pecas.filter((_, i) => i !== selecionado);
      setPecas(novas);
      setSelecionado(null);
    }
  }

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Plano de corte na 3F</h1>
      <div className="mb-4">
        <label className="mr-2">CLIENTE:</label>
        <input
          value={cliente}
          onChange={e => setCliente(e.target.value)}
          className="border p-1"
        />
      </div>

      {pecas.map((peca, i) => (
        <div key={i} className="mb-2 border p-2 rounded bg-white">
          <div className="grid grid-cols-10 gap-2 mb-1">
            <input placeholder="QTDE" value={peca.qtde} onChange={e => handleChange(i, 'qtde', e.target.value.replace(/\D/g, ''))} className="col-span-1 border p-1" />
            <input placeholder="NOME DA PEÇA" value={peca.nome} onChange={e => handleChange(i, 'nome', e.target.value)} className="col-span-2 border p-1" />
            <input placeholder="C (mm)" value={peca.c} max={2750} onChange={e => handleChange(i, 'c', Math.min(2750, Number(e.target.value)) || '')} className="col-span-1 border p-1" />
            <input placeholder="L (mm)" value={peca.l} max={2750} onChange={e => handleChange(i, 'l', Math.min(2750, Number(e.target.value)) || '')} className="col-span-1 border p-1" />
            <select value={peca.chapa} onChange={e => handleChange(i, 'chapa', e.target.value)} className="col-span-2 border p-1">
              <option>Branco TX</option>
              <option>Preto TX</option>
              <option>Mocca Fibraplac</option>
              <option>Italian Noce Eucatex</option>
              <option>Noce Oro Eucatex</option>
              <option>Cinza Italia Lacca Eucatex</option>
              <option>OUTROS</option>
            </select>
            {peca.chapa === 'OUTROS' && (
              <input placeholder="Digite o nome da chapa" value={peca.chapaOutro} onChange={e => handleChange(i, 'chapaOutro', e.target.value)} className="col-span-2 border p-1" />
            )}
            <select value={peca.espessura} onChange={e => handleChange(i, 'espessura', e.target.value)} className="col-span-1 border p-1">
              <option>3</option><option>6</option><option>9</option><option>15</option><option>18</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <label>
              <input type="checkbox" checked={peca.veio} onChange={() => handleChange(i, 'veio', !peca.veio)} />{' '}
              {peca.veio ? 'SEGUE COMPRIMENTO' : 'PODE GIRAR'}
            </label>
            <input placeholder="AMBIENTE" value={peca.ambiente} onChange={e => handleChange(i, 'ambiente', e.target.value)} className="border p-1" />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p>FITA:</p>
              <input
                value={peca.fitaOutro}
                onChange={e => handleChange(i, 'fitaOutro', e.target.value)}
                className="border p-1 w-full"
              />
            </div>
            <div>
              <p>QUAL LADO VAI A FITA?</p>
              {['c1', 'c2', 'l1', 'l2'].map((lado, idx) => (
                <label key={idx} className="mr-2">
                  <input type="checkbox" checked={peca.lados[lado]} onChange={() => toggleLado(i, lado)} /> {lado.toUpperCase()}
                </label>
              ))}
              <label className="ml-4">
                <input type="checkbox" checked={peca.lados.todos} onChange={() => toggleTodosLados(i)} /> TODOS OS LADOS
              </label>
            </div>
          </div>

          <div className="mb-2">
            <p>OBSERVAÇÕES:</p>
            {['2F LADO MAIOR', '3F LADO MAIOR', '4F LADO MAIOR', '2F LADO MENOR', 'OUTROS'].map((obs, idx) => (
              <label key={idx} className="mr-2">
                <input
                  type="checkbox"
                  checked={peca.observacoes.includes(obs)}
                  onChange={e => {
                    const checked = e.target.checked;
                    const novaLista = checked
                      ? [...peca.observacoes, obs]
                      : peca.observacoes.filter(o => o !== obs);
                    handleChange(i, 'observacoes', novaLista);
                  }}
                />{' '}{obs}
              </label>
            ))}
            {peca.observacoes.includes('OUTROS') && (
              <input placeholder="Especifique" value={peca.obsOutros} onChange={e => handleChange(i, 'obsOutros', e.target.value)} className="border p-1 w-full mt-1" />
            )}
          </div>

          <button onClick={excluirPeca} className="bg-red-600 text-white px-3 py-1 rounded">Excluir Peça</button>
        </div>
      ))}

      <button onClick={addPeca} className="bg-blue-600 text-white px-4 py-2 rounded">+ Adicionar Peça</button>

      {pecas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">LISTA DE PEÇAS - CLIENTE: {cliente.toUpperCase()}</h2>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black px-2 py-1">#</th>
                <th className="border border-black px-2 py-1">QTDE</th>
                <th className="border border-black px-2 py-1">PEÇA</th>
                <th className="border border-black px-2 py-1">C</th>
                <th className="border border-black px-2 py-1">L</th>
                <th className="border border-black px-2 py-1">CHAPA</th>
                <th className="border border-black px-2 py-1">ESPESSURA</th>
                <th className="border border-black px-2 py-1">FIBRA</th>
                <th className="border border-black px-2 py-1">AMBIENTE</th>
                <th className="border border-black px-2 py-1">FITA C1</th>
                <th className="border border-black px-2 py-1">FITA C2</th>
                <th className="border border-black px-2 py-1">FITA L1</th>
                <th className="border border-black px-2 py-1">FITA L2</th>
                <th className="border border-black px-2 py-1">OBS</th>
              </tr>
            </thead>
            <tbody>
              {pecas.map((p, i) => (
                <tr
                  key={i}
                  className={selecionado === i ? 'bg-yellow-200' : ''}
                  onClick={() => setSelecionado(i)}
                >
                  <td className="border border-black px-2 py-1">{i + 1}</td>
                  <td className="border border-black px-2 py-1">{p.qtde}</td>
                  <td className="border border-black px-2 py-1">{p.nome}</td>
                  <td className="border border-black px-2 py-1">{p.c}</td>
                  <td className="border border-black px-2 py-1">{p.l}</td>
                  <td className="border border-black px-2 py-1">{p.chapa === 'OUTROS' ? p.chapaOutro : p.chapa}</td>
                  <td className="border border-black px-2 py-1">{p.espessura}</td>
                  <td className="border border-black px-2 py-1">{p.veio ? 'SEGUE COMPRIMENTO' : 'PODE GIRAR'}</td>
                  <td className="border border-black px-2 py-1">{p.ambiente}</td>
                  <td className="border border-black px-2 py-1">{p.lados.c1 ? 'X' : ''}</td>
                  <td className="border border-black px-2 py-1">{p.lados.c2 ? 'X' : ''}</td>
                  <td className="border border-black px-2 py-1">{p.lados.l1 ? 'X' : ''}</td>
                  <td className="border border-black px-2 py-1">{p.lados.l2 ? 'X' : ''}</td>
                  <td className="border border-black px-2 py-1">{p.observacoes.join(', ')} {p.obsOutros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}




