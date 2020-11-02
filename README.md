# Sudoku

![Prod check](https://github.com/PMantovani/sudoku/workflows/Prod%20check/badge.svg)

Esse projeto é um jogo de Sudoku para se jogar diretamente no browser. Toda a geração e solução de novos jogos é feita diretamente no código do frontend, então essa aplicação funciona sozinha, sem nenhum backend necessário.

Para deploy, foi utilizado o Cloud Run do GCP, que roda através de um container nginx buildado através do resultado compilado do frontend, que funciona com o framework Angular 10.
Um workflow do GitHub Action foi configurado para garantir que o build não quebrou a cada push para a branch main.

A versão deployada está disponível em:

https://sudoku-vmlanmhenq-uc.a.run.app/

Para rodar localmente, basta rodar `ng serve`.
