# Tech for PMs #008 - PWA ou SPA?

---

## O que você já viu por aqui:
- ✅ Clientes, servidores, TCP/IP, DNS, HTTP, Component Files e Assets.
- ✅ A diferença entre Git e GitHub.
- ✅ O que permite a existência da internet?
- ✅ O que pode parar o ChatGPT? E a evolução das LLMs.
- ✅ O que se espera de um PM?
- ✅ O que é um SDK?
- ✅ Aprendendo a usar o DevTools. Analisando erros, sugerindo mudanças e simulando uma internet mais lenta.
- ⌛️ **Hoje**: PWA ou SPA?

---

## Aula de Hoje
Vamos lá?

Existem frameworks de JavaScript como React, Angular e Vue que permitiram uma modernização em como websites e webapps são criados.

Single Page Applications (SPAs) e Progressive Web Applications (PWAs) são discussões ainda bastante presentes no dia a dia.

O exemplo de uma discussão comum, é se deveríamos seguir com a construção de um aplicativo nativo, ou se conseguiríamos simular essa experiência no navegador, **sem a necessidade do usuário instalar um aplicativo**.

O PWA, em particular, se tornou uma boa solução para empresas que inicialmente queriam criar um aplicativo nativo, mas que não possuem recursos o suficiente para manutenção desse app a longo prazo.

**Então é uma discussão que junta 2 critérios: experiência do usuário e performance.**

A grande questão é que essa decisão, em muitas empresas, acontece com o simples critério:

> "Meu concorrente está fazendo assim e está indo bem. Vamos fazer assim também."

E por mais que decisões da alta liderança não sejam tão debatidas, é importante você entender os benefícios de cada caminho.

A primeira coisa é que não existe um melhor ou pior para todos os casos.

---

## PWA (Progressive Web Application)
Um progressive web app (PWA) é um tipo de web app que tem como objetivo entregar uma experiência semelhante aos apps nativos para os usuários. Surgiu em 2015 pelo Google.

PWAs são feitos para funcionar em qualquer aparelho: smartphones, tablets, desktops e podem ser acessados em qualquer browser (Chrome, Firefox, Safari, etc.).

O PWA permite inclusive que você envie notificações para os usuários, como um app.

A manutenção de um PWA normalmente é mais simples, justamente porque os desenvolvedores que sabem linguagens voltadas a web conseguem manter.

Outro grande benefício é que esses sites PWA são indexados em motores de busca, como o Google. Ou seja, são mais fáceis de achar na internet do que os aplicativos nativos.

Falando no tecniquês, eles usam uma variedade de técnicas para otimizar performance, como caching, service workers, minification e compression, além de code splitting. **Não se preocupe caso não tenha entendido esses conceitos, para agora não é necessário.**

Outro ponto mega interessante dos PWAs são as atualizações automáticas. Pensa comigo: se o usuário não tem a necessidade de instalar esse aplicativo através de uma App Store ou Play Store, você não precisa esperar ele clicar em atualizar quando lançar uma nova versão.

Para quem já mexeu com app, sabe que, em alguns casos (tirando um force update), demoram semanas para +80% dos usuários chegarem na última versão. E a consequência de usuários em versões anteriores é que eles continuam com uma versão que não teve manutenção e que, por vezes, apresenta diversos bugs.

### Conclusão PWA
Vale analisar bem o seu público-alvo (ex: relação deles com os apps, quando baixam um app, qual o gatilho, se tem ou não espaço no celular) e a frequência com que acessam seu app (é algo periódico? semanal? mensal?). Essas perguntas ajudam a perceber se esse talvez seja o caminho.

---

## SPA (Single Page Application)
Single-page applications (SPA) de forma simplificada: o conteúdo da página carrega conforme o usuário "scrolla" (arrasta a página para baixo).

Algo parecido com o feed do Instagram, que só aparece quando você vai até o final da página.

Isso permite interações mais rápidas e uma experiência do usuário muito boa. Normalmente, SPAs são criados com React ou Angular.

Um dos benefícios do SPA é a performance, justamente porque só carrega quando necessário. Isso elimina a necessidade do servidor de gerar uma nova página para cada requisição. Então o tempo de resposta é absurdamente rápido.

Quando comparado com aplicações web tradicionais, segundo uma página especialista no assunto:

> "Em contraste, com uma aplicação web tradicional, cada solicitação do usuário exige que o servidor processe a solicitação, recupere os dados necessários e gere uma nova página HTML para ser enviada de volta ao cliente. Esse processo pode ser demorado, especialmente para aplicativos com grande quantidade de dados ou lógica complexa do lado do servidor."

---

## Comparação PWA x SPA
Agora que você sabe um pouco mais de PWA e SPA, vamos ver qual é melhor para cada situação.

**Resumindo de forma objetiva, sem considerar o contexto:**

- **Segurança**: SPAs são menos seguros que PWAs.
- **SEO (Search Engine Optimization)**: PWAs são melhores.
- **Custos**: PWAs são mais caros para construir.
- **Performance**: a curto prazo, SPAs. Mas a longo prazo, PWAs (por conta do cache). A grande questão do SPA é que ele tem um tempo inicial de carregamento maior, justamente porque precisa fazer download de todo o conteúdo necessário antes de ser renderizado.

---
