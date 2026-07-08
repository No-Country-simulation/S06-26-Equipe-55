# Wongola - Equipe 55

Plataforma de Matching Inclusivo que conecta empresas com profissionais de grupos sub-representados.

## Stack

- **Backend:** Java 17 + Spring Boot 3.5 + PostgreSQL
- **Frontend:** React + Vite + Tailwind CSS (PWA)
- **Autenticação:** JWT (Spring Security)
- **Documentação:** Swagger/OpenAPI

## Pré-requisitos

- Java 17+
- Node.js 18+
- PostgreSQL 16+

```sql
CREATE DATABASE wongola;
```

## Como rodar

**Backend:**

```bash
./mvnw clean install -pl modules/core && ./mvnw spring-boot:run -pl modules/api
```

**Frontend:**

```bash
cd modules/web && npm install && npm run dev
```

- App: http://localhost:5173
- Swagger: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/api-docs

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| DB_USERNAME | postgres | Usuário do banco |
| DB_PASSWORD | postgres | Senha do banco |
| JWT_SECRET | (chave interna) | Chave para assinar tokens |
| jwt.expiration | 86400000 | Expiração do token (24h) |

## Endpoints

| Método | Endpoint | Acesso | Descrição |
|--------|----------|--------|-----------|
| POST | /api/companies | Público | Cadastro de empresa |
| GET | /api/companies/me | Autenticado | Dados da empresa |
| PATCH | /api/companies/me | Autenticado | Editar empresa e metas ESG |
| POST | /api/auth/login | Público | Login (retorna JWT) |
| GET | /api/jobs | Autenticado | Listar vagas da empresa |
| POST | /api/jobs | Autenticado | Publicar vaga |
| PATCH | /api/jobs/{id} | Autenticado | Editar vaga |
| POST | /api/match | Autenticado | Matching de candidatos |
| POST | /api/jobs/simulate | Autenticado | Simulador de impacto da vaga |

## API - Cadastro de Empresa

`POST /api/companies`

```json
{
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Wongola Ltda",
  "nomeFantasia": "Wongola",
  "porte": "Médio",
  "segmento": "Tecnologia",
  "setorAtuacao": "Fintech",
  "localizacaoMatriz": "SP",
  "regioesAtuacao": ["SP", "RJ", "MG"],
  "qtdColaboradores": 150,
  "percentualDiversidade": 30,
  "prazoMetaEsg": "2026-12",
  "responsavelRh": {
    "nome": "Ana Silva",
    "email": "ana@wongola.com",
    "cargo": "Head de Diversidade"
  },
  "senha": "senha123"
}
```

## API - Login

`POST /api/auth/login`

```json
{
  "email": "ana@wongola.com",
  "senha": "senha123"
}
```

Response:

```json
{
  "token": "<jwt_token>",
  "empresaId": 1,
  "nomeFantasia": "Wongola"
}
```

## API - Publicação de Vagas

`POST /api/jobs` (requer token)

```json
{
  "empresaId": 1,
  "titulo": "Dev Backend",
  "descricao": "Buscamos desenvolvedor backend com experiência em microsserviços.",
  "skills": ["Java", "Spring Boot"],
  "nivel": "Pleno",
  "regiao": "SP",
  "gruposFoco": ["PCD", "RACIAL", "GENERO"],
  "diversidadeMinima": 40
}
```

## API - Matching

`POST /api/match` (requer token)

```json
{ "jobId": 1 }
```

Response:

```json
{
  "candidatos": [
    {
      "id": 1,
      "nome": "João Silva",
      "perfil": "Backend Developer",
      "score": 75,
      "badgeDiversidade": true,
      "skills": ["Java", "Spring Boot"],
      "nivel": "Pleno",
      "gapPorcentual": 25
    }
  ],
  "totalAnalisados": 8,
  "diversidadeResultado": 50
}
```

Score = % de critérios da vaga que o candidato atende (skills + nível).

## API - Simulador de Impacto

`POST /api/jobs/simulate` (requer token)

Analisa o alcance da vaga antes de publicar, mostrando quantos candidatos atendem aos critérios e o impacto de cada requisito.

```json
{
  "empresaId": 1,
  "titulo": "Dev Backend",
  "descricao": "Descrição",
  "skills": ["Java", "Spring Boot"],
  "nivel": "Pleno",
  "regiao": "SP,RJ",
  "gruposFoco": ["PCD"],
  "diversidadeMinima": null
}
```

Response:

```json
{
  "totalCandidatos": 8,
  "candidatosElegiveis": 2,
  "impactoPorCriterio": [
    { "criterio": "Pleno", "semEsse": 4, "ganho": 2 },
    { "criterio": "Região (SP, RJ)", "semEsse": 4, "ganho": 2 },
    { "criterio": "Java", "semEsse": 2, "ganho": 0 }
  ],
  "diversidadeEstimada": 50
}
```

Cada critério mostra quantos candidatos a mais ficam elegíveis se removido.

## Estrutura

```
modules/
├── core/       → Entidades JPA e Repositórios
├── api/        → Controllers, Services, DTOs, Security
└── web/        → Frontend React (PWA)
    ├── domains/auth/       → Login
    ├── domains/company/    → Cadastro de empresa
    ├── domains/job/        → Vagas (listagem, detalhe, edição)
    ├── domains/match/      → Matching de candidatos
    ├── domains/dashboard/  → Dashboard com gráficos e heatmap de exclusão
    ├── domains/profile/    → Configurações da empresa
    └── shared/             → Componentes, contexto e serviços
```

## Dashboard

O dashboard exibe métricas de diversidade, gráficos e um heatmap de exclusão:

- **Heatmap de exclusão** — Avalia cada critério (skill, nível, região) isoladamente contra a base de candidatos, mostrando o percentual de candidatos excluídos por cada requisito. Cores indicam severidade: verde (<30%), amarelo (30-60%), vermelho (>60%).
- **Relatório ESG (PDF)** — Exportável com métricas de diversidade, metas e resultados para stakeholders.

## Testes

**Backend (22 testes):**

| Tipo | Arquivo | Cobertura |
|------|---------|----------|
| Integração | AuthControllerTest | Login, credenciais inválidas |
| Integração | CompanyControllerTest | Cadastro, validações |
| Integração | JobControllerTest | CRUD de vagas, autenticação |
| Unitário | CompanyServiceTest | Lógica de criação de empresa |
| Unitário | SimulationServiceTest | Simulador de impacto por critério |

**Frontend (18 testes):**

| Tipo | Arquivo | Cobertura |
|------|---------|----------|
| Unitário | api.test.js | Serviço HTTP, token, erros |
| Unitário | sort.test.js | Ordenação de candidatos |
| Unitário | exclusion.test.js | Heatmap de exclusão |

**Executar:**

```bash
./mvnw clean install -pl modules/core && ./mvnw test -pl modules/api
cd modules/web && npm test
```

## Pipeline AppSec

| Etapa | Ferramenta |
|-------|-----------|
| SAST | SpotBugs + Find Security Bugs |
| Segredos | Gitleaks |
| SCA | OWASP Dependency-Check |
| Containers | Trivy |
| DAST | OWASP ZAP |
| Filesystem | Trivy FS |
