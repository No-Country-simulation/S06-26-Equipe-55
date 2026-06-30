# Wangola - Equipe 55

Aplicação Java Spring Boot com arquitetura de monolito modular.

## Pipeline AppSec

Pipeline de segurança automatizado rodando no GitHub Actions:

| Etapa | Ferramenta | Objetivo |
|-------|-----------|----------|
| SAST | SpotBugs + Find Security Bugs | Análise estática de vulnerabilidades no código-fonte |
| Detecção de Segredos | Gitleaks | Impede que credenciais e segredos sejam commitados |
| SCA | OWASP Dependency-Check | Identifica CVEs conhecidas em dependências de terceiros |
| Segurança de Containers | Trivy | Escaneia imagens Docker em busca de vulnerabilidades |
| DAST | OWASP ZAP | Testes dinâmicos contra a aplicação em execução |
| Scan de Filesystem | Trivy FS | Verifica arquivos de IaC e configuração por falhas |

O pipeline é acionado a cada push nas branches `main`/`develop` e em pull requests para `main`.

## API - Cadastro de Empresa

Endpoint REST para cadastro de empresas no sistema.

### Pré-requisitos

- Java 17+
- PostgreSQL rodando na porta 5432
- Banco `wongola` criado:

```sql
CREATE DATABASE wongola;
```

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| DB_USERNAME | postgres | Usuário do banco |
| DB_PASSWORD | postgres | Senha do banco |

### Como rodar

```bash
./mvnw clean install -pl modules/core && ./mvnw spring-boot:run -pl modules/api
```

### Documentação Swagger

Com a aplicação rodando, acesse:

- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs (JSON): http://localhost:8080/api-docs

### Endpoint

`POST /api/companies`

**Request body:**

```json
{
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Wongola Ltda",
  "nomeFantasia": "Wongola",
  "porte": "Médio",
  "segmento": "Tecnologia",
  "setorAtuacao": "Fintech",
  "localizacaoMatriz": "São Paulo - SP",
  "regioesAtuacao": ["SP", "RJ", "MG"],
  "qtdColaboradores": 150,
  "percentualDiversidade": 30,
  "prazoMetaEsg": "2026-12",
  "responsavelRh": {
    "nome": "Ana Silva",
    "email": "ana@wongola.com",
    "cargo": "Head de Diversidade"
  }
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Wongola Ltda",
  "nomeFantasia": "Wongola",
  "porte": "Médio",
  "segmento": "Tecnologia",
  "setorAtuacao": "Fintech",
  "localizacaoMatriz": "São Paulo - SP",
  "regioesAtuacao": ["SP", "RJ", "MG"],
  "qtdColaboradores": 150,
  "percentualDiversidade": 30,
  "prazoMetaEsg": "2026-12",
  "responsavelRh": {
    "id": 1,
    "nome": "Ana Silva",
    "email": "ana@wongola.com",
    "cargo": "Head de Diversidade"
  }
}
```

**Campos obrigatórios:**

| Campo | Tipo | Validação |
|-------|------|-----------|
| cnpj | String | Não pode ser vazio |
| razaoSocial | String | Não pode ser vazio |
| nomeFantasia | String | Não pode ser vazio |
| porte | String | Não pode ser vazio |
| segmento | String | Não pode ser vazio |
| setorAtuacao | String | Não pode ser vazio |
| localizacaoMatriz | String | Não pode ser vazio |
| regioesAtuacao | List<String> | Não pode ser vazia |
| qtdColaboradores | Integer | Positivo |
| percentualDiversidade | Integer | 0 a 100 |
| prazoMetaEsg | String | Formato YYYY-MM |
| responsavelRh.nome | String | Não pode ser vazio |
| responsavelRh.email | String | Email válido |
| responsavelRh.cargo | String | Não pode ser vazio |

---

## API - Publicação de Vagas

Endpoint REST para publicação de vagas vinculadas a uma empresa.

### Endpoint

`POST /api/jobs`

**Request body:**

```json
{
  "empresaId": 1,
  "titulo": "Dev Backend",
  "descricao": "Buscamos desenvolvedor backend com experiência em microsserviços e APIs REST.",
  "skills": ["Java", "Spring Boot"],
  "nivel": "Pleno",
  "regiao": "SP",
  "gruposFoco": ["PCD", "RACIAL", "GENERO"],
  "diversidadeMinima": 40,
  "filtroAntiVies": true
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "empresaId": 1,
  "titulo": "Dev Backend",
  "descricao": "Buscamos desenvolvedor backend com experiência em microsserviços e APIs REST.",
  "skills": ["Java", "Spring Boot"],
  "nivel": "Pleno",
  "regiao": "SP",
  "gruposFoco": ["PCD", "RACIAL", "GENERO"],
  "diversidadeMinima": 40,
  "filtroAntiVies": true,
  "createdAt": "2026-06-29T23:15:57"
}
```

**Campos obrigatórios:**

| Campo | Tipo | Validação |
|-------|------|-----------|
| empresaId | Long | Deve existir no banco |
| titulo | String | Não pode ser vazio |
| descricao | String | Não pode ser vazio, máx 3000 caracteres |
| skills | List<String> | Não pode ser vazia |
| nivel | String | Não pode ser vazio |
| regiao | String | Não pode ser vazio |
| gruposFoco | List<String> | Opcional |
| diversidadeMinima | Integer | 0 a 100, opcional |
| filtroAntiVies | Boolean | Opcional |

---

### Estrutura modular

```
modules/
├── core/       → Entidades JPA e Repositórios
└── api/        → Controllers, Services, DTOs
```
