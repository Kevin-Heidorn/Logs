const fs = require('fs');
const axios = require('axios');

const arquivoEntrada = './Teste.json';
const arquivoSaida = './convertido.json';

// Configuração da API IVC
const url = 'https://dooh139api.ivcbrasil.org.br/Exibitions';
const headers = {
  'ivc-subscription-key': 'DOOH74897CE242C1BF7E8CFBBC12C3CC',
  'Content-Type': 'application/json'
};

// Função principal
async function processarEEnviar() {
  try {
    const rawData = fs.readFileSync(arquivoEntrada, 'utf8');
    const dataHoraEnvio = new Date().toISOString();

    const exibicoes = rawData
      .trim()
      .split('\n')
      .map(linha => {
        const obj = JSON.parse(linha);
        return {
          codVeiculo: 139,
          dataHoraEnvio,
          codPonto: obj.player.id,
          codPlayer: obj.player.id,
          codMidia: obj.content.id,
          dataHoraExibicao: obj.ts,
          codOp: obj.content.name
        };
      });

    console.log(`🎯 Total de registros convertidos: ${exibicoes.length}`);

    // Salva os dados convertidos em um arquivo
    fs.writeFileSync(arquivoSaida, JSON.stringify(exibicoes, null, 2), 'utf8');
    console.log(`💾 Arquivo salvo como ${arquivoSaida}`);

    // Log extra para contar o total final
    console.log(`📊 Total de registros no convertido.json: ${exibicoes.length}`);

    // Envia em lotes
    const lote = 10000;
    for (let i = 0; i < exibicoes.length; i += lote) {
      const chunk = exibicoes.slice(i, i + lote);
      const resposta = await axios.post(url, chunk, { headers });
      console.log(`✅ Lote ${i / lote + 1} enviado - Status: ${resposta.status}`);
    }

  } catch (erro) {
    console.error('❌ Erro:', erro.response?.data || erro.message);
  }
}

processarEEnviar();
