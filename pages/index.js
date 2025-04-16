import { useState } from "react";

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

const espessuras = ["3", "6", "9", "15", "18"];

export default function Home() {
  const [cliente, setCliente] = useState("");
  const [pecas, setPecas] = useState([
    criarPeca()
  ]);

  function criarPeca(copiarChapa = "", copiarEspessura = "") {
    return {
      qtde: "",
      c: "",
      l: "",
      chapa: copiarChapa,
      chapaOutro: "",
      espessura: copiarEspessura || "15",
      podeGirar: true,
      ambiente: "",
      observacoes: [],
      observacaoOutro: "",
      fita: copiarChapa,
      ladosFita: []
    };
  }

  const handleAddPeca = () => {
    const ultima = pecas[pecas.length - 1];
    setPecas([...pecas, criarPeca(ultima.chapa, ultima.espessura)]);
  };

  const handleRemovePeca = (index) => {
    const novas = [...pecas];
    novas.splice(index, 1);
    setPecas(novas);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Formulário de Peças - 3F</h1>

      <input
        placeholder="CLIENTE"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        style={{ display: "block", marginBottom: 20 }}
      />

      {pecas.map((peca, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            paddingBottom: 10,
            marginBottom: 10
          }}
        >
          <strong>#{index + 1}</strong>

          <input
            type="number"
            placeholder="Qtde"
            value={peca.qtde}
            onChange={(e) => {
              const v = [...pecas];
              v[index].qtde = e.target.value;
              setPecas(v);
            }}
            style={{ width: 50 }}
          />

          <input
            type="number"
            placeholder="C (mm)"
            value={peca.c}
            onChange={(e) => {
              const v = [...pecas];
              v[index].c = Math.min(2750, +e.target.value || "");
              setPecas(v);
            }}
            style={{ width: 80 }}
          />

          <input
            type="number"
            placeholder="L (mm)"
            value={peca.l}
            onChange={(e) => {
              const v = [...pecas];
              v[index].l = Math.min(2750, +e.target.value || "");
              setPecas(v);
            }}
            style={{ width: 80 }}
          />

          <select
            value={peca.chapa}
            onChange={(e) => {
              const v = [...pecas];
              v[index].chapa = e.target.value;
              v[index].fita = e.target.value;
              setPecas(v);
            }}
          >
            {chapas.map((ch) => (
              <option key={ch}>{ch}</option>
            ))}
          </select>

          {peca.chapa === "OUTROS" && (
            <input
              placeholder="Nome da chapa"
              value={peca.chapaOutro}
              onChange={(e) => {
                const v = [...pecas];
                v[index].chapaOutro = e.target.value;
                setPecas(v);
              }}
            />
          )}

          <select
            value={peca.espessura}
            onChange={(e) => {
              const v = [...pecas];
              v[index].espessura = e.target.value;
              setPecas(v);
            }}
          >
            {espessuras.map((esp) => (
              <option key={esp}>{esp}</option>
            ))}
          </select>

          <label>
            <input
              type="checkbox"
              checked={peca.podeGirar}
              onChange={(e) => {
                const v = [...pecas];
                v[index].podeGirar = e.target.checked;
                setPecas(v);
              }}
            />
            Pode girar
          </label>

          <input
            placeholder="AMBIENTE"
            value={peca.ambiente}
            onChange={(e) => {
              const v = [...pecas];
              v[index].ambiente = e.target.value;
              setPecas(v);
            }}
          />

          <fieldset>
            <legend>OBSERVAÇÕES:</legend>
            {["2F LADO MAIOR", "3F LADO MAIOR", "4F LADO MAIOR", "2F LADO MENOR", "OUTROS"].map((obs) => (
              <label key={obs}>
                <input
                  type="checkbox"
                  checked={peca.observacoes.includes(obs)}
                  onChange={(e) => {
                    const v = [...pecas];
                    const set = new Set(v[index].observacoes);
                    e.target.checked ? set.add(obs) : set.delete(obs);
                    v[index].observacoes = [...set];
                    setPecas(v);
                  }}
                />
                {obs}
              </label>
            ))}
            {peca.observacoes.includes("OUTROS") && (
              <input
                placeholder="Digite a observação"
                value={peca.observacaoOutro}
                maxLength={60}
                onChange={(e) => {
                  const v = [...pecas];
                  v[index].observacaoOutro = e.target.value;
                  setPecas(v);
                }}
              />
            )}
          </fieldset>

          <label>FITA:
            <input
              value={peca.fita}
              onChange={(e) => {
                const v = [...pecas];
                v[index].fita = e.target.value;
                setPecas(v);
              }}
            />
          </label>

          <fieldset>
            <legend>QUAL LADO VAI A FITA?</legend>
            {["C1", "C2", "L1", "L2"].map((lado) => (
              <label key={lado}>
                <input
                  type="checkbox"
                  checked={peca.ladosFita.includes(lado)}
                  onChange={(e) => {
                    const v = [...pecas];
                    const set = new Set(v[index].ladosFita);
                    e.target.checked ? set.add(lado) : set.delete(lado);
                    v[index].ladosFita = [...set];
                    setPecas(v);
                  }}
                />
                {lado}
              </label>
            ))}
            <label>
              <input
                type="checkbox"
                onChange={(e) => {
                  const v = [...pecas];
                  v[index].ladosFita = e.target.checked ? ["C1", "C2", "L1", "L2"] : [];
                  setPecas(v);
                }}
              />
              TODOS OS LADOS
            </label>
          </fieldset>

          <button onClick={() => handleRemovePeca(index)}>Excluir</button>
        </div>
      ))}

      <button onClick={handleAddPeca}>+ Adicionar Peça</button>
    </div>
  );
}
