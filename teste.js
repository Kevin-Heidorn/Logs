const axios = require('axios');

// Simulação do conteúdo do NDJSON (duas linhas)
const ndjsonSimulado = `
{"id":"OP123","player":{"id":"COD_DO_PONTO_DE_VCS"},"content":{"id":"CODIGO_DO_ANUNCIO","name":"Campanha Incrível"},"ts":"2025-04-07T17:21:09.438Z"}
{"id":"OP124","player":{"id":"CODIGO_DO_PLAYER_DE_VCS"},"content":{"id":"CODIGO_DO_ANUNCIO","name":"Campanha Super"},"ts":"2025-04-07T18:22:10.000Z"}
`;

// URL da API
const url = 'https://dooh139api.ivcbrasil.org.br/Exibitions';

// Headers exigidos pela API
const headers = {
  'ivc-subscription-key': 'DOOH74897CE242C1BF7E8CFBBC12C3CC',
  'Content-Type': 'application/json'
};

try {
  const linhasConvertidas = ndjsonSimulado
    .trim()
    .split('\n')
    .map(linha => {
      const obj = JSON.parse(linha);
      return {
        codVeiculo: 139,
        dataHoraEnvio: new Date().toISOString(),
        codPonto: obj.player.id,
        codPlayer: obj.player.id,
        codMidia: obj.content.id,
        dataHoraExibicao: new Date(obj.ts).toISOString(),
        codOp: obj.id
      };
    });

  console.log('📦 JSON gerado para envio:\n', JSON.stringify(linhasConvertidas, null, 2));

  axios.post(url, linhasConvertidas, { headers })
    .then(response => {
      console.log('✅ Dados enviados com sucesso!');
      console.log('📡 Código de status:', response.status);
      console.log('📨 Resposta:', response.data);
    })
    .catch(error => {
      const statusCode = error.response?.status || 'sem status';
      console.error(`❌ Erro ao enviar os dados (status: ${statusCode}):`, error.response?.data || error.message);
    });

} catch (err) {
  console.error('❌ Erro ao processar o JSON simulado:', err.message);
}
