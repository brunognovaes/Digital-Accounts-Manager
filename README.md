# Digital Accounts Manager

## Pré requisitos

Para fazer o uso da aplicação será necessário ter uma instância de Postgres, caso não possua nenhuma, recomendo que faça uso do Docker e rode uma instância localmente.

[Instalar docker Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

[Instalar docker Windows](https://docs.docker.com/desktop/install/windows-install/)

[Como rodar uma instância de postgres](https://www.code4it.dev/blog/run-postgresql-with-docker/)

É necessário também informar as variáveis de ambiente em um arquivo `.env`, exemplos se encontram no arquivo `.env.example`.

## Instalação

```bash
$ npm install
```

## Criando banco de dados

É necessário que as informações de variáveis de ambiente estejam informadas.

```bash
$ npm run migration
```

## Iniciar aplicação

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```

## O Projeto

O projeto se trata de um gerenciador de contas digitais com uma serie de funcionalidades. Foi separado em quatro módulos, cada um com suas resposabilidades.
Projetado com o framework `NestJS`, utilizando algumas outras ferramentas, como por exemplo, `Prisma` e `Jest`.

### Auth

O serviço de autenticação é responsável por prover a possibilidade de registrar novas credenciais, autenticar login, e verificar autenticidade do token passado nas requisições.

### Holders

Gerencia a parte de titulares, que são gerenciados pelo seus documentos de forma única. Cada titular quando criado é solicitado uma senha e criado uma credencial pelo seu documento, todas as requisições em diante será solicitado a autenticação por meio de `Bearer token` gerado no endpoint de autorização.

Com o cadastro de um titular é possível então fazer o gerenciamento de contas.

### Accounts

As contas são criadas a partir do documento de um titular, não sendo possível criar com um titular inexistente. É possível fazer o cadastro de múltiplas contas para um mesmo titular, consultar contas, bloquear, desbloquear, e inativa-las. Após a inativação de uma conta não será possível fazer mais nenhuma movimentação na mesma e nem reativa-la.

Com a exclusão de um titular todas as contas cadastradas em cima serão desativadas.

### Transfers

O módulo de transferência gerencia a possibilidade de executar transações de entrada e saída em uma conta, fazendo validações de saldo e alterando para o novo valor.
É criado também um histórico dessas transações, podendo fazer a consulta de extratos por meio de filtros.

## Documentação

É possível encontrar a documentação do projeto na pasta `docs` no arquivo `v1.yaml`, o swagger se encontra no padrão `openapi: 3.0.0` e pode ser facilmente visualizado por meio de ferramentas, como por exemplo:

[Swagger Io](https://editor.swagger.io)

## Contato

- [Linkedin](https://www.linkedin.com/in/brunognovaes/)

