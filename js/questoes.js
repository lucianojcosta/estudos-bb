function toggleMenu() {
  document.getElementById("menu").classList.toggle("ativo");
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function carregarQuestoes(materia, quantidade) {
  fetch('../dados/questoes.json')
    .then(res => res.json())
    .then(dados => {
      const todas = dados[materia];
      if (!todas) {
        console.error(`Matéria "${materia}" não encontrada.`);
        return;
      }

      const sorteadas = embaralhar(todas).slice(0, quantidade);
      const container = document.getElementById("questoes");
      container.innerHTML = ''; // limpar questões anteriores

      sorteadas.forEach((q, i) => {
        const div = document.createElement("div");
        div.classList.add("questao");

        const alternativasHTML = q.alternativas.map(alt => `
          <button class="alternativa" data-correta="${q.correta}" data-escolha="${alt}" data-explicacao="${q.explicacao}">
            ${alt}
          </button>
        `).join('');

        div.innerHTML = `
          <p><strong>Questão ${i + 1}:</strong> ${q.pergunta}</p>
          <div class="alternativas">${alternativasHTML}</div>
          <p class="feedback"></p>
        `;

        container.appendChild(div);
      });

      // Adiciona o comportamento aos botões
      document.querySelectorAll('.alternativa').forEach(btn => {
        btn.addEventListener('click', function () {
          const correta = this.dataset.correta;
          const escolha = this.dataset.escolha;
          const explicacao = this.dataset.explicacao;
          const feedback = this.parentElement.nextElementSibling;
      
          if (escolha === correta) {
            feedback.innerHTML = `
              <span style="color:green;">✅ Resposta correta!</span><br>
              Explicação: ${explicacao}
            `;
          } else {
            feedback.innerHTML = `
              <span style="color:red;">❌ Resposta errada.</span><br>
              Resposta certa: <strong>${correta}</strong><br>
              Explicação: ${explicacao}
            `;
          }

          // Desabilita todos os botões da questão
          this.parentElement.querySelectorAll('button').forEach(b => b.disabled = true);
        });
      });
    });
}