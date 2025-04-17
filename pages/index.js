import { useState } from 'react';

export default function Home() {
  const [cliente, setCliente] = useState('');
  const [pecas, setPecas] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const chapasPredefinidas = ['Branco TX', 'Preto TX', 'Cru', 'Mocca Fibraplac', 'Italian Noce Eucatex', 'Noce Oro Eucatex', 'Cinza Italia Lacca Eucatex'];
  const espessuras = ['3', '6', '9', '15', '18'];
  const observacoesFixas = ['2F LADO MAIOR', '3F LADO MAIOR', '4F LADO MAIOR', '2F LADO MENOR', 'OUTROS'];

  const [novaPeca, setNovaPeca] = useState({
    qtde: '', nome: '', c: '', l: '',
    chapa: 'Branco TX', chapaOutro: '', espessura: '15', veio: true,
    ambiente: '', fita: 'Branco TX', fitaOutro: '',
    lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
    obs: [], obsOutros: ''
  });

  const atualizarFita = (peca) => {
    const nomeChapa = peca.chapa === 'OUTROS' ? peca.chapaOutro : peca.chapa;
    return nomeChapa;
  }

  const handleNovaPecaChange = (campo, valor) => {
    const nova = { ...novaPeca, [campo]: valor };

    // Atualiza fita automaticamente com base na chapa
    if (campo === 'chapa') {
      nova.fita = valor !== 'OUTROS' ? valor : '';
      nova.fitaOutro = '';
    }
    if (campo === 'chapaOutro') {
      nova.fita = valor;
    }

    // Atualiza lados
    if (campo === 'todos') {
      nova.lados = { c1: valor, c2: valor, l1: valor, l2: valor, todos: valor };
    }

    setNovaPeca(nova);
  };

  const adicionarPeca = () => {
    const nova = {
      ...novaPeca,
      fita: novaPeca.fitaOutro || atualizarFita(novaPeca)
    };
    setPecas([...pecas, nova]);
    setNovaPeca({
      qtde: '', nome: '', c: '', l: '',
      chapa: nova.chapa, chapaOutro: '', espessura: nova.espessura,
      veio: true, ambiente: '', fita: nova.fita, fitaOutro: '',
      lados: { c1: false, c2: false, l1: false, l2: false, todos: false },
      obs: [], obsOutros: ''
    });
  };

  const excluirPecaSelecionada = () => {
    if (selectedRow !== null) {
      const novas = pecas.filter((_, i) => i !== selectedRow);
      setPecas(novas);
      setSelectedRow(null);
    }
  }

  return (
    <div className="p-4 text-sm font-sans">
      <h1 className="text-2xl font-bold mb-4">Plano de corte na 3F</h1>

      <div className="mb-4">
        <label className="mr-2">CLIENTE:</label>
        <input value={cliente} onChange={e => setCliente(e.target.value)} className="border p-1" />
      </div>

      <div className="grid grid-cols-12 gap-2 mb-2">
        <input placeholder="QTDE" type="number" min={1} className="col-span-1 border p-1" value={novaPeca.qtde} onChange={e => handleNovaPecaChange('qtde', e.target.value)} />
        <input placeholder="NOME DA PEÇA" className="col-span-2 border p-1" value={novaPeca.nome} onChange={e => handleNovaPecaChange('nome', e.target.value)} />
        <input placeholder="C (mm)" type="number" max={2750} className="col-span-1 border p-1" value={novaPeca.c} onChange={e => handleNovaPecaChange('c', Math.min(+e.target.value, 2750))} />
        <input placeholder="L (mm)" type="number" max={2750} className="col-span-1 border p-1" value={novaPeca.l} onChange={e => handleNovaPecaChange('l', Math.min(+e.target.value, 2750))} />
        <select value={novaPeca.chapa} onChange={e => handleNovaPecaChange('chapa', e.target.value)} className="col-span-2 border p-1">
          {chapasPredefinidas.map((c, i) => <option key={i}>{c}</option>)}
          <option>OUTROS</option>
        </select>
        {novaPeca.chapa === 'OUTROS' && (
          <input placeholder="Digite o nome da chapa" value={novaPeca.chapaOutro} onChange={e => handleNovaPecaChange('chapaOutro', e.target.value)} className="col-span-2 border p-1" />
        )}
        <select value={novaPeca.espessura} onChange={e => handleNovaPecaChange('espessura', e.target.value)} className="col-span-1 border p-1">
          {espessuras.map((e, i) => <option key={i}>{e}</option>)}
        </select>
        <label className="col-span-1 flex items-center">
          <input type="checkbox" checked={novaPeca.veio} onChange={e => handleNovaPecaChange('veio', e.target.checked)} className="mr-1" />
          {novaPeca.veio ? 'PODE GIRAR' : 'SEGUE COMPRIMENTO'}
        </label>
        <input placeholder="AMBIENTE" value={novaPeca.ambiente} onChange={e => handleNovaPecaChange('ambiente', e.target.value)} className="col-span-2 border p-1" />
      </div>

      <div className="grid grid-cols-12 gap-2 mb-2">
        <input placeholder="FITA" className="col-span-3 border p-1" value={novaPeca.fita} onChange={e => handleNovaPecaChange('fita', e.target.value)} />
        {['c1','c2','l1','l2'].map((lado, i) => (
          <label key={i} className="col-span-1 flex items-center">
            <input type="checkbox" checked={novaPeca.lados[lado]} onChange={() => handleNovaPecaChange(lado, !novaPeca.lados[lado])} className="mr-1" />
            {lado.toUpperCase()}
          </label>
        ))}
        <label className="col-span-2 flex items-center">
          <input type="checkbox" checked={novaPeca.lados.todos} onChange={e => handleNovaPecaChange('todos', e.target.checked)} className="mr-1" /> TODOS OS LADOS
        </label>
      </div>

      <div className="mb-4">
        <label className="font-bold">OBSERVAÇÕES:</label>
        <div className="flex flex-wrap mt-1">
          {observacoesFixas.map((obs, i) => (
            <label key={i} className="mr-4">
              <input type="checkbox" checked={novaPeca.obs.includes(obs)} onChange={e => {
                const checked = e.target.checked;
                const novaObs = checked ? [...novaPeca.obs, obs] : novaPeca.obs.filter(o => o !== obs);
                handleNovaPecaChange('obs', novaObs);
              }} /> {obs}
            </label>
          ))}
        </div>
        {novaPeca.obs.includes('OUTROS') && (
          <input placeholder="Especifique" value={novaPeca.obsOutros} onChange={e => handleNovaPecaChange('obsOutros', e.target.value)} className="border p-1 w-full mt-1" />
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={adicionarPeca} className="bg-green-600 text-white px-3 py-1 rounded">+ Adicionar Peça</button>
        <button onClick={excluirPecaSelecionada} className="bg-red-600 text-white px-3 py-1 rounded">Excluir Peça</button>
      </div>

      {pecas.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">LISTA DE PEÇAS - CLIENTE: {cliente.toUpperCase()}</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border">#</th>
                <th className="border">QTDE</th>
                <th className="border">PEÇA</th>
                <th className="border">C</th>
                <th className="border">L</th>
                <th className="border">CHAPA</th>
                <th className="border">ESPESSURA</th>
                <th className="border">FIBRA</th>
                <th className="border">AMBIENTE</th>
                <th className="border">FITA C1</th>
                <th className="border">FITA C2</th>
                <th className="border">FITA L1</th>
                <th className="border">FITA L2</th>
                <th className="border">OBS</th>
              </tr>
            </thead>
            <tbody>
              {pecas.map((p, i) => (
                <tr key={i} className={`cursor-pointer ${selectedRow === i ? 'bg-yellow-100' : ''}`} onClick={() => setSelectedRow(i)}>
                  <td className="border text-center">{i + 1}</td>
                  <td className="border text-center">{p.qtde}</td>
                  <td className="border text-center">{p.nome}</td>
                  <td className="border text-center">{p.c}</td>
                  <td className="border text-center">{p.l}</td>
                  <td className="border text-center">{p.chapa === 'OUTROS' ? p.chapaOutro : p.chapa}</td>
                  <td className="border text-center">{p.espessura}</td>
                  <td className="border text-center">{p.veio ? 'PODE GIRAR' : 'SEGUE COMPRIMENTO'}</td>
                  <td className="border text-center">{p.ambiente}</td>
                  <td className="border text-center">{p.lados.c1 ? 'X' : ''}</td>
                  <td className="border text-center">{p.lados.c2 ? 'X' : ''}</td>
                  <td className="border text-center">{p.lados.l1 ? 'X' : ''}</td>
                  <td className="border text-center">{p.lados.l2 ? 'X' : ''}</td>
                  <td className="border text-center">{p.obs.join(', ')} {p.obs.includes('OUTROS') && p.obsOutros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



