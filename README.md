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
  "razaoSocial": "Wongola Ltda",
  "nomeFantasia": "Wongola",
  "porte": "Médio",
  "segmento": "Tecnologia",
  "localizacaoMatriz": "São Paulo - SP",
  "qtdColaboradores": 150
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "razaoSocial": "Wongola Ltda",
  "nomeFantasia": "Wongola",
  "porte": "Médio",
  "segmento": "Tecnologia",
  "localizacaoMatriz": "São Paulo - SP",
  "qtdColaboradores": 150
}
```

### Estrutura modular

```
modules/
├── core/       → Entidades JPA e Repositórios
└── api/        → Controllers, Services, DTOs
```
