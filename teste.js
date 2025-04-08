const fs = require('fs');
const axios = require('axios');

// Caminho para o arquivo NDJSON (um JSON por linha)
const caminhoDoJson = './Teste.json';

// Caminho para salvar o JSON convertido
const caminhoConvertido = './convertido.json';

// URL da API
const url = 'https://dooh139api.ivcbrasil.org.br/Exibitions';

// Headers exigidos pela API
const headers = {
  'ivc-subscription-key': 'DOOH74897CE242C1BF7E8CFBBC12C3CC',
  'Content-Type': 'application/json'
};

try {
  // Lê todo o conteúdo do arquivo NDJSON
  const rawData = fs.readFileSync(caminhoDoJson, 'utf8');

  // Divide por linha, filtra vazias e converte cada linha no novo formato
  const linhasConvertidas = rawData
    .split('\n')
    .filter(linha => linha.trim() !== '')
    .map(linha => {
      const obj = JSON.parse(linha);
      return {
        codVeiculo: 99,
        dataHoraEnvio: new Date().toISOString().split('.')[0],
        codPonto: obj.player.id,
        codPlayer: obj.player.id,
        codMidia: obj.content.id,
        dataHoraExibicao: obj.ts.split('.')[0],
        codOp: obj.id,
        cnpjAnunciante: '44578875000140',
        anunciante: 'Empresa BlaBlaBla Ltda.',
        marca: obj.content.name,
        produto: 'Campanha Programática',
        tituloCampanha: obj.content.name,
        timezone: 'America/Sao_Paulo',
        codCampanhaVeiculo: 123456,
        codCampanhaIvc: 3133
      };
    });

  // Salva o JSON convertido (em array) em um novo arquivo
  fs.writeFileSync(caminhoConvertido, JSON.stringify(linhasConvertidas, null, 2));
  console.log('💾 Arquivo convertido salvo como convertido.json');

  // Envia os dados convertidos via POST (em lote)
  axios.post(url, linhasConvertidas, { headers })
    .then(response => {
      console.log('✅ Dados enviados com sucesso!');
      console.log('📦 Código de status:', response.status);
      console.log('📦 Resposta:', response.data);

      if (response.status === 200) {
        console.log('🎉 Tudo certo, resposta 200 OK!');
      }
    })
    .catch(error => {
      const statusCode = error.response?.status || 'sem status';
      console.error(`❌ Erro ao enviar os dados (status: ${statusCode}):`, error.response?.data || error.message);
    });

} catch (err) {
  console.error('❌ Erro ao ler ou interpretar o JSON:', err.message);
}


